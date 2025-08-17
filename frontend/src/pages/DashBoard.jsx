import React, { useState, useRef, useCallback } from "react";
import {
  Box,
  Typography,
  Tabs,
  Tab,
  Paper,
  Container,
  CircularProgress,
  Alert,
  List,
  ListItem,
  ListItemText,
  ListItemIcon,
  Button,
  Fade,
  Grid,
  TextField,
} from "@mui/material";
import { auth } from "../firebase"; // Import auth to get the token
import axios from "axios";
import { useDropzone } from "react-dropzone";
import UploadFileIcon from "@mui/icons-material/UploadFile";
import DescriptionIcon from "@mui/icons-material/Description";
import useAnalysisStore from "../stores/useAnalysisStore";
import ManagementTone from "../components/ManagementTone";
import RiskSummary from "../components/RiskSummary";
import RiskDiffViewer from "../components/RiskDiffViewer";
import MetricsDashboard from "../components/MetricsDashboard";
import CompetitorAnalysis from "../components/CompetitorAnalysis";
import LegalSummary from "../components/LegalSummary";
import FinancialStatements from "../components/FinancialStatements";
import GuidanceOutlook from "../components/GuidanceOutlook";
import HistoricalTrends from "../components/HistoricalTrends";
import GovernanceChanges from "../components/GovernanceChnages";
import ExecutiveSummary from "../components/ExecutiveSummary";
import RatioAnalysis from "../components/RatioAnalysis";
import DebtSchedule from "../components/DebtSchedule";
import EsgAnalysis from "../components/EsgAnalysis";
import FootnoteExplorer from "../components/FootnoteExplorer";
import jsPDF from "jspdf";
import html2canvas from "html2canvas";
import HelpOutlineIcon from "@mui/icons-material/HelpOutline";
import styles from "../module/dash.module.css";
import Sidebar from "../components/Sidebar";
import UploadFiles from "../components/UploadFiles";


function TabPanel(props) {
  const { children, value, index } = props;
  return (
    <div hidden={value !== index}>
      {value === index && <Box sx={{ p: 3 }}>{children}</Box>}
    </div>
  );
}

function FileUploader() {
  const { startLoading, setResult, setError, isLoading } = useAnalysisStore();
  const [files, setFiles] = useState([]);
  const [companyTicker, setCompanyTicker] = useState("");
  const [uploadMode, setUploadMode] = useState(0); // 0 for single, 1 for compare

  const onDrop = useCallback(
    (acceptedFiles) => {
      const maxFiles = uploadMode === 0 ? 1 : 2;
      setFiles((prev) => [...prev, ...acceptedFiles].slice(0, maxFiles));
    },
    [uploadMode]
  );

  const handleAnalyze = async () => {
    if (files.length === 0 || !companyTicker) {
      setError("Please provide a company ticker and at least one report file.");
      return;
    }

    startLoading();
    const formData = new FormData();
    formData.append("companyTicker", companyTicker.toUpperCase());
    formData.append("currentReport", files[0]);
    if (uploadMode === 1 && files[1]) {
      formData.append("previousReport", files[1]);
    }

    const API_URL = "http://localhost:5000";

    try {
      const user = auth.currentUser;
      if (!user) throw new Error("User not logged in.");
      const token = await user.getIdToken();

      const response = await axios.post(`${API_URL}/api/analyze`, formData, {
        headers: {
          "Content-Type": "multipart/form-data",
          Authorization: `Bearer ${token}`,
        },
      });
      setResult(response.data);
    } catch (err) {
      setError(err.response?.data?.message || "An unknown error occurred.");
    }
  };

  const handleClear = () => {
    setFiles([]);
  };
  

  const handleModeChange = (event, newValue) => {
    setUploadMode(newValue);
    setFiles([]); // Clear files when changing mode
  };

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: { "application/pdf": [".pdf"] },
    maxFiles: uploadMode === 0 ? 1 : 2,
    disabled: isLoading,
  });

  return (
    <>
      <div className={styles.container2}>
        <div className={styles.cont}>
          <TextField
            // fullWidth
            className={styles.field}
            label="Company Ticker"
            value={companyTicker}
            onChange={(e) => setCompanyTicker(e.target.value)}
            placeholder="e.g., AAPL, AMZN"
          />
          <Tabs value={uploadMode} onChange={handleModeChange}>
            <Tab label="Analyze Single Report" className={styles.text} />
            <Tab label="Compare Two Reports" className={styles.text} />
          </Tabs>
        </div>
        <Box
          {...getRootProps()}
          sx={{
            mt: 2,
            p: 4,
            textAlign: "center",
            border: "1px solid grey",
            backgroundColor: isDragActive ? "#333" : "transparent",
          }}
        >
          <input {...getInputProps()} />
          <UploadFileIcon sx={{ fontSize: 40, mb: 0.2 }} />
          <Typography variant="h6">
            {uploadMode === 0
              ? "Drop Current Report"
              : "Drop Current & Previous Reports"}
          </Typography>
        </Box>

        {files.length > 0 && (
          <Box sx={{ mt: 2 }}>
            <List dense>
              {files.map((file, index) => (
                <ListItem key={file.path}>
                  <ListItemIcon>
                    <DescriptionIcon />
                  </ListItemIcon>
                  <ListItemText
                    className={styles.style}
                    primary={file.name}
                    secondary={
                      index === 0 ? "Current Report" : "Previous Report"
                    }
                  />
                </ListItem>
              ))}
            </List>
          </Box>
        )}
        <div className={styles.butcon}>
          <button
            onClick={handleAnalyze}
            disabled={isLoading || files.length === 0 || !companyTicker}
            className={styles.button1}
          >
            {isLoading ? "Analyzing..." : "Analyze"}
          </button>
          <button
            className={styles.button2}
            onClick={handleClear}
            disabled={isLoading}
          >
            Clear
          </button>
        </div>
      </div>
    </>
  );
}

//     <Box>
//     <Paper sx={{ p: 3 }}>
//       <Grid container spacing={3} alignItems="center">
//         <Grid item xs={12} md={4}>
//           <TextField
//             fullWidth
//             label="Company Ticker"
//             variant="outlined"
//             value={companyTicker}
//             onChange={(e) => setCompanyTicker(e.target.value)}
//             placeholder="e.g., AAPL, AMZN"
//             disabled={isLoading}
//           />
//         </Grid>
//         <Grid item xs={12} md={8}>
//           <Tabs value={uploadMode} onChange={handleModeChange} centered>
//             <Tab label="Analyze Single Report" />
//             <Tab label="Compare Two Reports" />
//           </Tabs>
//         </Grid>
//       </Grid>

//       <Box {...getRootProps()} sx={{ mt: 2, p: 4, textAlign: 'center', border: '2px dashed grey', cursor: isLoading ? 'not-allowed' : 'pointer', backgroundColor: isDragActive ? '#333' : 'transparent' }}>
//         <input {...getInputProps()} />
//         <UploadFileIcon sx={{ fontSize: 48, mb: 2 }} />
//         <Typography variant="h6">
//           {uploadMode === 0 ? "Drop Current Report" : "Drop Current & Previous Reports"}
//         </Typography>
//       </Box>

//       {files.length > 0 && (
//         <Box sx={{ mt: 2 }}>
//           <List dense>
//             {files.map((file, index) => (
//               <ListItem key={file.path}>
//                 <ListItemIcon><DescriptionIcon /></ListItemIcon>
//                 <ListItemText primary={file.path} secondary={index === 0 ? "Current Report" : "Previous Report"} />
//               </ListItem>
//             ))}
//           </List>
//         </Box>
//       )}

//       <Box sx={{ mt: 2, display: 'flex', gap: 2 }}>
//         <Button
//           variant="contained"
//           onClick={handleAnalyze}
//           disabled={isLoading || files.length === 0 || !companyTicker}
//         >
//           {isLoading ? 'Analyzing...' : 'Analyze'}
//         </Button>
//         <Button variant="outlined" color="secondary" onClick={handleClear} disabled={isLoading}>
//           Clear
//         </Button>
//       </Box>
//       </Paper>
//     </Box>
//   );
// }

export default function DashBoard() {
  const[uploadfile,setuploadfile]=useState(false)
  const [index, setindex] = useState(0);
  const [tabValue, setTabValue] = useState(0);
  const { isLoading, analysisResult } = useAnalysisStore();
  const handleTabChange = (event, newValue) => setTabValue(newValue);
  const [loading, setLoading] = useState(false);
  // const dashboardRef = useRef(null); // Ref to the dashboard paper component
  const exportAllTabs = useRef(null);

  const handleExport = () => {
    if (exportAllTabs.current) {
      html2canvas(exportAllTabs.current, { scale: 2 }).then((canvas) => {
        const imgData = canvas.toDataURL("image/png");
        const pdf = new jsPDF("p", "mm", "a4");
        const pdfWidth = pdf.internal.pageSize.getWidth();
        const pdfHeight = (canvas.height * pdfWidth) / canvas.width;
        pdf.addImage(imgData, "PNG", 0, 0, pdfWidth, pdfHeight);
        pdf.save(`${analysisResult.current.companyTicker}-analysis.pdf`);
      });
    }
  };
function upload(){
    setindex(9)
  }
  function Click(i) {
    console.log(i);
    setindex(i);
  }

  return (
    <>
      <div
        style={{
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        {!analysisResult && <FileUploader />}
        {analysisResult && (
        
          <>
            <div
              style={{
                overflowX: "hidden",
                position: "relative",
                color: "white",
                display: "flex",
                width: "100vw",
                // height: "100vh",
                justifyContent: "center",
                alignItems: "center",
              }}
            >
              <Sidebar handleClick={Click} active={index}/>
             
              {index == 0 && (
                <ExecutiveSummary
                  data={analysisResult}
                  ratios={analysisResult?.financial_ratios}
                  handleupload={upload}
                  filename={analysisResult.filename}
                  ticker={analysisResult.companyTicker}
                />
              )}
              {index == 1 && (
                <MetricsDashboard
                  data={analysisResult?.key_metrics}
                  analysisResult={analysisResult}
                  context={analysisResult?.raw_management_discussion}
                  ratios={analysisResult?.financial_ratios}
                  benchmarkData={analysisResult?.industry_benchmarks}
                />
              )}
              {index == 2 && (
                <RiskDiffViewer
                  oldText={analysisResult?.previous_raw_risk_factors}
                  newText={analysisResult?.raw_risk_factors}
                  comparisonSummary={analysisResult?.risk_comparison}
                  wordCloudData={analysisResult?.risk_wordcloud}
                />
              )}
              {index == 3 && (
                <FinancialStatements
                  data={analysisResult?.financial_statements}
                  analysisResult={analysisResult}
                />
              )}
              {index == 4 && (
                <GuidanceOutlook
                  data={analysisResult?.guidance_analysis}
                  legal={analysisResult?.legal_summary}
                  manage={analysisResult?.management_tone}
                />
              )}
              {index == 5 && (
                <GovernanceChanges
                  comp={analysisResult?.competitor_analysis}
                  data={analysisResult?.governance_changes}
                />
              )}
              {index == 6 && (
                <HistoricalTrends
                  analysisResult={analysisResult}
                  context={analysisResult?.raw_management_discussion}
                  data={analysisResult?.risk_summary}
                  redFlagsData={analysisResult?.red_flags}
                />
              )}

              {index == 7 && (
                <FootnoteExplorer data={analysisResult?.footnote_summary} />
              )}
              {index == 8 && (
                <EsgAnalysis
                  data={analysisResult?.esg_analysis}
                  debt={analysisResult?.debt_details}
                  context={`List of debts taken by the company and it's maturity${analysisResult?.debt_details}`}
                />
              )}
              {index == 9 && <UploadFiles />}
              {/* <Paper sx={{ mt: 4 }} > */}

              {/* <TabPanel value={tabValue} index={0}>
              <Typography
                component="pre"
                sx={{ whiteSpace: "pre-wrap", wordBreak: "break-word" }}
              >
                <ExecutiveSummary data={analysisResult} />
              </Typography>
            </TabPanel>
            <TabPanel value={tabValue} index={1}>
              <Typography
                component="pre"
                sx={{ whiteSpace: "pre-wrap", wordBreak: "break-word" }}
              >
                <MetricsDashboard
                  data={analysisResult?.key_metrics}
                  analysisResult={analysisResult}
                  context={analysisResult?.raw_management_discussion}
                />
              </Typography>
            </TabPanel>
            <TabPanel value={tabValue} index={2}>
              <Typography
                component="pre"
                sx={{ whiteSpace: "pre-wrap", wordBreak: "break-word" }}
              >
                <FinancialStatements
                  data={analysisResult?.financial_statements}
                  analysisResult={analysisResult}
                />
              </Typography>
            </TabPanel>
            <TabPanel value={tabValue} index={3}>
              <Typography
                component="pre"
                sx={{ whiteSpace: "pre-wrap", wordBreak: "break-word" }}
              >
                <RatioAnalysis
                  data={analysisResult?.financial_ratios}
                  benchmarkData={analysisResult?.industry_benchmarks}
                />
              </Typography>
            </TabPanel>
            <TabPanel value={tabValue} index={4}>
              <Typography
                component="pre"
                sx={{ whiteSpace: "pre-wrap", wordBreak: "break-word" }}
              >
                <RiskDiffViewer
                  oldText={analysisResult?.previous_raw_risk_factors}
                  newText={analysisResult?.raw_risk_factors}
                  comparisonSummary={analysisResult?.risk_comparison}
                  wordCloudData={analysisResult?.risk_wordcloud}
                />
              </Typography>
            </TabPanel>
            <TabPanel value={tabValue} index={5}>
              <Typography
                component="pre"
                sx={{ whiteSpace: "pre-wrap", wordBreak: "break-word" }}
              >
                <ManagementTone data={analysisResult?.management_tone} />{" "}
              </Typography>
            </TabPanel>
            <TabPanel value={tabValue} index={6}>
              <Typography
                component="pre"
                sx={{ whiteSpace: "pre-wrap", wordBreak: "break-word" }}
              >
                <CompetitorAnalysis data={analysisResult?.competitor_analysis} />{" "}
              </Typography>
            </TabPanel>
            <TabPanel value={tabValue} index={7}>
              <Typography
                component="pre"
                sx={{ whiteSpace: "pre-wrap", wordBreak: "break-word" }}
              >
                <LegalSummary data={analysisResult?.legal_summary} />
              </Typography>
            </TabPanel>
            <TabPanel value={tabValue} index={8}>
              <Typography
                component="pre"
                sx={{ whiteSpace: "pre-wrap", wordBreak: "break-word" }}
              >
                <GuidanceOutlook data={analysisResult?.guidance_analysis} />
              </Typography>
            </TabPanel>
            <TabPanel value={tabValue} index={9}>
              <Typography
                component="pre"
                sx={{ whiteSpace: "pre-wrap", wordBreak: "break-word" }}
              >
                <RiskSummary
                  data={analysisResult?.risk_summary}
                  redFlagsData={analysisResult?.red_flags}
                />
              </Typography>
            </TabPanel>
            <TabPanel value={tabValue} index={10}>
              <Typography
                component="pre"
                sx={{ whiteSpace: "pre-wrap", wordBreak: "break-word" }}
              >
                <GovernanceChanges data={analysisResult?.governance_changes} />
              </Typography>
            </TabPanel>
            <TabPanel value={tabValue} index={11}>
              <Typography
                component="pre"
                sx={{ whiteSpace: "pre-wrap", wordBreak: "break-word" }}
              >
                <HistoricalTrends analysisResult={analysisResult} 
                context={analysisResult?.raw_management_discussion}/>
              </Typography>
            </TabPanel>
            <TabPanel value={tabValue} index={12}>
              <Typography
                component="pre"
                sx={{ whiteSpace: "pre-wrap", wordBreak: "break-word" }}
              >
                <DebtSchedule data={analysisResult?.debt_details} 
                context={`List of debts taken by the company and it's maturity${analysisResult?.debt_details}`}/>
              </Typography>
            </TabPanel>
            <TabPanel value={tabValue} index={13}>
              <Typography
                component="pre"
                sx={{ whiteSpace: "pre-wrap", wordBreak: "break-word" }}
              >
                <EsgAnalysis data={analysisResult?.esg_analysis} 
                />
              </Typography>
            </TabPanel>
            <TabPanel value={tabValue} index={14}>
              <Typography
                component="pre"
                sx={{ whiteSpace: "pre-wrap", wordBreak: "break-word" }}
              >
                <FootnoteExplorer data={analysisResult?.footnote_summary} />
              </Typography>
            </TabPanel> */}
            </div>
          </>
          )}
        
      </div>
    </>
  );
}

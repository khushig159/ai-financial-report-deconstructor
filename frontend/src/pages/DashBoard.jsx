import React, { useState,  useCallback } from "react";
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
  TextField
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

function TabPanel(props) {
  const { children, value, index } = props;
  return (
    <div hidden={value !== index}>
      {value === index && <Box sx={{ p: 3 }}>{children}</Box>}
    </div>
  );
}

// --- UPDATED FileUploader Component with your logic ---
function FileUploader() {
  const { startLoading, setResult, setError, isLoading } = useAnalysisStore();
  const [files, setFiles] = useState([]);
  const [companyTicker, setCompanyTicker] = useState('');
  const [uploadMode, setUploadMode] = useState(0); // 0 for single, 1 for compare

  const onDrop = useCallback((acceptedFiles) => {
    const maxFiles = uploadMode === 0 ? 1 : 2;
    setFiles(prev => [...prev, ...acceptedFiles].slice(0, maxFiles));
  }, [uploadMode]);

  const handleAnalyze = async () => {
    if (files.length === 0 || !companyTicker) {
      setError("Please provide a company ticker and at least one report file.");
      return;
    }

    startLoading();
    const formData = new FormData();
    formData.append('companyTicker', companyTicker.toUpperCase());
    formData.append('currentReport', files[0]);
    if (uploadMode === 1 && files[1]) {
      formData.append('previousReport', files[1]);
    }

    const API_URL = 'http://localhost:5000';
    
    try {
      const user = auth.currentUser;
      if (!user) throw new Error("User not logged in.");
      const token = await user.getIdToken();

      const response = await axios.post(`${API_URL}/api/analyze`, formData, {
        headers: { 
          'Content-Type': 'multipart/form-data',
          'Authorization': `Bearer ${token}`
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
    accept: { 'application/pdf': ['.pdf'] },
    maxFiles: uploadMode === 0 ? 1 : 2,
    disabled: isLoading,
  });

  return (
    <Box>
    <Paper sx={{ p: 3 }}>
      <Grid container spacing={3} alignItems="center">
        <Grid item xs={12} md={4}>
          <TextField
            fullWidth
            label="Company Ticker"
            variant="outlined"
            value={companyTicker}
            onChange={(e) => setCompanyTicker(e.target.value)}
            placeholder="e.g., AAPL, AMZN"
            disabled={isLoading}
          />
        </Grid>
        <Grid item xs={12} md={8}>
          <Tabs value={uploadMode} onChange={handleModeChange} centered>
            <Tab label="Analyze Single Report" />
            <Tab label="Compare Two Reports" />
          </Tabs>
        </Grid>
      </Grid>

      <Box {...getRootProps()} sx={{ mt: 2, p: 4, textAlign: 'center', border: '2px dashed grey', cursor: isLoading ? 'not-allowed' : 'pointer', backgroundColor: isDragActive ? '#333' : 'transparent' }}>
        <input {...getInputProps()} />
        <UploadFileIcon sx={{ fontSize: 48, mb: 2 }} />
        <Typography variant="h6">
          {uploadMode === 0 ? "Drop Current Report" : "Drop Current & Previous Reports"}
        </Typography>
      </Box>
      
      {files.length > 0 && (
        <Box sx={{ mt: 2 }}>
          <List dense>
            {files.map((file, index) => (
              <ListItem key={file.path}>
                <ListItemIcon><DescriptionIcon /></ListItemIcon>
                <ListItemText primary={file.path} secondary={index === 0 ? "Current Report" : "Previous Report"} />
              </ListItem>
            ))}
          </List>
        </Box>
      )}

      <Box sx={{ mt: 2, display: 'flex', gap: 2 }}>
        <Button 
          variant="contained" 
          onClick={handleAnalyze} 
          disabled={isLoading || files.length === 0 || !companyTicker}
        >
          {isLoading ? 'Analyzing...' : 'Analyze'}
        </Button>
        <Button variant="outlined" color="secondary" onClick={handleClear} disabled={isLoading}>
          Clear
        </Button>
      </Box>
      </Paper>
    </Box>
  );
}

export default function DashBoard() {
  const [tabValue, setTabValue] = useState(0);
  const { isLoading, analysisResult } = useAnalysisStore();
  const handleTabChange = (event, newValue) => setTabValue(newValue);

  return (
    <>
      <Box sx={{ mt: 4 }}>
        <FileUploader />

        {/* {isLoading && (
          <Box sx={{ display: "flex", justifyContent: "center", mt: 4 }}>
            <CircularProgress />
            <Typography variant="h6" sx={{ ml: 2 }}>
              Analyzing... This may take a minute.
            </Typography>
          </Box>
        )} */}

        {/* {error && (
          <Alert severity="error" sx={{ mt: 4 }}>
            {error}
          </Alert>
        )} */}
        {/* <Fade in={!!analysisResult && !isLoading} timeout={1000}> */}
        {analysisResult && !isLoading && (
          <Paper sx={{ mt: 4 }}>
            <Box sx={{ borderBottom: 1, borderColor: "divider" }}>
              <Tabs
                value={tabValue}
                onChange={handleTabChange}
                aria-label="analysis tabs"
                scrollButtons="auto"
                variant="scrollable"
              >
                <Tab label="Summary" /> {/* <-- ADD NEW TAB */}
                <Tab label="Key Metrics" />
                <Tab label="Financials" />
                <Tab label="Ratio Analysis" /> {/* <-- ADD NEW TAB */}
                <Tab label="Risk Factor Analysis" />
                <Tab label="Management Tone" />
                <Tab label="Competitors" />
                <Tab label="Legal" />
                <Tab label="Guidance & Outlook" />
                <Tab label="Anomaly Flags" />
                <Tab label="Governance Changes" />
                <Tab label="Historical Trends" />
                <Tab label="Debt & Covenants" /> {/* <-- ADD NEW TAB */}
                <Tab label="ESG" /> {/* <-- ADD NEW TAB */}
                <Tab label="Footnote Explorer" /> {/* <-- ADD NEW TAB */}
              </Tabs>
            </Box>
            <TabPanel value={tabValue} index={0}>
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
                  data={analysisResult.key_metrics}
                  analysisResult={analysisResult}
                  context={analysisResult.raw_management_discussion}
                />
              </Typography>
            </TabPanel>
            <TabPanel value={tabValue} index={2}>
              <Typography
                component="pre"
                sx={{ whiteSpace: "pre-wrap", wordBreak: "break-word" }}
              >
                <FinancialStatements
                  data={analysisResult.financial_statements}
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
                  data={analysisResult.financial_ratios}
                  benchmarkData={analysisResult.industry_benchmarks}
                />
              </Typography>
            </TabPanel>
            <TabPanel value={tabValue} index={4}>
              <Typography
                component="pre"
                sx={{ whiteSpace: "pre-wrap", wordBreak: "break-word" }}
              >
                <RiskDiffViewer
                  oldText={analysisResult.previous_raw_risk_factors}
                  newText={analysisResult.raw_risk_factors}
                  comparisonSummary={analysisResult.risk_comparison}
                  wordCloudData={analysisResult.risk_wordcloud}
                />
              </Typography>
            </TabPanel>
            <TabPanel value={tabValue} index={5}>
              <Typography
                component="pre"
                sx={{ whiteSpace: "pre-wrap", wordBreak: "break-word" }}
              >
                <ManagementTone data={analysisResult.management_tone} />{" "}
              </Typography>
            </TabPanel>
            <TabPanel value={tabValue} index={6}>
              <Typography
                component="pre"
                sx={{ whiteSpace: "pre-wrap", wordBreak: "break-word" }}
              >
                <CompetitorAnalysis data={analysisResult.competitor_analysis} />{" "}
              </Typography>
            </TabPanel>
            <TabPanel value={tabValue} index={7}>
              <Typography
                component="pre"
                sx={{ whiteSpace: "pre-wrap", wordBreak: "break-word" }}
              >
                <LegalSummary data={analysisResult.legal_summary} />
              </Typography>
            </TabPanel>
            <TabPanel value={tabValue} index={8}>
              <Typography
                component="pre"
                sx={{ whiteSpace: "pre-wrap", wordBreak: "break-word" }}
              >
                <GuidanceOutlook data={analysisResult.guidance_analysis} />
              </Typography>
            </TabPanel>
            <TabPanel value={tabValue} index={9}>
              <Typography
                component="pre"
                sx={{ whiteSpace: "pre-wrap", wordBreak: "break-word" }}
              >
                <RiskSummary
                  data={analysisResult.risk_summary}
                  redFlagsData={analysisResult.red_flags}
                />
              </Typography>
            </TabPanel>
            <TabPanel value={tabValue} index={10}>
              <Typography
                component="pre"
                sx={{ whiteSpace: "pre-wrap", wordBreak: "break-word" }}
              >
                <GovernanceChanges data={analysisResult.governance_changes} />
              </Typography>
            </TabPanel>
            <TabPanel value={tabValue} index={11}>
              <Typography
                component="pre"
                sx={{ whiteSpace: "pre-wrap", wordBreak: "break-word" }}
              >
                <HistoricalTrends analysisResult={analysisResult} 
                context={analysisResult.raw_management_discussion}/>
              </Typography>
            </TabPanel>
            <TabPanel value={tabValue} index={12}>
              <Typography
                component="pre"
                sx={{ whiteSpace: "pre-wrap", wordBreak: "break-word" }}
              >
                <DebtSchedule data={analysisResult.debt_details} 
                context={`List of debts taken by the company and it's maturity${analysisResult.debt_details}`}/>
              </Typography>
            </TabPanel>
            <TabPanel value={tabValue} index={13}>
              <Typography
                component="pre"
                sx={{ whiteSpace: "pre-wrap", wordBreak: "break-word" }}
              >
                <EsgAnalysis data={analysisResult.esg_analysis} 
                />
              </Typography>
            </TabPanel>
            <TabPanel value={tabValue} index={14}>
              <Typography
                component="pre"
                sx={{ whiteSpace: "pre-wrap", wordBreak: "break-word" }}
              >
                <FootnoteExplorer data={analysisResult.footnote_summary} />
              </Typography>
            </TabPanel>
          </Paper>
        )}
      </Box>
    </>
  );
}

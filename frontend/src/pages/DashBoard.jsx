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
import autoTable from "jspdf-autotable";


// function TabPanel(props) {
//   const { children, value, index } = props;
//   return (
//     <div hidden={value !== index}>
//       {value === index && <Box sx={{ p: 3 }}>{children}</Box>}
//     </div>
//   );
// }

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

export default function DashBoard() {
  const [index, setindex] = useState(0);
  const { analysisResult } = useAnalysisStore();

const handleExport = () => {
  const doc = new jsPDF("p", "mm", "a4");
  let yPos = 20; // Track manual Y position

 const addTextSection = (title, content) => {
  if (doc.lastAutoTable && doc.lastAutoTable.finalY > yPos) {
    yPos = doc.lastAutoTable.finalY + 8; // more space after tables
  }

  if (yPos > 280) {
    doc.addPage();
    yPos = 20;
  }

  // --- Title ---
  doc.setFontSize(14);
  doc.text(title, 14, yPos);
  yPos += 6;

  // --- Content ---
  if (content && content.trim().length > 0) {
    doc.setFontSize(10);
    const cleanContent = content.replace(/\n{3,}/g, "\n\n");
    const lines = doc.splitTextToSize(cleanContent, 180);

    lines.forEach((line) => {
      if (yPos > 280) {  
        doc.addPage();
        yPos = 20;
      }
      doc.text(line, 14, yPos);
      yPos += 4.5; // tight line spacing
    });

    yPos += 5; // BIGGER gap after section
  } else {
    yPos += 5; // if no content
  }
};


  const addTable = (title, data) => {
    if (doc.lastAutoTable && doc.lastAutoTable.finalY > yPos) {
      yPos = doc.lastAutoTable.finalY + 6;
    }

    doc.setFontSize(14);
    doc.text(title, 14, yPos);

    autoTable(doc, {
      startY: yPos + 4,
      head: [["Item", "Current Period", "Previous Period"]],
      body: data.map(d => [d.item, d.current_period, d.previous_period]),
      theme: "striped",
      styles: { fontSize: 10 },
      headStyles: { fillColor: [22, 160, 133] },
      margin: { left: 14, right: 14 }
    });

    yPos = doc.lastAutoTable.finalY + 6;
  };

  doc.setFontSize(20);
  doc.text(`AI Financial Analysis: ${analysisResult.companyTicker}`, 105, yPos, { align: "center" });
  yPos += 15;

  addTextSection("Executive Summary", analysisResult.executive_summary.paragraph);
  addTextSection("Key Takeaways", analysisResult.executive_summary.takeaways.join("\n"));

  const metricsText = `Revenue: ${analysisResult.key_metrics.revenue}$\nNet Income: ${analysisResult.key_metrics.income}$\nEPS: ${analysisResult.key_metrics.eps}`;
  addTextSection("Key Metrics", metricsText);

  const ratiosText = analysisResult.financial_ratios.ratios.map(r => `${r.name}: ${r.value}`).join("\n");
  addTextSection("Financial Ratios", ratiosText);

  const benchmark = analysisResult.industry_benchmarks.benchmarks
    .map(b => `Name: ${b.name}\nValue: ${b.value}\nComparison: ${b.comparison}`)
    .join("\n\n");
  addTextSection("Industry Benchmarks", benchmark);

  const manageText = `${analysisResult.management_tone.summary} (Cautiousness score: ${analysisResult.management_tone.cautiousness_score})`;
  addTextSection("Management Tone", manageText);

  // --- Tables ---
  addTable("Income Statement", analysisResult.financial_statements.income_statement);
  addTable("Balance Sheet", analysisResult.financial_statements.balance_sheet);
  addTable("Cash Flow Statement", analysisResult.financial_statements.cash_flow_statement);

  // --- More sections ---
  addTextSection("Competitor Analysis", analysisResult.competitor_analysis.competitors.map(c => `Name: ${c.name}\nContext: ${c.context}`).join("\n\n"));
  addTextSection("Guidance Analysis", analysisResult.guidance_analysis.guidance.map(g => `${g.statement} (${g.sentiment})`).join("\n\n"));
  addTextSection("ESG Analysis", analysisResult.esg_analysis.esg_mentions.map(e => `Category: ${e.category}\nStatement: ${e.statement}`).join("\n\n"));
  addTextSection("Governance Changes", analysisResult.governance_changes.join("\n"));
  addTextSection("Legal Summary", analysisResult.legal_summary.legal_summary.join("\n"));
  addTextSection("Top Identified Risks", analysisResult.risk_summary.top_risks.join("\n"));
  addTextSection("AI-Detected Potential Red Flags", analysisResult.red_flags.join("\n"));

  const debt = analysisResult.debt_details.debt_schedule.filter(d => d.principal_due != null).map(d => `${d.year} - Principal Due $${d.principal_due}`).join("\n");
  addTextSection("Debt Details", debt);

  const footnote = analysisResult.footnote_summary.footnote_summary.map((f, i) => `Note ${i+1}: ${f.topic}\n${f.summary}`).join("\n\n");
  addTextSection("FootNote Summary", footnote);

  // --- Save ---
  doc.save(`${analysisResult.companyTicker}-full-analysis.pdf`);
};


  function upload() {
    setindex(9);
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
              <Sidebar handleClick={Click} active={index} />

              {index == 0 && (
                <ExecutiveSummary
                  data={analysisResult}
                  ratios={analysisResult?.financial_ratios}
                  handleupload={upload}
                  filename={analysisResult.filename}
                  ticker={analysisResult.companyTicker}
                  handleExport={handleExport}
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
            </div>
          </>
        )}
      </div>
    </>
  );
}

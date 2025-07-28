import React, { useState, useEffect, useCallback,useRef } from 'react';
import { 
  createTheme, ThemeProvider, CssBaseline, Box, Typography, AppBar, Toolbar, 
  Tabs, Tab, Paper, Container, CircularProgress, Alert, List, ListItem, ListItemText, 
  ListItemIcon, Button
} from '@mui/material';
import { useDropzone } from 'react-dropzone';
import UploadFileIcon from '@mui/icons-material/UploadFile';
import DescriptionIcon from '@mui/icons-material/Description';
import axios from 'axios';
import useAnalysisStore from './stores/useAnalysisStore';
import KeyMetricsTable from './components/KeyMetricsTable';
import ManagementTone from './components/ManagementTone';
import RiskSummary from './components/RiskSummary';
import RiskDiffViewer from './components/RiskDiffViewer';

// --- THEME CONFIGURATION (Unchanged) ---
const darkTheme = createTheme({
  palette: { mode: 'dark', primary: { main: '#90caf9' }, background: { default: '#121212', paper: '#1e1e1e' } },
  typography: { fontFamily: '"Roboto", "Helvetica", "Arial", sans-serif', h4: { fontWeight: 700 }, h5: { fontWeight: 600 } },
});

// --- COMPONENTS ---

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
  const analysisTriggered = useRef(false); // The critical fix to prevent loops
  const { startLoading, setResult, setError, isLoading, analysisResult } = useAnalysisStore();
  const [files, setFiles] = useState([]);

  const onDrop = useCallback((acceptedFiles) => {
    // Your suggested logic to append files
    setFiles(prev => {
        const newFiles = [...prev, ...acceptedFiles];
        // If we add more than 2, just keep the latest 2.
        if (newFiles.length > 2) {
            return newFiles.slice(-2);
        }
        return newFiles;
    });
  }, []);
  
  // This useEffect hook triggers the analysis when we have exactly 2 files
  useEffect(() => {
    if (files.length === 2 && !isLoading && !analysisTriggered.current) {
      analysisTriggered.current=true
      const uploadAndAnalyze = async () => {
        startLoading();
        const formData = new FormData();
        // Assume the first file is current, second is previous
        formData.append('currentReport', files[0]);
        formData.append('previousReport', files[1]);

        try {
          const response = await axios.post('http://localhost:5000/api/analyze', formData, {
            headers: { 'Content-Type': 'multipart/form-data' },
          });
          setResult(response.data);
        } catch (err) {
          const errorMessage = err.response?.data?.message || "An unknown error occurred.";
          setError(errorMessage);
        }
      };
      uploadAndAnalyze();
    }
  }, [files, isLoading, startLoading, setResult, setError]);
  
  // Clear files when an analysis is complete
  useEffect(() => {
      if (analysisResult) {
          setFiles([]);
          analysisTriggered.current=false;
      }
  }, [analysisResult]);


  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: { 'application/pdf': ['.pdf'] },
    disabled: files.length >= 2 || isLoading, // Disable if 2 files are loaded or during analysis
  });

  const handleClear = () => {
      setFiles([]);
      analysisTriggered.current=false;
  }

  return (
    <Box>
      <Paper {...getRootProps()} sx={{ p: 4, textAlign: 'center', border: '2px dashed grey', backgroundColor: isDragActive ? '#333' : (files.length >= 2 || isLoading ? '#222' : 'transparent'), cursor: (files.length >= 2 || isLoading ? 'not-allowed' : 'pointer') }}>
        <input {...getInputProps()} />
        <UploadFileIcon sx={{ fontSize: 48, mb: 2 }} />
        <Typography variant="h6">
          {files.length < 2 ? "Drop files one by one, or select multiple" : "Files ready for analysis"}
        </Typography>
        <Typography variant="body2" color="text.secondary">
          {files.length} of 2 files selected
        </Typography>
      </Paper>
      {files.length > 0 && (
        <Box>
            <List>
            {files.map(file => (
                <ListItem key={file.path}>
                <ListItemIcon>
                    <DescriptionIcon />
                </ListItemIcon>
                <ListItemText primary={file.path} secondary={`${(file.size / 1024).toFixed(2)} KB`} />
                </ListItem>
            ))}
            </List>
            <Button onClick={handleClear} variant="outlined" color="secondary" disabled={isLoading}>Clear Files</Button>
        </Box>
      )}
    </Box>
  );
}


// --- Main App Component (Unchanged) ---
function App() {
  const [tabValue, setTabValue] = useState(0);
  const { isLoading, error, analysisResult } = useAnalysisStore();
  const handleTabChange = (event, newValue) => setTabValue(newValue);

  return (
    <ThemeProvider theme={darkTheme}>
      <CssBaseline />
      <Box sx={{ display: 'flex', flexDirection: 'column', minHeight: '100vh' }}>
        <AppBar position="static">
          <Toolbar>
            <Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>
              AI Financial Report Deconstructor
            </Typography>
          </Toolbar>
        </AppBar>
        <Container component="main" sx={{ mt: 4, mb: 4 }}>
          <FileUploader />

          {isLoading && (
            <Box sx={{ display: 'flex', justifyContent: 'center', mt: 4 }}>
              <CircularProgress />
              <Typography variant="h6" sx={{ ml: 2 }}>Analyzing... This may take a minute.</Typography>
            </Box>
          )}

          {error && (
            <Alert severity="error" sx={{ mt: 4 }}>
              {error}
            </Alert>
          )}

          {analysisResult && !isLoading && (
            <Paper sx={{ mt: 4 }}>
              <Box sx={{ borderBottom: 1, borderColor: 'divider' }}>
                <Tabs value={tabValue} onChange={handleTabChange} aria-label="analysis tabs">
                  <Tab label="Key Metrics" />
                  <Tab label="Risk Factor Analysis" />
                  <Tab label="Management Tone" />
                  <Tab label="Anomaly Flags" />
                </Tabs>
              </Box>
              <TabPanel value={tabValue} index={0}>
                <Typography component="pre" sx={{ whiteSpace: 'pre-wrap', wordBreak: 'break-word' }}>
                  <KeyMetricsTable data={analysisResult.key_metrics}/>
                </Typography>
              </TabPanel>
              <TabPanel value={tabValue} index={1}>
                <RiskDiffViewer
                oldText={analysisResult.previous_raw_risk_factors}
                newText={analysisResult.raw_risk_factors}
                comparisonSummary={analysisResult.risk_comparison}
                />
              </TabPanel>
              <TabPanel value={tabValue} index={2}>
                 <Typography component="pre" sx={{ whiteSpace: 'pre-wrap', wordBreak: 'break-word' }}>
                 <ManagementTone data={analysisResult.management_tone} />                 </Typography>
              </TabPanel>
              <TabPanel value={tabValue} index={3}>
                 <Typography component="pre" sx={{ whiteSpace: 'pre-wrap', wordBreak: 'break-word' }}>
                 <RiskSummary data={analysisResult.risk_summary} />
                 </Typography>
              </TabPanel>
            </Paper>
          )}
        </Container>
      </Box>
    </ThemeProvider>
  );
}

export default App;

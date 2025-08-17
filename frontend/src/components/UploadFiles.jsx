import React, { useState, useCallback } from "react";
import { useDropzone } from "react-dropzone";
import styles from "../module/dash.module.css";
import UploadFileIcon from "@mui/icons-material/UploadFile";
import DescriptionIcon from "@mui/icons-material/Description";
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

function FileUploader() {
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

  const handleModeChange = (event, newValue) => {
    setUploadMode(newValue);
    setFiles([]); // Clear files when changing mode
  };
  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: { "application/pdf": [".pdf"] },
    maxFiles: uploadMode === 0 ? 1 : 2,
    // disabled: isLoading,
  });
  return (
    <>
    <div className={styles.container}>
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
                  secondary={index === 0 ? "Current Report" : "Previous Report"}
                />
              </ListItem>
            ))}
          </List>
        </Box>
      )}
      <div className={styles.butcon}>
      <button className={styles.button1}>{"Analyze"}</button>
      <button className={styles.button2}>
        Clear
      </button></div>
      </div>
    </>
  );
}

export default function UploadFiles() {
  return (
    <div
      style={{
        position: "relative",
        marginLeft:'300px',
        marginTop:'100px',
        alignItems: "center",
        height: "70vh",
        color: "#16211c",
        // padding: "2rem",
        // marginTop: "50px",
      }}
    >
      <FileUploader />
    </div>
  );
}

import React from 'react';
import { Paper, Typography, Box ,List,ListItem,ListItemIcon,ListItemText} from '@mui/material';
import InsightsIcon from '@mui/icons-material/Insights';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import HelpOutlineIcon from '@mui/icons-material/HelpOutline';
import styles from '../module/exe.module.css'

function ExecutiveSummary({ data ,ratios,handleupload,ticker}) {
    const ratio = ratios?.ratios;
  const summary = data?.executive_summary;

  if (!summary) {
    return (
      <Paper sx={{ p: 3 }}>
        <Typography variant="h6" gutterBottom>
          Executive Summary
        </Typography>
        <Typography>
          The AI-generated executive summary could not be created for this report.
        </Typography>
      </Paper>
    );
  }

  return (
    <>
    <div
      style={{
        flex: 1,
        position: "relative",
        display: "flex",
        flexDirection: "column",
        justifyContent: "start",
        alignItems: "center",
        // minHeight: "100vh",
        color: "#16211c",
        padding: "1rem",
        marginLeft:'300px',
      }}
    >
      <div className={styles.upper}>
        <div>
      <h1>Executive Summary</h1>
      <p>Analytics of {ticker}</p></div>
      <button onClick={handleupload}>Upload File</button>
      </div>
      <div style={{width:'100%'}}>
        <div className={styles.grid}>
          {ratio.map((rat, index) => (
            <div className={styles.card}>
              <p>{rat.name}</p>
              <h3>{rat.value}</h3>
            </div>
          ))}
        </div>
      </div>
      <div>
      <div className={styles.topic}>
        <InsightsIcon color="primary" sx={{ mr: 1.5, fontSize: '2rem' }} />
        <h2>
          AI-Generated Executive Summary
        </h2>
      </div>
      <Typography   className={styles.p}sx={{ lineHeight: 1.7 }}>
        {summary.paragraph}
      </Typography></div>
      {summary.takeaways && summary.takeaways.length > 0 && (
        <div className={styles.takeaway}>
          <h2>
            Key Highlights
          </h2>
          <div>
            {summary.takeaways.map((item, index) => (
              <div key={index} className={styles.list}>
                <>
                  <CheckCircleIcon color="success"/>
                </>
                <p>{item}</p>
              </div>
            ))}
          </div>
        </div>
      )}
      </div>
      </>
  );
}

export default ExecutiveSummary;
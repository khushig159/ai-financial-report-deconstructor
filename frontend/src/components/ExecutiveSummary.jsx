import React from 'react';
import { Paper, Typography, Box } from '@mui/material';
import InsightsIcon from '@mui/icons-material/Insights';

function ExecutiveSummary({ data }) {
  const summary = data?.executive_summary;

  if (!summary || summary.includes("Failed to generate")) {
    return (
      <Paper sx={{ p: 3, backgroundColor: '#2a2a2a' }}>
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
    <Paper sx={{ p: 3, backgroundColor: '#2a2a2a' }}>
      <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
        <InsightsIcon color="primary" sx={{ mr: 1.5, fontSize: '2rem' }} />
        <Typography variant="h5" sx={{ fontWeight: 'bold' }}>
          AI-Generated Executive Summary
        </Typography>
      </Box>
      <Typography variant="body1" paragraph sx={{ lineHeight: 1.7, color: 'text.secondary' }}>
        {summary}
      </Typography>
    </Paper>
  );
}

export default ExecutiveSummary;
import React from 'react';
import { Box, Paper, Typography, Grid,Divider } from '@mui/material';
import BenchmarkDisplay from './BenchmarkDisplay';

// A single, reusable card for each ratio
function RatioCard({ title, value }) {
  return (
    <Paper 
      elevation={4} 
      sx={{ 
        p: 2, 
        display: 'flex', 
        flexDirection: 'column', 
        justifyContent: 'center', 
        alignItems: 'center',
        height: '100%',
        backgroundColor: '#2a2a2a'
      }}
    >
      <Typography variant="subtitle1" color="text.secondary">
        {title}
      </Typography>
      <Typography variant="h4" sx={{ fontWeight: 'bold', color: 'primary.main', mt: 1 }}>
        {value}
      </Typography>
    </Paper>
  );
}

function RatioAnalysis({ data ,benchmarkData}) {
  const ratios = data?.ratios;

  if (!ratios || ratios.length === 0) {
    return (
      <Paper sx={{ p: 3, backgroundColor: '#2a2a2a' }}>
        <Typography variant="h6" gutterBottom>
          Financial Ratio Analysis
        </Typography>
        <Typography>
          No financial ratios could be calculated from this report.
        </Typography>
      </Paper>
    );
  }

  return (
    <Box>
      <Typography variant="h6" gutterBottom sx={{ mb: 2 }}>
        Key Financial Ratios
      </Typography>
      <Grid container spacing={3}>
        {ratios.map((ratio, index) => (
          <Grid item xs={12} sm={6} md={3} key={index}>
            <RatioCard title={ratio.name} value={ratio.value} />
          </Grid>
        ))}
      </Grid>

      <Divider sx={{ my: 4 }} />

      <BenchmarkDisplay data={benchmarkData}/>
    </Box>
  );
}

export default RatioAnalysis;
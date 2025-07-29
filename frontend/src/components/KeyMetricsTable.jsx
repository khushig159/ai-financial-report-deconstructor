import React from 'react';
import { Box, Paper, Typography } from '@mui/material';

// A helper function to format the metric names for display



// A single, reusable card for each metric
function MetricCard({ title, value }) {
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

function KeyMetricsTable({ data }) {
  if (!data) {
    return <Typography>No key metrics data available.</Typography>;
  }

  return (
    <Box>
      <Typography variant="h6" gutterBottom sx={{ mb: 2 }}>
        Key Financial Metrics
      </Typography>
      {/* --- THE CRITICAL FIX IS HERE --- */}
      {/* This Box uses a direct CSS Grid layout for perfect alignment. */}
      <Box 
        sx={{
          display: 'grid',
          // On small screens (xs), one column. On medium screens (md) and up, three columns.
          gridTemplateColumns: { xs: '1fr', md: '1fr 1fr 1fr' },
          gap: 2, // This creates the space between the cards
        }}
      >
        <MetricCard title="Total Revenue" value={data.revenue || 'N/A'} />
        <MetricCard title="Net Income" value={data.netIncome || 'N/A'} />
        <MetricCard title="Diluted EPS" value={data.eps || 'N/A'} />
      </Box>
    </Box>
  );
}

export default KeyMetricsTable;
import React from 'react';
import { Box, Paper, Typography, CircularProgress } from '@mui/material';

function ManagementTone({ data }) {
  if (!data || data.cautiousness_score === -1 || data.summary === "N/A") {
    return <Typography>No management tone data available for this report.</Typography>;
  }

  const { summary, cautiousness_score } = data;
  const scorePercentage = cautiousness_score * 10;

  // This function changes the color of the circle based on the score
  const getColor = (value) => {
    if (value <= 3) return 'success'; // Green for optimistic
    if (value <= 6) return 'warning'; // Yellow for neutral
    return 'error'; // Red for cautious
  };

  return (
    <Paper sx={{ p: 3, backgroundColor: '#2a2a2a' }}>
      <Typography variant="h6" gutterBottom>
        Linguistic Tone Analysis
      </Typography>
      
      {/* This Box creates the blue line and formats the summary text */}
      <Box sx={{ borderLeft: '4px solid #90caf9', pl: 2, my: 2 }}>
        <Typography variant="body1" sx={{ fontStyle: 'italic', color: 'text.secondary' }}>
          "{summary}"
        </Typography>
      </Box>

      {/* This Box centers the gauge and the title */}
      <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center', mt: 4, flexDirection: 'column' }}>
        <Typography variant="subtitle1" gutterBottom>
          Cautiousness Score
        </Typography>
        <Box sx={{ position: 'relative', display: 'inline-flex', mt: 1 }}>
          {/* This is the grey background circle */}
          <CircularProgress
            variant="determinate"
            value={100}
            size={120}
            thickness={4}
            sx={{ color: 'grey.700' }}
          />
          {/* This is the colored foreground circle */}
          <CircularProgress
            variant="determinate"
            value={scorePercentage}
            size={120}
            thickness={4}
            color={getColor(cautiousness_score)}
            sx={{ position: 'absolute', left: 0 }}
          />
          {/* This Box puts the number in the middle of the circle */}
          <Box
            sx={{
              top: 0,
              left: 0,
              bottom: 0,
              right: 0,
              position: 'absolute',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
            }}
          >
            <Typography variant="h4" component="div" color="text.primary" sx={{ fontWeight: 'bold' }}>
              {cautiousness_score}
            </Typography>
          </Box>
        </Box>
      </Box>
    </Paper>
  );
}

export default ManagementTone;
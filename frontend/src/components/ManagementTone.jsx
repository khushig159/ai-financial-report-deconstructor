import React from 'react';
import { Box, Paper, Typography, LinearProgress } from '@mui/material';

function ManagementTone({ data }) {
  if (!data || data.cautiousness_score === -1) {
    return <Typography>No management tone data available.</Typography>;
  }

  const { summary, cautiousness_score } = data;
  const scorePercentage = cautiousness_score * 10;

  // This function changes the color of the bar based on the score
  const getColor = (value) => {
    if (value <= 3) return 'success'; // Green for optimistic
    if (value <= 6) return 'warning'; // Yellow for neutral
    return 'error'; // Red for cautious
  };

  return (
    <Paper sx={{ p: 2 }}>
      <Typography variant="h6" gutterBottom>
        Linguistic Tone Analysis
      </Typography>
      <Typography variant="body1" paragraph sx={{ fontStyle: 'italic', color: 'text.secondary' }}>
        "{summary}"
      </Typography>
      <Box sx={{ mt: 2 }}>
        <Typography variant="subtitle1" gutterBottom>
          Cautiousness Score: {cautiousness_score} / 10
        </Typography>
        <LinearProgress
          variant="determinate"
          value={scorePercentage}
          color={getColor(cautiousness_score)}
          sx={{ height: 10, borderRadius: 5 }}
        />
      </Box>
    </Paper>
  );
}

export default ManagementTone;
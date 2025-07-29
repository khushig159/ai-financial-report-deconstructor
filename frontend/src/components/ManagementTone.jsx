import React from 'react';
import { Box, Paper, Typography } from '@mui/material';
import { RadialBarChart, RadialBar, Legend, ResponsiveContainer, PolarAngleAxis } from 'recharts';

function ManagementTone({ data }) {
  if (!data || data.cautiousness_score === -1 || data.summary === "N/A") {
    return <Typography>No management tone data available for this report.</Typography>;
  }

  const { summary, cautiousness_score } = data;

  // Data for the radial bar chart. Recharts expects an array.
  const chartData = [
    {
      name: 'Cautiousness',
      score: cautiousness_score,
      // Fill color changes based on the score
      fill: cautiousness_score > 6 ? '#f44336' : cautiousness_score > 3 ? '#ff9800' : '#4caf50',
    },
  ];

  return (
    <Paper sx={{ p: 3, backgroundColor: '#2a2a2a' }}>
      <Typography variant="h6" gutterBottom>
        Linguistic Tone Analysis
      </Typography>
      
      <Box sx={{ borderLeft: '4px solid #90caf9', pl: 2, my: 2 }}>
        <Typography variant="body1" sx={{ fontStyle: 'italic', color: 'text.secondary' }}>
          "{summary}"
        </Typography>
      </Box>

      {/* --- NEW: Radial Gauge Chart --- */}
      <Box sx={{ height: 250, display: 'flex', justifyContent: 'center', alignItems: 'center', flexDirection: 'column' }}>
        <Typography variant="subtitle1" gutterBottom>
          Cautiousness Score
        </Typography>
        <ResponsiveContainer width="100%" height="100%">
          <RadialBarChart 
            cx="50%" 
            cy="50%" 
            innerRadius="60%" 
            outerRadius="80%" 
            barSize={20} 
            data={chartData}
            startAngle={90}
            endAngle={-270}
          >
            <PolarAngleAxis
              type="number"
              domain={[0, 10]}
              angleAxisId={0}
              tick={false}
            />
            <RadialBar
              background
              dataKey="score"
              angleAxisId={0}
              cornerRadius={10}
            />
            {/* This text element displays the score in the center of the gauge */}
            <text x="50%" y="50%" textAnchor="middle" dominantBaseline="middle" fill="#fff" fontSize="32px" fontWeight="bold">
              {cautiousness_score}
            </text>
             <text x="50%" y="65%" textAnchor="middle" dominantBaseline="middle" fill="#ccc" fontSize="14px">
              out of 10
            </text>
          </RadialBarChart>
        </ResponsiveContainer>
      </Box>
    </Paper>
  );
}

export default ManagementTone;

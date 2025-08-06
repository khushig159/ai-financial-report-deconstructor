import React from 'react';
import { Box, Paper, Typography, Grid, Card, CardContent, Avatar } from '@mui/material';

// Helper function to generate a color from a string (for the avatar)
const stringToColor = (string) => {
  let hash = 0;
  for (let i = 0; i < string.length; i += 1) {
    hash = string.charCodeAt(i) + ((hash << 5) - hash);
  }
  let color = '#';
  for (let i = 0; i < 3; i += 1) {
    const value = (hash >> (i * 8)) & 0xff;
    color += `00${value.toString(16)}`.slice(-2);
  }
  return color;
};


function CompetitorAnalysis({ data }) {
  const competitors = data?.competitors;

  if (!competitors || competitors.length === 0 || (competitors[0] && competitors[0].name === "Error")) {
    return (
      <Paper sx={{ p: 3, backgroundColor: '#2a2a2a' }}>
        <Typography variant="h6" gutterBottom>
          Competitive Landscape
        </Typography>
        <Typography>
          No specific competitors were mentioned in the Management's Discussion & Analysis section of this report.
        </Typography>
      </Paper>
    );
  }

  return (
    <Box>
      <Typography variant="h6" gutterBottom sx={{ mb: 2 }}>
        Competitive Landscape Analysis
      </Typography>
      <Grid container spacing={3}>
        {competitors.map((competitor, index) => (
          <Grid item xs={12} md={6} lg={4} key={index}>
            <Card sx={{ height: '100%', backgroundColor: '#2a2a2a' }}>
              <CardContent sx={{ display: 'flex', flexDirection: 'column' }}>
                <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                  <Avatar sx={{ bgcolor: stringToColor(competitor.name), mr: 2, fontWeight: 'bold' }}>
                    {competitor.name.charAt(0)}
                  </Avatar>
                  <Typography variant="h6" component="div">
                    {competitor.name}
                  </Typography>
                </Box>
                <Typography variant="body2" color="text.secondary">
                  {competitor.context}
                </Typography>
              </CardContent>
            </Card>
          </Grid>
        ))}
      </Grid>
    </Box>
  );
}

export default CompetitorAnalysis;
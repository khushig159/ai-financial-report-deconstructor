import React from 'react';
import { Box, Paper, Typography, List, ListItem, ListItemText, Divider } from '@mui/material';

function CompetitorAnalysis({ data }) {
  const competitors = data?.competitors;

  if (!competitors || competitors.length === 0 || competitors[0].name === "Error") {
    return (
      <Paper sx={{ p: 3, backgroundColor: '#2a2a2a' }}>
        <Typography variant="h6" gutterBottom>
          Competitive Landscape
        </Typography>
        <Typography>
          No specific competitors were mentioned in the Management's Discussion & Analysis section.
        </Typography>
      </Paper>
    );
  }

  return (
    <Paper sx={{ p: 2, backgroundColor: '#2a2a2a' }}>
      <Typography variant="h6" gutterBottom sx={{ p: 2 }}>
        Competitive Landscape Analysis
      </Typography>
      <List>
        {competitors.map((competitor, index) => (
          <React.Fragment key={index}>
            <ListItem>
              <ListItemText
                primary={
                  <Typography variant="subtitle1" sx={{ fontWeight: 'bold' }}>
                    {competitor.name}
                  </Typography>
                }
                secondary={
                  <Typography variant="body2" color="text.secondary">
                    {competitor.context}
                  </Typography>
                }
              />
            </ListItem>
            {index < competitors.length - 1 && <Divider component="li" />}
          </React.Fragment>
        ))}
      </List>
    </Paper>
  );
}

export default CompetitorAnalysis;
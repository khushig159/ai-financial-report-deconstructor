import React from 'react';
import { Box, Paper, Typography, List, ListItem, ListItemText, Chip } from '@mui/material';

// Helper to get a color for each ESG category
const getCategoryChipColor = (category) => {
  const cat = category.toLowerCase();
  if (cat.includes('environmental')) return 'success';
  if (cat.includes('social')) return 'info';
  if (cat.includes('governance')) return 'warning';
  return 'default';
};

function EsgAnalysis({ data }) {
  const mentions = data?.esg_mentions;

  if (!mentions || mentions.length === 0) {
    return (
      <Paper sx={{ p: 3, backgroundColor: '#2a2a2a' }}>
        <Typography variant="h6" gutterBottom>
          ESG (Environmental, Social, and Governance)
        </Typography>
        <Typography>
          No specific ESG-related statements were identified in this report.
        </Typography>
      </Paper>
    );
  }

  return (
    <Paper sx={{ p: 2, backgroundColor: '#2a2a2a' }}>
      <Typography variant="h6" gutterBottom sx={{ p: 2 }}>
        ESG Mention Analysis
      </Typography>
      <List>
        {mentions.map((item, index) => (
          <ListItem key={index} alignItems="flex-start">
            <ListItemText
              primary={item.statement}
              secondary={
                <Chip 
                  label={item.category} 
                  color={getCategoryChipColor(item.category)} 
                  size="small" 
                  sx={{ mt: 1 }} 
                />
              }
            />
          </ListItem>
        ))}
      </List>
    </Paper>
  );
}

export default EsgAnalysis;
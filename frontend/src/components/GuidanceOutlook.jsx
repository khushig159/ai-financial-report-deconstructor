import React from 'react';
import { Paper, Typography, List, ListItem, ListItemIcon, ListItemText, Chip } from '@mui/material';
import TrendingUpIcon from '@mui/icons-material/TrendingUp';
import TrendingDownIcon from '@mui/icons-material/TrendingDown';
import TrendingFlatIcon from '@mui/icons-material/TrendingFlat';

// Helper function to get the right icon and color for each sentiment
const getSentimentStyle = (sentiment) => {
  switch (sentiment?.toLowerCase()) {
    case 'positive':
      return { icon: <TrendingUpIcon />, color: 'success' };
    case 'negative':
      return { icon: <TrendingDownIcon />, color: 'error' };
    case 'neutral':
      return { icon: <TrendingFlatIcon />, color: 'warning' };
    default:
      return { icon: <TrendingFlatIcon />, color: 'default' };
  }
};

function GuidanceOutlook({ data }) {
  const guidanceItems = data?.guidance;

  if (!guidanceItems || guidanceItems.length === 0 || (guidanceItems[0] && guidanceItems[0].statement.includes("Error"))) {
    return (
      <Paper sx={{ p: 3, backgroundColor: '#2a2a2a' }}>
        <Typography variant="h6" gutterBottom>
          Guidance & Forward-Looking Statements
        </Typography>
        <Typography>
          No specific forward-looking statements or guidance were identified in this report.
        </Typography>
      </Paper>
    );
  }

  return (
    <Paper sx={{ p: 2, backgroundColor: '#2a2a2a' }}>
      <Typography variant="h6" gutterBottom sx={{ p: 2 }}>
        Guidance & Forward-Looking Statements
      </Typography>
      <List>
        {guidanceItems.map((item, index) => {
          const { icon, color } = getSentimentStyle(item.sentiment);
          return (
            <ListItem key={index} alignItems="flex-start">
              <ListItemIcon sx={{ mt: 0.5 }}>
                {React.cloneElement(icon, { color: color })}
              </ListItemIcon>
              <ListItemText
                primary={item.statement}
                secondary={
                  <Chip label={item.sentiment} color={color} size="small" sx={{ mt: 1 }} />
                }
              />
            </ListItem>
          );
        })}
      </List>
    </Paper>
  );
}

export default GuidanceOutlook;

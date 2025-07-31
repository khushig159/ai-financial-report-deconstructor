import React from 'react';
import { Box, Typography, List, ListItem, ListItemIcon, ListItemText } from '@mui/material';
import FlagIcon from '@mui/icons-material/Flag';

function RedFlagDisplay({ data }) {
  const flags = data;

  if (!flags || flags.length === 0 || (flags[0] && flags[0].includes("Error"))) {
    return (
        <Typography sx={{ mt: 2 }}>
          No specific red flags were automatically detected by the AI.
        </Typography>
    );
  }

  return (
    <Box sx={{ mt: 4 }}>
      <Typography variant="h6" gutterBottom>
        AI-Detected Potential Red Flags
      </Typography>
      <List>
        {flags.map((flag, index) => (
          <ListItem key={index} alignItems="flex-start">
            <ListItemIcon sx={{ mt: 0.5 }}>
              <FlagIcon color="error" />
            </ListItemIcon>
            <ListItemText primary={flag} />
          </ListItem>
        ))}
      </List>
    </Box>
  );
}

export default RedFlagDisplay;
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
      <Typography variant="h6" sx={{fontFamily:'DM sans',fontSize:'25px'}}>
        AI-Detected Potential Red Flags
      </Typography>
      <List>
        {flags.map((flag, index) => (
          <ListItem key={index} alignItems="flex-start">
            <ListItemIcon sx={{ mt: 0.5 }}>
              <FlagIcon color="error" />
            </ListItemIcon>
            <p style={{fontFamily:'DM sans', fontSize:'16px',fontWeight:'400',color:'#6c6b6bff'}}>
            {flag}</p>
          </ListItem>
        ))}
      </List>
    </Box>
  );
}

export default RedFlagDisplay;
import React from 'react';
import { Paper, Typography, List, ListItem, ListItemIcon, ListItemText } from '@mui/material';
import SupervisorAccountIcon from '@mui/icons-material/SupervisorAccount';

function GovernanceChanges({ data }) {
  const changes = data;

  if (!changes || changes.length === 0 || (changes[0] && changes[0].includes("Error"))) {
    return (
      <Paper sx={{ p: 3, backgroundColor: '#2a2a2a' }}>
        <Typography variant="h6" gutterBottom>
          Executive & Board Changes
        </Typography>
        <Typography>
          No significant changes to executive personnel or the board of directors were mentioned in this report.
        </Typography>
      </Paper>
    );
  }

  return (
    <Paper sx={{ p: 2, backgroundColor: '#2a2a2a' }}>
      <Typography variant="h6" gutterBottom sx={{ p: 2 }}>
        Key Governance Changes
      </Typography>
      <List>
        {changes.map((item, index) => (
          <ListItem key={index}>
            <ListItemIcon>
              <SupervisorAccountIcon color="primary" />
            </ListItemIcon>
            <ListItemText primary={item} />
          </ListItem>
        ))}
      </List>
    </Paper>
  );
}

export default GovernanceChanges;

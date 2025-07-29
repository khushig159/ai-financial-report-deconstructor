import React from 'react';
import { Paper, Typography, List, ListItem, ListItemIcon, ListItemText } from '@mui/material';
import GavelIcon from '@mui/icons-material/Gavel';

function LegalSummary({ data }) {
  const proceedings = data?.legal_summary;

  if (!proceedings || proceedings.length === 0 || (proceedings[0] && proceedings[0].includes("Error"))) {
    return (
      <Paper sx={{ p: 3, backgroundColor: '#2a2a2a' }}>
        <Typography variant="h6" gutterBottom>
          Legal & Regulatory Proceedings
        </Typography>
        <Typography>
          No significant legal proceedings were mentioned in this report.
        </Typography>
      </Paper>
    );
  }

  return (
    <Paper sx={{ p: 2, backgroundColor: '#2a2a2a' }}>
      <Typography variant="h6" gutterBottom sx={{ p: 2 }}>
        Key Legal Proceedings
      </Typography>
      <List>
        {proceedings.map((item, index) => (
          <ListItem key={index}>
            <ListItemIcon>
              <GavelIcon color="warning" />
            </ListItemIcon>
            <ListItemText primary={item} />
          </ListItem>
        ))}
      </List>
    </Paper>
  );
}

export default LegalSummary;
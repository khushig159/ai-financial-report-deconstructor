import React from 'react';
import { Paper, Typography, List, ListItem, ListItemIcon, ListItemText, Divider } from '@mui/material';
import WarningAmberIcon from '@mui/icons-material/WarningAmber';
import RedFlagDisplay from './RedFlagDisplay';

function RiskSummary({ data,redFlagsData  }) {
  if (!data || !data.top_risks || data.top_risks[0] === 'N/A') {
    return <Typography>No risk summary data available.</Typography>;
  }

  return (
    <Paper sx={{ p: 2 }}>
      <Typography variant="h6" sx={{fontFamily:'DM sans',fontSize:'25px'}}>
        Top Identified Risks & Anomaly Flags
      </Typography>
      <List>
        {data.top_risks.map((risk, index) => (
          <ListItem key={index} alignItems="flex-start">
            <ListItemIcon sx={{ mt: 0.5 }}>
              <WarningAmberIcon color="error" />
            </ListItemIcon>
            <p style={{fontFamily:'DM sans', fontSize:'16px',fontWeight:'400',color:'#6c6b6bff'}}>{risk}</p>
          </ListItem>
        ))}
      </List>

      <Divider sc={{my:3}}/>
      <RedFlagDisplay data={redFlagsData}/>
    </Paper>
  );
}

export default RiskSummary;
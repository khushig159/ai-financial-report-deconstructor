import React from 'react';
import { Paper, Typography, List, Box,ListItem, ListItemIcon, ListItemText } from '@mui/material';
import SupervisorAccountIcon from '@mui/icons-material/SupervisorAccount';
import { Timeline, TimelineItem, TimelineSeparator, TimelineConnector, TimelineContent, TimelineDot, TimelineOppositeContent } from '@mui/lab';
import CompetitorAnalysis from './CompetitorAnalysis';

function GovernanceChanges({ data ,comp}) {
  const changes = data;

  if (!changes || changes.length === 0 || (changes[0] && changes[0].includes("Error"))) {
    return (
      <Paper sx={{ p: 3 }}>
        <Typography variant="h6" gutterBottom sx={{fontFamily:'DM sans', fontSize:'20px', color:'#474646ff'}}>
          Executive & Board Changes
        </Typography>
        <Typography sx={{fontFamily:'DM sans', fontSize:'15px', color:'#474646ff'}}>
          No significant changes to executive personnel or the board of directors were mentioned in this report.
        </Typography>
      </Paper>
    );
  }

  return (
    <div style={{marginLeft:'320px',marginRight:'24px'}}>
      <CompetitorAnalysis data={comp}/>
      <Typography variant="h6" gutterBottom sx={{ mb: 2, fontFamily:'DM sans', fontWeight:500,marginTop:'30px',fontSize:'25px', color:'black',marginBottom:'30px' }}>
        Key Governance Changes
      </Typography>
      <Paper sx={{ p: 2}}>
        <Timeline position="alternate">
          {changes.map((item, index) => (
            <TimelineItem key={index}>
              <TimelineOppositeContent
                sx={{ m: 'auto 0',fontFamily:'DM sans', fontSize:'15px', color:'#474646ff'}}
                align="right"
                variant="body2"
                color="text.secondary"
                
              >
                {/* Placeholder for date - can be enhanced if AI provides dates */}
                Change {index + 1}
              </TimelineOppositeContent>
              <TimelineSeparator>
                <TimelineConnector />
                <TimelineDot sx={{color:'#ffffffe9',backgroundColor:'#10335fff'}}>
                  <SupervisorAccountIcon />
                </TimelineDot>
                <TimelineConnector />
              </TimelineSeparator>
              <TimelineContent sx={{ py: '12px', px: 2 }}>
                <Paper elevation={3} sx={{ p: 2 }}>
                  <Typography sx={{fontFamily:'DM sans', fontSize:'15px', color:'#474646ff'}}>{item}</Typography>
                </Paper>
              </TimelineContent>
            </TimelineItem>
          ))}
        </Timeline>
      </Paper>
    </div>
  );
}

export default GovernanceChanges;
import React from 'react';
import { Paper, Typography, List, Box,ListItem, ListItemIcon, ListItemText } from '@mui/material';
import SupervisorAccountIcon from '@mui/icons-material/SupervisorAccount';
import { Timeline, TimelineItem, TimelineSeparator, TimelineConnector, TimelineContent, TimelineDot, TimelineOppositeContent } from '@mui/lab';

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
    <Box>
      <Typography variant="h6" gutterBottom sx={{ mb: 2 }}>
        Key Governance Changes
      </Typography>
      <Paper sx={{ p: 2, backgroundColor: '#2a2a2a' }}>
        <Timeline position="alternate">
          {changes.map((item, index) => (
            <TimelineItem key={index}>
              <TimelineOppositeContent
                sx={{ m: 'auto 0' }}
                align="right"
                variant="body2"
                color="text.secondary"
              >
                {/* Placeholder for date - can be enhanced if AI provides dates */}
                Change {index + 1}
              </TimelineOppositeContent>
              <TimelineSeparator>
                <TimelineConnector />
                <TimelineDot color="primary">
                  <SupervisorAccountIcon />
                </TimelineDot>
                <TimelineConnector />
              </TimelineSeparator>
              <TimelineContent sx={{ py: '12px', px: 2 }}>
                <Paper elevation={3} sx={{ p: 2 }}>
                  <Typography>{item}</Typography>
                </Paper>
              </TimelineContent>
            </TimelineItem>
          ))}
        </Timeline>
      </Paper>
    </Box>
  );
}

export default GovernanceChanges;
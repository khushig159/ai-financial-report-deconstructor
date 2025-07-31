import React from 'react';
import {
  Box, Paper, Typography, List, ListItem, ListItemIcon, ListItemText,
  Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Divider
} from '@mui/material';
import GavelIcon from '@mui/icons-material/Gavel';

function DebtSchedule({ data }) {
  const schedule = data?.debt_schedule;
  const covenants = data?.covenants;

  const hasSchedule = schedule && schedule.length > 0;
  const hasCovenants = covenants && covenants.length > 0;

  if (!hasSchedule || !hasCovenants) {
    return (
      <Paper sx={{ p: 3, backgroundColor: '#2a2a2a' }}>
        <Typography variant="h6" gutterBottom>
          Debt & Covenants
        </Typography>
        <Typography>
          No specific debt schedule or covenant information was extracted from this report.
        </Typography>
      </Paper>
    );
  }

  return (
    <Box>
      <Typography variant="h6" gutterBottom sx={{ mb: 2 }}>
        Debt & Covenant Deconstruction
      </Typography>

      {hasSchedule && (
        <Paper sx={{ p: 2, backgroundColor: '#2a2a2a', mb: 3 }}>
          <Typography variant="h6" gutterBottom sx={{ p: 2 }}>
            Future Principal Payments
          </Typography>
          <TableContainer>
            <Table size="small">
              <TableHead>
                <TableRow>
                  <TableCell sx={{ fontWeight: 'bold' }}>Maturity Year</TableCell>
                  <TableCell align="right" sx={{ fontWeight: 'bold' }}>Principal Due</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {schedule.map((row, index) => (
                  <TableRow key={index}>
                    <TableCell>{row.year}</TableCell>
                    <TableCell align="right">{row.principal_due}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>
        </Paper>
      )}

      {hasCovenants && (
        <Paper sx={{ p: 2, backgroundColor: '#2a2a2a' }}>
          <Typography variant="h6" gutterBottom sx={{ p: 2 }}>
            Identified Debt Covenants
          </Typography>
          <List>
            {covenants.map((item, index) => (
              <ListItem key={index}>
                <ListItemIcon>
                  <GavelIcon color="warning" />
                </ListItemIcon>
                <ListItemText primary={item} />
              </ListItem>
            ))}
          </List>
        </Paper>
      )}
    </Box>
  );
}

export default DebtSchedule;

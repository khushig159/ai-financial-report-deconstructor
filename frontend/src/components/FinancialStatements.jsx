import React from 'react';
import {
  Box, Paper, Typography, Accordion, AccordionSummary, AccordionDetails,
  Table, TableBody, TableCell, TableContainer, TableHead, TableRow
} from '@mui/material';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';

// A reusable component to render a single financial statement table
const StatementTable = ({ title, data }) => {
  if (!data || data.length === 0) {
    return <Typography sx={{ p: 2 }}>Data for {title} not available in this report.</Typography>;
  }

  return (
    <TableContainer>
      <Table stickyHeader size="small" aria-label={`${title} table`}>
        <TableHead>
          <TableRow>
            <TableCell sx={{ fontWeight: 'bold', backgroundColor: '#333' }}>Line Item</TableCell>
            <TableCell align="right" sx={{ fontWeight: 'bold', backgroundColor: '#333' }}>Current Period</TableCell>
            <TableCell align="right" sx={{ fontWeight: 'bold', backgroundColor: '#333' }}>Previous Period</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {data.map((row, index) => (
            <TableRow key={index} sx={{ '&:last-child td, &:last-child th': { border: 0 } }}>
              <TableCell component="th" scope="row">
                {row.item}
              </TableCell>
              <TableCell align="right">{row.current_period}</TableCell>
              <TableCell align="right">{row.previous_period}</TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </TableContainer>
  );
};

function FinancialStatements({ data }) {
  if (!data) {
    return (
      <Paper sx={{ p: 3, backgroundColor: '#2a2a2a' }}>
        <Typography variant="h6" gutterBottom>
          Financial Statements
        </Typography>
        <Typography>
          No financial statement data was extracted from this report.
        </Typography>
      </Paper>
    );
  }

  return (
    <Box>
      <Typography variant="h6" gutterBottom sx={{ mb: 2 }}>
        Deconstructed Financial Statements
      </Typography>
      
      {/* Accordion for Income Statement */}
      <Accordion defaultExpanded sx={{ backgroundColor: '#2a2a2a', mb: 1 }}>
        <AccordionSummary expandIcon={<ExpandMoreIcon />}>
          <Typography sx={{ fontWeight: 'bold' }}>Income Statement</Typography>
        </AccordionSummary>
        <AccordionDetails sx={{ p: 0 }}>
          <StatementTable title="Income Statement" data={data.income_statement} />
        </AccordionDetails>
      </Accordion>

      {/* Accordion for Balance Sheet */}
      <Accordion sx={{ backgroundColor: '#2a2a2a', mb: 1 }}>
        <AccordionSummary expandIcon={<ExpandMoreIcon />}>
          <Typography sx={{ fontWeight: 'bold' }}>Balance Sheet</Typography>
        </AccordionSummary>
        <AccordionDetails sx={{ p: 0 }}>
          <StatementTable title="Balance Sheet" data={data.balance_sheet} />
        </AccordionDetails>
      </Accordion>

      {/* Accordion for Cash Flow Statement */}
      <Accordion sx={{ backgroundColor: '#2a2a2a' }}>
        <AccordionSummary expandIcon={<ExpandMoreIcon />}>
          <Typography sx={{ fontWeight: 'bold' }}>Cash Flow Statement</Typography>
        </AccordionSummary>
        <AccordionDetails sx={{ p: 0 }}>
          <StatementTable title="Cash Flow Statement" data={data.cash_flow_statement} />
        </AccordionDetails>
      </Accordion>
    </Box>
  );
}

export default FinancialStatements;
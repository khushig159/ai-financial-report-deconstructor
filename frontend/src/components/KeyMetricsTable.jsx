import React from 'react';
import {
  Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper, Typography
} from '@mui/material';

// A helper function to format the metric names for display
const formatMetricName = (name) => {
  switch (name) {
    case 'revenue':
      return 'Total Revenue';
    case 'netIncome':
      return 'Net Income';
    case 'eps':
      return 'Diluted EPS';
    default:
      return name;
  }
};

function KeyMetricsTable({ data }) {
  if (!data) {
    return <Typography>No key metrics data available.</Typography>;
  }

  // This converts your data object into an array we can easily display
  const metrics = Object.entries(data).map(([key, value]) => ({ key, value }));

  return (
    <TableContainer component={Paper}>
      <Table aria-label="key metrics table">
        <TableHead>
          <TableRow>
            <TableCell sx={{ fontWeight: 'bold' }}>Metric</TableCell>
            <TableCell align="right" sx={{ fontWeight: 'bold' }}>Value</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {metrics.map((metric) => (
            <TableRow key={metric.key}>
              <TableCell component="th" scope="row">
                {formatMetricName(metric.key)}
              </TableCell>
              <TableCell align="right">{metric.value}</TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </TableContainer>
  );
}

export default KeyMetricsTable;
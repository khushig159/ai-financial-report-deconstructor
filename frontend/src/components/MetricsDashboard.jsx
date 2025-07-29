import React, { useState, useEffect } from 'react';
import { Box, Paper, Typography, Grid } from '@mui/material';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';

// A simpler, more reliable parser that just gets the number
const parseFinancialValue = (valueStr) => {
    if (typeof valueStr !== 'string' || valueStr === 'N/A') {
        return 0;
    }
    const numberPart = parseFloat(valueStr.replace(/[$,a-zA-Z]/g, ''));
    return isNaN(numberPart) ? 0 : numberPart;
};

// A formatter for the Y-axis of the chart to make large numbers readable
const formatYAxis = (tickItem) => {
    if (tickItem >= 1000) {
        return `${tickItem / 1000}k`;
    }
    return tickItem;
};


// A single, reusable card for each metric (Unchanged)
function MetricCard({ title, value }) {
  return (
    <Paper 
      elevation={4} 
      sx={{ 
        p: 3, 
        display: 'flex', 
        flexDirection: 'column', 
        justifyContent: 'center', 
        alignItems: 'center',
        height: '100%',
        backgroundColor: '#2a2a2a'
      }}
    >
      <Typography variant="subtitle1" color="text.secondary" sx={{ mb: 1 }}>
        {title}
      </Typography>
      <Typography variant="h4" sx={{ fontWeight: 'bold', color: 'primary.main' }}>
        {value}
      </Typography>
    </Paper>
  );
}

function MetricsDashboard({ data }) {
  const [chartUnit, setChartUnit] = useState('Millions');

  // --- THE CRITICAL FIX IS HERE ---
  // This useEffect hook runs when the data arrives and detects the unit.
  useEffect(() => {
    if (data && data.revenue && typeof data.revenue === 'string') {
      if (data.revenue.toLowerCase().includes('billion')) {
        setChartUnit('Billions');
      } else {
        setChartUnit('Millions');
      }
    }
  }, [data]); // Dependency array: this code runs whenever 'data' changes.

  if (!data) {
    return <Typography>No key metrics data available.</Typography>;
  }

  // Prepare the data for the chart
  const chartData = [
    {
      name: 'Metrics',
      Revenue: parseFinancialValue(data.revenue),
      'Net Income': parseFinancialValue(data.netIncome),
    },
  ];

  return (
    <Box>
      <Typography variant="h6" gutterBottom sx={{ mb: 2 }}>
        Key Financial Metrics
      </Typography>
      
      {/* Stat Cards (Unchanged) */}
      <Box 
        sx={{
          display: 'grid',
          gridTemplateColumns: { xs: '1fr', md: '1fr 1fr 1fr' },
          gap: 2,
          mb: 4
        }}
      >
        <MetricCard title="Total Revenue" value={data.revenue || 'N/A'} />
        <MetricCard title="Net Income" value={data.netIncome || 'N/A'} />
        <MetricCard title="Diluted EPS" value={data.eps || 'N/A'} />
      </Box>

      {/* Bar Chart Visualization */}
      <Paper sx={{ p: 2, mt: 3, backgroundColor: '#2a2a2a' }}>
        <Typography variant="h6" gutterBottom sx={{ ml: 2, mt: 1 }}>
          {/* The chart title is now dynamic */}
          Revenue vs. Net Income (in {chartUnit})
        </Typography>
        <Box sx={{ height: 300 }}>
            <ResponsiveContainer width="100%" height="100%">
                <BarChart
                    data={chartData}
                    margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
                >
                    <CartesianGrid strokeDasharray="3 3" stroke="#444" />
                    <XAxis dataKey="name" tick={{ fill: '#ccc' }} />
                    {/* The Y-axis now uses our formatter */}
                    <YAxis tick={{ fill: '#ccc' }} tickFormatter={formatYAxis} />
                    <Tooltip 
                        contentStyle={{ backgroundColor: '#333', border: '1px solid #555' }} 
                        labelStyle={{ color: '#fff' }}
                    />
                    <Legend wrapperStyle={{ color: '#ccc' }} />
                    <Bar dataKey="Revenue" fill="#8884d8" />
                    <Bar dataKey="Net Income" fill="#82ca9d" />
                </BarChart>
            </ResponsiveContainer>
        </Box>
      </Paper>
    </Box>
  );
}

export default MetricsDashboard;

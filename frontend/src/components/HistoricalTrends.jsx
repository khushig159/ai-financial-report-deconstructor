import React, { useState, useEffect } from 'react';
import { Box, Paper, Typography, CircularProgress, Alert,Grid } from '@mui/material';
import axios from 'axios';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';

// Helper function to parse financial strings into numbers
const parseFinancialValue = (valueStr) => {
    if (typeof valueStr !== 'string' || valueStr === 'N/A') {
        return null;
    }
    const numberPart = parseFloat(valueStr.replace(/[$,a-zA-Z]/g, ''));
    return isNaN(numberPart) ? null : numberPart;
};

// Helper function to format dates for the chart's X-axis
const formatDate = (dateString) => {
    const options = { year: 'numeric', month: 'short', day: 'numeric' };
    return new Date(dateString).toLocaleDateString(undefined, options);
};


function HistoricalTrends({ filename }) {
  const [history, setHistory] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (filename) {
      const fetchHistory = async () => {
        try {
          setIsLoading(true);
          setError(null);
          const response = await axios.get(`http://localhost:5000/api/history/${filename}`);
          
          // Process and format the data for the chart
          const formattedData = response.data.map(report => ({
            date: formatDate(report.uploadDate),
            Revenue: parseFinancialValue(report.key_metrics.revenue),
            'Net Income': parseFinancialValue(report.key_metrics.netIncome),
            'Cautiousness Score': report.management_tone.cautiousness_score,
          })).reverse(); // Reverse to show oldest to newest

          setHistory(formattedData);
          console.log("Formatted history data:", formattedData);

        } catch (err) {
          setError(err.response?.data?.message || "Failed to fetch historical data.");
        } finally {
          setIsLoading(false);
        }
      };
      fetchHistory();
    }
  }, [filename]); // This effect runs whenever the filename prop changes

  if (isLoading) {
    return <CircularProgress />;
  }

  if (error) {
    return <Alert severity="warning">{error}</Alert>;
  }
  
  if (history.length < 2) {
      return <Typography>At least two reports for this file must be analyzed to show a trend.</Typography>
  }

  return (
    <Box>
      <Typography variant="h6" gutterBottom sx={{ mb: 2 }}>
        Historical Trend Analysis for: {filename}
      </Typography>
      
      <Grid container spacing={4}>
        {/* Financial Trends Chart */}
        <Grid item xs={12} lg={6}>
            <Paper sx={{ p: 2, backgroundColor: '#2a2a2a', height: 400 }}>
                <Typography variant="h6" gutterBottom sx={{ ml: 2, mt: 1 }}>
                Revenue & Net Income (in Millions)
                </Typography>
                <ResponsiveContainer width="100%" height="90%">
                    <LineChart data={history} margin={{ top: 5, right: 30, left: 20, bottom: 5 }}>
                        <CartesianGrid strokeDasharray="3 3" stroke="#444" />
                        <XAxis dataKey="date" tick={{ fill: '#ccc' }} />
                        <YAxis tick={{ fill: '#ccc' }} />
                        <Tooltip contentStyle={{ backgroundColor: '#333', border: '1px solid #555' }} />
                        <Legend wrapperStyle={{ color: '#ccc' }} />
                        <Line type="monotone" dataKey="Revenue" stroke="#8884d8" activeDot={{ r: 8 }} />
                        <Line type="monotone" dataKey="Net Income" stroke="#82ca9d" />
                    </LineChart>
                </ResponsiveContainer>
            </Paper>
        </Grid>

        {/* --- NEW: Sentiment Trend Chart --- */}
        <Grid item xs={12} lg={6}>
            <Paper sx={{ p: 2, backgroundColor: '#2a2a2a', height: 400 }}>
                <Typography variant="h6" gutterBottom sx={{ ml: 2, mt: 1 }}>
                Management Tone Over Time
                </Typography>
                <ResponsiveContainer width="100%" height="90%">
                    <LineChart data={history} margin={{ top: 5, right: 30, left: 0, bottom: 5 }}>
                        <CartesianGrid strokeDasharray="3 3" stroke="#444" />
                        <XAxis dataKey="date" tick={{ fill: '#ccc' }} />
                        <YAxis domain={[0, 10]} tick={{ fill: '#ccc' }} />
                        <Tooltip contentStyle={{ backgroundColor: '#333', border: '1px solid #555' }} />
                        <Legend wrapperStyle={{ color: '#ccc' }} />
                        <Line type="monotone" dataKey="Cautiousness Score" stroke="#ff9800" activeDot={{ r: 8 }} />
                    </LineChart>
                </ResponsiveContainer>
            </Paper>
        </Grid>
      </Grid>
    </Box>
  );
}

export default HistoricalTrends;
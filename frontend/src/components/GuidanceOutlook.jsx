import React from 'react';
import { Box, Paper, Typography, Grid, Card, CardContent, Chip } from '@mui/material';
import { PieChart, Pie, Cell, ResponsiveContainer, Legend, Tooltip } from 'recharts';
import TrendingUpIcon from '@mui/icons-material/TrendingUp';
import TrendingDownIcon from '@mui/icons-material/TrendingDown';
import TrendingFlatIcon from '@mui/icons-material/TrendingFlat';


const COLORS = {
  Positive: '#4caf50', // green
  Negative: '#f44336', // red
  Neutral: '#ff9800',  // orange
};

const sentimentIcons = {
  Positive: <TrendingUpIcon />,
  Negative: <TrendingDownIcon />,
  Neutral: <TrendingFlatIcon />,
};

function GuidanceOutlook({ data }) {
  const guidanceItems = data?.guidance;

  if (!guidanceItems || guidanceItems.length === 0 || (guidanceItems[0] && guidanceItems[0].statement.includes("Error"))) {
    return (
      <Paper sx={{ p: 3, backgroundColor: '#2a2a2a' }}>
        <Typography variant="h6" gutterBottom>
          Guidance & Forward-Looking Statements
        </Typography>
        <Typography>
          No specific forward-looking statements or guidance were identified in this report.
        </Typography>
      </Paper>
    );
  }

  // Calculate the sentiment breakdown for the donut chart
  const sentimentCounts = guidanceItems.reduce((acc, item) => {
    const sentiment = item.sentiment || 'Neutral';
    acc[sentiment] = (acc[sentiment] || 0) + 1;
    return acc;
  }, {});

  const chartData = Object.keys(sentimentCounts).map(key => ({
    name: key,
    value: sentimentCounts[key],
  }));

  return (
    <Box>
      <Typography variant="h6" gutterBottom sx={{ mb: 2 }}>
        Guidance & Forward-Looking Statements
      </Typography>
      
      <Grid container spacing={4} alignItems="center">
        {/* Donut Chart Section */}
        <Grid item xs={12} md={4}>
          <Paper sx={{ p: 2, backgroundColor: '#2a2a2a', height: 300 }}>
            <Typography variant="h6" align="center" gutterBottom>Sentiment Breakdown</Typography>
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={chartData}
                  cx="50%"
                  cy="45%"
                  innerRadius={60}
                  outerRadius={80}
                  fill="#8884d8"
                  paddingAngle={5}
                  dataKey="value"
                  label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                >
                  {chartData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[entry.name]} />
                  ))}
                </Pie>
                <Tooltip 
                    contentStyle={{ backgroundColor: '#333', border: '1px solid #555' }}
                    itemStyle={{ color: '#fff' }}
                />
                <Legend wrapperStyle={{ color: '#ccc', bottom: 0 }} />
              </PieChart>
            </ResponsiveContainer>
          </Paper>
        </Grid>

        {/* Statement Cards Section */}
        <Grid item xs={12} md={8}>
          <Box sx={{ minHeight: 300, overflowY: 'auto', pr: 1 }}>
            {guidanceItems.map((item, index) => {
              const sentiment = item.sentiment || 'Neutral';
              const color = COLORS[sentiment];
              const icon = sentimentIcons[sentiment];

              return (
                <Card key={index} sx={{ mb: 2, backgroundColor: '#2a2a2a' }}>
                  <CardContent>
                    <Chip 
                      icon={React.cloneElement(icon, { style: { color }})}
                      label={sentiment}
                      variant="outlined"
                      size="small"
                      sx={{ borderColor: color, color: color, mb: 1.5 }}
                    />
                    <Typography variant="body2" color="text.secondary">
                      {item.statement}
                    </Typography>
                  </CardContent>
                </Card>
              );
            })}
          </Box>
        </Grid>
      </Grid>
    </Box>
  );
}

export default GuidanceOutlook;

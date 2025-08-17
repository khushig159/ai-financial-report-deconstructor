import React from 'react';
import { Box, Paper, Typography, Grid, Card, CardContent, Chip } from '@mui/material';
import { PieChart, Pie, Cell, ResponsiveContainer, Legend, Tooltip } from 'recharts';
import {  List, ListItem, ListItemIcon, ListItemText } from '@mui/material';
import { RadialBarChart, RadialBar, PolarAngleAxis } from 'recharts';
import GavelIcon from '@mui/icons-material/Gavel';
import TrendingUpIcon from '@mui/icons-material/TrendingUp';
import TrendingDownIcon from '@mui/icons-material/TrendingDown';
import TrendingFlatIcon from '@mui/icons-material/TrendingFlat';
import HelpOutlineIcon from '@mui/icons-material/HelpOutline';
import styles from '../module/dash.module.css'

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

function GuidanceOutlook({ data ,legal, manage}) {
  const proceedings = legal?.legal_summary;
  const guidanceItems = data?.guidance;

  if (!guidanceItems || guidanceItems.length === 0 || (guidanceItems[0] && guidanceItems[0].statement.includes("Error"))) {
    return (
      <Paper sx={{ p: 3}}>
        <Typography variant="h6" gutterBottom>
          Guidance & Forward-Looking Statements
        </Typography>
        <Typography>
          No specific forward-looking statements or guidance were identified in this report.
        </Typography>
      </Paper>
    );
  }

  const sentimentCounts = guidanceItems.reduce((acc, item) => {
    const sentiment = item.sentiment || 'Neutral';
    acc[sentiment] = (acc[sentiment] || 0) + 1;
    return acc;
  }, {});

  const chartData1 = Object.keys(sentimentCounts).map(key => ({
    name: key,
    value: sentimentCounts[key],
  }));

  const { summary, cautiousness_score } = manage;

  const chartData2 = [
    {
      name: 'Cautiousness',
      score: cautiousness_score,
      // Fill color changes based on the score
      fill: cautiousness_score > 6 ? '#f44336' : cautiousness_score > 3 ? '#ff9800' : '#4caf50',
    },
  ];

  return (
    <>
    <div style={{marginLeft:'320px', marginRight:'30px'}}>
    {/* <Paper sx={{ p: 3 }}> */}
          <Typography sx={{fontFamily:'DM sans',color:'black',fontSize:'24px',fontWeight:'500',marginBottom:'20px'}}>
            Linguistic Tone Analysis
          </Typography>
          
          <Box sx={{ borderLeft: '4px solid #90caf9', pl: 2, my: 2 }}>
            <Typography variant="body1" sx={{ fontStyle: 'italic', color: '#888',fontFamily:'DM sans' }}>
              "{summary}"
            </Typography>
          </Box>
    
          <div style={{ height: 250, display: 'flex', border:'none', justifyContent: 'center', alignItems: 'center', flexDirection: 'column' }}>
            <Typography sx={{fontFamily:'DM sans',color:'black', fontSize:'18px',fontWeight:'600'}} >
              Cautiousness Score
            </Typography>
            <ResponsiveContainer width="100%" height="100%">
              <RadialBarChart 
                cx="50%" 
                cy="50%" 
                innerRadius="60%" 
                outerRadius="80%" 
                barSize={20} 
                data={chartData2}
                startAngle={90}
                endAngle={-270}
              >
                <PolarAngleAxis
                  type="number"
                  domain={[0, 10]}
                  angleAxisId={0}
                  tick={false}
                />
                <RadialBar
                  background
                  dataKey="score"
                  angleAxisId={0}
                  cornerRadius={10}
                />
                {/* This text element displays the score in the center of the gauge */}
                <text x="50%" y="50%" textAnchor="middle" dominantBaseline="middle" fill="#680303ff" fontSize="32px" fontWeight="bold">
                  {cautiousness_score}
                </text>
                 <text x="50%" y="65%" textAnchor="middle" dominantBaseline="middle" fill="#575555ff" fontSize="14px">
                  out of 10
                </text>
              </RadialBarChart>
            </ResponsiveContainer>
          </div>
        {/* </Paper> */}
    <Box>
          <Typography sx={{fontFamily:'DM sans',color:'black',fontSize:'24px',fontWeight:'500',marginBottom:'30px'}}>
        Guidance & Forward-Looking Statements
      </Typography>
      
      <Grid container spacing={4} alignItems="center">
        <Grid item xs={12} md={4} sx={{width:'100%', marginRight:'30px'}}>
          <Paper sx={{ p: 2,height: 250 ,width:'100%'}}>
            <Typography variant="h6" align="center" sx={{fontFamily:'DM sans'}}>Sentiment Breakdown</Typography>
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={chartData1}
                  cx="50%"
                  cy="50%"
                  innerRadius={60}
                  outerRadius={80}
                  fill="#8884d8"
                  paddingAngle={9}
                  dataKey="value"
                  label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                >
                  {chartData1.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[entry.name]} />
                  ))}
                </Pie>
                <Tooltip 
                    // contentStyle={{  border: '1px solid #555' }}
                    itemStyle={{ color: 'black' }}
                />
                <Legend wrapperStyle={{ color: '#ccc', bottom: -10 }} />
              </PieChart>
            </ResponsiveContainer>
          </Paper>
        </Grid>

        <Grid item xs={12} md={8}>
          <Box sx={{ minHeight: 300, overflowY: 'auto', pr: 1 }}>
            {guidanceItems.map((item, index) => {
              const sentiment = item.sentiment || 'Neutral';
              const color = COLORS[sentiment];
              const icon = sentimentIcons[sentiment];

              return (
                <div className={styles.carddd} key={index}>
                  <CardContent>
                    <Chip 
                      icon={React.cloneElement(icon, { style: { color }})}
                      label={sentiment}
                      variant="outlined"
                      size="small"
                      sx={{ borderColor: color, color: color, mb: 1.5 ,fontFamily:'DM sans'}}
                    />
                    <Typography variant="body2" color="text.secondary" sx={{fontFamily:'DM sans',fontSize:'15px'}}>
                      {item.statement}
                    </Typography>
                  </CardContent>
                </div>
              );
            })}
          </Box>
        </Grid>
      </Grid>
    </Box>
    <Paper sx={{ p: 2 ,marginTop:'20px'}}>
          <Typography sx={{fontFamily:'DM sans',color:'black',fontSize:'25px',fontWeight:'500'}}>
        Key Legal Proceedings
      </Typography>
      <List>
        {proceedings.map((item, index) => (
          <ListItem key={index}>
            <ListItemIcon>
              <GavelIcon color="warning" />
            </ListItemIcon>
            <p style={{fontFamily:'DM sans', color:'#525050ff',fontSize:'15px',fontWeight:'400'}}>{item}</p>
          </ListItem>
        ))}
      </List>
    </Paper>
    </div>
    </>
  );
}

export default GuidanceOutlook;

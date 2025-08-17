import React from 'react';
import { Box, Paper, Typography, Grid, Tooltip,Divider } from '@mui/material';
import BenchmarkDisplay from './BenchmarkDisplay';
import TrendingUpIcon from '@mui/icons-material/TrendingUp';
import TrendingDownIcon from '@mui/icons-material/TrendingDown';
import TrendingFlatIcon from '@mui/icons-material/TrendingFlat';


const getBenchMarkStyle=(comparisonText)=>{
  if (!comparisonText) return { color: 'text.secondary', icon: <TrendingFlatIcon /> };
  const text = comparisonText.toLowerCase();
  if (text.includes("strong") || text.includes("above average") || text.includes("healthy") || text.includes("better")) {
    return { color: 'success.main', icon: <TrendingUpIcon /> };
  }
  if (text.includes("weak") || text.includes("below average") || text.includes("concerning") || text.includes("worse")) {
    return { color: 'error.main', icon: <TrendingDownIcon /> };
  }
  return { color: 'warning.main', icon: <TrendingFlatIcon /> };
};

function RatioGauge({title,value,benchMark}){
  const style=getBenchMarkStyle(benchMark);
  const numericValue = parseFloat(value?.replace('%', '')) || 0;
 return (
        <Tooltip title={benchMark || 'No benchmark available'} placement="top" arrow>
            <Paper 
                elevation={4} 
                sx={{ 
                    p: 2, 
                    height: '100%',
                    backgroundColor: '#2a2a2a',
                    display: 'flex',
                    flexDirection: 'column',
                    justifyContent: 'space-between'
                }}
            >
                <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <Typography variant="subtitle1" color="text.secondary">
                        {title}
                    </Typography>
                    {React.cloneElement(style.icon, { sx: { color: style.color } })}
                </Box>
                <Typography variant="h4" sx={{ fontWeight: 'bold', color: 'primary.main', my: 1 }}>
                    {value}
                </Typography>
                
                <Box sx={{ width: '100%', height: '8px', backgroundColor: 'grey.700', borderRadius: '4px' }}>
                    <Box sx={{ width: `${Math.min(numericValue, 100)}%`, height: '100%', backgroundColor: style.color, borderRadius: '4px' }} />
                </Box>

            </Paper>
        </Tooltip>
    );
}

function RatioAnalysis({ data ,benchmarkData}) {
  const ratios = data?.ratios;

  if (!ratios || ratios.length === 0) {
    return (
      <Paper sx={{ p: 3, backgroundColor: '#2a2a2a' }}>
        <Typography variant="h6" gutterBottom>
          Financial Ratio Analysis
        </Typography>
        <Typography>
          No financial ratios could be calculated from this report.
        </Typography>
      </Paper>
    );
  }

  return (
    <Box>
      <Typography variant="h6" gutterBottom sx={{ mb: 2 }}>
        Key Financial Ratios
      </Typography>
      <Grid container spacing={3}>
        {ratios.map((ratio, index) => {
          const benchmark=benchmarkData?.benchmarks?.find(b=>b.name===ratio.name)
          return(
          <Grid item xs={12} sm={6} md={3} key={index}>
            <RatioGauge title={ratio.name} value={ratio.value} benchMark={benchmark?.comparison}/>
          </Grid>
          )
})}
      </Grid>

      <Divider sx={{ my: 4 }} />

      <BenchmarkDisplay data={benchmarkData}/>
    </Box>
  );
}

export default RatioAnalysis;
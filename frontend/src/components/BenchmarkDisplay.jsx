import React from 'react';
import { Box, Typography, Chip } from '@mui/material';
import TrendingUpIcon from '@mui/icons-material/TrendingUp';
import TrendingDownIcon from '@mui/icons-material/TrendingDown';
import TrendingFlatIcon from '@mui/icons-material/TrendingFlat';

const getComparisonStyle = (comparisonText) => {
  const text = comparisonText.toLowerCase();
  if (text.includes("strong") || text.includes("above average") || text.includes("healthy")) {
    return { color: 'success.main', icon: <TrendingUpIcon sx={{ fontSize: '1rem', mr: 0.5 }} /> };
  }
  if (text.includes("weak") || text.includes("below average") || text.includes("concerning")) {
    return { color: 'error.main', icon: <TrendingDownIcon sx={{ fontSize: '1rem', mr: 0.5 }} /> };
  }
  return { color: 'warning.main', icon: <TrendingFlatIcon sx={{ fontSize: '1rem', mr: 0.5 }} /> };
};

function BenchmarkDisplay({ data }) {
  const benchmarks = data?.benchmarks;

  if (!benchmarks || benchmarks.length === 0) {
    return null; 
  }

  return (
    <Box sx={{ mt: 3 }}>
      <h2 style={{marginTop:'40px'}}>
        Industry Benchmarking
      </h2>
      {benchmarks.map((item, index) => {
        const style = getComparisonStyle(item.comparison);
        return (
          <Box key={index} sx={{ mb: 2 }}>
            <Chip 
              icon={style.icon}
              label={item.name} 
              size="small" 
              sx={{ mb: 0.5, fontWeight: '600' ,fontFamily:'DM sans', padding:'13px', marginBottom:'13px'}}
            />
            <Typography variant="body2" color={style.color} sx={{fontFamily:'DM sans', width:'95%', fontWeight:'500',fontSize:'15px'}}>
              {item.comparison}
            </Typography>
          </Box>
        );
      })}
    </Box>
  );
}

export default BenchmarkDisplay;
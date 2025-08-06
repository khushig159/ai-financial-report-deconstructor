import React from 'react';
import { Box, Typography } from '@mui/material';
import ReactWordcloud from 'react-wordcloud';


const options = {
  colors: ["#90caf9", "#f48fb1", "#ce93d8", "#81d4fa", "#a5d6a7"],
  enableTooltip: true,
  deterministic: false,
  fontFamily: "Roboto",
  fontSizes: [14, 60],
  padding: 1,
  rotations: 2,
  rotationAngles: [0, 90],
  scale: "sqrt",
  spiral: "archimedean",
  transitionDuration: 1000
};

function RiskWordCloud({ data }) {
const rawWords = data?.wordcloud_data ?? [];
console.log(rawWords)
  // Safely map and filter invalid entries
  const words = rawWords
    .map(word => ({
      text: word.text,
      value: word.value
    }));
    console.log(words)

  if (words.length === 0) {
    return <Typography variant="body2" color="text.secondary">No valid word cloud data available.</Typography>;
  }

  return (
    <Box sx={{ height: 300, width: '100%' }}>
      <Typography variant="h6" gutterBottom>
        Key Risk Themes
      </Typography>
      <ReactWordcloud words={words} options={options} />
    </Box>
  );
}
export default RiskWordCloud;
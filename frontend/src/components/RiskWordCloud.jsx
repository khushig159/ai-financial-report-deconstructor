import React from 'react';
import { Box, Typography } from '@mui/material';
import ReactWordcloud from 'react-wordcloud';

// WordCloud options
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
  transitionDuration: 1000,
};

// Error boundary component
class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError(error) {
    return { hasError: true };
  }

  componentDidCatch(error, errorInfo) {
    console.error("WordCloud Render Error:", error, errorInfo);
  }

  render() {
    if (this.state.hasError) {
      return (
        <Typography variant="body2" color="error">
          Error loading word cloud. Please try again later.
        </Typography>
      );
    }

    return this.props.children;
  }
}

// Main RiskWordCloud Component
function RiskWordCloud({ data }) {
  // Validate that data is an array of words
  const words = Array.isArray(data)
    ? data.filter(
        (word) =>
          word &&
          typeof word.text === 'string' &&
          word.text.trim() !== '' &&
          typeof word.value === 'number' &&
          !isNaN(word.value)
      )
    : [];

  if (words.length === 0) {
    return (
      <Typography variant="body2" color="text.secondary">
        No valid word cloud data available.
      </Typography>
    );
  }

  return (
    <Box sx={{ width: '100%', maxWidth: 600 }}>
      <Typography variant="h6" gutterBottom>
        Key Risk Themes
      </Typography>
      <ErrorBoundary>
        <div style={{ height: 300, width: 600 }}>
          <ReactWordcloud words={words} options={options} />
        </div>
      </ErrorBoundary>
    </Box>
  );
}

export default RiskWordCloud;

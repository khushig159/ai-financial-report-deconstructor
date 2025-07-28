import React from 'react';
import ReactDiffViewer, { DiffMethod } from 'react-diff-viewer';
import { Box, Typography, Paper, List, ListItem, ListItemIcon, ListItemText } from '@mui/material';
import CheckCircleOutlineIcon from '@mui/icons-material/CheckCircleOutline';
import ChangeHistoryIcon from '@mui/icons-material/ChangeHistory';

function RiskDiffViewer({ oldText, newText, comparisonSummary }) {
  if (!oldText || !newText) {
    return <Typography>Risk factor text for comparison is not available.</Typography>;
  }

  const areTextsIdentical = oldText.trim() === newText.trim();
  
  const hasValidSummary = comparisonSummary && comparisonSummary.comparison_summary && comparisonSummary.comparison_summary.length > 0;
  
  return (
    <Box>
      <Typography variant="h5" gutterBottom>
        Risk Factor Comparison
      </Typography>

      {/* AI Summary Section */}
      <Paper sx={{ p: 2, mb: 3, backgroundColor: '#2a2a2a' }}>
        <Typography variant="h6" gutterBottom>
          AI-Generated Summary of Changes
        </Typography>
        
        {/* --- THE CRITICAL FIX IS HERE --- */}
        {/* The "!" has been removed from the condition. */}
        {hasValidSummary ? (
          // If there ARE changes, display the list.
          <List dense>
            {comparisonSummary.comparison_summary.map((change, index) => (
              <ListItem key={index}>
                <ListItemIcon sx={{ minWidth: 32 }}>
                  <ChangeHistoryIcon color="primary" />
                </ListItemIcon>
                <ListItemText primary={change} />
              </ListItem>
            ))}
          </List>
        ) : (
          // If there are NO changes, show the success message.
          <Box sx={{ display: 'flex', alignItems: 'center', color: 'success.main' }}>
            <CheckCircleOutlineIcon sx={{ mr: 1 }} />
            <Typography>
              {areTextsIdentical
                ? "No changes were detected between the two reports."
                : "AI did not find any major risks to highlight."}
            </Typography>
          </Box>
        )}
      </Paper>

      {/* Raw Diff Viewer Section (Unchanged) */}
      <Typography variant="h6" gutterBottom>
        Detailed Side-by-Side View
      </Typography>
      <Box sx={{ mt: 1, '& .diff-viewer': { backgroundColor: '#1e1e1e', fontFamily: 'monospace' } }}>
        <ReactDiffViewer
          oldValue={oldText}
          newValue={newText}
          splitView={true}
          compareMethod={DiffMethod.WORDS}
          useDarkTheme={true}
          leftTitle="Previous Period"
          rightTitle="Current Period"
        />
      </Box>
    </Box>
  );
}

export default RiskDiffViewer;
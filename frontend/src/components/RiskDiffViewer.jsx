import React from 'react';
import ReactDiffViewer, { DiffMethod } from 'react-diff-viewer';
import { Box, Typography, Paper, List, ListItem, ListItemIcon, ListItemText, useTheme, useMediaQuery } from '@mui/material';
import CheckCircleOutlineIcon from '@mui/icons-material/CheckCircleOutline';
import ChangeHistoryIcon from '@mui/icons-material/ChangeHistory';

function RiskDiffViewer({ oldText, newText, comparisonSummary }) {
  // --- THE CRITICAL FIX FOR RESPONSIVENESS ---
  const theme = useTheme();
  // This hook returns 'true' if the screen width is medium (md) or larger.
  const isDesktop = useMediaQuery(theme.breakpoints.up('md'));

  if (!oldText || !newText) {
    return <Typography>Risk factor text for both periods is required for comparison.</Typography>;
  }

  const areTextsIdentical = oldText.trim() === newText.trim();
  const hasValidSummary = comparisonSummary && comparisonSummary.comparison_summary && comparisonSummary.comparison_summary.length > 0;

  return (
    <Box>
      <Typography variant="h5" gutterBottom>
        Risk Factor Comparison
      </Typography>

      {/* AI Summary Section (Unchanged) */}
      <Paper sx={{ p: 2, mb: 3, backgroundColor: '#2a2a2a' }}>
        <Typography variant="h6" gutterBottom>
          AI-Generated Summary of Changes
        </Typography>
        {areTextsIdentical || !hasValidSummary ? (
          <Box sx={{ display: 'flex', alignItems: 'center', color: 'success.main' }}>
            <CheckCircleOutlineIcon sx={{ mr: 1 }} />
            <Typography>
              No significant changes were detected by the AI.
            </Typography>
          </Box>
        ) : (
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
        )}
      </Paper>

      {/* Raw Diff Viewer Section (Now Responsive) */}
      <Typography variant="h6" gutterBottom>
        Detailed Side-by-Side View
      </Typography>
      <Box sx={{ mt: 1, '& .diff-viewer': { backgroundColor: '#1e1e1e', fontFamily: 'monospace' } }}>
        <ReactDiffViewer
          oldValue={oldText}
          newValue={newText}
          // The view is now conditional on the screen size
          splitView={isDesktop} 
          compareMethod={DiffMethod.WORDS}
          useDarkTheme={true}
          leftTitle={isDesktop ? "Previous Period" : undefined}
          rightTitle={isDesktop ? "Current Period" : "Comparison"}
        />
      </Box>
    </Box>
  );
}

export default RiskDiffViewer;
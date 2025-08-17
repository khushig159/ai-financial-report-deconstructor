import React from 'react';
import ReactDiffViewer, { DiffMethod } from 'react-diff-viewer';
import { Box, Typography, Paper, List, ListItem, ListItemIcon, ListItemText, useTheme, useMediaQuery,Divider } from '@mui/material';
import CheckCircleOutlineIcon from '@mui/icons-material/CheckCircleOutline';
import ChangeHistoryIcon from '@mui/icons-material/ChangeHistory';
import RiskWordCloud from './RiskWordCloud';

function RiskDiffViewer({ oldText, newText, comparisonSummary,wordCloudData }) {
  const theme = useTheme();
  // This hook returns 'true' if the screen width is medium (md) or larger.
  const isDesktop = useMediaQuery(theme.breakpoints.up('md'));

  if (!oldText || !newText) {
    return <Typography>Risk factor text for both periods is required for comparison.</Typography>;
  }

  const areTextsIdentical = oldText.trim() === newText.trim();
  const hasValidSummary = comparisonSummary && comparisonSummary.comparison_summary && comparisonSummary.comparison_summary.length > 0;
const customStyles = {
  variables: {
    dark: {
      diffViewerBackground: '#1e1e1e', // Background color
      diffViewerColor: '#fff', // Text color
      addedBackground: '#86d386ff', // Background for added text
      addedColor: '#070a07ff', // Text color for added text
      removedBackground: '#871515cd', // Background for removed text
      removedColor: '#ffffffff', // Text color for removed text
      wordAddedBackground: '#4dbe4dff', // Background for word additions
      wordRemovedBackground: '#4d000099', // Background for word removals
      addedGutterBackground: '#d0f4d042', // Gutter background for added lines
      removedGutterBackground: '#330000', // Gutter background for removed lines
    },
  },
};
  return (
    <div style={{marginLeft:'320px',marginRight:'30px'}}>
      <Typography variant="h6" gutterBottom sx={{fontFamily:'DM sans',color:'black', fontSize:'25px'}}>
        Risk Factor Comparison
      </Typography>

      <Paper sx={{ p: 2, mb: 3 }}>
      <Typography variant="h6" gutterBottom sx={{fontFamily:'DM sans',color:'black', fontSize:'20px'}}>
          AI-Generated Summary of Changes
        </Typography>
        {areTextsIdentical || !hasValidSummary ? (
          <Box sx={{ display: 'flex', alignItems: 'center', color: 'success.main' }}>
            <CheckCircleOutlineIcon sx={{ mr: 1 }} />
      <Typography variant="h6" gutterBottom sx={{fontFamily:'DM sans',color:'black', fontSize:'25px'}}>
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
                <p style={{fontFamily:'DM sans', fontSize:'16px', color:'#646363ff'}}>{change}</p>
              </ListItem>
            ))}
          </List>
        )}
      </Paper>
      <Paper sx={{ p: 2, mb: 3 }}>
        <RiskWordCloud data={wordCloudData} />
      </Paper>
      <Typography variant="h6" gutterBottom sx={{fontFamily:'DM sans',color:'black', fontSize:'20px'}}>
        Detailed Side-by-Side View
      </Typography>
      <Box sx={{ mt: 1, '& .diff-viewer': { fontFamily: 'monospace' } }}>
         <ReactDiffViewer
      oldValue={oldText}
      newValue={newText}
      splitView={isDesktop}
      compareMethod={DiffMethod.WORDS}
      useDarkTheme={true}
      leftTitle={isDesktop ? 'Previous Period' : undefined}
      rightTitle={isDesktop ? 'Current Period' : 'Comparison'}
      styles={customStyles}
    />
      </Box>
    </div>
  );
}

export default RiskDiffViewer;
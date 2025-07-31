import React from 'react';
import { Box, Paper, Typography, Accordion, AccordionSummary, AccordionDetails } from '@mui/material';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';

function FootnoteExplorer({ data }) {
  const footnotes = data?.footnote_summary;

  if (!footnotes || footnotes.length === 0) {
    return (
      <Paper sx={{ p: 3, backgroundColor: '#2a2a2a' }}>
        <Typography variant="h6" gutterBottom>
          Footnote Explorer
        </Typography>
        <Typography>
          No summarized footnotes were extracted from this report.
        </Typography>
      </Paper>
    );
  }

  return (
    <Box>
      <Typography variant="h6" gutterBottom sx={{ mb: 2 }}>
        Interactive Footnote Explorer
      </Typography>
      {footnotes.map((note, index) => (
        <Accordion key={index} sx={{ backgroundColor: '#2a2a2a', mb: 1 }}>
          <AccordionSummary expandIcon={<ExpandMoreIcon />}>
            <Typography sx={{ fontWeight: 'bold' }}>{note.topic}</Typography>
          </AccordionSummary>
          <AccordionDetails>
            <Typography variant="body2" color="text.secondary">
              {note.summary}
            </Typography>
          </AccordionDetails>
        </Accordion>
      ))}
    </Box>
  );
}

export default FootnoteExplorer;
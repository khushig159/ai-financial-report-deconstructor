import React ,{useState} from 'react';
import { Box, Paper, Typography, Accordion, AccordionSummary, AccordionDetails, TextField, InputAdornment } from '@mui/material';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import SearchIcon from '@mui/icons-material/Search';

function FootnoteExplorer({ data }) {
  const [searchTerm, setSearchTerm] = useState('');
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

  const filteredFootnotes=footnotes.filter(note=>
    note.topic.toLowerCase().includes(searchTerm.toLowerCase())||
    note.summary.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div style={{marginLeft:'320px',marginRight:'20px'}}>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
        <Typography variant="h6" sx={{fontFamily:'DM sans' ,color:'black',fontSize:'25px'}}>
           Footnote Explorer
        </Typography>
        {/* --- NEW: Search Bar --- */}
        <TextField
          label="Search Footnotes"
          variant="outlined"
          size="small"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          sx={{marginTop:'10px'}}
          InputProps={{
            startAdornment: (
              <InputAdornment position="start">
                <SearchIcon />
              </InputAdornment>
            ),
          }}
        />
      </Box>
      
      {filteredFootnotes.length > 0 ? (
        filteredFootnotes.map((note, index) => (
          <Accordion key={index} sx={{  mb: 1 }}>
            <AccordionSummary expandIcon={<ExpandMoreIcon />}>
              <Typography sx={{ fontWeight: 'bold',fontFamily:'DM sans' }}>{note.topic}</Typography>
            </AccordionSummary>
            <AccordionDetails>
              <Typography variant="body2" color="text.secondary" sx={{fontFamily:'DM sans'}}>
                {note.summary}
              </Typography>
            </AccordionDetails>
          </Accordion>
        ))
      ) : (
        <Typography sx={{ mt: 3, textAlign: 'center' }}>
          No footnotes match your search term.
        </Typography>
      )}
    </div>
  );
}

export default FootnoteExplorer;
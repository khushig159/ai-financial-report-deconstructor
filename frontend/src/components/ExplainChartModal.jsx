// frontend/src/components/ExplainChartModal.jsx

import React, { useState } from 'react';
import { Box, Modal, Paper, Typography, Button, CircularProgress, Alert } from '@mui/material';
import axios from 'axios';
import { auth } from '../firebase';

const modalStyle = {
  position: 'absolute',
  top: '50%',
  left: '50%',
  transform: 'translate(-50%, -50%)',
  width: 400,
  bgcolor: 'background.paper',
  border: '2px solid #000',
  boxShadow: 24,
  p: 4,
};

function ExplainChartModal({ open, handleClose, chartTitle, chartData, context }) {
  const [explanation, setExplanation] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');

  const handleExplain = async () => {
    setIsLoading(true);
    setError('');
    setExplanation('');

    try {
      const user = auth.currentUser;
      if (!user) throw new Error("User not logged in.");
      const token = await user.getIdToken();
      const API_URL = import.meta.env.VITE_API_GATEWAY_URL || 'http://localhost:5000';

      const response = await axios.post(`${API_URL}/api/explain`, 
        { chartTitle, chartData, context },
        { headers: { 'Authorization': `Bearer ${token}` } }
      );

      setExplanation(response.data.explanation);

    } catch (err) {
      setError(err.response?.data?.message || "Failed to get explanation.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Modal open={open} onClose={handleClose}>
      <Paper sx={modalStyle}>
        <Typography variant="h6" component="h2" gutterBottom>
          AI Explanation for: {chartTitle}
        </Typography>

        {isLoading ? (
          <Box sx={{ display: 'flex', justifyContent: 'center', my: 2 }}>
            <CircularProgress />
          </Box>
        ) : error ? (
          <Alert severity="error" sx={{ my: 2 }}>{error}</Alert>
        ) : explanation ? (
          <Typography sx={{ mt: 2, fontStyle: 'italic', color: 'text.secondary' }}>
            {explanation}
          </Typography>
        ) : (
          <Typography sx={{ mt: 2 }}>
            Click the button below to generate an AI-powered explanation for this chart.
          </Typography>
        )}

        <Box sx={{ mt: 3, display: 'flex', justifyContent: 'flex-end', gap: 1 }}>
          <Button onClick={handleClose}>Close</Button>
          <Button variant="contained" onClick={handleExplain} disabled={isLoading}>
            {isLoading ? 'Generating...' : 'Explain'}
          </Button>
        </Box>
      </Paper>
    </Modal>
  );
}

export default ExplainChartModal;
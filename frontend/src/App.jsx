import React from "react";
import {
  ThemeProvider,
  CssBaseline,
  Box,
  Typography,
  AppBar,
  Toolbar,
  Container,
  CircularProgress,
  Backdrop,
  Button,
  Modal,
  Fade,
  Alert
} from "@mui/material";
import useAnalysisStore from "./stores/useAnalysisStore";
import AuthPage from "./pages/AuthPage";
// import { auth } from "./firebase";
// import { signOut } from "firebase/auth";
import DashBoard from "./pages/DashBoard";


function App() {
  const { currentUser, isAuthLoading,error,isLoading } = useAnalysisStore();
// const handleLogout = async () => {
//     try {
//       await signOut(auth);
//     } catch (error) {
//       console.error("Error signing out:", error);
//     }
//   };
  if (isAuthLoading) {
    return (
        <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh' }}>
          <CircularProgress />
        </Box>
    );
  }
  return (
      < >
     
        
        <Container component="main" sx={{ mt: 4, mb: 4 }}>
          {currentUser ? <DashBoard /> : <AuthPage />}
          {error && (<Alert severity="error" sx={{ mt: 4 }}>{error}</Alert>)}
        </Container>
        <Modal
          open={isLoading}
          closeAfterTransition
          BackdropComponent={Backdrop}
          BackdropProps={{
            timeout: 500,
            sx: { backgroundColor: 'rgba(0, 0, 0, 0.7)' }
          }}
        >
          <Fade in={isLoading}>
            <Box sx={{
              position: 'absolute',
              top: '50%',
              left: '50%',
              transform: 'translate(-50%, -50%)',
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              outline: 'none'
            }}>
              <CircularProgress />
              <Typography variant="h6" sx={{ mt: 2, color: 'white' }}>
                Analyzing... This may take a few minutes.
              </Typography>
            </Box>
          </Fade>
        </Modal>
      </>
  );
}

export default App;

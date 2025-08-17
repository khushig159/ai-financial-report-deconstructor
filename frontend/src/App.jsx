import React from "react";
import {
  createTheme,
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
import { auth } from "./firebase";
import { signOut } from "firebase/auth";
import DashBoard from "./pages/DashBoard";

// const darkTheme = createTheme({
//   palette: {
//     mode: "dark",
//     primary: { main: "#90caf9" },
//     background: { default: "#fff", paper: "#fff" },
//   },
//   typography: {
//     fontFamily: '"Roboto", "Helvetica", "Arial", sans-serif',
//     h4: { fontWeight: 700 },
//     h5: { fontWeight: 600 },
//   },
// });



function App() {
  const { currentUser, isAuthLoading,error,isLoading } = useAnalysisStore();
const handleLogout = async () => {
    try {
      await signOut(auth);
      // The onAuthStateChanged listener will handle the state update
    } catch (error) {
      console.error("Error signing out:", error);
    }
  };
  if (isAuthLoading) {
    return (
      // <ThemeProvider theme={darkTheme}>
        // <CssBaseline />
        <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh' }}>
          <CircularProgress />
        </Box>
      // </ThemeProvider>
    );
  }
  return (
    // <ThemeProvider theme={darkTheme}>
      < >
     
        {/* <AppBar position="static"> */}
          {/* <Toolbar>
            <Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>
              AI Financial Report Deconstructor
            </Typography>
            {currentUser && (
              <Button color="inherit" onClick={handleLogout}>
                Logout
              </Button>
            )}
          </Toolbar> */}
        {/* </AppBar> */}
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
      {/* </Box> */}
      </>
    // </ThemeProvider>
  );
}

export default App;

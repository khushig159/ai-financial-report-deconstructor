// frontend/src/pages/AuthPage.jsx

import React, { useState } from "react";
import {
  Container,
  Box,
  Typography,
  TextField,
  Button,
  Paper,
  Alert,
  Divider,
} from "@mui/material";
import { auth } from "../firebase";
import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  GoogleAuthProvider,
  signInWithPopup,
} from "firebase/auth";
import styles from "../module/auth.module.css";
import GoogleIcon from "@mui/icons-material/Google";

function AuthPage() {
  const [isLogin, setIsLogin] = useState(true);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [successMessage, setSuccessMessage] = useState(""); // For successful signup
  const getFriendlyError = (code) => {
    switch (code) {
      case "auth/invalid-email":
        return "Invalid email address.";
      case "auth/user-not-found":
        return "No user found with this email.";
      case "auth/wrong-password":
        return "Incorrect password.";
      case "auth/email-already-in-use":
        return "Email is already in use.";
      case "auth/weak-password":
        return "Password should be at least 6 characters.";
      case "auth/popup-closed-by-user":
        return "Google sign-in popup was closed before completing.";
      default:
        return "An error occurred. Please try again.";
    }
  };

  const handleAuthAction = async (e) => {
    e.preventDefault();
    if (!email || !password) {
      setError("Please fill out both email and password.");
      return;
    }
    if (!/\S+@\S+\.\S+/.test(email)) {
      setError("Please enter a valid email.");
      return;
    }

    setError(""); // Clear previous errors
    setSuccessMessage("");
    if (isLogin) {
      try {
        await signInWithEmailAndPassword(auth, email, password);
      } catch (err) {
        setError(getFriendlyError(err.code));
      }
    } else {
      try {
        await createUserWithEmailAndPassword(auth, email, password);
        setSuccessMessage("Account created successfully! Please sign in.");
        setIsLogin(true);
      } catch (err) {
        setError(getFriendlyError(err.code));
      }
    }
  };

  const handleGoogleSignIn = async () => {
    setError("");
    setSuccessMessage("");
    const provider = new GoogleAuthProvider();
    try {
      await signInWithPopup(auth, provider);
    } catch (err) {
      setError(getFriendlyError(err.code));
    }
  };

  return (
    <>
  <div className={styles.back}>
    <Container component="main" maxWidth="xs" sx={{marginTop:'20px'}} className={styles.con}>
      <Paper
        elevation={6}
        sx={{
          // mt: 8,
          p: 4,
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          backgroundColor: "#ebebf4ff",
          borderRadius: "20px",
          // marginTop:'100px',
          // marginLeft:'-300px',
          width: "100%",
        }}
      >
        <Typography
          component="h1"
          variant="h5"
          sx={{ fontFamily: "DM sans", color: "black", fontWeight: "600" }}
        >
          {isLogin ? "Sign In" : "Sign Up"}
        </Typography>
        {successMessage && (
          <Alert severity="success" sx={{ mt: 2, width: "100%" }}>
            {successMessage}
          </Alert>
        )}

        <Box
          component="form"
          onSubmit={handleAuthAction}
          noValidate
          sx={{ mt: 1 }}
        >
          <TextField
            margin="normal"
            required
            fullWidth
            id="email"
            label="Email Address"
            name="email"
            autoComplete="email"
            // autoFocus
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            variant="outlined"
            sx={{
              "& label.Mui-focused": { color: "black" }, // Label color on focus
              "& .MuiOutlinedInput-root": {
                "& fieldset": { borderColor: "#888" }, // Default border
                "&:hover fieldset": { borderColor: "black" }, // Hover border
                "&.Mui-focused fieldset": { borderColor: "black" }, // Focus border
              },
              "& label": {
                color: "black",
                opacity: 1,
              },
              // backgroundColor:'#c2d1d8ff'
            }}
          />

          <TextField
            margin="normal"
            required
            fullWidth
            name="password"
            label="Password"
            type="password"
            id="password"
            autoComplete="current-password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            variant="outlined"
            sx={{
              "& label.Mui-focused": { color: "black" }, // Label color on focus
              "& .MuiOutlinedInput-root": {
                "& fieldset": { borderColor: "#888" }, // Default border
                "&:hover fieldset": { borderColor: "black" }, // Hover border
                "&.Mui-focused fieldset": { borderColor: "black" }, // Focus border
              },
              "& label": {
                color: "black",
                opacity: 1,
              },
              // backgroundColor:'#c2d1d8ff'
            }}
          />
          {error && (
            <Alert
              severity="error"
              sx={{
                mt: 2,
                width: "90%",
                color: "black",
                fontFamily: "DM sans",
              }}
            >
              {error}
            </Alert>
          )}
          <Button
            type="submit"
            fullWidth
            variant="contained"
            sx={{
              mt: 3,
              mb: 2,
              backgroundColor: "black",
              color: "white",
              fontFamily: "DM sans",
              fontWeight: "600",
            }}
          >
            {isLogin ? "Sign In" : "Sign Up"}
          </Button>
          <Divider
            sx={{
              my: 2,
              color: "black",
              fontFamily: "DM sans",
              fontWeight: "600",
            }}
          >
            OR
          </Divider>
          <Button
            fullWidth
            variant="outlined"
            startIcon={<GoogleIcon />}
            onClick={handleGoogleSignIn}
            sx={{
              mb: 2,
              color: "black",
              fontFamily: "DM sans",
              fontWeight: "600",
            }}
          >
            {isLogin ? "Sign In with Google" : "Sign Up with Google"}
          </Button>
          <Button
            fullWidth
            onClick={() => {
              setIsLogin(!isLogin);
              setError("");
              setSuccessMessage("");
            }}
            sx={{ color: "black", fontFamily: "DM sans", fontWeight: "500" }}
          >
            {isLogin
              ? "Don't have an account? Sign Up"
              : "Already have an account? Sign In"}
          </Button>
        </Box>
      </Paper>
    </Container>
      </div>
      </>)
  
}

export default AuthPage;

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
  Divider
} from "@mui/material";
import { auth } from "../firebase";
import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  GoogleAuthProvider,
  signInWithPopup,
} from "firebase/auth";
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
      // --- SIGNUP LOGIC (THE CRITICAL FIX) ---
      try {
        await createUserWithEmailAndPassword(auth, email, password);
        // On successful creation, show a message and switch to the login view.
        setSuccessMessage("Account created successfully! Please sign in.");
        setIsLogin(true);
        // We DO NOT log the user in here. They must now sign in explicitly.
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
    <Container component="main" maxWidth="xs">
      <Paper
        elevation={6}
        sx={{
          mt: 8,
          p: 4,
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
        }}
      >
        <Typography component="h1" variant="h5">
          {isLogin ? "Sign In" : "Sign Up"}
        </Typography>
                {successMessage && <Alert severity="success" sx={{ mt: 2, width: '100%' }}>{successMessage}</Alert>}

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
            autoFocus
            value={email}
            onChange={(e) => setEmail(e.target.value)}
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
          />
          {error && (
            <Alert severity="error" sx={{ mt: 2, width: "100%" }}>
              {error}
            </Alert>
          )}
          <Button
            type="submit"
            fullWidth
            variant="contained"
            sx={{ mt: 3, mb: 2 }}
          >
            {isLogin ? "Sign In" : "Sign Up"}
          </Button>
                    <Divider sx={{ my: 2 }}>OR</Divider>
          <Button
            fullWidth
            variant="outlined"
            startIcon={<GoogleIcon />}
            onClick={handleGoogleSignIn}
            sx={{ mb: 2 }}
          >
            {isLogin ? "Sign In with Google" : "Sign Up with Google"}
          </Button>
          <Button fullWidth onClick={() => {setIsLogin(!isLogin); setError(''); setSuccessMessage('');}}>
            {isLogin
              ? "Don't have an account? Sign Up"
              : "Already have an account? Sign In"}
          </Button>
        </Box>
      </Paper>
    </Container>
  );
}

export default AuthPage;

"use client";

import React, { useState } from "react";
import {
  Box,
  Button,
  Card,
  CardContent,
  CardHeader,
  CardActions,
  CardMedia,
  Typography,
  TextField,
  IconButton,
  CircularProgress
} from "@mui/material";
// import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import { Link, useNavigate } from "react-router-dom";
import { GET_CLIENT_DETAILS_API, LOGIN_USER_API } from "../../API/ApiServices";
import { loginAction } from "../../redux/authSlice";
import { useDispatch } from "react-redux";

export default function Login() {
  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });
  const [isLoading, setIsLoading] = useState(false);
  let navigate = useNavigate();
  let dispatch = useDispatch()
  const handleimgChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      const payload = {
        event: "login",
        data: {
          email: formData.email,
          password: formData.password,
        },
      };

      console.log("Login payload:", payload);

      // Example: Call your API
      // await fetch('/api/auth/login', {
      //   method: 'POST',
      //   headers: { 'Content-Type': 'application/json' },
      //   body: JSON.stringify(payload),
      // });
      const userLogin =await LOGIN_USER_API(payload)
      console.log(userLogin)
      if(userLogin.status == 200 && userLogin.data.status == 'success'){
        const clientDetails= await GET_CLIENT_DETAILS_API(userLogin.data.result)

        console.log("clientDetails",clientDetails)

        dispatch(loginAction({
          data: {...userLogin.data?.result,client_MT5_id:clientDetails.data.result},
          isLoggedIn: true
        }));
        navigate("/dashboard")
      }
      
      console.info("Login Attempted. Check console for payload.");
    } catch (error) {
      console.error("Something went wrong. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };
  return (
    <Box
      sx={{
        minHeight: "100vh",
        backgroundColor: "background.default",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        p: 2,
        position: "relative",
      }}
    >
      {/* Back button */}
      {/* <Box sx={{ position: "absolute", top: 16, left: 16 }}>
        <Button
          component={Link}
          href="/"
          startIcon={<ArrowBackIcon />}
          variant="text"
          color="inherit"
        >
          Back to Home
        </Button>
      </Box> */}

      {/* Card */}
      <Card sx={{ width: "100%", maxWidth: 400, p: 2 }}>
        <CardHeader
          sx={{ textAlign: "center", pb: 0 }}
          title={
            <Box display="flex" justifyContent="center" mb={1}>
              <img
                src="/sgfx-logo.png"
                alt="SGFX Logo"
                width={80}
                height={26}
              />
            </Box>
          }
          subheader={
            <>
              <Typography variant="h5" fontWeight="bold">
                Welcome Back
              </Typography>
              <Typography variant="body2" color="text.secondary">
                Sign in to your trading account
              </Typography>
            </>
          }
        />
        <CardContent>
          <form onSubmit={handleSubmit}>
            <TextField
              label="Email"
              name="email"
              type="email"
              placeholder="Enter your email"
              value={formData.email}
              onChange={handleimgChange}
              required
              fullWidth
              margin="normal"
            />
            <TextField
              label="Password"
              name="password"
              type="password"
              placeholder="Enter your password"
              value={formData.password}
              onChange={handleimgChange}
              required
              fullWidth
              margin="normal"
            />
            <Button
              type="submit"
              variant="contained"
              color="primary"
              fullWidth
              disabled={isLoading}
              sx={{ mt: 2 }}
            >
              {isLoading ? <CircularProgress size={24} color="inherit" /> : "Sign In"}
            </Button>
          </form>
          <Typography
            variant="body2"
            color="text.secondary"
            align="center"
            sx={{ mt: 2 }}
          >
            Don&apos;t have an account?{" "}
            <Link to="/register" style={{ color: "#1976d2" }}>
              Create account
            </Link>
          </Typography>
        </CardContent>
      </Card>
    </Box>
  );
}

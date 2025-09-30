import React from "react";
import { Box, Typography, Container, Button } from "@mui/material";
import { Construction } from "@mui/icons-material";

export default function MaintenancePage() {
  return (
    <Container
      maxWidth="sm"
      sx={{
        minHeight: "100vh",
        display: "flex",
        flexDirection: "column",
        justifyContent: "center",
        alignItems: "center",
        textAlign: "center",
        px: 2,
      }}
    >
      {/* Icon */}
      <Construction
        sx={{ fontSize: 80, color: "primary.main", mb: 2 }}
      />

      {/* Heading */}
      <Typography
        variant="h3"
        component="h1"
        gutterBottom
        sx={{ fontWeight: "bold" }}
      >
        We’ll Be Back Soon
      </Typography>

      {/* Message */}
      <Typography variant="body1" color="text.secondary" mb={4}>
        Our system is currently under scheduled maintenance.  
        We’re working hard to bring everything back online as quickly as possible.
      </Typography>

      {/* Refresh button */}
      <Button
        variant="contained"
        color="primary"
        onClick={() => window.location.reload()}
      >
        Refresh Page
      </Button>

      {/* Footer note */}
      <Box mt={6}>
        <Typography variant="caption" color="text.secondary">
          © 2020 {new Date().getFullYear()}  CFDUP
        </Typography>
      </Box>
    </Container>
  );
}

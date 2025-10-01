
import React from "react";
import {
  Box,
  Card,
  Typography,
  Button,
  Grid,
  Divider,
  Paper,
} from "@mui/material";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";
import FallBackUi from "../../components/FallBack/FallBackUI";

export default function PaymentSuccess() {
    // if(true){
    //     return <FallBackUi/>
    // }
  return (
    <Box
      sx={{
        minHeight: "100vh",
        bgcolor: "#f9f9f9",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        p: 2,
      }}
    >
      <Card
        sx={{
          maxWidth: 700,
          width: "100%",
          p: { xs: 3, sm: 5 },
          textAlign: "center",
          borderRadius: 2,
          boxShadow: "0px 6px 18px rgba(0,0,0,0.1)",
        }}
      >
        {/* ✅ Success Icon & Heading */}
       
        <Typography
          variant="h4"
          sx={{ color: "green", fontWeight: "bold", mb: 1, fontSize: { xs: 24, sm: 32 } }}
        > 
        <CheckCircleIcon
          sx={{
            color: "success.main",
            fontSize: 40,
            mr:1,
            mb:1
          }}
        />
          Payment Successful !
        </Typography>

        {/* ✅ Thank You Message */}
        <Typography
          variant="h6"
          sx={{ fontWeight: "bold", mb: 2, fontSize: { xs: 16, sm: 18 } }}
        >
          Thank you! Your payment of ₹ 1000 has been received.
        </Typography>

        {/* ✅ Order + Transaction Info */}
        <Typography variant="body2" sx={{ color: "text.secondary", mb: 4 }}>
          Order ID : IC-1234, IC-5678 &nbsp; | &nbsp; Transaction ID : 12345
        </Typography>

        {/* ✅ Payment Details Section */}
        <Typography
          variant="h6"
          sx={{ mb: 2, fontWeight: "bold", fontSize: { xs: 16, sm: 18 } }}
        >
          Payment Details
        </Typography>

        <Paper
          elevation={0}
          sx={{
            p: 2,
            mb: 4,
            border: "1px solid #e0e0e0",
            borderRadius: 2,
            textAlign: "center",
            backgroundColor: "#fafafa",
          }}
        >
          <Grid container spacing={2}>
            <Grid size={{ xs: 12, md: 6 }}>
              <Typography variant="body2">Total Amount : ₹ 5000</Typography>
            </Grid>
            <Grid size={{ xs: 12, md: 6 }}>
              <Typography variant="body2">
                Paid via ADCB Account Balance : ₹ 1000
              </Typography>
            </Grid>
            <Grid size={{ xs: 12, md: 6 }}>
              <Typography variant="body2">Paid via Incentives : ₹ 1000</Typography>
            </Grid>
            <Grid size={{ xs: 12, md: 6 }}>
              <Typography variant="body2">Paid via Online Transaction : ₹ 3000</Typography>
            </Grid>
          </Grid>
        </Paper>

        {/* ✅ Waiting Info */}
        <Typography
          variant="body2"
          sx={{ color: "text.primary", mb: 1, fontSize: { xs: 13, sm: 14 } }}
        >
          Please wait for some time for the amount to show up in your SGFX account.
        </Typography>
        <Typography
          variant="caption"
          sx={{ color: "text.secondary", mb: 4, display: "block" }}
        >
          Please contact us at <strong>1800-889-666</strong> or email to{" "}
          <strong>SGFX@gmail.com</strong> for any query.
        </Typography>

        <Divider sx={{ mb: 4 }} />

        {/* ✅ OK Button */}
        <Button
          variant="outlined"
          color="success"
          fullWidth
          sx={{
           
            borderRadius: 2,
            fontWeight: "bold",
            textTransform: "none",
          }}
          onClick={() => window.location.href = "/dashboard"}
        >
          Back
        </Button>
      </Card>
    </Box>
  );
}

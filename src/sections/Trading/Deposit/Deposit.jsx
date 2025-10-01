import React, { useState } from "react";
import { Box, Typography, Container, Grid } from "@mui/material";
import SingleMethod from "./SingleMethod";
import CheckoutModal from "./CheckoutModal";
import { PAYMENT_API } from "../../../API/ApiServices";
import { paymentMethods } from "../../../constants/payment";
import { useSelector } from "react-redux";


export default function DepositMethods() {
  const [open, setOpen] = useState(false);
  const [selectedMethod, setSelectedMethod] = useState(null);
  const [amount, setAmount] = useState("");
  const [error, setError] = useState("");
  const isLoggedIn = useSelector(state => state.auth);
  console.log("isLoggedIn", isLoggedIn)

  const handleOpen = (method) => {

    if (method.unavailable) return;
    setSelectedMethod(method);
    setAmount("");
    setError("");
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
    setSelectedMethod(null);
  };

  const depositHanldeSubmit = async () => {
    if (!selectedMethod) return;
    const value = parseFloat(amount);
    if (isNaN(value)) return setError("Please enter a valid amount");
    if (value < selectedMethod.minLimit || value > selectedMethod.maxLimit) {
      return setError(`Amount must be between ${selectedMethod.minLimit} and ${selectedMethod.maxLimit}`);
    }
    setError("");

    try {
      const { data } = await PAYMENT_API({
        event: "paymentOut",
        data: { amount: value, clientId: isLoggedIn.activeId, pspName: selectedMethod.name, },
      });

      console.log("Payment success:", data);

      // Redirect to cashier link
      if (data?.result?.data?.cashierLink) window.location.href = data.result.data.cashierLink;
      else setError("Cashier link not found");

      handleClose();
    } catch (err) {
      setError(err.message || "Something went wrong");
    }
  };

  return (
    <Container maxWidth="lg">
      <Box sx={{ my: 3 }}>
        <Typography variant="h4" fontWeight={800} gutterBottom>
          Deposit
        </Typography>

        <Typography
          variant="subtitle1"
          color="text.secondary"
          gutterBottom
          sx={{ mb: 3 }}
        >
          Verification required
        </Typography>

        {/* Payment method cards */}
        <Grid container spacing={3}>
          {paymentMethods.map((m) => (
            <Grid size={{ xs: 12, md: 6 }} key={m.id}>
              <SingleMethod method={m} onSelect={() => handleOpen(m)} accType={isLoggedIn.accountType} />
            </Grid>
          ))}
        </Grid>

        {/* Checkout modal */}
        <CheckoutModal
          open={open}
          onClose={handleClose}
          selectedMethod={selectedMethod}
          amount={amount}
          setAmount={setAmount}
          error={error}
          onSubmit={depositHanldeSubmit}
        />
      </Box>
    </Container>
  );
}

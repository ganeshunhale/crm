import React from "react";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  TextField,
} from "@mui/material";

export default function CheckoutModal({
  open,
  onClose,
  selectedMethod,
  amount,
  setAmount,
  error,
  onSubmit,
}) {
  return (
    <Dialog open={open} onClose={onClose} maxWidth="xs" fullWidth>
      <DialogTitle>Checkout - {selectedMethod?.name}</DialogTitle>
      <DialogContent dividers>
        <TextField
          fullWidth
          label="Enter amount"
          type="number"
          value={amount}
          onChange={(e) => setAmount(e.target.value)}
          sx={{ mt: 1 }}
          error={!!error}
          helperText={
            error ||
            (selectedMethod &&
              `Allowed range: ${selectedMethod.minLimit} - ${selectedMethod.maxLimit} USD`)
          }
        />
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose} variant="outlined">
          Cancel
        </Button>
        <Button onClick={onSubmit} variant="contained">
          Pay
        </Button>
      </DialogActions>
    </Dialog>
  );
}

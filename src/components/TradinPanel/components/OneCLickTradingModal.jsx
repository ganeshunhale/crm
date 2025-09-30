import React from "react";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  Checkbox,
  FormControlLabel,
  IconButton,
} from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";

export default function OneClickTradingModal({ isOpen, setIsOpen, onSubmit }) {
  const [dontShowAgain, setDontShowAgain] = React.useState(false);

  const handleClose = () => setIsOpen(false);

  return (
    <Dialog
      open={isOpen}
      onClose={handleClose}
      maxWidth="sm"
      fullWidth
      PaperProps={{
        className:
          "!rounded-md !bg-[#2b2b2b] !text-[#cccccc] !p-2", // Modal background + text color
      }}
    >
      {/* Title */}
      <DialogTitle className="flex justify-between items-center font-bold text-white text-lg">
        One-click Trading mode
        <IconButton onClick={handleClose} size="small" className="text-[#cccccc]">
          <CloseIcon />
        </IconButton>
      </DialogTitle>

      {/* Content */}
      <DialogContent className="text-[#cccccc] text-sm space-y-3">
        <p>
          Selecting this option activates One-click Trading mode for order
          placement.
        </p>
        <p>
          By enabling this mode, you understand that your market or limit orders
          will be submitted by clicking the bid or ask rate button, without any
          further order confirmation. You agree to accept all risks associated
          with the use of the order submission mode you have chosen, including,
          without limitation, the risk of errors, omissions or mistakes made in
          submitting any order.
        </p>

        <FormControlLabel
          control={
            <Checkbox
              checked={dontShowAgain}
              onChange={(e) => setDontShowAgain(e.target.checked)}
              sx={{
                color: "#cccccc",
                "&.Mui-checked": { color: "#ffd900" },
              }}
            />
          }
          label={<span className="text-[#cccccc] text-sm">Don’t show again</span>}
        />
      </DialogContent>

      {/* Actions */}
      <DialogActions className="space-x-3 px-4 pb-3">
        <Button
          onClick={handleClose}
          sx={{
            backgroundColor: "#444b54",
            color: "white",
            textTransform: "none",
            borderRadius: "6px",
            px: 3,
            "&:hover": { backgroundColor: "#505861" },
          }}
        >
          Cancel
        </Button>
        <Button
          onClick={() => {
            onSubmit(dontShowAgain);
            handleClose();
          }}
          sx={{
            backgroundColor: "#ffd900",
            color: "black",
            textTransform: "none",
            fontWeight: 500,
            borderRadius: "6px",
            px: 3,
            "&:hover": { backgroundColor: "#e6c200" },
          }}
        >
          Yes, proceed
        </Button>
      </DialogActions>
    </Dialog>
  );
}

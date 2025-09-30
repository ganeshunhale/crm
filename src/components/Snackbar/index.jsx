// GlobalSnackbar.jsx
import React from "react";
import { useDispatch, useSelector } from "react-redux";
import Snackbar from "@mui/material/Snackbar";
import Alert from "@mui/material/Alert";
import { hideSnackbar } from "../../redux/snackbarslice";

export default function GlobalSnackbar() {
    const dispatch = useDispatch();
    const { open, message, severity,backgroundColor,position } = useSelector((state) => state.snackbar);

    const handleClose = (_, reason) => {
        if (reason === "clickaway") return;
        dispatch(hideSnackbar());
    };

    return (
        <Snackbar
            open={open}
            autoHideDuration={3000}
            onClose={handleClose}
            anchorOrigin={position} // position
        >
            <Alert
                onClose={handleClose}
                severity={severity}
                variant="filled"
                sx={{
                    width: "100%", color: "white",
                    fontWeight: "bold",
                    backgroundColor:backgroundColor
                }}
            >
                <div style={{ whiteSpace: "pre-line" }}>
                    {message}
                </div>
            </Alert>
        </Snackbar>
    );
}

import React, { useState } from "react";
import { useDispatch } from "react-redux";
import { showSnackbar } from "../../../redux/snackbarslice";
import { updateBalance } from "../../../redux/authSlice";
import {
    Box,
    Grid,
    Typography,
    TextField,
    Button,
    MenuItem,
    Divider,
    InputAdornment,
} from "@mui/material";
import { currencies, widrowalMethods } from "../../../contants/payment";
import axios from "axios";
import { WITHDRAWAL_API } from "../../../API/ApiServices";

export default function Withdrawal() {
    const dispatch = useDispatch();
    // single state for all fields
    const [formData, setFormData] = useState({
        method: "P2P_UPI",
        currency: "USD",
        name: "",
        upiId: "",
        amount: "",
    });

    const [loading, setLoading] = useState(false);

    const formFields = [
        {
            label: "Payment method",
            type: "select",
            key: "method",
            options: widrowalMethods.map((pm) => ({
                value: pm.method,
                label: `${pm.provider} - ${pm.method.split("_").join(" ")}`,
                logo: pm.logo,
            })),
        },
        {
            label: "Currency",
            type: "select",
            key: "currency",
            options: currencies.map((c) => ({ value: c, label: c })),
        },
        { label: "Name on account", type: "text", key: "name" },
        { label: "UPI ID", type: "text", key: "upiId" },
        { label: "Amount", type: "number", key: "amount" },
    ];

    const handleChange = (key, value) => {
        setFormData((prev) => ({ ...prev, [key]: value }));
    };

    const handleWithdraw = async () => {
        const { amount, method, name, upiId } = formData;
        if (!amount || !name || !upiId) return;

        setLoading(true);
        try {
            const payload = {
                event: "paymentOut",
                data: { amount, method, name, upiId },
            };
            const {data} = await WITHDRAWAL_API(payload);
            console.log("API response:", data);
            // Rich feedback using snackbar
            if (data?.status === "success" && data?.result?.data?.code === "000000") {
                // Update balance in Redux
                if (typeof data?.result?.data?.balance === "number") {
                    dispatch(updateBalance({ balance: data.result.data.balance }));
                }
                dispatch(showSnackbar({
                    message: `Withdrawal Success!\nTrade No: ${data.result.data.tradeNo}\nOrder ID: ${data.result.orderId}`,
                    severity: "success",
                    backgroundColor: "#22c55e"
                }));
            } else {
                dispatch(showSnackbar({
                    message: `Withdrawal response: ${data?.result?.data?.msg || "Unknown response"}`,
                    severity: "info",
                    backgroundColor: "#2563eb"
                }));
            }
        } catch (error) {
            console.error("Error submitting withdrawal:", error);
            dispatch(showSnackbar({
                message: `Failed to submit withdrawal.\n${error?.response?.data?.reason || error.message}`,
                severity: "error",
                backgroundColor: "#ef4444"
            }));
        } finally {
            setLoading(false);
        }
    };

    return (
        <Box sx={{ p: 4, justifyContent: "center" }}>
            <Typography variant="h4" fontWeight={800} gutterBottom>
                Withdrawal
            </Typography>

            <Typography
                variant="body2"
                sx={{ color: "primary.main", cursor: "pointer", mb: 3 }}
            >
                See all payment methods
            </Typography>

            <div style={{ display: "flex", justifyContent: "center", marginBottom: 20 }}>
                <Grid item xs={12} md={7} style={{ width: "100%" }}>
                    {/* Render form dynamically */}
                    {formFields.map((field) => (
                        <Box sx={{ mb: 2 }} key={field.key}>
                            {field.type === "select" ? (
                                <TextField
                                    select
                                    fullWidth
                                    label={field.label}
                                    value={formData[field.key]}
                                    onChange={(e) => handleChange(field.key, e.target.value)}
                                >
                                    {field.options.map((opt) => (
                                        <MenuItem key={opt.value} value={opt.value}>
                                            <div style={{ display: 'flex', alignItems: 'center' }}>
                                                {opt.logo && (
                                                    <img
                                                        src={opt.logo}
                                                        alt=""
                                                        style={{ width: 20, height: 20, marginRight: 8 }}
                                                    />
                                                )}
                                                {opt.label}
                                            </div>
                                        </MenuItem>
                                    ))}
                                </TextField>
                            ) : (
                                <TextField
                                    fullWidth
                                    label={field.label}
                                    type={field.type}
                                    value={formData[field.key]}
                                    onChange={(e) => handleChange(field.key, e.target.value)}
                                    InputProps={
                                        field.key === "amount"
                                            ? {
                                                style: { fontSize: 20, fontWeight: 700 },
                                                startAdornment: <InputAdornment position="start"></InputAdornment>,
                                            }
                                            : {}
                                    }
                                />
                            )}
                        </Box>
                    ))}

                    {/* Withdraw summary */}
                    <Box
                        sx={{
                            bgcolor: "#f9f9f9",
                            mt: 3,
                            p: 2,
                            display: "flex",
                            justifyContent: "space-between",
                            fontWeight: 700,
                        }}
                    >
                        <Typography variant="body2" color="text.secondary">
                            To be withdrawn
                        </Typography>
                        <Typography variant="body1">
                            {formData.amount
                                ? `${Number(formData.amount).toLocaleString()} ${formData.currency}`
                                : "0.00 " + formData.currency}
                        </Typography>
                    </Box>

                    {/* Continue button */}
                    <Button
                        variant="contained"
                        disabled={!formData.amount || !formData.name || !formData.upiId || loading}
                        sx={{ mt: 3, textTransform: "none", fontWeight: 600 }}
                        onClick={handleWithdraw}
                    >
                        {loading ? "Processing..." : "Continue"}
                    </Button>
                </Grid>

                {/* RIGHT SIDE */}
                <div style={{ width: "40%", padding: "0 20px" }}>
                    <Divider orientation="vertical" flexItem sx={{ mb: 3 }} />

                    <Typography variant="h6" fontWeight={700}>
                        Terms
                    </Typography>
                    <Typography variant="body2" sx={{ mt: 1 }}>
                        Average payment time <b>Instant</b>
                    </Typography>
                    <Typography variant="body2">
                        Fee <b>0%</b>
                    </Typography>

                    <Typography variant="h6" fontWeight={700} sx={{ mt: 3 }}>
                        FAQ
                    </Typography>
                    <Typography
                        variant="body2"
                        sx={{ color: "primary.main", cursor: "pointer", mt: 1 }}
                    >
                        Getting started with Binance Pay
                    </Typography>
                    <Typography
                        variant="body2"
                        sx={{ color: "primary.main", cursor: "pointer" }}
                    >
                        How do I withdraw with Binance Pay?
                    </Typography>
                </div>
            </div>
        </Box>
    );
}

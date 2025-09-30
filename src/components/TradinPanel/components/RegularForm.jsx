import { Box, Button, Tabs } from '@mui/material';
import { useMemo } from 'react';
import { NumberInputField } from './Fields';
import { OrderTypeButtons } from './CommonComponents';

function RegularForm({formState, updateFormField, placeOrder, onClose}) {

    const formFields = useMemo(() => [
        { key: "openPrice", label: "Open price", endAdornment: "Limit", step: 0.1, show: formState.orderType === "limit" },
        { key: "volume", label: "Volume", endAdornment: "Lots", step: 0.01, show: true },
        { key: "takeProfit", label: "Take Profit", endAdornment: "Price", step: 0.1, placeholder: "Not set", show: true },
        { key: "stopLoss", label: "Stop Loss", endAdornment: "Price", step: 0.1, placeholder: "Stop Loss", show: true }
    ], [formState]);

    

    return (
        <>
            <OrderTypeButtons formState={formState} updateFormField={updateFormField} />
            <Box>
                {formFields.filter(field => field.show).map((field,index) => (
                    <NumberInputField
                        key={field.key}
                        label={field.label}
                        value={formState[field.key]}
                        onChange={(value) => updateFormField(field.key, value)}
                        placeholder={field.placeholder}
                        endAdornment={field.endAdornment}
                        step={field.step}
                        fullWidth
                        index={index}
                    />
                ))}
            </Box>

            <Box mt={2} />

            {/* Confirm Button */}
            {formState.selectedOrderType && (
                <Button
                    onClick={placeOrder}
                    fullWidth
                    sx={{
                        mb: 2,
                        bgcolor: formState.selectedOrderType === "sell" ? "#d32f2f" : "#158BF9",
                        color: formState.selectedOrderType === "sell" ? "#fff" : "#fff",
                        border: `1px solid ${formState.selectedOrderType === "sell" ? "#d32f2f" : "#158BF9"}`,
                        fontWeight: 600,
                        "&:hover": {
                            bgcolor: formState.selectedOrderType === "sell"
                                ? "rgba(211,47,47,0.25)"
                                : "rgba(21,139,249,0.25)",
                            boxShadow: `0 0 10px ${formState.selectedOrderType === "sell" ? "#d32f2f55" : "#158BF955"}`,
                        },
                    }}
                >
                    Confirm {formState.selectedOrderType === "sell" ? "Sell" : "Buy"} {formState.volume} lots
                </Button>
            )}

            {/* Cancel Button */}
            {formState.selectedOrderType && (
                <Button
                    variant="outlined"
                    onClick={() => { updateFormField("selectedOrderType", ""); onClose(false) }}
                    fullWidth
                    sx={{ mb: 3, borderColor: "gray", color: "gray" }}
                >
                    Cancel
                </Button>
            )}
        </>
    )
}

export default RegularForm
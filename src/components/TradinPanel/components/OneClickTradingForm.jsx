import { Box, Button, Tabs } from '@mui/material';
import { useMemo } from 'react';
import { NumberInputField } from './Fields';
import { OrderTypeButtons } from './CommonComponents';

function OneClickTradingForm({formState, updateFormField, placeOrder}) {

    const formFields = useMemo(() => [
        { key: "openPrice", label: "Open price", endAdornment: "Limit", step: 0.1, show: formState.orderType === "limit" },
        { key: "volume", label: "Volume", endAdornment: "Lots", step: 0.1, show: true },
    ], [formState]);


    const handleOrder = (type) => {
        updateFormField("selectedOrderType", type);
        placeOrder(type);
    }

    return (
        <>
            <OrderTypeButtons formState={formState} updateFormField={updateFormField} />
            <Box>
                {formFields.filter(field => field.show).map(field => (
                    <NumberInputField
                        key={field.key}
                        label={field.label}
                        value={formState[field.key]}
                        onChange={(value) => updateFormField(field.key, value)}
                        placeholder={field.placeholder}
                        endAdornment={field.endAdornment}
                        step={field.step}
                        fullWidth
                    />
                ))}
            </Box>
            <Box mt={2} />
            {/* <BuySellButtons formState={formState} handleOrderTypeSelect={(type) => handleOrder(type)} /> */}
        </>
    )
}

export default OneClickTradingForm
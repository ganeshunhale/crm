import { Box, Button, InputAdornment, TextField, Typography } from "@mui/material";

export const NumberInputField = ({
  label,
  value,
  index,
  onChange,
  placeholder,
  endAdornment,
  step = 0.01,
  minValue = 0,
  fullWidth = false
}) => (
  <Box mb={1}>
    <Typography variant="body2" color="white" mb={0.5}>
      {label}
    </Typography>
    <Box display="flex" alignItems="center" gap={1}>
      <TextField
        type="number"
        value={value}
        onChange={(e) => {
          const val = e.target.value
          onChange(val === "" ? "" : Number(val))
        }}
        fullWidth={fullWidth}
        size="small"
        placeholder={placeholder}
        InputProps={{
          endAdornment: <InputAdornment position="end">{endAdornment}</InputAdornment>,
          sx: { color: "white", height: "32px" },
        }}
        sx={{
          minWidth: 130,
          backgroundColor: "#2c2c2c",
          borderRadius: "6px",
          input: {
            color: "white",
            padding: "6px 8px",
            '&::-webkit-outer-spin-button, &::-webkit-inner-spin-button': {
              WebkitAppearance: 'none',
              margin: 0,
            },
            '&[type=number]': {
              MozAppearance: 'textfield',
            },
          },
        }}
   

      />
      <Button
        variant="outlined"
        size="small"
        onClick={() => {
          const currentValue = typeof value === "number" ? value : 0;
          const newValue = Number((currentValue + step).toFixed(3));
          onChange(newValue);
        }}
        sx={{ color: "gray", borderColor: "gray", minWidth: "32px", px: "6px" }}
      >
        +
      </Button>
      <Button
        variant="outlined"
        size="small"
        onClick={() => {
          const currentValue = typeof value === "number" ? value : 0;
          const newValue = currentValue > minValue ? Number((currentValue - step).toFixed(3)) : minValue;
          onChange(newValue);
        }}
        sx={{ color: "gray", borderColor: "gray", minWidth: "32px", px: "6px" }}
      >
        -
      </Button>
    </Box>
    {(value === 0 && label === 'Volume') &&<Typography variant="caption" color="error">Volume must be at least 0.01</Typography>}
  </Box>
)
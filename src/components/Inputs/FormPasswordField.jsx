// components/inputs/FormPasswordField.jsx
import { useState } from "react";
import { TextField, IconButton, InputAdornment } from "@mui/material";
import { useField } from "formik";
import Visibility from "@mui/icons-material/Visibility";
import VisibilityOff from "@mui/icons-material/VisibilityOff";

export default function FormPasswordField({ name, label = "Password", ...props }) {
  const [field, meta] = useField(name);
  const [showPassword, setShowPassword] = useState(false);

  const handleClickShowPassword = () => {
    setShowPassword((prev) => !prev);
  };

  return (
    <TextField
      {...field}
      {...props}
      type={showPassword ? "text" : "password"}
      label={label}
      variant="standard"
      fullWidth
      autoComplete="current-password"
      error={meta.touched && Boolean(meta.error)}
      helperText={meta.touched && meta.error}
      InputProps={{
        endAdornment: (
          <InputAdornment position="end">
            <IconButton onClick={handleClickShowPassword} edge="end">
              {showPassword ? <VisibilityOff /> : <Visibility />}
            </IconButton>
          </InputAdornment>
        ),
      }}
    />
  );
}

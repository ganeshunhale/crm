// components/inputs/FormTextField.jsx
import { TextField } from "@mui/material";
import { useField } from "formik";

export default function FormTextField({ name, label, type = "text", ...props }) {
  const [field, meta] = useField(name);

  return (
    <TextField
      {...field}       // value, name, onChange, onBlur
      {...props}       // fullWidth, variant, etc
      type={type}
      label={label}
      variant="standard"
      fullWidth
      error={meta.touched && Boolean(meta.error)}
      helperText={meta.touched && meta.error}
    />
  );
}

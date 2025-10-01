// components/inputs/FormSelect.jsx
import {
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  FormHelperText,
} from "@mui/material";
import { useField, useFormikContext } from "formik";

export default function FormSelect({
  name,
  label,
  options,
  getOptionLabel = (opt) => opt.label || opt.name,
  getOptionValue = (opt) => opt.value || opt.iso2,
  ...props
}) {
  const { setFieldValue } = useFormikContext();
  const [field, meta] = useField(name);

  return (
    <FormControl
      variant="standard"
      sx={{ width: "100%" }}
      error={meta.touched && Boolean(meta.error)}
    >
      <InputLabel id={`${name}-label`}>{label}</InputLabel>
      <Select
        labelId={`${name}-label`}
        id={name}
        value={field.value ? getOptionValue(field.value) : ""}
        onChange={(e) => {
          const selected = options.find(
            (opt) => getOptionValue(opt) === e.target.value
          );
          setFieldValue(name, selected || null);
        }}
        onBlur={field.onBlur}
        renderValue={(selected) => {
          const option = options.find(
            (opt) => getOptionValue(opt) === selected
          );
          return option ? getOptionLabel(option) : "";
        }}
        {...props}
      >
        {options.map((opt) => (
          <MenuItem key={getOptionValue(opt)} value={getOptionValue(opt)}>
            {getOptionLabel(opt)}
          </MenuItem>
        ))}
      </Select>

      {meta.touched && meta.error && (
        <FormHelperText>{meta.error}</FormHelperText>
      )}
    </FormControl>
  );
}

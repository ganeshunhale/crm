import * as Yup from 'yup';

// Register validations 
export const registerSchema = Yup.object({
    first_name: Yup.string().required('First name is required'),
    last_name: Yup.string().required('Last name is required'),
    email: Yup.string()
        .email('Invalid email format')
        .required('Email is required'),
    phone_no: Yup.string().required('Phone no is required').min(10, "Phone number must be at least 10 digits")
        .max(10, "Phone number must be at most 10 digits"),
    password: Yup.string()
        .min(8, 'Minimum 8 characters')
        .matches(/[A-Z]/, 'Must contain an uppercase letter')
        .matches(/[a-z]/, 'Must contain a lowercase letter')
        .matches(/[0-9]/, 'Must contain a number')
        .matches(/[@$!%*?&#]/, 'Must contain a special character')
        .required('Password is required'),
    confirm_password: Yup.string()
        .required("Confirm password is required")
        .oneOf([Yup.ref("password"), null], "Passwords must match"),
    country: Yup.object()
        .nullable()
        .required("Country is required"),
    state: Yup.string().required('state is required'),
    city: Yup.string().optional('City is optional'),
    address: Yup.string().required('Address is required'),
    terms: Yup.boolean()
        .oneOf([true], "You must accept the Terms and Conditions")
        .required("You must accept the Terms and Conditions"),
})

// Login Validation
export const loginSchema = Yup.object({
    email: Yup.string()
        .email('Invalid email format')
        .required('Email is required'),
    password: Yup.string().required('Password is required'),
})

// Demo Real User Creation Validations
export const userSchema = Yup.object({
    nickname: Yup.string().required('Nickname is required'),
    leverage: Yup.string().required('Leverage is required'),
    startBal: Yup.string().when('accountType', {
        is: 'demo',
        then: (schema) => schema.required('Starting balance is required'),
    }),
    password: Yup.string()
        .min(8, 'Minimum 8 characters')
        .matches(/[A-Z]/, 'Must contain an uppercase letter')
        .matches(/[a-z]/, 'Must contain a lowercase letter')
        .matches(/[0-9]/, 'Must contain a number')
        .matches(/[@$!%*?&#]/, 'Must contain a special character')
        .required('Password is required'),
    currency: Yup.string().required('Currency is required'),
});
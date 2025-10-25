import * as Yup from "yup";

const editProfileValidation = Yup.object({
    name: Yup.string()
        .required("Please enter the name")
        .min(2, "Username must be at least 2 characters")
        .max(24, "Username must be at most 24 characters"),
    phoneNumber: Yup.string()
        .required("Phone number is required")
        .matches(
            /^(\+\d{1,3}[- ]?)?\d{10}$/,
            "Phone number must be valid (10 digits with optional country code)"
        ),
    address: Yup.string()
        .required("Address is required")
        .min(5, "Address must be at least 5 characters")
        .max(200, "Address must be at most 200 characters")
        .trim(),
});

export default editProfileValidation;
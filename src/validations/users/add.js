import * as Yup from "yup";

const addUserValidation = Yup.object({
    username: Yup.string()
        .required("Please enter the username")
        .min(2, "Username must be at least 2 characters")
        .max(24, "Username must be at most 24 characters")
        .trim(),
    email: Yup.string()
        .lowercase()
        .email("Invalid email address")
        .required("Email is required"),
    password: Yup.string()
        .required('Password is required')
        .matches(
            /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*#?&])[A-Za-z\d@$!%*#?&]{8,}$/,
            "Must Contain 8 Characters, One Uppercase, One Lowercase, One Number and one special case Character"
        ),
});

export default addUserValidation;
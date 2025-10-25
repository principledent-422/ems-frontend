import * as Yup from "yup";

const SignupValidation = Yup.object({
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
    confirmPassword: Yup.string()
        .oneOf([Yup.ref('password'), null], "Password mismatch")
        .required('Password confirmation is required'),
});

export default SignupValidation;
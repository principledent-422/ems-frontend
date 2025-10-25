import * as Yup from "yup";

const LoginValidation = Yup.object({
    username: Yup.string()
        .required("Please enter the username")
        .min(2, "Username must be at least 2 characters")
        .max(24, "Username must be at most 24 characters")
        .trim(),
    password: Yup.string()
        .required('Password is required')
        .matches(
            /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*#?&])[A-Za-z\d@$!%*#?&]{8,}$/,
            "Must Contain 8 Characters, One Uppercase, One Lowercase, One Number and one special case Character"
        )
        .trim(),
});

export default LoginValidation;
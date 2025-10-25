import * as Yup from "yup";

const editDepartmentValidation = Yup.object({
    name: Yup.string()
        .required("Please enter the name")
        .min(2, "Deaprtment name must be at least 2 characters")
        .max(35, "Deaprtment name must be at most 35 characters")
        .trim(),
    description: Yup.string()
        .required("Description is required")
        .min(6, "Description must be at least 6 characters")
        .max(40, "Description must be at most 40 characters")
        .trim(),
});

export default editDepartmentValidation;
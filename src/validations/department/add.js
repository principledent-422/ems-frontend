import * as Yup from "yup";

const addDepartmentValidation = Yup.object({
    name: Yup.string()
        .required("Please enter the department name")
        .min(2, "Department name must be at least 2 characters")
        .max(35, "Department name must be at most 35 characters")
        .trim(),
    description: Yup.string()
        .required("Description is required")
        .min(6, "Description must be at least 6 characters")
        .max(40, "Description must be at most 40 characters")
        .trim(),
    departmentSlug: Yup.string()
        .required("Department Slug is required")
        .required("Department Slug is required")
        .matches(/^[A-Z]{2,4}-\d{3}$/, "Department slug must be in format: 2-4 letters, dash, 3 numbers (e.g. SDE-001)")
});

export default addDepartmentValidation;
import * as Yup from "yup";

const AddTaskValidation = Yup.object({
    title: Yup.string()
        .required("Please enter the task title")
        .min(2, "Title must be at least 2 characters")
        .max(35, "Title name must be at most 35 characters")
        .trim(),
    description: Yup.string()
        .required("Description is required")
        .min(6, "Description must be at least 6 characters")
        .max(40, "Description must be at most 50 characters")
        .trim(),
    employeeId: Yup.string()
        .trim(),
    assignedTo: Yup.string()
        .trim(),
    priority: Yup.string()
        .required("Priority is required")
        .trim(),
    dueDate: Yup.string()
        .required("Due Date is required")
        .trim(),
});

export default AddTaskValidation;
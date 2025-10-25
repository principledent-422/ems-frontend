import React, { useState } from "react";
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Button } from "@/components/ui/button"
import { DialogClose } from "@/components/ui/dialog"
import { toast } from "sonner"
import api from "../../../lib/api";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup"
import addDepartmentValidation from "../../../validations/department/add";
import { LoaderCircle } from "lucide-react";


const AddDepartmentContent = () => {

    const [loading, setLoading] = useState(false);

    // const [departmentDetails, setDepartmentDetails] = useState({
    //     name: "",
    //     description: "",
    //     departmentSlug: "",
    // });

    // const [name, setName] = useState("");
    // const [description, setDescription] = useState("");
    // const [departmentSlug, setDepartmentSlug] = useState("");

    // const setValue = (key, value) => {
    //     setDepartmentDetails(
    //         (prev) => (
    //             {
    //                 ...prev,
    //                 [key]: value,
    //             }
    //         )
    //     )
    // }

    const { register, handleSubmit, formState: { errors } } = useForm({
        resolver: yupResolver(addDepartmentValidation),
        defaultValues: {
            name: "",
            description: "",
            departmentSlug: ""
        }
    });

    const onSubmit = async (formData) => {

        setLoading(true);

        const response = await api.post(
            "/department/add",
            formData,
            {
                headers: {
                    'content-type': 'application/json'
                }
            }
        );

        const result = await response.data;

        result.error ? toast.error("Error", {
            description: result?.message,
        }) : toast.success("Success", {
            description: "Department added successfully"
        })

        setLoading(false)
    }

    return (
        <>
            <form onSubmit={handleSubmit(onSubmit)}>
                <div className="grid grid-cols-4 items-center gap-4 mb-4">
                    <Label htmlFor="name" className="text-right">
                        Name
                    </Label>
                    <div className="col-span-3">
                        <Input
                            {...register("name")}
                            // onChange={(e) => setValue("name", e.target.value)}
                            // value={departmentDetails.name}
                            className="col-span-3"
                            autoComplete="off"
                        />
                        {errors.name && (
                            <p className="text-red-500 text-xs mt-1">{errors.name.message}</p>
                        )}
                    </div>
                </div>


                <div className="grid grid-cols-4 items-center gap-4 mb-4">
                    <Label htmlFor="description" className="text-right">
                        Description
                    </Label>
                    <div className="col-span-3">
                        <Input
                            {...register("description")}
                            // onChange={(e) => setValue("description", e.target.value)}
                            // value={departmentDetails.description}
                            className="col-span-3"
                            autoComplete="off"
                        />
                        {errors.description && (
                            <p className="text-red-500 text-xs mt-1">{errors.description.message}</p>
                        )}
                    </div>
                </div>


                <div className="grid grid-cols-4 items-center gap-4 mb-4">
                    <Label htmlFor="departmentSlug" className="text-right">
                        Department Slug
                    </Label>
                    <div className="col-span-3">
                        <Input
                            {...register("departmentSlug")}
                            // onChange={(e) => setValue("departmentSlug", e.target.value)}
                            // value={departmentDetails.departmentSlug}
                            className="col-span-3"
                            autoComplete="off"
                        />
                        {errors.departmentSlug && (
                            <p className="text-red-500 text-xs mt-1">{errors.departmentSlug.message}</p>
                        )}
                    </div>
                </div>

                <div className="flex justify-end pt-2">
                    <Button type="submit" disabled={loading}>
                        {loading ? (
                            <>
                                Saving <LoaderCircle className="ml-2 h-4 w-4 animate-spin" />
                            </>
                        ) : (
                            "Save"
                        )}
                    </Button>
                </div>
            </form>
        </>
    );
}

export default AddDepartmentContent;
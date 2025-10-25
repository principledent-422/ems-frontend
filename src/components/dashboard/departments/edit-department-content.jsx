import { Label } from '@/components/ui/label'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { toast } from "sonner";
import { DialogClose } from "@/components/ui/dialog"
import { useContext, useState } from 'react';
import api from '../../../lib/api';
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import { LoaderCircle } from 'lucide-react';
import editDepartmentValidation from '../../../validations/department/edit';
import { ProfileContext } from '../../../context/ProfileContext';


const EditDepartmentContent = ({ row }) => {

    const [loading, setLoading] = useState(false)
    const { user } = useContext(ProfileContext);

    const { register, handleSubmit, formState: { errors } } = useForm({
        resolver: yupResolver(editDepartmentValidation),
        defaultValues: {
            departmentSlug: row.getValue("departmentSlug"),
            name: row.getValue("name"),
            description: row.getValue("description")
        }
    });

    // const [userDetails, setUserDetails] = useState({
    //     name: row.getValue("name"),
    //     phoneNumber: row.getValue("phoneNumber"),
    //     address: row.getValue("address")
    // })

    // const setValue = (key, value) => {
    //     setUserDetails(
    //         (prev) => (
    //             {
    //                 ...prev,
    //                 [key]: value,
    //             }
    //         )
    //     )
    // }

    const disabled = !["SUPER_ADMIN", "MANAGER"].includes(user.role);

    const onSubmit = async (formData) => {

        setLoading(true);
        console.log(formData);

        const response = await api.post(
            "/user/profile/update",
            formData,
            {
                headers: {
                    'content-type': 'application/json'
                }
            }
        )

        const result = response.data;

        result.error ? toast.error("Error", {
            description: result?.message,
        }) : toast.success("Success", {
            description: "Department details edited successfully"
        })

        setLoading(false);
    }


    return (
        <>
            <form onSubmit={handleSubmit(onSubmit)}>
                <div className="grid grid-cols-4 items-center gap-4 mb-4">
                    <Label htmlFor="departmentSlug" className="text-right">
                        Department Slug
                    </Label>
                    <div className="col-span-3">
                        <Input
                            {...register("departmentSlug")}
                            disabled={true}
                            // onChange={(e) => setValue("name", e.target.value)}
                            // value={userDetails.name}
                            className="col-span-3"
                        />
                        {errors.departmentSlug && (
                            <p className="text-red-500 text-xs mt-1">{errors.departmentSlug.message}</p>
                        )}
                    </div>
                </div>
                <div className="grid grid-cols-4 items-center gap-4 mb-4">
                    <Label htmlFor="name" className="text-right">
                        Name
                    </Label>
                    <div className="col-span-3">
                        <Input
                            {...register("name")}
                            // onChange={(e) => setValue("phoneNumber", e.target.value)}
                            // value={userDetails.phoneNumber}
                            className="col-span-3"
                            disabled={disabled}
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
                            // onChange={(e) => setValue("address", e.target.value)}
                            // value={userDetails.address}
                            className="col-span-3"
                            disabled={disabled}
                        />
                        {errors.description && (
                            <p className="text-red-500 text-xs mt-1">{errors.description.message}</p>
                        )}
                    </div>
                </div>
                <div className="flex justify-end pt-2">
                    {!disabled && <Button type="submit" disabled={loading}>
                        {loading ? (
                            <>
                                Saving <LoaderCircle className="ml-2 h-4 w-4 animate-spin" />
                            </>
                        ) : (
                            "Save changes"
                        )}
                    </Button>}
                </div>
            </form>
        </>
    );
}

export default EditDepartmentContent;
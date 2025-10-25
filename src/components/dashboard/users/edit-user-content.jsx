import { Label } from '@/components/ui/label'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { toast } from "sonner";
import { DialogClose } from "@/components/ui/dialog"
import { useContext, useEffect, useState } from 'react';
import api from '../../../lib/api';
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import { LoaderCircle } from 'lucide-react';
import editUserValidation from '../../../validations/users/edit';
import { ClientContext } from '../../../context/ClientContext';
import { ProfileContext } from '../../../context/ProfileContext';


const EditUserContent = ({ row }) => {

    const { users, setUsers } = useContext(ClientContext);
    const { user } = useContext(ProfileContext)
    const [loading, setLoading] = useState(false)

    const { register, handleSubmit, formState: { errors } } = useForm({
        resolver: yupResolver(editUserValidation),
        defaultValues: {
            userId: row.getValue("userId"),
            name: row.getValue("name"),
            phoneNumber: row.getValue("phoneNumber"),
            address: row.getValue("address")
        }
    });

    // // Function to fetch all users
    // const fetchAllUsers = async () => {
    //     try {
    //         setLoading(true)
    //         const response = await api.get('/user')
    //         setUsers(response.data?.info || [])
    //     } catch (error) {
    //         console.error("Error fetching users:", error)
    //     } finally {
    //         setLoading(false)
    //     }
    // }


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

    const fetchAllUsers = async () => {
        try {
            setLoading(true)
            const response = await api.get('/user')
            setUsers(response.data?.users || [])
        } catch (error) {
            console.error("Error fetching users:", error)
        } finally {
            setLoading(false)
        }
    }

    const disabled = !["SUPER_ADMIN", "MANAGER"].includes(user.role);

    const onSubmit = async (formData) => {

        try {
            setLoading(true);
            console.log(formData);

            const response = await api.post(
                "/user/update",
                formData,
                {
                    headers: {
                        'content-type': 'application/json'
                    }
                }
            );

            const result = response.data;

            result.error ? toast.error("Error", {
                description: result?.message,
            }) : toast.success("Success", {
                description: "User details edited successfully"
            })
        }
        catch (error) {
            toast.error("Error", {
                description: "Failed to update profile",
            });
        }
        finally {
            await fetchAllUsers()
            setLoading(false);
        }
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
                            // value={userDetails.name}
                            className="col-span-3"
                            disabled={disabled}
                        />
                        {errors.name && (
                            <p className="text-red-500 text-xs mt-1">{errors.name.message}</p>
                        )}
                    </div>
                </div>
                <div className="grid grid-cols-4 items-center gap-4 mb-4">
                    <Label htmlFor="phoneNumber" className="text-right">
                        Phone Number
                    </Label>
                    <div className="col-span-3">
                        <Input
                            {...register("phoneNumber")}
                            // onChange={(e) => setValue("phoneNumber", e.target.value)}
                            // value={userDetails.phoneNumber}
                            className="col-span-3"
                            disabled={disabled}
                        />
                        {errors.phoneNumber && (
                            <p className="text-red-500 text-xs mt-1">{errors.phoneNumber.message}</p>
                        )}
                    </div>
                </div>
                <div className="grid grid-cols-4 items-center gap-4 mb-4">
                    <Label htmlFor="address" className="text-right">
                        Address
                    </Label>
                    <div className="col-span-3">
                        <Input
                            {...register("address")}
                            // onChange={(e) => setValue("address", e.target.value)}
                            // value={userDetails.address}
                            className="col-span-3"
                            disabled={disabled}
                        />
                        {errors.address && (
                            <p className="text-red-500 text-xs mt-1">{errors.address.message}</p>
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
                            "Save changes"
                        )}
                    </Button>
                </div>
            </form>
        </>
    );
}

export default EditUserContent;
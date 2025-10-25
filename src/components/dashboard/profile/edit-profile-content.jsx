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
import { ProfileContext } from '../../../context/ProfileContext';
import editProfileValidation from '../../../validations/profile/edit';


const EditProfileContent = () => {

    const { user, setUser } = useContext(ProfileContext);

    const [loading, setLoading] = useState(false)

    const { register, handleSubmit, formState: { errors } } = useForm({
        resolver: yupResolver(editProfileValidation),
        defaultValues: {
            name: user.name,
            phoneNumber: user.phoneNumber,
            address: user.address
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

    const fetchUserData = async () => {
        try {

            const response = await api.get('/user/profile');
            setUser(response.data?.profile)
            console.log(response.data?.profile);

        } catch (error) {
            console.error("Error fetching profile:", error);
        }
    }

    const onSubmit = async (formData) => {

        try {
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
            await fetchUserData()
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

export default EditProfileContent;
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { yupResolver } from "@hookform/resolvers/yup";
import axios from "axios";
import { LoaderCircle } from "lucide-react";
import React, { useState } from "react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import { config } from "../../../lib/config";
import addUserValidation from "../../../validations/users/add";

const AddUserContent = () => {

    const [loading, setLoading] = useState(false)

    // const [username, setUsername] = useState("");
    // const [password, setPassword] = useState("");
    // const [email, setEmail] = useState("");

    // const [userDetails, setUserDetails] = useState({
    //     username: "",
    //     password: "",
    //     email: "",
    // });


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

    const { register, handleSubmit, formState: { errors } } = useForm({
        resolver: yupResolver(addUserValidation),
        defaultValues: {
            username: "",
            password: "",
            email: ""
        }
    });

    const handleAddUser = async (formData) => {

        setLoading(true)
        try {
            const response = await axios.post(
                `${config.apiBaseUrl}/auth/signup`,
                {
                    username: formData.username,
                    password: formData.password,
                    email: formData.email
                },
                {
                    headers: {
                        'content-type': 'application/json'
                    }
                }
            );

            const result = await response.data;

            if (result.error) {
                toast.error("Error", {
                    description: result?.message
                });
                return;
            }

            toast.success("Success", {
                description: result?.message
            });
        }
        catch (error) {
            // Handle the error response from the server
            const errorMessage = error.response?.data?.message || "Signup failed. Please check your credentials.";

            toast.error("Error", {
                description: errorMessage,
            });
        }
        finally {
            setLoading(false)
        }
    }

    return (
        <>
            <form onSubmit={handleSubmit(handleAddUser)}>
                <div className="grid grid-cols-4 items-center gap-4 mb-4">
                    <Label htmlFor="username" className="text-right">
                        Username
                    </Label>
                    <div className="col-span-3">
                        <Input
                            {...register("username")}
                            // onChange={(e) => setValue("username", e.target.value)}
                            // value={userDetails.username}
                            className="col-span-3"
                            autoComplete="off"
                        />
                        {errors.username && (
                            <p className="text-red-500 text-xs mt-1">{errors.username.message}</p>
                        )}
                    </div>
                </div>


                <div className="grid grid-cols-4 items-center gap-4 mb-4">
                    <Label htmlFor="email" className="text-right">
                        Email
                    </Label>
                    <div className="col-span-3">
                        <Input
                            {...register("email")}
                            // onChange={(e) => setValue("email", e.target.value)}
                            // value={userDetails.email}
                            className="col-span-3"
                            autoComplete="off"
                        />
                        {errors.email && (
                            <p className="text-red-500 text-xs mt-1">{errors.email.message}</p>
                        )}
                    </div>
                </div>


                <div className="grid grid-cols-4 items-center gap-4 mb-4">
                    <Label htmlFor="password" className="text-right">
                        Password
                    </Label>
                    <div className="col-span-3">
                        <Input
                            {...register("password")}
                            // onChange={(e) => setValue("password", e.target.value)}
                            // value={userDetails.password}
                            className="col-span-3"
                            autoComplete="off"
                        />
                        {errors.password && (
                            <p className="text-red-500 text-xs mt-1">{errors.password.message}</p>
                        )}
                    </div>
                </div>

                {/* <Button onClick={() => {
                    handleAddUser(username, password, email);


                }} className="flex justify-right w-28">Save changes 
                </Button> */}

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

export default AddUserContent;
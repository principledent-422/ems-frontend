import { Label } from '@/components/ui/label'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { toast } from "sonner";
import { useContext, useState } from 'react';
import api from '../../../lib/api';
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import { LoaderCircle } from 'lucide-react';
import EditTaskValidation from '../../../validations/task/edit';
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";
import { ClientContext } from '../../../context/ClientContext';
import { ProfileContext } from '../../../context/ProfileContext';




const EditTasktContent = ({ row }) => {
    const { setTasks } = useContext(ClientContext)

    const fetchAllTasks = async () => {
        try {
            setLoading(true)
            const response = await api.get('/task')
            setTasks(response.data?.info || [])
        } catch (error) {
            console.error("Error fetching tasks:", error)
        } finally {
            setLoading(false)
        }
    }

    const [loading, setLoading] = useState(false)

    const { register, setValue, handleSubmit, formState: { errors } } = useForm({
        resolver: yupResolver(EditTaskValidation),
        defaultValues: {
            taskId: row.getValue("taskId"),
            title: row.getValue("title"),
            description: row.getValue("description"),
            priority: row.getValue("priority")
        }
    });

    // For handling select field which can't use register directly
    const handlePriorityChange = (value) => {
        setValue("priority", value);
    };

    const handleStatusChange = (value) => {
        setValue("status", value);
    };

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

    const onSubmit = async (formData) => {

        setLoading(true);
        console.log(formData);

        // return

        const response = await api.post(
            "/task/update",
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
            description: "Task edited successfully"
        })

        setLoading(false);
        await fetchAllTasks()
    }

    const { user } = useContext(ProfileContext)
    const disabled = !["SUPER_ADMIN", "MANAGER"].includes(user.role)

    return (
        <>
            <form onSubmit={handleSubmit(onSubmit)}>
                <div className="grid grid-cols-4 items-center gap-4 mb-4">
                    <Label htmlFor="title" className="text-right">
                        Title
                    </Label>
                    <div className="col-span-3">
                        <Input
                            {...register("title")}
                            // onChange={(e) => setValue("name", e.target.value)}
                            // value={userDetails.name}
                            className="col-span-3"
                            disabled={disabled}
                        />
                        {errors.title && (
                            <p className="text-red-500 text-xs mt-1">{errors.title.message}</p>
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

                <div className="grid grid-cols-4 items-center gap-4 mb-4">
                    <Label htmlFor="priority" className="text-right">
                        Priority
                    </Label>
                    <div className="col-span-3">
                        <Select
                            defaultValue={row.getValue("priority")}
                            onValueChange={handlePriorityChange}
                            disabled={disabled}
                        >
                            <SelectTrigger className="w-full">
                                <SelectValue placeholder="Select priority" />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value="low">Low</SelectItem>
                                <SelectItem value="medium">Medium</SelectItem>
                                <SelectItem value="high">High</SelectItem>
                            </SelectContent>
                        </Select>
                        <input type="hidden" {...register("priority")} />
                        {errors.priority && (
                            <p className="text-red-500 text-xs mt-1">
                                {errors.priority.message}
                            </p>
                        )}
                    </div>
                </div>

                <div className="grid grid-cols-4 items-center gap-4 mb-4">
                    <Label htmlFor="status" className="text-right">
                        Status
                    </Label>
                    <div className="col-span-3">
                        <Select
                            defaultValue={row.getValue("status")}
                            onValueChange={handleStatusChange}
                        >
                            <SelectTrigger className="w-full">
                                <SelectValue placeholder="Select Status" />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value="pending">Pending</SelectItem>
                                <SelectItem value="in_progress">In progress</SelectItem>
                                <SelectItem value="completed">Completed</SelectItem>
                            </SelectContent>
                        </Select>
                        <input type="hidden" {...register("status")} />
                        {errors.status && (
                            <p className="text-red-500 text-xs mt-1">
                                {errors.status.message}
                            </p>
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

export default EditTasktContent;
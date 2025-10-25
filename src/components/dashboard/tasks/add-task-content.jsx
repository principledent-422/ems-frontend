import React, { useState } from "react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import api from "../../../lib/api";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import { LoaderCircle, CalendarIcon } from "lucide-react";
import AddTaskValidation from "../../../validations/task/add";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";
import {
    Popover,
    PopoverContent,
    PopoverTrigger,
} from "@/components/ui/popover";
import { Calendar } from "@/components/ui/calendar";
import { format } from "date-fns";
import { cn } from "@/lib/utils";

const AddTaskContent = () => {
    const [loading, setLoading] = useState(false);
    const [dueDate, setDueDate] = useState(new Date());

    const {
        register,
        handleSubmit,
        setValue,
        formState: { errors },
    } = useForm({
        resolver: yupResolver(AddTaskValidation),
        defaultValues: {
            title: "",
            description: "",
            assignedTo: "4c1dc651-b4cb-48f8-8aaf-21f47af555cd",
            priority: "medium",
            dueDate: new Date(),
        },
    });

    // For handling select field which can't use register directly
    const handlePriorityChange = (value) => {
        setValue("priority", value);
    };

    // Handle date selection
    const handleDateSelect = (date) => {
        setDueDate(date);
        setValue("dueDate", date);
    };

    const onSubmit = async (formData) => {
        try {
            setLoading(true);
            console.log("Form data being sent:", formData);

            const response = await api.post("/task/add", formData, {
                headers: {
                    "content-type": "application/json",
                },
            });

            const result = response.data;

            result.error
                ? toast.error("Error", {
                    description: result?.message,
                })
                : toast.success("Success", {
                    description: "Task added successfully",
                });
        } catch (error) {
            console.error("API Error:", error);
            toast.error("Error", {
                description: "Failed to add task: " + (error.message || "Unknown error"),
            });
        } finally {
            setLoading(false);
        }
    };

    return (
        <>
            <form onSubmit={handleSubmit(onSubmit)}>
                <div className="grid grid-cols-4 items-center gap-4 mb-4">
                    <Label htmlFor="title" className="text-right">
                        Title
                    </Label>
                    <div className="col-span-3">
                        <Input
                            id="title"
                            {...register("title")}
                            className="col-span-3"
                            autoComplete="off"
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
                            id="description"
                            {...register("description")}
                            className="col-span-3"
                            autoComplete="off"
                        />
                        {errors.description && (
                            <p className="text-red-500 text-xs mt-1">
                                {errors.description.message}
                            </p>
                        )}
                    </div>
                </div>

                <div className="grid grid-cols-4 items-center gap-4 mb-4">
                    <Label htmlFor="assignedTo" className="text-right">
                        Assigned To
                    </Label>
                    <div className="col-span-3">
                        <Input
                            id="assignedTo"
                            {...register("assignedTo")}
                            defaultValue="4c09033d-00f1-4dcf-9d03-544668440570"
                            className="col-span-3"
                            autoComplete="off"
                        />
                        {errors.assignedTo && (
                            <p className="text-red-500 text-xs mt-1">
                                {errors.assignedTo.message}
                            </p>
                        )}
                    </div>
                </div>

                <div className="grid grid-cols-4 items-center gap-4 mb-4">
                    <Label htmlFor="priority" className="text-right">
                        Priority
                    </Label>
                    <div className="col-span-3">
                        <Select
                            defaultValue="medium"
                            onValueChange={handlePriorityChange}
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

                {/* Updated Date Picker */}
                <div className="grid grid-cols-4 items-center gap-4 mb-4">
                    <Label htmlFor="dueDate" className="text-right">
                        Due Date
                    </Label>
                    <div className="col-span-3">
                        <Popover>
                            <PopoverTrigger asChild>
                                <Button
                                    variant="outline"
                                    className={cn(
                                        "w-full pl-3 text-left font-normal",
                                        !dueDate && "text-muted-foreground"
                                    )}
                                >
                                    {dueDate ? (
                                        format(dueDate, "PPP")
                                    ) : (
                                        <span>Pick a date</span>
                                    )}
                                    <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                                </Button>
                            </PopoverTrigger>
                            <PopoverContent className="w-auto p-0" align="start">
                                <Calendar
                                    mode="single"
                                    selected={dueDate}
                                    onSelect={handleDateSelect}
                                    initialFocus
                                />
                            </PopoverContent>
                        </Popover>
                        {/* Hidden input to register with React Hook Form */}
                        <input type="hidden" {...register("dueDate")} />
                        {errors.dueDate && (
                            <p className="text-red-500 text-xs mt-1">{errors.dueDate.message}</p>
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
};

export default AddTaskContent;
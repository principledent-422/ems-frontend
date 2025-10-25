import React, { useContext, useState } from 'react'
import api from '../../../lib/api';
import { toast } from 'sonner';
import { Button } from '@/components/ui/button'
import { LoaderCircle } from 'lucide-react';
import { ClientContext } from '../../../context/ClientContext';

const DeleteDepartment = ({ row }) => {

    const [loading, setLoading] = useState(false)
    const { setDept } = useContext(ClientContext);

    const fetchAllDepartments = async () => {
        try {
            setLoading(true)
            const response = await api.get('/department')
            setDept(response.data?.info || [])
        } catch (error) {
            console.error("Error fetching departments:", error)
        } finally {
            setLoading(false)
        }
    }

    const handleDelete = async () => {
        try {
            setLoading(true)
            const departmentId = row.getValue("departmentId");

            const response = await api.post(
                "/department/delete",
                {
                    "departmentId": departmentId
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
                    description: result.message,
                });
            } else {
                toast.success("Success", {
                    description: `"${row.getValue("name")}" department has been permanently removed`
                });
            }

        } catch (error) {
            console.error("Error deleting department: ", error);
            toast.error("Error", {
                description: error.message || "Failed to delete department",
            });
        } finally {
            fetchAllDepartments();
            setLoading(false);
        }
    };

    return (
        <div>
            <Button
                onClick={handleDelete}
                disabled={loading}>
                {loading ? (
                    <>
                        Deleting <LoaderCircle className="ml-2 h-4 w-4 animate-spin" />
                    </>
                ) : (
                    "Delete"
                )}
            </Button>
        </div>
    )
}

export default DeleteDepartment;
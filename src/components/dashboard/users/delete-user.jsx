import React, { useContext, useState } from 'react'
import api from '../../../lib/api';
import { toast } from 'sonner';
import { Button } from '@/components/ui/button'
import { LoaderCircle } from 'lucide-react';
import { ClientContext } from '../../../context/ClientContext';

const DeleteUser = ({ row }) => {

    const [loading, setLoading] = useState(false)
    const { setUsers } = useContext(ClientContext)


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


    const handleDelete = async () => {
        try {
            setLoading(true)
            const userId = row.getValue("userId");

            const response = await api.post(
                "/user/delete",
                {
                    "userId": userId
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
                    description: `"${row.getValue("name")}" user has been permanently removed`
                });
            }

        } catch (error) {
            console.error("Error deleting user: ", error);
            toast.error("Error", {
                description: error.message || "Failed to delete user",
            });
        } finally {
            await fetchAllUsers()
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

export default DeleteUser;
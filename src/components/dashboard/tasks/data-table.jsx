import { useEffect, useState } from 'react'
import { cn } from "@/lib/utils"
import { format } from "date-fns";

import api from '../../../lib/api'
import { CalendarIcon, Eye, LoaderCircle, Pencil, Plus, ShieldUser, Trash2, User, UserRoundX, UserX } from 'lucide-react'
import * as React from "react"
import { Calendar } from "@/components/ui/calendar"
import {
    Popover,
    PopoverContent,
    PopoverTrigger,
} from "@/components/ui/popover"
import {
    flexRender,
    getCoreRowModel,
    getFilteredRowModel,
    getPaginationRowModel,
    getSortedRowModel,
    useReactTable
} from "@tanstack/react-table"
import { ArrowUpDown, ChevronDown, MoreHorizontal } from "lucide-react"
import { Badge } from "@/components/ui/badge"


import { Button } from "@/components/ui/button"
import { Checkbox } from "@/components/ui/checkbox"
import {
    DropdownMenu,
    DropdownMenuCheckboxItem,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuSeparator,
    DropdownMenuTrigger
} from "@/components/ui/dropdown-menu"
import { Input } from "@/components/ui/input"
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow
} from "@/components/ui/table"
import { ProfileContext } from '../../../context/ProfileContext'
import DynamicDialog from '../DynamicDialog'
import {
    Card,
    CardContent,
    CardDescription,
    CardFooter,
    CardHeader,
    CardTitle,
} from "@/components/ui/card"
import { Label } from "@/components/ui/label"
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select"
import { toast } from "sonner";
import { DialogClose } from "@/components/ui/dialog"
import { ClientContext } from '../../../context/ClientContext';
import AddTaskContent from './add-task-content';
import ViewTaskContent from './view-task-content';
import EditTasktContent from './edit-task-content';
// function formatTimestamp(timestamp) {
//   const date = new Date(timestamp);

//   // Get day, month (3-letter abbreviation), and year
//   const day = date.getDate();
//   const month = date.toLocaleString('en-US', { month: 'short' });
//   const year = date.getFullYear();

//   // Return the formatted date in the desired format
//   return `${day} ${month}, ${year}`;
// }


const priorityMapping = {
    "high": "destructive",
    "medium": "yellow",
    "low": "green"
}

function formatDate(utcString) {
    const date = new Date(utcString);

    // Get date parts
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0'); // months are 0-based
    const day = String(date.getDate()).padStart(2, '0');

    const hours = String(date.getHours()).padStart(2, '0');
    const minutes = String(date.getMinutes()).padStart(2, '0');
    const seconds = String(date.getSeconds()).padStart(2, '0');

    return `${year}-${month}-${day} ${hours}:${minutes}:${seconds}`;
}

const getSupervisorName = (userId) => {
    const { supervisors } = React.useContext(ProfileContext)
    return supervisors.find(
        (supervisor) => supervisor.userId == userId
    )?.name
}

export const columns = [
    {
        id: "select",
        header: ({ table }) => (
            <Checkbox
                checked={
                    table.getIsAllPageRowsSelected() ||
                    (table.getIsSomePageRowsSelected() && "indeterminate")
                }
                onCheckedChange={value => table.toggleAllPageRowsSelected(!!value)}
                aria-label="Select all"
            />
        ),
        cell: ({ row }) => (
            <Checkbox
                checked={row.getIsSelected()}
                onCheckedChange={value => row.toggleSelected(!!value)}
                aria-label="Select row"
            />
        ),
        enableSorting: false,
        enableHiding: false
    },
    {
        accessorKey: "taskId",
        header: ({ column }) => {
            return (
                <div className="hidden">Task ID</div>
            )
        },
        cell: ({ row }) => <div className="hidden">{row.getValue("taskId")}</div>
    },
    {
        accessorKey: "employeeId",
        header: ({ column }) => {
            return (
                <div className="hidden">Employee ID</div>
            )
        },
        cell: ({ row }) => <div className="hidden">{row.getValue("employeeId")}</div>
    },
    {
        accessorKey: "assignedBy",
        header: "Assigned By",
        cell: ({ row }) => <div className="">{getSupervisorName(row.getValue("assignedBy"))}</div>
    },
    {
        accessorKey: "title",
        header: () => <div className="text-left">Title</div>,
        cell: ({ row }) => <div className="text-left">{row.getValue("title")}</div>
    },
    {
        accessorKey: "description",
        header: () => <div className="text-left">Description</div>,
        // Todo: limit word
        cell: ({ row }) => <div className="text-left">{row.getValue("description")}</div>
    },
    {
        accessorKey: "priority",
        header: () => <div className="text-left">Priority</div>,
        cell: ({ row }) => <div className="uppercase text-left"><Badge variant={priorityMapping[row.getValue("priority")]}>{row.getValue("priority")}</Badge></div>
    },
    {
        accessorKey: "status",
        header: ({ column }) => {
            return (
                <div className="">Status</div>
            )
        },
        cell: ({ row }) => <div className="uppercase">{row.getValue("status").replace("_", " ")}</div>

    },
    {
        accessorKey: "dueDate",
        header: ({ column }) => {
            return (
                <div className="">Due Date</div>
            )
        },
        cell: ({ row }) => <div className="">{formatDate(row.getValue("dueDate"))}</div>

    },
    {
        accessorKey: "createdAt",
        header: ({ column }) => {
            return (
                <div className="">Created At</div>
            )
        },
        cell: ({ row }) => <div className="">{row.getValue("createdAt")}</div>

    },
    {
        accessorKey: "lastEditedAt",
        header: ({ column }) => {
            return (
                <div className="hidden">Last Edited</div>
            )
        },
        cell: ({ row }) => <div className="hidden">{row.getValue("lastEditedAt")}</div>

    },
    {
        id: "actions",
        header: () => <div className="text-left">Actions</div>,
        cell: ({ row }) => (
            <DropdownMenu>
                <DropdownMenuTrigger asChild>
                    <Button variant="ghost" className="h-8 w-8 p-0">
                        <span className="sr-only">Open menu</span>
                        <MoreHorizontal />
                    </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end">
                    <DropdownMenuLabel>Actions</DropdownMenuLabel>

                    <DynamicDialog
                        trigger={
                            <div className="relative flex cursor-default items-center gap-2 rounded-sm px-2 py-1.5 text-sm select-none hover:bg-accent hover:text-accent-foreground">
                                <Eye className="h-4 w-4" />
                                View
                            </div>
                        }
                        title="View task"
                        description="View task details"
                        content={<ViewTaskContent row={row} />}
                        className="sm:max-w-[425px]"
                    />

                    <DynamicDialog
                        trigger={
                            <div className="relative flex cursor-default items-center gap-2 rounded-sm px-2 py-1.5 text-sm select-none hover:bg-accent hover:text-accent-foreground">
                                <Pencil className="h-4 w-4" />
                                Edit
                            </div>
                        }
                        title="Edit task"
                        description="Edit task details"
                        content={<EditTasktContent row={row} />}
                        className="sm:max-w-[625px]"
                    />

                    <DynamicDialog
                        trigger={
                            <div className="relative flex cursor-default items-center gap-2 rounded-sm px-2 py-1.5 text-sm select-none hover:bg-accent hover:text-accent-foreground">
                                <Trash2 className="h-4 w-4" />
                                Delete
                            </div>
                        }
                        title="Are you absolutely sure?"
                        description="This action cannot be undone. Are you sure you want to permanently delete the task."
                        className="sm:max-w-[425px]"
                        content=""
                    />
                </DropdownMenuContent>
            </DropdownMenu>
        )
    },
];


const TasksTable = () => {
    const [sorting, setSorting] = useState([])
    const [columnFilters, setColumnFilters] = React.useState([])
    const [columnVisibility, setColumnVisibility] = React.useState({})
    const [rowSelection, setRowSelection] = React.useState({})
    const { tasks, setTasks } = React.useContext(ClientContext);
    const { setSupervisors, supervisors } = React.useContext(ProfileContext)
    const [loading, setLoading] = useState(false)

    const fetchAllSupervisors = async () => {
        try {
            setLoading(true)
            const response = await api.get('/site/supervisor')
            setSupervisors(response.data?.managers || [])
        } catch (error) {
            console.error("Error fetching supervisors:", error)
        } finally {
            setLoading(false)
        }
    }

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

    useEffect(() => {
        fetchAllSupervisors()
        fetchAllTasks()
    }, [])

    useEffect(
        () => { console.log(supervisors) }, [supervisors]
    )

    const table = useReactTable({
        data: tasks,
        columns,
        onSortingChange: setSorting,
        onColumnFiltersChange: setColumnFilters,
        getCoreRowModel: getCoreRowModel(),
        getPaginationRowModel: getPaginationRowModel(),
        getSortedRowModel: getSortedRowModel(),
        getFilteredRowModel: getFilteredRowModel(),
        onColumnVisibilityChange: setColumnVisibility,
        onRowSelectionChange: setRowSelection,
        state: {
            sorting,
            columnFilters,
            columnVisibility,
            rowSelection
        }
    })

    const { user } = React.useContext(ProfileContext);
    const diabledAdd = !["SUPER_ADMIN", "MANAGER"].includes(user.role);

    if (loading) {
        return (
            <div className="flex items-center justify-center h-screen">
                <LoaderCircle className="h-20 w-20 animate-spin flex flex-col items-center justify-center h-[40vh]" />
            </div>
        )
    }

    return (
        <div className="px-4">
            <div className="w-full">
                <div className="flex items-center py-4">
                    <Input autoComplete="off"
                        placeholder="Filter title..."
                        value={table.getColumn("title")?.getFilterValue() ?? ""}
                        onChange={event => {
                            const input = event.target.value;
                            // Remove leading spaces, allow internal and trailing spaces
                            const filtered = input.replace(/^\s+/, "");
                            table.getColumn("title")?.setFilterValue(filtered);
                        }}
                        className="max-w-sm"
                    />

                    <div className="flex items-center ml-auto space-x-4">
                        {!diabledAdd && <DynamicDialog
                            trigger={
                                <Button variant="outline" className="ml-4 hover:bg-black hover:text-white">
                                    Add <Plus />
                                </Button>
                            }
                            title="Add task"
                            description="Add task details"
                            content={<AddTaskContent />}
                            className="sm:max-w-[625px]"
                        />}

                        <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                                <Button variant="outline" className="ml-auto">
                                    Columns <ChevronDown />
                                </Button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent align="end">
                                {table
                                    .getAllColumns()
                                    .filter(column => column.getCanHide())
                                    .map(column => (
                                        <DropdownMenuCheckboxItem
                                            key={column.id}
                                            className="capitalize"
                                            checked={column.getIsVisible()}
                                            onCheckedChange={value => column.toggleVisibility(!!value)}
                                        >
                                            {column.id}
                                        </DropdownMenuCheckboxItem>
                                    ))}
                            </DropdownMenuContent>
                        </DropdownMenu>
                    </div>
                </div>
                <div className="rounded-md border">
                    <Table>
                        <TableHeader>
                            {table.getHeaderGroups().map(headerGroup => (
                                <TableRow key={headerGroup.id}>
                                    {headerGroup.headers.map(header => (
                                        <TableHead key={header.id}>
                                            {header.isPlaceholder
                                                ? null
                                                : flexRender(
                                                    header.column.columnDef.header,
                                                    header.getContext()
                                                )}
                                        </TableHead>
                                    ))}
                                </TableRow>
                            ))}
                        </TableHeader>
                        <TableBody>
                            {table.getRowModel().rows?.length ? (
                                table.getRowModel().rows.map(row => (
                                    <TableRow
                                        key={row.id}
                                        data-state={row.getIsSelected() && "selected"}
                                    >
                                        {row.getVisibleCells().map(cell => (
                                            <TableCell key={cell.id}>
                                                {flexRender(
                                                    cell.column.columnDef.cell,
                                                    cell.getContext()
                                                )}
                                            </TableCell>
                                        ))}
                                    </TableRow>
                                ))
                            ) : (
                                <TableRow>
                                    <TableCell
                                        colSpan={columns.length}
                                        className="h-24 text-center"
                                    >
                                        No results.
                                    </TableCell>
                                </TableRow>
                            )}
                        </TableBody>
                    </Table>
                </div>
                <div className="flex items-center justify-end space-x-2 py-4">
                    <div className="flex-1 text-sm text-muted-foreground">
                        {table.getFilteredSelectedRowModel().rows.length} of{" "}
                        {table.getFilteredRowModel().rows.length} row(s) selected.
                    </div>
                    <div className="space-x-2">
                        <Button
                            variant="outline"
                            size="sm"
                            onClick={() => table.previousPage()}
                            disabled={!table.getCanPreviousPage()}
                        >
                            Previous
                        </Button>
                        <Button
                            variant="outline"
                            size="sm"
                            onClick={() => table.nextPage()}
                            disabled={!table.getCanNextPage()}
                        >
                            Next
                        </Button>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default TasksTable;

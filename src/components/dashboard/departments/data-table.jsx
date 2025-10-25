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
import AddDepartmentContent from './add-department-content';
import ViewDepartmentContent from './view-department-content';
import EditDepartmentContent from './edit-department-content';
import DeleteDepartment from './delete-department';
import { ClientContext } from '../../../context/ClientContext';
// function formatTimestamp(timestamp) {
//   const date = new Date(timestamp);

//   // Get day, month (3-letter abbreviation), and year
//   const day = date.getDate();
//   const month = date.toLocaleString('en-US', { month: 'short' });
//   const year = date.getFullYear();

//   // Return the formatted date in the desired format
//   return `${day} ${month}, ${year}`;
// }

const getNotDisabled = () => {
  const { user } = React.useContext(ProfileContext);

  return ["SUPER_ADMIN", "MANAGER"].includes(user.role);
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
    accessorKey: "departmentId",
    header: ({ column }) => {
      return (
        <div className="hidden">Department ID</div>
      )
    },
    cell: ({ row }) => <div className="hidden">{row.getValue("departmentId")}</div>
  },
  {
    accessorKey: "departmentSlug",
    header: () => <div className="text-center">Department Slug</div>,
    cell: ({ row }) => <div className="uppercase text-center"><Badge>{row.getValue("departmentSlug")}</Badge></div>
  },
  {
    accessorKey: "name",
    header: "Name",
    cell: ({ row }) => <div className="uppercase">{row.getValue("name")}</div>
  },
  {
    accessorKey: "description",
    header: () => <div className="text-left">Description</div>,
    cell: ({ row }) => <div className="text-left">{row.getValue("description")}</div>
  },
  {
    accessorKey: "supervisorId",
    header: () => <div className="text-left">Supervisor Id</div>,
    cell: ({ row }) => <div className="text-left">{getSupervisorName(row.getValue("supervisorId"))}</div>
  },
  {
    accessorKey: "createdAt",
    header: ({ column }) => {
      return (
        <div className="hidden">Created At</div>
      )
    },
    cell: ({ row }) => <div className="hidden">{row.getValue("createdAt")}</div>

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
            title="View department"
            description="View department details"
            content={<ViewDepartmentContent row={row} />}
            className="sm:max-w-[425px]"
          />

          <DynamicDialog
            trigger={
              <div className="relative flex cursor-default items-center gap-2 rounded-sm px-2 py-1.5 text-sm select-none hover:bg-accent hover:text-accent-foreground">
                <Pencil className="h-4 w-4" />
                Edit
              </div>
            }
            title="Edit department"
            description="Edit department details"
            content={<EditDepartmentContent row={row} />}
            className="sm:max-w-[625px]"
          />

          {getNotDisabled() && <DynamicDialog
            trigger={
              <div className="relative flex cursor-default items-center gap-2 rounded-sm px-2 py-1.5 text-sm select-none hover:bg-accent hover:text-accent-foreground">
                <Trash2 className="h-4 w-4" />
                Delete
              </div>
            }
            title="Are you absolutely sure?"
            description="This action cannot be undone. Are you sure you want to permanently delete the department."
            className="sm:max-w-[425px]"
            content={<DeleteDepartment row={row} />}
          />}
        </DropdownMenuContent>
      </DropdownMenu>
    )
  },
];

const getSupervisorName = (userId) => {
  const { supervisors } = React.useContext(ProfileContext)
  return supervisors.find(
    (supervisor) => supervisor.userId == userId
  )?.name
}



const DepartmentsTable = () => {
  const [sorting, setSorting] = useState([])
  const [columnFilters, setColumnFilters] = React.useState([])
  const [columnVisibility, setColumnVisibility] = React.useState({})
  const [rowSelection, setRowSelection] = React.useState({})
  const { dept, setDept } = React.useContext(ClientContext);
  const [loading, setLoading] = useState(false)
  const { supervisors, setSupervisors } = React.useContext(ProfileContext)
  const { user } = React.useContext(ProfileContext)

  const disabled = !["SUPER_ADMIN", "MANAGER"].includes(user.role)

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



  useEffect(() => {
    fetchAllSupervisors()
    fetchAllDepartments()
  }, [])

  const table = useReactTable({
    data: dept,
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
            placeholder="Filter name..."
            value={table.getColumn("name")?.getFilterValue() ?? ""}
            onChange={event => {
              const input = event.target.value;
              // Remove leading spaces, allow internal and trailing spaces
              const filtered = input.replace(/^\s+/, "");
              table.getColumn("name")?.setFilterValue(filtered);
            }}
            className="max-w-sm"
          />

          <div className="flex items-center ml-auto space-x-4">
            {!disabled && <DynamicDialog
              trigger={
                <Button variant="outline" className="ml-4 hover:bg-black hover:text-white">
                  Add <Plus />
                </Button>
              }
              title="Add department"
              description="Add department details"
              content={<AddDepartmentContent />}
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

export default DepartmentsTable;

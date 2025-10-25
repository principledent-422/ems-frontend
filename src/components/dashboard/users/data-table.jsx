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
import { ClientContext } from '../../../context/ClientContext';

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
import EditUserContent from './edit-user-content'
import ViewUserContent from './view-user-content'
import AddUserContent from './add-user-content';
import DeleteUser from './delete-user';
// function formatTimestamp(timestamp) {
//   const date = new Date(timestamp);

//   // Get day, month (3-letter abbreviation), and year
//   const day = date.getDate();
//   const month = date.toLocaleString('en-US', { month: 'short' });
//   const year = date.getFullYear();

//   // Return the formatted date in the desired format
//   return `${day} ${month}, ${year}`;
// }



const PromoteTo = ({ from, to, userId }) => {
  const [selectedDate, setSelectedDate] = useState(null);
  const [loading, setLoading] = useState(false);

  const { users, setUsers } = React.useContext(ClientContext)
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

  const [finalValues, setFinalValues] = useState({
    userId: userId,
    from: from,
    to: to,
    departmentId: "012e54bd-5dc3-4573-808e-34a0c81e542b",
    hireDate: "",
    position: "",
    salary: "",
  });

  useEffect(
    () => {
      console.log(finalValues)
    }, [finalValues]
  )

  useEffect(() => {
    if (selectedDate) {
      const formattedDate = format(selectedDate, "yyyy-MM-dd");
      handleFormChange("hireDate", formattedDate);
    }
  }, [selectedDate]);

  const handleFormChange = (key, value) => {
    setFinalValues((prev) => ({
      ...prev,
      [key]: ["from", "to"].includes(key) ? value.toUpperCase() : value,
    }));
  };

  const handlePromoteClick = async (e) => {
    e.preventDefault();

    if (!finalValues.hireDate || !finalValues.position || !finalValues.salary) {
      toast.error("Error", {
        description: "Hire date or position or salary missing",
      });
      return;
    }

    try {
      setLoading(true);
      const response = await api.post(
        "/action/promote",
        {
          ...finalValues,
          from: finalValues.from.toUpperCase(),
          to: finalValues.to.toUpperCase(),
        },
        {
          headers: {
            'content-type': 'application/json'
          }
        }
      );

      const result = response?.data;

      if (result.error) {
        toast.error("Error", {
          description: result?.message
        });
        return;
      }

      toast.success("Success", {
        description: result?.message
      });
      await fetchAllUsers()

    }
    catch (error) {
      toast.error("Error", {
        description: error.message || "An error occurred during promotion"
      });
    }
    finally {
      setLoading(false);
    }
  }

  return (
    <form onSubmit={handlePromoteClick} className="w-[350px] space-y-3">
      <div className="flex space-x-4">
        <div className="flex flex-col space-y-1.5 flex-1">
          <Label htmlFor="from">From</Label>
          <Select defaultValue={from}>
            <SelectTrigger id="from">
              <SelectValue placeholder="Select role" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem disabled={from !== "guest"} value="guest">
                Guest
              </SelectItem>
              <SelectItem disabled={from !== "employee"} value="employee">
                Employee
              </SelectItem>
              <SelectItem disabled={from !== "manager"} value="manager">
                Manager
              </SelectItem>
            </SelectContent>
          </Select>
        </div>
        <div className="flex flex-col space-y-1.5 flex-1">
          <Label htmlFor="to">To</Label>
          <Select
            onValueChange={(value) => handleFormChange("to", value.toUpperCase())}
            defaultValue={to}
          >
            <SelectTrigger id="to">
              <SelectValue placeholder="Select role" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem disabled={from === "guest"} value="guest">
                Guest
              </SelectItem>
              <SelectItem disabled={from === "employee"} value="employee">
                Employee
              </SelectItem>
              <SelectItem disabled={from === "manager"} value="manager">
                Manager
              </SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      <div className="flex flex-col space-y-1.5">
        <Label htmlFor="department">Department</Label>
        <Input
          autoComplete="off"
          disabled={true}
          value={finalValues.departmentId}
          onChange={(e) => handleFormChange("departmentId", e.target.value)}
          id="department"
          placeholder="e.g. Marketing"
        />
      </div>

      <div className="flex space-x-4">
        <div className="flex flex-col space-y-1.5 flex-1">
          <Label htmlFor="hireDate">Hire Date</Label>
          <Popover>
            <PopoverTrigger asChild>
              <Button
                variant="outline"
                className={cn(
                  "w-[240px] pl-3 text-left font-normal",
                  !selectedDate && "text-muted-foreground"
                )}
              >
                {selectedDate ? (
                  format(selectedDate, "PPP")
                ) : (
                  <span>Pick a date</span>
                )}
                <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-auto p-0" align="start">
              <Calendar
                mode="single"
                selected={selectedDate}
                onSelect={setSelectedDate}
                initialFocus
              />
            </PopoverContent>
          </Popover>
        </div>
        <div className="flex flex-col space-y-1.5 flex-1">
          <Label htmlFor="position">Position</Label>
          <Input
            autoComplete="off"
            value={finalValues.position}
            onChange={(e) => handleFormChange("position", e.target.value)}
            id="position"
            placeholder="e.g. Senior Dev"
          />
        </div>
      </div>

      <div className="flex flex-col space-y-1.5">
        <Label htmlFor="salary">Salary</Label>
        <Input
          autoComplete="off"
          value={finalValues.salary}
          onChange={(e) => handleFormChange("salary", Number(e.target.value))}
          id="salary"
          type="number"
          placeholder="e.g. 75000"
        />
      </div>

      <div className="flex justify-end pt-2">
        <Button type="submit" disabled={loading}>
          {loading ? (
            <>
              Promoting <LoaderCircle className="ml-2 h-4 w-4 animate-spin" />
            </>
          ) : (
            "Promote"
          )}
        </Button>
      </div>
    </form>
  );
};

const getNotDisabled = () => {
  const { user } = React.useContext(ProfileContext)
  return ["SUPER_ADMIN", "MANAGER"].includes(user.role)
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
    accessorKey: "name",
    header: ({ column }) => {
      return (
        <div className="hidden">Name</div>
      )
    },
    cell: ({ row }) => <div className="hidden">{row.getValue("name")}</div>

  },
  {
    accessorKey: "username",
    header: "Username",
    cell: ({ row }) => <div>{row.getValue("username")}</div>
  },
  {
    accessorKey: "email",
    header: "Email",
    cell: ({ row }) => <div className="lowercase">{row.getValue("email")}</div>
  },
  {
    accessorKey: "role",
    header: "Role",
    cell: ({ row }) => <div className="uppercase"><Badge>{row.getValue("role")}</Badge></div>
  },
  {
    accessorKey: "phoneNumber",
    header: () => <div className="text-left">Phone</div>,
    cell: ({ row }) => <div className="text-left">{row.getValue("phoneNumber") || "-"}</div>
  },
  {
    accessorKey: "address",
    header: () => <div className="text-left">Address</div>,
    cell: ({ row }) => <div className="text-left">{row.getValue("address") || "-"}</div>
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
    accessorKey: "userId",
    header: ({ column }) => {
      return (
        <div className="hidden">UserId</div>
      )
    },
    cell: ({ row }) => <div className="hidden">{row.getValue("userId")}</div>

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
            title="View user"
            description="View user details"
            content={<ViewUserContent row={row} />}
            className="sm:max-w-[425px]"
          />

          <DynamicDialog
            trigger={
              <div className="relative flex cursor-default items-center gap-2 rounded-sm px-2 py-1.5 text-sm select-none hover:bg-accent hover:text-accent-foreground">
                <Pencil className="h-4 w-4" />
                Edit
              </div>
            }
            title="Edit user"
            description="Edit user details"
            content={<EditUserContent row={row} />}
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
            description="This action cannot be undone. Are you sure you want to permanently delete the user."
            className="sm:max-w-[425px]"
            content={<DeleteUser row={row} />}
          />}
        </DropdownMenuContent>
      </DropdownMenu>
    )
  },
  {
    id: "promote",
    header: () => <div className="text-left">Promote</div>,
    cell: ({ row }) => (
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant="ghost" className="h-8 w-8 p-0">
            <span className="sr-only">Open menu</span>
            <MoreHorizontal />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end">
          <DropdownMenuLabel>Promote to</DropdownMenuLabel>
          <DynamicDialog
            trigger={
              <div className={`relative flex cursor-default items-center gap-2 rounded-sm px-2 py-1.5 text-sm select-none ${row.getValue("role") == "MANAGER" ? "opacity-50 pointer-events-none" : "hover:bg-accent hover:text-accent-foreground"}`}>
                <ShieldUser className="h-4 w-4 mr-2" />
                Manager
              </div>
            }
            title="Promote user"
            description="Promote user to MANAGER"
            content={<PromoteTo from={row.getValue("role").toLowerCase()} to="manager" userId={row.getValue('userId')} />}
            className="sm:max-w-[425px]"
          />

          <DynamicDialog
            trigger={
              <div className={`relative flex cursor-default items-center gap-2 rounded-sm px-2 py-1.5 text-sm select-none ${row.getValue("role").toLowerCase() == "employee" ? "opacity-50 pointer-events-none" : "hover:bg-accent hover:text-accent-foreground"}`}>
                <User className="h-4 w-4 mr-2" />
                Employee
              </div>
            }
            title="Promote user"
            description="Promote user to EMPLOYEE"
            content={<PromoteTo from={row.getValue("role").toLowerCase()} to="employee" userId={row.getValue('userId')} />}
            className="sm:max-w-[425px]"
          />

          <DynamicDialog
            trigger={
              <div className={`relative flex cursor-default items-center gap-2 rounded-sm px-2 py-1.5 text-sm select-none ${row.getValue("role") == "GUEST" ? "opacity-50 pointer-events-none" : "hover:bg-accent hover:text-accent-foreground"}`}>
                <UserX className="h-4 w-4 mr-2" />
                Guest
              </div>

            }
            title="Promote user"
            description="Promote user to GUEST"
            content={<PromoteTo from={row.getValue("role").toLowerCase()} to="guest" userId={row.getValue('userId')} />}
            className="sm:max-w-[425px]"
          />


        </DropdownMenuContent>
      </DropdownMenu>
    )
  }
];


const UsersTable = () => {
  const { users, setUsers } = React.useContext(ClientContext)
  const [sorting, setSorting] = useState([])
  const [columnFilters, setColumnFilters] = React.useState([])
  const [columnVisibility, setColumnVisibility] = React.useState({})
  const [rowSelection, setRowSelection] = React.useState({})

  const [loading, setLoading] = useState(false)

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

  useEffect(() => {

    fetchAllUsers()
  }, [])

  const table = useReactTable({
    data: users,
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

  const { user } = React.useContext(ProfileContext);
  const diabledAdd = !["SUPER_ADMIN", "MANAGER"].includes(user.role);

  return (
    <div className="px-4">
      <div className="w-full">
        <div className="flex items-center py-4">
          <Input autoComplete="off"
            placeholder="Filter username..."
            value={table.getColumn("username")?.getFilterValue() ?? ""}
            onChange={event => {
              const input = event.target.value;
              // Remove leading spaces, allow internal and trailing spaces
              const filtered = input.replace(/^\s+/, "");
              table.getColumn("username")?.setFilterValue(filtered);
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
              title="Add user"
              description="Add user details"
              content={<AddUserContent />}
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

export default UsersTable

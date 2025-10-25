import * as React from "react"
import { toast } from "sonner";
import { useTheme } from "../theme/theme-provider";
import { routeToTitleMappings } from "../../lib/config";
import {
    ArrowUpCircleIcon,
    BarChartIcon,
    CameraIcon,
    ClipboardListIcon,
    DatabaseIcon,
    FileCodeIcon,
    FileIcon,
    FileTextIcon,
    FolderIcon,
    HelpCircleIcon,
    LayoutDashboardIcon,
    ListIcon,
    SearchIcon,
    SettingsIcon,
    UsersIcon,
    MailIcon, PlusCircleIcon,
    MoreHorizontalIcon,
    ShareIcon,
    MoreVerticalIcon,
    BellIcon,
    CreditCardIcon,
    LogOutIcon,
    UserCircleIcon,
    Users,
    Layers,
    ShieldPlus,
    ShieldCheck,
    FolderHeart,
    CalendarCheck,
    SunMoon,
    Moon,
    Sun,
    ClipboardCheck
} from "lucide-react"

import { Button } from "@/components/ui/button"
import {
    DropdownMenuGroup,
    DropdownMenuLabel,
    DropdownMenuSeparator,
} from "@/components/ui/dropdown-menu"


import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"

import {
    Sidebar,
    SidebarContent,
    SidebarFooter,
    SidebarHeader,
    SidebarMenu,
    SidebarMenuButton,
    SidebarMenuItem,
    SidebarGroup,
    SidebarGroupLabel,
    SidebarMenuAction,
    useSidebar,
    SidebarGroupContent
} from "@/components/ui/sidebar"

import {
    Avatar,
    AvatarFallback,
    AvatarImage,
} from "@/components/ui/avatar"
import { useLocation, useNavigate } from "react-router-dom"
import { ProfileContext } from "../../context/ProfileContext"


import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import DynamicDialog from "./DynamicDialog";
import EditProfileContent from "./profile/edit-profile-content";


export const NavDocuments = ({ items }) => {
    const { isMobile } = useSidebar()
    return (
        <SidebarGroup className="group-data-[collapsible=icon]:hidden">
            <SidebarGroupLabel>Documents</SidebarGroupLabel>
            <SidebarMenu>
                {items.map(item => (
                    <SidebarMenuItem key={item.name}>
                        <SidebarMenuButton asChild>
                            <a href={item.url}>
                                <item.icon />
                                <span>{item.name}</span>
                            </a>
                        </SidebarMenuButton>
                        <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                                <SidebarMenuAction
                                    showOnHover
                                    className="rounded-sm data-[state=open]:bg-accent"
                                >
                                    <MoreHorizontalIcon />
                                    <span className="sr-only">More</span>
                                </SidebarMenuAction>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent
                                className="w-24 rounded-lg"
                                side={isMobile ? "bottom" : "right"}
                                align={isMobile ? "end" : "start"}
                            >
                                <DropdownMenuItem>
                                    <FolderIcon />
                                    <span>Open</span>
                                </DropdownMenuItem>
                                <DropdownMenuItem>
                                    <ShareIcon />
                                    <span>Share</span>
                                </DropdownMenuItem>
                            </DropdownMenuContent>
                        </DropdownMenu>
                    </SidebarMenuItem>
                ))}
                <SidebarMenuItem>
                    <SidebarMenuButton className="text-sidebar-foreground/70">
                        <MoreHorizontalIcon className="text-sidebar-foreground/70" />
                        <span>More</span>
                    </SidebarMenuButton>
                </SidebarMenuItem>
            </SidebarMenu>
        </SidebarGroup>
    )
}

export const NavSecondary = ({ items, ...props }) => {
    const { theme, setTheme } = useTheme()
    return (
        <SidebarGroup {...props}>
            <SidebarGroupContent>
                <SidebarMenu>
                    <div>
                        <SidebarMenuItem >
                            <SidebarMenuButton asChild>

                                <div className="cursor-pointer" onClick={() => setTheme(theme == "light" ? "dark" : "light")}>
                                    {theme == "light" ? <Moon /> : <Sun />}
                                    <span>{theme == "light" ? "Dark Mode" : "Light Mode"}</span>
                                </div>

                            </SidebarMenuButton>
                        </SidebarMenuItem>
                        {items.map(item => (
                            <SidebarMenuItem key={item.title}>
                                <SidebarMenuButton asChild>
                                    <a href={item.url}>
                                        <item.icon />
                                        <span>{item.title}</span>
                                    </a>
                                </SidebarMenuButton>
                            </SidebarMenuItem>
                        ))}
                    </div>
                </SidebarMenu>
            </SidebarGroupContent>
        </SidebarGroup>
    )
}


export const NavMain = ({ items }) => {
    const [selected, setSelected] = React.useState(null);
    const navigate = useNavigate()
    const { user } = React.useContext(ProfileContext)
    const location = useLocation()



    React.useEffect(
        () => {
            const path = location.pathname
            setSelected(path)
        }, []
    )

    return (
        <SidebarGroup>
            <SidebarGroupContent className="flex flex-col gap-2">
                <SidebarMenu>
                    {items.map(item => (
                        item.roles.includes(user.role) && <SidebarMenuItem key={item.title}>
                            <SidebarMenuButton className={`${selected == item.href ? "min-w-8 bg-primary text-primary-foreground duration-200 ease-linear hover:bg-primary hover:text-primary-foreground active:bg-primary/90 active:text-primary-foreground" : ""} cursor-pointer`} tooltip={item.title} onClick={() => {
                                setSelected(item.href)
                                navigate(item.href)
                            }}>
                                {item.icon && <item.icon />}
                                <span>{item.title}</span>
                            </SidebarMenuButton>
                        </SidebarMenuItem>
                    ))}
                </SidebarMenu>
            </SidebarGroupContent>
        </SidebarGroup>
    )
}

export const NavUser = ({ user }) => {
    const { isMobile } = useSidebar()
    const navigate = useNavigate()


    const logoutUser = () => {
        localStorage.removeItem('access_token');
        localStorage.removeItem('expiry');

        toast.success("Success", {
            description: "Logged out successfully",
        })

        navigate("/login")

    }

    return (
        <SidebarMenu>
            <SidebarMenuItem>
                <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                        <SidebarMenuButton
                            size="lg"
                            className="data-[state=open]:bg-sidebar-accent data-[state=open]:text-sidebar-accent-foreground"
                        >
                            <Avatar className="h-8 w-8 rounded-lg grayscale">
                                <AvatarImage src={user.avatar} alt={user.name} />
                                <AvatarFallback className="rounded-lg">CN</AvatarFallback>
                            </Avatar>
                            <div className="grid flex-1 text-left text-sm leading-tight">
                                <span className="truncate font-medium">{user.name}</span>
                                <span className="truncate text-xs text-muted-foreground">
                                    {user.email}
                                </span>
                            </div>
                            <MoreVerticalIcon className="ml-auto size-4" />
                        </SidebarMenuButton>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent
                        className="w-[--radix-dropdown-menu-trigger-width] min-w-56 rounded-lg"
                        side={isMobile ? "bottom" : "right"}
                        align="end"
                        sideOffset={4}
                    >
                        <DropdownMenuLabel className="p-0 font-normal">
                            <div className="flex items-center gap-2 px-1 py-1.5 text-left text-sm">
                                <Avatar className="h-8 w-8 rounded-lg">
                                    <AvatarImage src={user.avatar} alt={user.name} />
                                    <AvatarFallback className="rounded-lg">CN</AvatarFallback>
                                </Avatar>
                                <div className="grid flex-1 text-left text-sm leading-tight">
                                    <span className="truncate font-medium">{user.name}</span>
                                    <span className="truncate text-xs text-muted-foreground">
                                        {user.email}
                                    </span>
                                </div>
                            </div>
                        </DropdownMenuLabel>
                        <DropdownMenuSeparator />
                        <DropdownMenuGroup>

                            <DropdownMenuItem onSelect={(event) => {
                                event.preventDefault();
                            }}>
                                <DynamicDialog
                                    trigger={
                                        <div className="relative w-full h-full flex cursor-default items-center gap-2 rounded-sm text-sm select-none hover:bg-accent hover:text-accent-foreground">
                                            <UserCircleIcon />
                                            Edit Account
                                        </div>
                                    }
                                    title="Edit profile"
                                    description="Edit your details"
                                    content={<EditProfileContent />}
                                    className="sm:max-w-[625px]"
                                />
                            </DropdownMenuItem>

                        </DropdownMenuGroup>
                        <DropdownMenuSeparator />
                        <DropdownMenuItem onClick={logoutUser}>
                            <LogOutIcon />
                            Log out
                        </DropdownMenuItem>
                    </DropdownMenuContent>
                </DropdownMenu>
            </SidebarMenuItem>
        </SidebarMenu>
    )
}




export const AppSidebar = ({ ...props }) => {

    const { user } = React.useContext(ProfileContext)

    console.log(user);

    const data = {
        user: {
            name: user?.name,
            email: user?.email,
            avatar: "/avatars/shadcn.jpg"
        },
        navMain: [
            {
                title: "Admin",
                url: "#",
                icon: ShieldCheck,
                roles: ["SUPER_ADMIN"],
                href: "/dashboard/admin"
            },
            {
                title: "Users",
                url: "#",
                roles: ["SUPER_ADMIN", "MANAGER", "EMPLOYEE"],
                icon: Users,
                href: "/dashboard/users"
            },
            {
                title: "Departments",
                url: "#",
                roles: ["SUPER_ADMIN", "MANAGER", "EMPLOYEE", "GUEST"],
                icon: Layers,
                href: "/dashboard/departments"
            },
            {
                title: "Tasks",
                url: "#",
                roles: ["SUPER_ADMIN", "MANAGER", "EMPLOYEE", "GUEST"],
                icon: ClipboardCheck,
                href: "/dashboard/tasks"
            },
            // {
            //     title: "Analytics",
            //     url: "#",
            //     roles: ["SUPER_ADMIN", "EMPLOYEE"],
            //     icon: BarChartIcon,
            //     href: "/dashboard/analytics"
            // },
            // {
            //     title: "Projects",
            //     url: "#",
            //     roles: ["GUEST"],
            //     icon: FolderIcon,
            //     href: "/dashboard/projects"
            // },
            // {
            //     title: "Team",
            //     url: "#",
            //     roles: ["EMPLOYEE"],
            //     icon: UsersIcon,
            //     href: "/dashboard/team"
            // }
        ],
        navSecondary: [

            {
                title: "Get Help",
                url: "#",
                icon: HelpCircleIcon
            },
        ],
        // documents: [
        //     {
        //         name: "Pay Slips",
        //         url: "#",
        //         icon: FolderHeart
        //     },
        //     {
        //         name: "Reports",
        //         url: "#",
        //         icon: ClipboardListIcon
        //     },
        //     {
        //         name: "Request Leave",
        //         url: "#",
        //         icon: CalendarCheck
        //     }
        // ]
    }



    return (
        <Sidebar collapsible="offcanvas" {...props}>
            <SidebarHeader>
                <SidebarMenu>
                    <SidebarMenuItem>
                        <SidebarMenuButton
                            asChild
                            className="data-[slot=sidebar-menu-button]:!p-1.5"
                        >
                            <a href="/dashboard">
                                <ArrowUpCircleIcon className="h-5 w-5" />
                                <span className="text-base font-semibold">Workers Inc.</span>
                            </a>
                        </SidebarMenuButton>
                    </SidebarMenuItem>
                </SidebarMenu>
            </SidebarHeader>
            <SidebarContent>
                <NavMain items={data.navMain} />
                {/* <NavDocuments items={data.documents} /> */}
                <NavSecondary items={data.navSecondary} className="mt-auto" />
            </SidebarContent>
            <SidebarFooter>
                <NavUser user={data.user} />
            </SidebarFooter>
        </Sidebar>
    )
}

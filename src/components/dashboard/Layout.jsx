
import { SidebarProvider, SidebarInset } from "@/components/ui/sidebar";
import { AppSidebar } from "./Sidebar";
import { Outlet, useLocation } from "react-router-dom";
import { useEffect } from "react";
import { useContext } from "react";
import { ProfileContext } from "../../context/ProfileContext";
import { SiteHeader } from "./Header";
import api from "../../lib/api";
import { LoaderCircle } from "lucide-react";
import { AdminCards } from "./admin/AdminCards";
import { routeToTitleMappings } from "../../lib/config";

export default function DashboardLayout() {

    const { user, setUser, userLoading, setUserLoading } = useContext(ProfileContext)



    const location = useLocation();


    useEffect(
        () => {


            const fetchUserData = async () => {
                try {
                    setUserLoading(true)
                    const response = await api.get('/user/profile');
                    setUser(response.data?.profile)
                    console.log(response.data?.profile);
                    setUserLoading(false)
                } catch (error) {
                    console.error("Error fetching profile:", error);
                }
            }

            fetchUserData();
        }, []
    )

    if (userLoading) {
        return (
            <div className="flex flex-col items-center justify-center min-h-screen">
                <LoaderCircle className="h-20 w-20 animate-spin text-black" />
            </div>
        );
    }

    return (
        <SidebarProvider>
            <AppSidebar variant="inset" />

            <SidebarInset>
                <SiteHeader title={routeToTitleMappings[location.pathname]} />
                <div className="flex flex-1 flex-col">
                    <div className="@container/main flex flex-1 flex-col gap-2">
                        <div className="flex flex-col gap-4 py-4 md:gap-6 md:py-6">
                            <Outlet />
                        </div>
                    </div>
                </div>

            </SidebarInset>

        </SidebarProvider>
    );
}

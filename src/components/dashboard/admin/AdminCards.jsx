import { LoaderCircle, TrendingDownIcon, TrendingUpIcon } from "lucide-react";
import api from "@/lib/api";
import { Badge } from "@/components/ui/badge";
import {
    Card,
    CardDescription,
    CardFooter,
    CardHeader,
    CardTitle,
} from "@/components/ui/card";
import { useContext, useEffect, useState } from "react";
import { ProfileContext } from "../../../context/ProfileContext";

export function AdminCards() {
    const { user } = useContext(ProfileContext)
    const tables = ["users", "employees", "managers", "departments", "tasks"];
    const [loading, setLoading] = useState(true);
    const [count, setCount] = useState({});

    useEffect(() => {
        const fetchCounts = async () => {
            try {
                const counts = {};
                await Promise.all(
                    tables.map(async (table) => {
                        const response = await api.get(`/action/count?id=${table}`);
                        counts[table] = response.data?.count || 0;
                    })
                );
                setCount(counts);
            } catch (error) {
                console.error("Error fetching counts:", error);
            } finally {
                setLoading(false);
            }
        };

        fetchCounts();
    }, []);

    if (loading) {
        return (
            <div>
                <div className="*:data-[slot=card]:shadow-xs @xl/main:grid-cols-1 @5xl/main:grid-cols-1 grid grid-cols-1 gap-4 px-4 *:data-[slot=card]:bg-gradient-to-t *:data-[slot=card]:from-primary/5 *:data-[slot=card]:to-card dark:*:data-[slot=card]:bg-card lg:px-6">
                    <Card className="@container/card mb-4 animate-pulse">
                        <CardHeader className="relative">
                            <div className="h-6 w-2/3 rounded-md bg-muted" />
                        </CardHeader>
                    </Card>
                </div>


                <div className="grid grid-cols-1 @xl/main:grid-cols-2 @5xl/main:grid-cols-4 gap-4 px-4 lg:px-6">
                    {Array.from({ length: 5 }).map((_, idx) => (
                        <div
                            key={idx}
                            className="rounded-lg bg-gradient-to-t from-primary/5 to-card dark:bg-card shadow-xs p-4 space-y-4 animate-pulse"
                        >
                            {/* Header */}
                            <div className="flex flex-col gap-2 relative">
                                <div className="h-4 w-1/3 rounded bg-muted" />
                                <div className="h-8 w-1/2 rounded bg-muted" />

                                {/* Badge (top-right) */}
                                <div className="absolute right-4 top-4 h-5 w-16 rounded bg-muted" />
                            </div>

                            {/* Footer */}
                            <div className="space-y-2 pt-4">
                                <div className="h-4 w-3/4 rounded bg-muted" />
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        );
    }

    return (
        <div>
            <div className="*:data-[slot=card]:shadow-xs @xl/main:grid-cols-1 @5xl/main:grid-cols-1 grid grid-cols-1 gap-4 px-4 *:data-[slot=card]:bg-gradient-to-t *:data-[slot=card]:from-primary/5 *:data-[slot=card]:to-card dark:*:data-[slot=card]:bg-card lg:px-6">
                <Card className="@container/card mb-4">
                    <CardHeader className="relative">
                        <CardTitle>Welcome, {user.name} 🎉</CardTitle>
                    </CardHeader>
                </Card>
            </div>
            <div className="*:data-[slot=card]:shadow-xs @xl/main:grid-cols-2 @5xl/main:grid-cols-4 grid grid-cols-1 gap-4 px-4 *:data-[slot=card]:bg-gradient-to-t *:data-[slot=card]:from-primary/5 *:data-[slot=card]:to-card dark:*:data-[slot=card]:bg-card lg:px-6">
                {tables.map((table) => (
                    <Card key={table} className="@container/card">
                        <CardHeader className="relative">
                            <CardDescription>{table.charAt(0).toUpperCase() + table.slice(1)}</CardDescription>
                            <CardTitle className="@[250px]/card:text-3xl text-2xl font-semibold tabular-nums">
                                {count[table]}
                            </CardTitle>
                            <div className="absolute right-4 top-4">
                                <Badge variant="outline" className="flex gap-1 rounded-lg text-xs">
                                    <TrendingUpIcon className="size-3" />
                                    +12.5%
                                </Badge>
                            </div>
                        </CardHeader>
                        <CardFooter className="flex-col items-start gap-1 text-sm">
                            <div className="line-clamp-1 flex gap-2 font-medium">
                                Total number of {table}
                            </div>
                            {/* <div className="text-muted-foreground">
                                Total number of {table}
                            </div> */}
                        </CardFooter>
                    </Card>
                ))}
            </div>
        </div>
    );
}

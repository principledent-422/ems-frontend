import { BarChart3, LayoutDashboard, Settings } from "lucide-react"
import { Card, CardContent } from "@/components/ui/card"

const Welcome = () => {
    return (
        <div className="flex flex-col items-center justify-center min-h-[80vh] p-6">
            <div className="max-w-3xl w-full space-y-8">
                <div className="text-center space-y-2">
                    <h1 className="text-4xl md:text-5xl font-bold bg-gradient-to-b from-black to-gray-500 dark:from-white dark:to-gray-500 bg-clip-text text-transparent">
                        Welcome to the Dashboard
                    </h1>
                    <p className="text-lg text-gray-600 dark:text-gray-400">Your central hub for monitoring and managing all your data</p>
                </div>

                <div className="h-px bg-gradient-to-r from-transparent via-gray-300 to-transparent my-6" />

                <Card className="border border-gray-200 shadow-sm">
                    <CardContent className="p-6">
                        <p className="text-lg text-gray-700 dark:text-gray-300 mb-4">
                            Choose the options from the sidebar to start exploring the dashboard. Here you can:
                        </p>

                        <div className="grid gap-4 md:grid-cols-2 mt-6">
                            <div className="flex items-start space-x-3">
                                <LayoutDashboard className="h-6 w-6 text-gray-700 dark:text-gray-300 mt-0.5" />
                                <div>
                                    <h3 className="font-medium">Overview</h3>
                                    <p className="text-sm text-gray-600 dark:text-gray-400">Get a complete summary of your metrics and performance</p>
                                </div>
                            </div>

                            <div className="flex items-start space-x-3">
                                <BarChart3 className="h-6 w-6 text-gray-700 dark:text-gray-300 mt-0.5" />
                                <div>
                                    <h3 className="font-medium">Analytics</h3>
                                    <p className="text-sm text-gray-600 dark:text-gray-400">Dive deep into your data with comprehensive analytics</p>
                                </div>
                            </div>

                            <div className="flex items-start space-x-3">
                                <Settings className="h-6 w-6 text-gray-700 dark:text-gray-300 mt-0.5" />
                                <div>
                                    <h3 className="font-medium">Settings</h3>
                                    <p className="text-sm text-gray-600 dark:text-gray-400">Configure your dashboard preferences and account details</p>
                                </div>
                            </div>
                        </div>
                    </CardContent>
                </Card>
            </div>
        </div>
    )
}

export default Welcome

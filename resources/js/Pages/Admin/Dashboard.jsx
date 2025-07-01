import React from "react";
import {
    LayoutDashboard,
    Users,
    FolderKanban,
    Layers3,
    MonitorSmartphone,
    Brush,
    Globe2,
    Megaphone,
    ShoppingCart,
    Code,
    ShieldCheck,
    CreditCard,
    LifeBuoy,
    Settings2,
} from "lucide-react";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import Layout from "@/Layouts/Layout";

const DashboardPage = () => {
    return (
        <Layout>
            <div className="p-6 space-y-6">
                <h1 className="text-3xl font-bold tracking-tight">
                    Admin Dashboard
                </h1>

                {/* Overview Cards */}
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                    <Card>
                        <CardHeader className="flex flex-row items-center justify-between">
                            <CardTitle>Active Clients</CardTitle>
                            <Users className="w-5 h-5 text-muted-foreground" />
                        </CardHeader>
                        <CardContent>
                            <p className="text-2xl font-semibold">48</p>
                            <p className="text-sm text-muted-foreground">
                                +5 this week
                            </p>
                        </CardContent>
                    </Card>

                    <Card>
                        <CardHeader className="flex flex-row items-center justify-between">
                            <CardTitle>Projects</CardTitle>
                            <FolderKanban className="w-5 h-5 text-muted-foreground" />
                        </CardHeader>
                        <CardContent>
                            <p className="text-2xl font-semibold">12</p>
                            <p className="text-sm text-muted-foreground">
                                3 ongoing
                            </p>
                        </CardContent>
                    </Card>

                    <Card>
                        <CardHeader className="flex flex-row items-center justify-between">
                            <CardTitle>Revenue</CardTitle>
                            <CreditCard className="w-5 h-5 text-muted-foreground" />
                        </CardHeader>
                        <CardContent>
                            <p className="text-2xl font-semibold">$7,200</p>
                            <p className="text-sm text-muted-foreground">
                                This month
                            </p>
                        </CardContent>
                    </Card>

                    <Card>
                        <CardHeader className="flex flex-row items-center justify-between">
                            <CardTitle>Support Tickets</CardTitle>
                            <LifeBuoy className="w-5 h-5 text-muted-foreground" />
                        </CardHeader>
                        <CardContent>
                            <p className="text-2xl font-semibold">14</p>
                            <p className="text-sm text-muted-foreground">
                                2 open
                            </p>
                        </CardContent>
                    </Card>
                </div>

                {/* Services Section */}
                <div>
                    <h2 className="text-xl font-semibold mb-4">
                        Core Services
                    </h2>
                    <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
                        {[
                            { icon: Layers3, title: "Digital Marketing" },
                            {
                                icon: MonitorSmartphone,
                                title: "Web Development",
                            },
                            { icon: Globe2, title: "SEO" },
                            { icon: Brush, title: "Content Creation" },
                            { icon: Megaphone, title: "Social Media" },
                            { icon: Code, title: "Custom Software" },
                            { icon: ShoppingCart, title: "E-Commerce" },
                            { icon: ShieldCheck, title: "Security & Audit" },
                        ].map(({ icon: Icon, title }, idx) => (
                            <Card
                                key={idx}
                                className="hover:shadow-md transition"
                            >
                                <CardContent className="flex flex-col items-center justify-center text-center p-6 space-y-2">
                                    <Icon className="w-8 h-8 text-primary" />
                                    <p className="text-sm font-medium">
                                        {title}
                                    </p>
                                </CardContent>
                            </Card>
                        ))}
                    </div>
                </div>
            </div>
        </Layout>
    );
};

export default DashboardPage;

import React, { useEffect } from "react";
import toast, { Toaster } from "react-hot-toast";
import { usePage } from "@inertiajs/react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Link } from "@inertiajs/react";
import { LogOut } from "lucide-react";
import Layout from "@/Layouts/Layout"; // Adjust path to your layout
import ShowImg from "@/Pages/utils/ShowImg";

// Map for current_traffic display
const TRAFFIC_MAP = {
    Low: {
        displayName: "Low",
        badge: {
            variant: "secondary",
            className: "bg-red-100 text-red-800 hover:bg-red-200",
        },
    },
    Medium: {
        displayName: "Medium",
        badge: {
            variant: "default",
            className: "bg-yellow-100 text-yellow-800 hover:bg-yellow-200",
        },
    },
    High: {
        displayName: "High",
        badge: {
            variant: "default",
            className: "bg-green-100 text-green-800 hover:bg-green-200",
        },
    },
};

export default function Manage() {
    const { props } = usePage();
    const { seo_forms, flash } = props;

    useEffect(() => {
        if (flash?.success) {
            toast.success(flash.success);
        }
        if (flash?.error) {
            toast.error(flash.error);
        }
    }, [flash]);

    return (
        <Layout>
            <div className="p-6 bg-gray-50 min-h-screen">
                <Toaster
                    position="top-right"
                    toastOptions={{
                        duration: 3000,
                        style: {
                            borderRadius: "8px",
                            background: "#333",
                            color: "#fff",
                        },
                    }}
                />

                <div className="flex justify-between items-center mb-6">
                    <h1 className="text-3xl font-bold">SEO Forms Dashboard</h1>
                    <ShowImg img="/assets/refImg/SEOform.png" />

                    <Link
                        href="/logout"
                        method="post"
                        as="button"
                        className="flex items-center gap-2 text-gray-600 hover:text-gray-800"
                    >
                        <LogOut className="h-4 w-4" />
                        Logout
                    </Link>
                </div>

                <Card className="shadow-sm">
                    <CardHeader className="bg-gray-50 border-b">
                        <CardTitle>SEO Form Submissions</CardTitle>
                    </CardHeader>
                    <CardContent className="p-0">
                        {seo_forms.length === 0 ? (
                            <div className="p-4 text-center text-gray-500">
                                No SEO form submissions found
                            </div>
                        ) : (
                            <Table>
                                <TableHeader>
                                    <TableRow>
                                        <TableHead>Image</TableHead>
                                        <TableHead>Name</TableHead>
                                        <TableHead>Website URL</TableHead>
                                        <TableHead>Email</TableHead>
                                        <TableHead>Current Traffic</TableHead>
                                        <TableHead>Message</TableHead>
                                        <TableHead>Button Text</TableHead>
                                    </TableRow>
                                </TableHeader>
                                <TableBody>
                                    {seo_forms.map((form) => {
                                        const trafficInfo =
                                            TRAFFIC_MAP[form.current_traffic] ||
                                            TRAFFIC_MAP.Low;
                                        return (
                                            <TableRow key={form.id}>
                                                <TableCell>
                                                    {form.image ? (
                                                        <img
                                                            src={`/${form.image}`}
                                                            alt={form.name}
                                                            className="w-16 h-16 object-cover rounded"
                                                        />
                                                    ) : (
                                                        "N/A"
                                                    )}
                                                </TableCell>
                                                <TableCell>
                                                    {form.name}
                                                </TableCell>
                                                <TableCell>
                                                    <a
                                                        href={form.website_url}
                                                        target="_blank"
                                                        className="text-blue-600 hover:underline"
                                                        rel="noopener noreferrer"
                                                    >
                                                        {form.website_url}
                                                    </a>
                                                </TableCell>
                                                <TableCell>
                                                    {form.email}
                                                </TableCell>
                                                <TableCell>
                                                    <Badge
                                                        variant={
                                                            trafficInfo.badge
                                                                .variant
                                                        }
                                                        className={
                                                            trafficInfo.badge
                                                                .className
                                                        }
                                                    >
                                                        {
                                                            trafficInfo.displayName
                                                        }
                                                    </Badge>
                                                </TableCell>
                                                <TableCell>
                                                    <div
                                                        className="text-sm text-gray-600 line-clamp-2"
                                                        dangerouslySetInnerHTML={{
                                                            __html: form.message,
                                                        }}
                                                    />
                                                </TableCell>
                                                <TableCell>
                                                    {form.button}
                                                </TableCell>
                                            </TableRow>
                                        );
                                    })}
                                </TableBody>
                            </Table>
                        )}
                    </CardContent>
                </Card>
            </div>
        </Layout>
    );
}

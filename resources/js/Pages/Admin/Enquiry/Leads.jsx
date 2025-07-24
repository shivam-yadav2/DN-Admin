import React, { useState, useEffect } from "react";
import toast, { Toaster } from "react-hot-toast";
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
import { Button } from "@/components/ui/button";
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
    AlertDialog,
    AlertDialogAction,
    AlertDialogCancel,
    AlertDialogContent,
    AlertDialogDescription,
    AlertDialogFooter,
    AlertDialogHeader,
    AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import {
    MoreVertical,
    Clock,
    Users,
    CheckCircle,
    XCircle,
    Filter,
    LogOut,
} from "lucide-react";
import { Link, useForm, usePage, router } from "@inertiajs/react";
import Layout from "@/Layouts/Layout";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

const STATUS_MAP = {
    new_lead: {
        displayName: "New Lead",
        badge: {
            variant: "secondary",
            className: "bg-amber-100 text-amber-800 hover:bg-amber-200",
            icon: <Clock className="h-4 w-4 mr-1" />,
        },
    },
    contacted: {
        displayName: "Contacted",
        badge: {
            variant: "default",
            className: "bg-purple-100 text-purple-800 hover:bg-purple-200",
            icon: <Users className="h-4 w-4 mr-1" />,
        },
    },
    converted: {
        displayName: "Converted",
        badge: {
            variant: "default",
            className: "bg-green-100 text-green-800 hover:bg-green-200",
            icon: <CheckCircle className="h-4 w-4 mr-1" />,
        },
    },
    lost: {
        displayName: "Lost",
        badge: {
            variant: "default",
            className: "bg-red-100 text-red-800 hover:bg-red-200",
            icon: <XCircle className="h-4 w-4 mr-1" />,
        },
    },
};

const Leads = ({ dashboardData }) => {
    const { props } = usePage();
    const { flash } = props;

    const [filteredEnquiries, setFilteredEnquiries] = useState([]);
    const [showCourseCategory, setShowCourseCategory] = useState(false);
    const [filterApplied, setFilterApplied] = useState(false);
    const [isDialogOpen, setIsDialogOpen] = useState(false);
    const [selectedEnrollment, setSelectedEnrollment] = useState(null);
    // Add a separate state to track the pending status change
    const [pendingStatus, setPendingStatus] = useState("");
    const [isProcessing, setIsProcessing] = useState(false);

    // Form for status update
    const statusForm = useForm({
        status: "",
    });

    // Form for creating new enquiry
    const enquiryForm = useForm({
        name: "",
        email: "",
        number: "",
        city: "",
        service_id: "",
        subservice_id: "",
        message: "",
    });

    useEffect(() => {
        if (flash?.message) {
            toast.success(flash.message);
        }
        if (flash?.errors?.message) {
            toast.error(flash.errors.message);
        }
    }, [flash]);

    useEffect(() => {
        if (dashboardData?.enquiries?.length > 0) {
            filterCourseCategoryData();
        }
    }, [dashboardData?.enquiries]);

    const filterCourseCategoryData = () => {
        const courseEnquiries = dashboardData.enquiries.filter(
            (enquiry) =>
                enquiry.addedFor &&
                enquiry.addedFor.toLowerCase().includes("course")
        );
        const reversedData = courseEnquiries.slice().reverse();
        setFilteredEnquiries(reversedData);
        setShowCourseCategory(reversedData.length > 0);
        setFilterApplied(true);
    };

    const getStatusDisplayName = (status) => {
        return STATUS_MAP[status]?.displayName || status;
    };

    const getApiStatusValue = (action) => {
        const actionMap = {
            contacted: "contacted",
            converted: "converted",
            lost: "lost",
        };
        return actionMap[action] || "new_lead";
    };

    // Add a helper function to handle dialog close
    const handleDialogClose = () => {
        setIsDialogOpen(false);
        setSelectedEnrollment(null);
        setPendingStatus("");
        setIsProcessing(false);
        statusForm.clearErrors();
        statusForm.reset();
    };

    const handleStatusChange = (enrollmentId, newStatus) => {
        console.log("Status Change 1", enrollmentId, newStatus);

        // Prevent multiple simultaneous operations
        if (isProcessing) {
            console.log("Already processing, ignoring request");
            return;
        }

        // Reset form first, then set new data
        statusForm.reset();

        setSelectedEnrollment(enrollmentId);
        setPendingStatus(newStatus);

        // Set the new status after reset
        setTimeout(() => {
            statusForm.setData("status", newStatus);
        }, 0);

        setIsDialogOpen(true);
    };

    const confirmStatusChange = (e) => {
        console.log("🔴 confirmStatusChange called", {
            event: e?.type,
            selectedEnrollment,
            pendingStatus,
            isProcessing,
            timestamp: new Date().toISOString(),
        });

        // Prevent any event bubbling or default behavior
        if (e) {
            e.preventDefault();
            e.stopPropagation();
        }

        if (!selectedEnrollment || !pendingStatus || isProcessing) {
            console.log("❌ Blocked execution:", {
                selectedEnrollment,
                pendingStatus,
                isProcessing,
            });
            return;
        }

        console.log("✅ Status Change 2 - Pending Status:", pendingStatus);
        setIsProcessing(true);

        // Make a direct Inertia request without using the form helper
        router.post(
            route("enquiries.updateStatus", selectedEnrollment),
            { status: pendingStatus },
            {
                onSuccess: () => {
                    console.log("✅ Success callback");
                    toast.success(
                        `Status updated to ${getStatusDisplayName(
                            pendingStatus
                        )}`
                    );
                    handleDialogClose();
                },
                onError: (errors) => {
                    console.error("❌ Update error:", errors);
                    toast.error(errors?.status || "Failed to update status");
                    handleDialogClose();
                },
                onFinish: () => {
                    console.log("🏁 Request finished");
                    setIsProcessing(false);
                },
                preserveState: true,
                preserveScroll: true,
            }
        );
    };

    const handleCreateEnquiry = (e) => {
        e.preventDefault();
        enquiryForm.post(route("enquiries.store"), {
            onSuccess: () => {
                enquiryForm.reset();
                toast.success("Enquiry created successfully");
            },
            onError: (errors) => {
                console.error("Error creating enquiry:", errors);
                toast.error("Failed to create enquiry");
            },
        });
    };

    const formatDate = (dateString) => {
        const date = new Date(dateString);
        return date.toLocaleDateString("en-US", {
            year: "numeric",
            month: "numeric",
            day: "numeric",
        });
    };

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
                    <div className="flex items-center gap-4">
                        <h1 className="text-3xl font-bold">
                            Inquiry Dashboard
                        </h1>
                        {filterApplied && (
                            <Badge
                                variant="outline"
                                className="flex items-center gap-1 py-1"
                            >
                                <Filter className="h-3 w-3" />
                                Digital Nawab Inquiries Only
                            </Badge>
                        )}
                    </div>
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
                        <CardTitle>Digital Nawab Inquiries</CardTitle>
                    </CardHeader>
                    <CardContent className="p-0">
                        {filteredEnquiries.length === 0 ? (
                            <div className="p-4 text-center text-gray-500">
                                No course enrollment inquiries found
                            </div>
                        ) : (
                            <Table>
                                <TableHeader>
                                    <TableRow>
                                        <TableHead>Name</TableHead>
                                        <TableHead>Mobile</TableHead>
                                        <TableHead>Email</TableHead>
                                        <TableHead>City</TableHead>
                                        {showCourseCategory && (
                                            <TableHead>
                                                Service Category
                                            </TableHead>
                                        )}
                                        <TableHead>Services</TableHead>
                                        <TableHead>Date</TableHead>
                                        <TableHead>Status</TableHead>
                                        <TableHead>Actions</TableHead>
                                    </TableRow>
                                </TableHeader>
                                <TableBody>
                                    {filteredEnquiries.map((enquiry) => {
                                        const statusInfo =
                                            STATUS_MAP[enquiry.leadStatus] ||
                                            STATUS_MAP.new_lead;
                                        return (
                                            <TableRow key={enquiry._id}>
                                                <TableCell>
                                                    {enquiry.name}
                                                </TableCell>
                                                <TableCell>
                                                    {enquiry.phone}
                                                </TableCell>
                                                <TableCell>
                                                    {enquiry.email}
                                                </TableCell>
                                                <TableCell>
                                                    {enquiry.city || "N/A"}
                                                </TableCell>
                                                {showCourseCategory && (
                                                    <TableCell>
                                                        {enquiry.addedFor}
                                                    </TableCell>
                                                )}
                                                <TableCell>
                                                    {enquiry.enquiryFor
                                                        ? enquiry.enquiryFor
                                                              .title
                                                        : enquiry.course ||
                                                          "N/A"}
                                                </TableCell>
                                                <TableCell>
                                                    {formatDate(
                                                        enquiry.createdAt
                                                    )}
                                                </TableCell>
                                                <TableCell>
                                                    <Badge
                                                        variant={
                                                            statusInfo.badge
                                                                .variant
                                                        }
                                                        className={
                                                            statusInfo.badge
                                                                .className
                                                        }
                                                    >
                                                        <div className="flex items-center">
                                                            {
                                                                statusInfo.badge
                                                                    .icon
                                                            }
                                                            {
                                                                statusInfo.displayName
                                                            }
                                                        </div>
                                                    </Badge>
                                                </TableCell>
                                                <TableCell>
                                                    <DropdownMenu>
                                                        <DropdownMenuTrigger
                                                            asChild
                                                        >
                                                            <Button
                                                                variant="ghost"
                                                                size="sm"
                                                                className="h-8 w-8 p-0"
                                                            >
                                                                <MoreVertical className="h-4 w-4" />
                                                            </Button>
                                                        </DropdownMenuTrigger>

                                                        <DropdownMenuContent align="end">
                                                            <DropdownMenuItem
                                                                className="cursor-pointer"
                                                                onClick={() =>
                                                                    handleStatusChange(
                                                                        enquiry._id,
                                                                        "contacted"
                                                                    )
                                                                }
                                                            >
                                                                Mark as
                                                                Contacted
                                                            </DropdownMenuItem>
                                                            <DropdownMenuItem
                                                                className="cursor-pointer"
                                                                onClick={() =>
                                                                    handleStatusChange(
                                                                        enquiry._id,
                                                                        "converted"
                                                                    )
                                                                }
                                                            >
                                                                Mark as
                                                                Converted
                                                            </DropdownMenuItem>
                                                            <DropdownMenuItem
                                                                className="cursor-pointer"
                                                                onClick={() =>
                                                                    handleStatusChange(
                                                                        enquiry._id,
                                                                        "lost"
                                                                    )
                                                                }
                                                            >
                                                                Mark as Lost
                                                            </DropdownMenuItem>
                                                        </DropdownMenuContent>
                                                    </DropdownMenu>
                                                </TableCell>
                                            </TableRow>
                                        );
                                    })}
                                </TableBody>
                            </Table>
                        )}
                    </CardContent>
                </Card>

                <AlertDialog
                    open={isDialogOpen}
                    onOpenChange={(open) => {
                        if (!open) {
                            handleDialogClose();
                        } else {
                            setIsDialogOpen(open);
                        }
                    }}
                >
                    <AlertDialogContent>
                        <AlertDialogHeader>
                            <AlertDialogTitle>
                                Confirm Status Change
                            </AlertDialogTitle>
                            <AlertDialogDescription>
                                Are you sure you want to mark this lead as{" "}
                                <strong>
                                    {getStatusDisplayName(pendingStatus)}
                                </strong>
                                ?
                            </AlertDialogDescription>
                        </AlertDialogHeader>
                        <AlertDialogFooter>
                            <AlertDialogCancel
                                disabled={isProcessing}
                                onClick={(e) => {
                                    e.preventDefault();
                                    e.stopPropagation();
                                    handleDialogClose();
                                }}
                            >
                                Cancel
                            </AlertDialogCancel>
                            <AlertDialogAction
                                onClick={confirmStatusChange}
                                disabled={isProcessing}
                                type="button"
                            >
                                {isProcessing ? "Updating..." : "Yes, Confirm"}
                            </AlertDialogAction>
                        </AlertDialogFooter>
                    </AlertDialogContent>
                </AlertDialog>
            </div>
        </Layout>
    );
};

export default Leads;

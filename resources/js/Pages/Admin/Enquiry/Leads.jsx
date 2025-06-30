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
    Users,
    BookOpen,
    Calendar,
    DollarSign,
    CheckCircle,
    Clock,
    LogOut,
    AlertTriangle,
    XCircle,
    Filter,
} from "lucide-react";
import Layout from "@/Layouts/Layout";
// import { useNavigate } from "react-router-dom";

// Static data to replace API calls
const staticDashboardData = {
    totalStudents: 120,
    activeCourses: 8,
    revenue: 15400,
    upcomingAppointments: 15,
    enquiries: [
        {
            _id: "1",
            name: "John Doe",
            phone: "+1234567890",
            email: "john.doe@example.com",
            city: "New York",
            addedFor: "Course: Fashion Design",
            enquiryFor: { title: "Advanced Fashion Design" },
            createdAt: "2025-06-01T10:00:00Z",
            leadStatus: "new",
        },
        {
            _id: "2",
            name: "Jane Smith",
            phone: "+1987654321",
            email: "jane.smith@example.com",
            city: "Los Angeles",
            addedFor: "Course: Textile Design",
            enquiryFor: { title: "Textile Design Basics" },
            createdAt: "2025-06-02T14:30:00Z",
            leadStatus: "contacted",
        },
        {
            _id: "3",
            name: "Alice Johnson",
            phone: "+1123456789",
            email: "alice.j@example.com",
            city: "Chicago",
            addedFor: "Course: Fashion Marketing",
            enquiryFor: { title: "Fashion Marketing 101" },
            createdAt: "2025-06-03T09:15:00Z",
            leadStatus: "converted",
        },
        {
            _id: "4",
            name: "Bob Wilson",
            phone: "+1098765432",
            email: "bob.w@example.com",
            city: "Miami",
            addedFor: "Course: Pattern Making",
            enquiryFor: { title: "Pattern Making Fundamentals" },
            createdAt: "2025-06-04T11:45:00Z",
            leadStatus: "lost",
        },
    ],
};

// Status mapping as constants
const STATUS_MAP = {
    new: {
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

// Stats card component for DRY code
const StatCard = ({ icon, title, value, color }) => (
    <Card className="shadow-sm hover:shadow-md transition-shadow">
        <CardContent className="p-6">
            <div className="flex items-center space-x-4">
                <div className={`p-2 bg-${color}-100 rounded-full`}>
                    {React.cloneElement(icon, {
                        className: `h-6 w-6 text-${color}-600`,
                    })}
                </div>
                <div>
                    <p className="text-sm font-medium text-gray-500">{title}</p>
                    <h3 className="text-2xl font-bold">{value}</h3>
                </div>
            </div>
        </CardContent>
    </Card>
);

const Leads = () => {
    //   const navigate = useNavigate();
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState(null);
    const [dashboardData, setDashboardData] = useState({
        totalStudents: 0,
        activeCourses: 0,
        revenue: 0,
        upcomingAppointments: 0,
        enquiries: [],
    });
    const [filteredEnquiries, setFilteredEnquiries] = useState([]);
    const [showCourseCategory, setShowCourseCategory] = useState(false);
    const [filterApplied, setFilterApplied] = useState(false);
    const [isDialogOpen, setIsDialogOpen] = useState(false);
    const [selectedAction, setSelectedAction] = useState(null);
    const [selectedEnrollment, setSelectedEnrollment] = useState(null);
    const [isSubmitting, setIsSubmitting] = useState(false);

    useEffect(() => {
        fetchDashboardData();
    }, []);

    // Filter data once dashboardData is loaded
    useEffect(() => {
        if (dashboardData.enquiries.length > 0) {
            filterCourseCategoryData();
        }
    }, [dashboardData.enquiries]);

    const filterCourseCategoryData = () => {
        // Filter enquiries that have addedFor value related to course categories
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

    const fetchDashboardData = () => {
        setIsLoading(true);
        try {
            // Use static data instead of API call
            setDashboardData(staticDashboardData);
            setError(null);
        } catch (err) {
            console.error("Error loading static data:", err);
            setError("Unable to load dashboard data. Please try again later.");
            toast.error("Failed to load dashboard data");
        } finally {
            setIsLoading(false);
        }
    };

    const handleLogout = () => {
        try {
            localStorage.removeItem("token");
            localStorage.removeItem("user");
            //   navigate("/");
        } catch (error) {
            console.error("Logout error:", error);
        }
    };

    const handleStatusChange = (enrollmentId, newStatus) => {
        setSelectedEnrollment(enrollmentId);
        setSelectedAction(newStatus);
        setIsDialogOpen(true);
    };

    const getStatusDisplayName = (status) => {
        return STATUS_MAP[status]?.displayName || status;
    };

    const getApiStatusValue = (action) => {
        const actionMap = {
            "lead-converted": "converted",
            "lead-lost": "lost",
            "lead-interested": "interested",
            "lead-contacted": "contacted",
        };
        return actionMap[action] || "new";
    };

    const confirmStatusChange = () => {
        setIsSubmitting(true);
        const newApiStatus = getApiStatusValue(selectedAction);

        try {
            // Simulate status update with static data
            const updatedEnquiries = dashboardData.enquiries.map((enquiry) =>
                enquiry._id === selectedEnrollment
                    ? { ...enquiry, leadStatus: newApiStatus }
                    : enquiry
            );

            setDashboardData({
                ...dashboardData,
                enquiries: updatedEnquiries,
            });

            toast.success(
                `Status updated to ${getStatusDisplayName(newApiStatus)}`
            );
        } catch (error) {
            console.error("Error updating enrollment status:", error);
            toast.error("Failed to update status");
        } finally {
            setIsSubmitting(false);
            setIsDialogOpen(false);
            setSelectedEnrollment(null);
            setSelectedAction(null);
        }
    };

    const formatDate = (dateString) => {
        const date = new Date(dateString);
        return date.toLocaleDateString("en-US", {
            year: "numeric",
            month: "short",
            day: "numeric",
        });
    };

    if (isLoading) {
        return (
            <div className="flex items-center justify-center h-screen bg-gray-50">
                <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
            </div>
        );
    }

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
                                Course Inquiries Only
                            </Badge>
                        )}
                    </div>
                    <Button
                        onClick={handleLogout}
                        variant="outline"
                        className="flex items-center gap-2"
                    >
                        <LogOut className="h-4 w-4" />
                        Logout
                    </Button>
                </div>

                {error && (
                    <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-6">
                        <div className="flex items-center">
                            <AlertTriangle className="h-4 w-4 mr-2" />
                            {error}
                        </div>
                    </div>
                )}

                {/* Stats Cards */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
                    <StatCard
                        icon={<Users />}
                        title="Total Students"
                        value={dashboardData.totalStudents}
                        color="blue"
                    />
                    <StatCard
                        icon={<BookOpen />}
                        title="Active Courses"
                        value={dashboardData.activeCourses}
                        color="purple"
                    />
                    <StatCard
                        icon={<DollarSign />}
                        title="Revenue"
                        value={`$${dashboardData.revenue.toLocaleString()}`}
                        color="green"
                    />
                    <StatCard
                        icon={<Calendar />}
                        title="Upcoming Appointments"
                        value={dashboardData.upcomingAppointments}
                        color="amber"
                    />
                </div>

                {/* Enquiry Table */}
                <Card className="shadow-sm">
                    <CardHeader className="bg-gray-50 border-b">
                        <CardTitle>Course Enrollment Inquiries</CardTitle>
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
                                                Course Category
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
                                            STATUS_MAP.new;
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
                                                                size="icon"
                                                            >
                                                                <MoreVertical className="h-4 w-4" />
                                                            </Button>
                                                        </DropdownMenuTrigger>
                                                        <DropdownMenuContent align="end">
                                                            <DropdownMenuItem
                                                                onClick={() =>
                                                                    handleStatusChange(
                                                                        enquiry._id,
                                                                        "lead-contacted"
                                                                    )
                                                                }
                                                            >
                                                                Mark as
                                                                Contacted
                                                            </DropdownMenuItem>
                                                            <DropdownMenuItem
                                                                onClick={() =>
                                                                    handleStatusChange(
                                                                        enquiry._id,
                                                                        "lead-converted"
                                                                    )
                                                                }
                                                            >
                                                                Mark as
                                                                Converted
                                                            </DropdownMenuItem>
                                                            <DropdownMenuItem
                                                                onClick={() =>
                                                                    handleStatusChange(
                                                                        enquiry._id,
                                                                        "lead-lost"
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

                {/* Alert Dialog */}
                <AlertDialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
                    <AlertDialogContent>
                        <AlertDialogHeader>
                            <AlertDialogTitle>
                                Confirm Status Change
                            </AlertDialogTitle>
                            <AlertDialogDescription>
                                Are you sure you want to mark this lead as{" "}
                                <strong>
                                    {getStatusDisplayName(
                                        getApiStatusValue(selectedAction)
                                    )}
                                </strong>
                                ?
                            </AlertDialogDescription>
                        </AlertDialogHeader>
                        <AlertDialogFooter>
                            <AlertDialogCancel disabled={isSubmitting}>
                                Cancel
                            </AlertDialogCancel>
                            <AlertDialogAction
                                onClick={confirmStatusChange}
                                disabled={isSubmitting}
                            >
                                {isSubmitting ? "Updating..." : "Yes, Confirm"}
                            </AlertDialogAction>
                        </AlertDialogFooter>
                    </AlertDialogContent>
                </AlertDialog>
            </div>
        </Layout>
    );
};

export default Leads;

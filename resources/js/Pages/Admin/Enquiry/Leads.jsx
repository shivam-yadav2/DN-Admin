import { useState, useEffect } from "react";
import { useForm, usePage, router } from "@inertiajs/react";
import { Head } from "@inertiajs/react";
import toast, { Toaster } from "react-hot-toast";
import Layout from "@/Layouts/Layout";
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
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";
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
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
    Clock,
    Users,
    CheckCircle,
    XCircle,
    LogOut,
    Settings,
    Plus,
    Filter,
    MoreVertical,
    Phone,
    Mail,
    MapPin,
    Calendar,
    User,
    MessageSquare,
} from "lucide-react";
import { Textarea } from "@/components/ui/textarea";
import { Link } from "@inertiajs/react";

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

const ADDED_BY_OPTIONS = ["User", "Ujjwal Porwal", "Sharad Verma", "Punit Shukla"];
const SOURCE_OPTIONS = ["Website", "Call", "WhatsApp"];

export default function Leads({ dashboardData }) {
    const { flash } = usePage().props;
    const { enquiries, services } = dashboardData;
    console.log(dashboardData)

    const [filteredEnquiries, setFilteredEnquiries] = useState(enquiries);
    const [isDialogOpen, setIsDialogOpen] = useState(false);
    const [selectedEnrollment, setSelectedEnrollment] = useState(null);
    const [subServices, setSubServices] = useState([]);
    const [pendingStatus, setPendingStatus] = useState("");
    const [isProcessing, setIsProcessing] = useState(false);
    const [showCreateForm, setShowCreateForm] = useState(false);
    
    // Simplified filters - only name, addedBy, and source
    const [filters, setFilters] = useState({
        name: "",
        addedBy: "all",
        source: "all",
    });

    // Form for creating new enquiry with default addedBy as "User"
    const { data, setData, post, processing, errors, reset } = useForm({
        name: "",
        email: "",
        number: "",
        city: "",
        service_id: "",
        subservice_id: "",
        message: "",
        addedBy: "User", // Default value
        source: "",
    });

    // Form for status update
    const statusForm = useForm({ status: "" });

    // Update subservices when service changes
    useEffect(() => {
        if (data.service_id) {
            const selectedService = services.find(s => s.id == data.service_id);
            setSubServices(selectedService ? selectedService.subservices : []);
            setData('subservice_id', ''); // Reset subservice when service changes
        } else {
            setSubServices([]);
        }
    }, [data.service_id, services]);

    // Handle flash messages
    useEffect(() => {
        if (flash?.success) {
            toast.success(flash.success);
        }
        if (flash?.error) {
            toast.error(flash.error);
        }
    }, [flash]);

    // Filter enquiries based on simplified filters
    useEffect(() => {
        const filtered = enquiries.filter((enquiry) => {
            const matchesName = enquiry.name
                .toLowerCase()
                .includes(filters.name.toLowerCase());
            const matchesAddedBy =
                filters.addedBy !== "all"
                    ? enquiry.addedBy === filters.addedBy
                    : true;
            const matchesSource =
                filters.source !== "all"
                    ? enquiry.source === filters.source
                    : true;

            return matchesName && matchesAddedBy && matchesSource;
        });
        setFilteredEnquiries(filtered);
    }, [filters, enquiries]);

    const handleCreateEnquiry = (e) => {
        e.preventDefault();
        post(route("enquiries.store"), {
            onSuccess: () => {
                reset();
                setData('addedBy', 'User'); // Reset to default
                setShowCreateForm(false);
                toast.success("Enquiry created successfully");
            },
            onError: (errors) => {
                toast.error("Failed to create enquiry");
            },
        });
    };

    const handleStatusChange = (enrollmentId, newStatus) => {
        if (isProcessing) return;
        statusForm.reset();
        setSelectedEnrollment(enrollmentId);
        setPendingStatus(newStatus);
        setTimeout(() => statusForm.setData("status", newStatus), 0);
        setIsDialogOpen(true);
    };

    const confirmStatusChange = (e) => {
        e.preventDefault();
        if (!selectedEnrollment || !pendingStatus || isProcessing) return;
        setIsProcessing(true);

        router.post(
            route("enquiries.updateStatus", selectedEnrollment),
            { status: pendingStatus },
            {
                onSuccess: () => {
                    toast.success(
                        `Status updated to ${STATUS_MAP[pendingStatus]?.displayName}`
                    );
                    handleDialogClose();
                },
                onError: (errors) => {
                    toast.error(errors?.status || "Failed to update status");
                    handleDialogClose();
                },
                onFinish: () => setIsProcessing(false),
                preserveState: true,
                preserveScroll: true,
            }
        );
    };

    const handleDelete = (id) => {
        if (confirm("Are you sure you want to delete this enquiry?")) {
            router.delete(route("enquiries.destroy", id), {
                onSuccess: () => toast.success("Enquiry deleted successfully"),
                onError: () => toast.error("Failed to delete enquiry"),
            });
        }
    };

    const handleDialogClose = () => {
        setIsDialogOpen(false);
        setSelectedEnrollment(null);
        setPendingStatus("");
        setIsProcessing(false);
        statusForm.reset();
    };

    const formatDate = (dateString) => {
        return new Date(dateString).toLocaleDateString("en-US", {
            year: "numeric",
            month: "short",
            day: "numeric",
        });
    };

    const clearFilters = () => {
        setFilters({
            name: "",
            addedBy: "all",
            source: "all",
        });
    };

    return (
        <Layout>
            <Head title="Enquiry Dashboard" />
            <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50">
                <Toaster position="top-right" toastOptions={{ duration: 3000 }} />

                {/* Header */}
                <div className="bg-white shadow-sm border-b border-gray-200">
                    <div className="max-w-7xl mx-auto px-6 py-4">
                        <div className="flex justify-between items-center">
                            <div>
                                <h1 className="text-3xl font-bold text-gray-900">
                                    Enquiry Dashboard
                                </h1>
                                <p className="text-gray-600 mt-1">
                                    Manage and track customer enquiries
                                </p>
                            </div>
                            <div className="flex items-center gap-4">
                                <Button
                                    onClick={() => setShowCreateForm(!showCreateForm)}
                                    className="bg-blue-600 hover:bg-blue-700 text-white"
                                >
                                    <Plus className="h-4 w-4 mr-2" />
                                    Add Enquiry
                                </Button>
                                <Link
                                    href="/logout"
                                    method="post"
                                    as="button"
                                    className="flex items-center gap-2 text-gray-600 hover:text-gray-800 px-4 py-2 rounded-lg hover:bg-gray-100 transition-colors"
                                >
                                    <LogOut className="h-4 w-4" />
                                    Logout
                                </Link>
                            </div>
                        </div>
                    </div>
                </div>

                <div className="max-w-7xl mx-auto px-6 py-8">
                    {/* Stats Cards */}
                    <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
                        <Card className="border-l-4 border-l-blue-500">
                            <CardContent className="p-6">
                                <div className="flex items-center justify-between">
                                    <div>
                                        <p className="text-sm font-medium text-gray-600">Total Enquiries</p>
                                        <p className="text-3xl font-bold text-gray-900">{enquiries.length}</p>
                                    </div>
                                    <Users className="h-8 w-8 text-blue-500" />
                                </div>
                            </CardContent>
                        </Card>
                        <Card className="border-l-4 border-l-green-500">
                            <CardContent className="p-6">
                                <div className="flex items-center justify-between">
                                    <div>
                                        <p className="text-sm font-medium text-gray-600">Converted</p>
                                        <p className="text-3xl font-bold text-gray-900">
                                            {enquiries.filter(e => e.leadStatus === 'converted').length}
                                        </p>
                                    </div>
                                    <CheckCircle className="h-8 w-8 text-green-500" />
                                </div>
                            </CardContent>
                        </Card>
                        <Card className="border-l-4 border-l-purple-500">
                            <CardContent className="p-6">
                                <div className="flex items-center justify-between">
                                    <div>
                                        <p className="text-sm font-medium text-gray-600">Contacted</p>
                                        <p className="text-3xl font-bold text-gray-900">
                                            {enquiries.filter(e => e.leadStatus === 'contacted').length}
                                        </p>
                                    </div>
                                    <Phone className="h-8 w-8 text-purple-500" />
                                </div>
                            </CardContent>
                        </Card>
                        <Card className="border-l-4 border-l-amber-500">
                            <CardContent className="p-6">
                                <div className="flex items-center justify-between">
                                    <div>
                                        <p className="text-sm font-medium text-gray-600">New Leads</p>
                                        <p className="text-3xl font-bold text-gray-900">
                                            {enquiries.filter(e => e.leadStatus === 'new_lead' || !e.leadStatus).length}
                                        </p>
                                    </div>
                                    <Clock className="h-8 w-8 text-amber-500" />
                                </div>
                            </CardContent>
                        </Card>
                    </div>

                    {/* Create Enquiry Form */}
                    {showCreateForm && (
                        <Card className="mb-8 shadow-lg border border-blue-200">
                            <CardHeader className="bg-blue-50">
                                <CardTitle className="text-xl text-blue-700 flex items-center">
                                    <Plus className="h-5 w-5 mr-2" />
                                    Add New Enquiry
                                </CardTitle>
                            </CardHeader>
                            <CardContent className="p-6">
                                <form onSubmit={handleCreateEnquiry} className="space-y-6">
                                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                                        {/* Name */}
                                        <div>
                                            <Label htmlFor="name" className="text-sm font-medium text-gray-700 flex items-center mb-2">
                                                <User className="h-4 w-4 mr-1" />
                                                Name *
                                            </Label>
                                            <Input
                                                id="name"
                                                value={data.name}
                                                onChange={(e) => setData("name", e.target.value)}
                                                className="border-gray-300 focus:ring-blue-500 focus:border-blue-500"
                                                placeholder="Enter full name"
                                                required
                                            />
                                            {errors.name && (
                                                <p className="text-red-500 text-xs mt-1">{errors.name}</p>
                                            )}
                                        </div>

                                        {/* Email */}
                                        <div>
                                            <Label htmlFor="email" className="text-sm font-medium text-gray-700 flex items-center mb-2">
                                                <Mail className="h-4 w-4 mr-1" />
                                                Email *
                                            </Label>
                                            <Input
                                                id="email"
                                                type="email"
                                                value={data.email}
                                                onChange={(e) => setData("email", e.target.value)}
                                                className="border-gray-300 focus:ring-blue-500 focus:border-blue-500"
                                                placeholder="Enter email address"
                                                required
                                            />
                                            {errors.email && (
                                                <p className="text-red-500 text-xs mt-1">{errors.email}</p>
                                            )}
                                        </div>

                                        {/* Phone */}
                                        <div>
                                            <Label htmlFor="number" className="text-sm font-medium text-gray-700 flex items-center mb-2">
                                                <Phone className="h-4 w-4 mr-1" />
                                                Phone *
                                            </Label>
                                            <Input
                                                id="number"
                                                value={data.number}
                                                onChange={(e) => setData("number", e.target.value)}
                                                className="border-gray-300 focus:ring-blue-500 focus:border-blue-500"
                                                placeholder="Enter phone number"
                                                required
                                            />
                                            {errors.number && (
                                                <p className="text-red-500 text-xs mt-1">{errors.number}</p>
                                            )}
                                        </div>

                                        {/* City */}
                                        <div>
                                            <Label htmlFor="city" className="text-sm font-medium text-gray-700 flex items-center mb-2">
                                                <MapPin className="h-4 w-4 mr-1" />
                                                City *
                                            </Label>
                                            <Input
                                                id="city"
                                                value={data.city}
                                                onChange={(e) => setData("city", e.target.value)}
                                                className="border-gray-300 focus:ring-blue-500 focus:border-blue-500"
                                                placeholder="Enter city"
                                                required
                                            />
                                            {errors.city && (
                                                <p className="text-red-500 text-xs mt-1">{errors.city}</p>
                                            )}
                                        </div>

                                        {/* Service */}
                                        <div>
                                            <Label className="text-sm font-medium text-gray-700 flex items-center mb-2">
                                                <Settings className="h-4 w-4 mr-1" />
                                                Service Category *
                                            </Label>
                                            <Select
                                                value={data.service_id}
                                                onValueChange={(value) => setData("service_id", value)}
                                            >
                                                <SelectTrigger className="border-gray-300 focus:ring-blue-500 focus:border-blue-500">
                                                    <SelectValue placeholder="Select service category" />
                                                </SelectTrigger>
                                                <SelectContent>
                                                    {services?.map((service) => (
                                                        <SelectItem key={service.id} value={service.id.toString()}>
                                                            {service.name}
                                                        </SelectItem>
                                                    ))}
                                                </SelectContent>
                                            </Select>
                                            {errors.service_id && (
                                                <p className="text-red-500 text-xs mt-1">{errors.service_id}</p>
                                            )}
                                        </div>

                                        {/* Subservice */}
                                        <div>
                                            <Label className="text-sm font-medium text-gray-700 flex items-center mb-2">
                                                <Settings className="h-4 w-4 mr-1" />
                                                Specific Service *
                                            </Label>
                                            <Select
                                                value={data.subservice_id}
                                                onValueChange={(value) => setData("subservice_id", value)}
                                                disabled={!subServices.length}
                                            >
                                                <SelectTrigger className="border-gray-300 focus:ring-blue-500 focus:border-blue-500">
                                                    <SelectValue placeholder="Select specific service" />
                                                </SelectTrigger>
                                                <SelectContent>
                                                    {subServices.map((subService) => (
                                                        <SelectItem key={subService.id} value={subService.id.toString()}>
                                                            {subService.name}
                                                        </SelectItem>
                                                    ))}
                                                </SelectContent>
                                            </Select>
                                            {errors.subservice_id && (
                                                <p className="text-red-500 text-xs mt-1">{errors.subservice_id}</p>
                                            )}
                                        </div>

                                        {/* Added By - Default to User */}
                                        <div>
                                            <Label className="text-sm font-medium text-gray-700 flex items-center mb-2">
                                                <User className="h-4 w-4 mr-1" />
                                                Added By
                                            </Label>
                                            <Select
                                                value={data.addedBy}
                                                onValueChange={(value) => setData("addedBy", value)}
                                            >
                                                <SelectTrigger className="border-gray-300 focus:ring-blue-500 focus:border-blue-500">
                                                    <SelectValue />
                                                </SelectTrigger>
                                                <SelectContent>
                                                    {ADDED_BY_OPTIONS.map((option) => (
                                                        <SelectItem key={option} value={option}>
                                                            {option}
                                                        </SelectItem>
                                                    ))}
                                                </SelectContent>
                                            </Select>
                                            {errors.addedBy && (
                                                <p className="text-red-500 text-xs mt-1">{errors.addedBy}</p>
                                            )}
                                        </div>

                                        {/* Source */}
                                        <div>
                                            <Label className="text-sm font-medium text-gray-700 flex items-center mb-2">
                                                <Settings className="h-4 w-4 mr-1" />
                                                Source
                                            </Label>
                                            <Select
                                                value={data.source}
                                                onValueChange={(value) => setData("source", value)}
                                            >
                                                <SelectTrigger className="border-gray-300 focus:ring-blue-500 focus:border-blue-500">
                                                    <SelectValue placeholder="Select source" />
                                                </SelectTrigger>
                                                <SelectContent>
                                                    {SOURCE_OPTIONS.map((option) => (
                                                        <SelectItem key={option} value={option}>
                                                            {option}
                                                        </SelectItem>
                                                    ))}
                                                </SelectContent>
                                            </Select>
                                            {errors.source && (
                                                <p className="text-red-500 text-xs mt-1">{errors.source}</p>
                                            )}
                                        </div>
                                    </div>

                                    {/* Message */}
                                    <div>
                                        <Label htmlFor="message" className="text-sm font-medium text-gray-700 flex items-center mb-2">
                                            <MessageSquare className="h-4 w-4 mr-1" />
                                            Message
                                        </Label>
                                        <Textarea
                                            id="message"
                                            value={data.message}
                                            onChange={(e) => setData("message", e.target.value)}
                                            className="border-gray-300 focus:ring-blue-500 focus:border-blue-500"
                                            placeholder="Enter additional message (optional)"
                                            rows={3}
                                        />
                                        {errors.message && (
                                            <p className="text-red-500 text-xs mt-1">{errors.message}</p>
                                        )}
                                    </div>

                                    <div className="flex justify-end gap-3">
                                        <Button
                                            type="button"
                                            variant="outline"
                                            onClick={() => setShowCreateForm(false)}
                                        >
                                            Cancel
                                        </Button>
                                        <Button
                                            type="submit"
                                            disabled={processing}
                                            className="bg-blue-600 hover:bg-blue-700"
                                        >
                                            {processing ? "Creating..." : "Create Enquiry"}
                                        </Button>
                                    </div>
                                </form>
                            </CardContent>
                        </Card>
                    )}

                    {/* Filter Panel */}
                    <Card className="mb-8 border border-gray-200">
                        <CardHeader className="bg-gray-50">
                            <CardTitle className="text-lg text-gray-700 flex items-center">
                                <Filter className="h-5 w-5 mr-2" />
                                Filter Enquiries
                            </CardTitle>
                        </CardHeader>
                        <CardContent className="p-6">
                            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                                {/* Name Filter */}
                                <div>
                                    <Label htmlFor="filter_name" className="text-sm font-medium text-gray-700 mb-2 block">
                                        Search by Name
                                    </Label>
                                    <Input
                                        id="filter_name"
                                        value={filters.name}
                                        onChange={(e) => setFilters({ ...filters, name: e.target.value })}
                                        className="border-gray-300 focus:ring-blue-500 focus:border-blue-500"
                                        placeholder="Enter name to search..."
                                    />
                                </div>

                                {/* Added By Filter */}
                                <div>
                                    <Label className="text-sm font-medium text-gray-700 mb-2 block">
                                        Added By
                                    </Label>
                                    <Select
                                        value={filters.addedBy}
                                        onValueChange={(value) => setFilters({ ...filters, addedBy: value })}
                                    >
                                        <SelectTrigger className="border-gray-300 focus:ring-blue-500 focus:border-blue-500">
                                            <SelectValue />
                                        </SelectTrigger>
                                        <SelectContent>
                                            <SelectItem value="all">All Users</SelectItem>
                                            {ADDED_BY_OPTIONS.map((option) => (
                                                <SelectItem key={option} value={option}>
                                                    {option}
                                                </SelectItem>
                                            ))}
                                        </SelectContent>
                                    </Select>
                                </div>

                                {/* Source Filter */}
                                <div>
                                    <Label className="text-sm font-medium text-gray-700 mb-2 block">
                                        Source
                                    </Label>
                                    <Select
                                        value={filters.source}
                                        onValueChange={(value) => setFilters({ ...filters, source: value })}
                                    >
                                        <SelectTrigger className="border-gray-300 focus:ring-blue-500 focus:border-blue-500">
                                            <SelectValue />
                                        </SelectTrigger>
                                        <SelectContent>
                                            <SelectItem value="all">All Sources</SelectItem>
                                            {SOURCE_OPTIONS.map((option) => (
                                                <SelectItem key={option} value={option}>
                                                    {option}
                                                </SelectItem>
                                            ))}
                                        </SelectContent>
                                    </Select>
                                </div>

                                {/* Clear Filters */}
                                <div className="flex items-end">
                                    <Button
                                        type="button"
                                        variant="outline"
                                        onClick={clearFilters}
                                        className="w-full"
                                    >
                                        Clear Filters
                                    </Button>
                                </div>
                            </div>
                        </CardContent>
                    </Card>

                    {/* Enquiries Table */}
                    <Card className="shadow-lg border border-gray-200">
                        <CardHeader className="bg-gray-50">
                            <CardTitle className="text-lg text-gray-700">
                                Enquiries ({filteredEnquiries.length})
                            </CardTitle>
                        </CardHeader>
                        <CardContent className="p-0">
                            {filteredEnquiries.length === 0 ? (
                                <div className="p-12 text-center">
                                    <Users className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                                    <p className="text-gray-500 text-lg">No enquiries found</p>
                                    <p className="text-gray-400 text-sm">Try adjusting your filters</p>
                                </div>
                            ) : (
                                <div className="overflow-x-auto">
                                    <Table>
                                        <TableHeader>
                                            <TableRow className="bg-gray-50">
                                                <TableHead className="font-semibold">Customer</TableHead>
                                                <TableHead className="font-semibold">Contact</TableHead>
                                                <TableHead className="font-semibold">Service</TableHead>
                                                <TableHead className="font-semibold">Details</TableHead>
                                                <TableHead className="font-semibold">Status</TableHead>
                                                <TableHead className="font-semibold text-center">Actions</TableHead>
                                            </TableRow>
                                        </TableHeader>
                                        <TableBody>
                                            {filteredEnquiries.map((enquiry) => {
                                                const statusInfo = STATUS_MAP[enquiry.leadStatus] || STATUS_MAP.new_lead;
                                                return (
                                                    <TableRow key={enquiry._id} className="hover:bg-gray-50">
                                                        <TableCell>
                                                            <div>
                                                                <div className="font-medium text-gray-900">{enquiry.name}</div>
                                                                <div className="text-sm text-gray-500 flex items-center">
                                                                    <MapPin className="h-3 w-3 mr-1" />
                                                                    {enquiry.city || "N/A"}
                                                                </div>
                                                            </div>
                                                        </TableCell>
                                                        <TableCell>
                                                            <div className="space-y-1">
                                                                <div className="flex items-center text-sm text-gray-900">
                                                                    <Phone className="h-3 w-3 mr-2 text-gray-400" />
                                                                    {enquiry.phone}
                                                                </div>
                                                                <div className="flex items-center text-sm text-gray-600">
                                                                    <Mail className="h-3 w-3 mr-2 text-gray-400" />
                                                                    {enquiry.email}
                                                                </div>
                                                            </div>
                                                        </TableCell>
                                                        <TableCell>
                                                            <div>
                                                                <div className="font-medium text-sm text-gray-900">
                                                                    {enquiry.addedFor}
                                                                </div>
                                                                <div className="text-xs text-gray-500">
                                                                    {enquiry.enquiryFor.title}
                                                                </div>
                                                            </div>
                                                        </TableCell>
                                                        <TableCell>
                                                            <div className="space-y-1">
                                                                <div className="flex items-center text-sm">
                                                                    <User className="h-3 w-3 mr-1 text-gray-400" />
                                                                    <span className="text-gray-600">By:</span>
                                                                    <span className="ml-1 font-medium">{enquiry.addedBy}</span>
                                                                </div>
                                                                <div className="flex items-center text-sm">
                                                                    <Settings className="h-3 w-3 mr-1 text-gray-400" />
                                                                    <span className="text-gray-600">Via:</span>
                                                                    <span className="ml-1">{enquiry.source}</span>
                                                                </div>
                                                                <div className="flex items-center text-xs text-gray-500">
                                                                    <Calendar className="h-3 w-3 mr-1" />
                                                                    {formatDate(enquiry.createdAt)}
                                                                </div>
                                                            </div>
                                                        </TableCell>
                                                        <TableCell>
                                                            <Badge
                                                                variant={statusInfo.badge.variant}
                                                                className={`${statusInfo.badge.className} flex items-center w-fit`}
                                                            >
                                                                {statusInfo.badge.icon}
                                                                {statusInfo.displayName}
                                                            </Badge>
                                                        </TableCell>
                                                        <TableCell className="text-center">
                                                            <DropdownMenu>
                                                                <DropdownMenuTrigger asChild>
                                                                    <Button
                                                                        variant="ghost"
                                                                        size="sm"
                                                                        className="h-8 w-8 p-0 hover:bg-gray-100"
                                                                    >
                                                                        <MoreVertical className="h-4 w-4" />
                                                                    </Button>
                                                                </DropdownMenuTrigger>
                                                                <DropdownMenuContent align="end" className="w-48">
                                                                    <DropdownMenuItem
                                                                        className="cursor-pointer text-purple-600 hover:text-purple-700 hover:bg-purple-50"
                                                                        onClick={() => handleStatusChange(enquiry._id, "contacted")}
                                                                    >
                                                                        <Users className="h-4 w-4 mr-2" />
                                                                        Mark as Contacted
                                                                    </DropdownMenuItem>
                                                                    <DropdownMenuItem
                                                                        className="cursor-pointer text-green-600 hover:text-green-700 hover:bg-green-50"
                                                                        onClick={() => handleStatusChange(enquiry._id, "converted")}
                                                                    >
                                                                        <CheckCircle className="h-4 w-4 mr-2" />
                                                                        Mark as Converted
                                                                    </DropdownMenuItem>
                                                                    <DropdownMenuItem
                                                                        className="cursor-pointer text-red-600 hover:text-red-700 hover:bg-red-50"
                                                                        onClick={() => handleStatusChange(enquiry._id, "lost")}
                                                                    >
                                                                        <XCircle className="h-4 w-4 mr-2" />
                                                                        Mark as Lost
                                                                    </DropdownMenuItem>
                                                                    <DropdownMenuItem
                                                                        className="cursor-pointer text-red-600 hover:text-red-700 hover:bg-red-50"
                                                                        onClick={() => handleDelete(enquiry._id)}
                                                                    >
                                                                        <XCircle className="h-4 w-4 mr-2" />
                                                                        Delete Enquiry
                                                                    </DropdownMenuItem>
                                                                </DropdownMenuContent>
                                                            </DropdownMenu>
                                                        </TableCell>
                                                    </TableRow>
                                                );
                                            })}
                                        </TableBody>
                                    </Table>
                                </div>
                            )}
                        </CardContent>
                    </Card>
                </div>

                {/* Status Change Confirmation Dialog */}
                <AlertDialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
                    <AlertDialogContent className="sm:max-w-md">
                        <AlertDialogHeader>
                            <AlertDialogTitle className="flex items-center">
                                {STATUS_MAP[pendingStatus]?.badge.icon}
                                <span className="ml-2">Confirm Status Change</span>
                            </AlertDialogTitle>
                            <AlertDialogDescription className="text-gray-600">
                                Are you sure you want to mark this enquiry as{" "}
                                <strong className="text-gray-900">
                                    {STATUS_MAP[pendingStatus]?.displayName}
                                </strong>
                                ? This action will update the enquiry status.
                            </AlertDialogDescription>
                        </AlertDialogHeader>
                        <AlertDialogFooter>
                            <AlertDialogCancel
                                disabled={isProcessing}
                                onClick={handleDialogClose}
                                className="hover:bg-gray-100"
                            >
                                Cancel
                            </AlertDialogCancel>
                            <AlertDialogAction
                                onClick={confirmStatusChange}
                                disabled={isProcessing}
                                type="button"
                                className="bg-blue-600 hover:bg-blue-700 text-white"
                            >
                                {isProcessing ? (
                                    <>
                                        <Clock className="h-4 w-4 mr-2 animate-spin" />
                                        Updating...
                                    </>
                                ) : (
                                    <>
                                        <CheckCircle className="h-4 w-4 mr-2" />
                                        Confirm Change
                                    </>
                                )}
                            </AlertDialogAction>
                        </AlertDialogFooter>
                    </AlertDialogContent>
                </AlertDialog>
            </div>
        </Layout>
    );
}
import React, { useState } from "react";
import { Link, useForm, usePage } from "@inertiajs/react"; // Add useForm and usePage
import { Button } from "@/components/ui/button";
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table";
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogFooter,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
    Plus,
    Edit3,
    Trash2,
    Eye,
    EyeOff,
    Image,
    ArrowLeft,
    Settings,
} from "lucide-react";
import Layout from "@/Layouts/Layout";

const Services = ({ services }) => {
    console.log(services); // Debug to verify data

    // Form for adding a service
    const { flash } = usePage().props; // Access flash messages
    const page = usePage();
    const { data, setData, post, errors, reset } = useForm({
        name: "",
        description: "",
        image: null,
    });

    console.log(page);

    const subServiceForm = useForm({
        name: "",
        description: "",
        image: null,
        service_id: null,
    });

    console.log(subServiceForm);

    const updateForm = useForm({
        name: "",
        description: "",
        images: null,
    });

    const deleteForm = useForm({});

    // State for modals
    const [selectedService, setSelectedService] = useState(null);
    const [isUpdateModalOpen, setIsUpdateModalOpen] = useState(false);
    const [isAddModalOpen, setIsAddModalOpen] = useState(false);
    const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
    const [isImageModalOpen, setIsImageModalOpen] = useState(false);
    const [isAddSubServiceModalOpen, setIsAddSubServiceModalOpen] =
        useState(false);
    const [isDeleteSubServiceModalOpen, setIsDeleteSubServiceModalOpen] =
        useState(false);
    const [selectedImage, setSelectedImage] = useState("");
    const [serviceToDelete, setServiceToDelete] = useState(null);
    const [subServiceToDelete, setSubServiceToDelete] = useState(null);

    const [serviceFormData, setServiceFormData] = useState({
        title: "",
        description: "",
    });

    const [currentServiceId, setCurrentServiceId] = useState(null);
    const [expandedServiceId, setExpandedServiceId] = useState(null);

    // Handle add service form submission
    const handleAddService = (e) => {
        e.preventDefault();
        post(route("services.store"), {
            onSuccess: () => {
                setIsAddModalOpen(false);
                reset(); // Clear form
            },
            preserveState: true, // Preserve form state on validation errors
        });
    };

    // Handle update modal
    const openUpdateModal = (service) => {
        setSelectedService(service);
        setServiceFormData({
            title: service.name, // Changed to match controller
            description: service.description,
            images: service.image,
        });
        setIsUpdateModalOpen(true);
    };

    const handleUpdate = () => {
        // Update logic (not implemented yet, requires a controller method)
        setIsUpdateModalOpen(false);
        setSelectedService(null);
        setServiceFormData({ title: "", description: "", images: null });
    };

    // Handle add sub-service
    const openAddSubServiceModal = (serviceId) => {
        setCurrentServiceId(serviceId);
        subServiceForm.setData({
            name: "",
            description: "",
            image: null,
            service_id: serviceId,
        });
        setIsAddSubServiceModalOpen(true);
        console.log(subServiceForm);
    };

    const handleAddSubService = (e) => {
        e.preventDefault();
        subServiceForm.post(route("subservices.store"), {
            onSuccess: () => {
                setIsAddSubServiceModalOpen(false);
                subServiceForm.reset();
                setCurrentServiceId(null);
            },
            preserveState: true,
        });
    };

    // Handle delete confirmation (service)
    const confirmDelete = (service) => {
        setServiceToDelete(service);
        setIsDeleteModalOpen(true);
    };

    const handleDelete = () => {
        // Delete logic (not implemented yet, requires a controller method)
        setIsDeleteModalOpen(false);
        setServiceToDelete(null);
    };

    // Handle delete sub-service
    const confirmDeleteSubService = (serviceId, subService) => {
        setCurrentServiceId(serviceId);
        setSubServiceToDelete(subService);
        setIsDeleteSubServiceModalOpen(true);
    };

    const handleDeleteSubService = () => {
        // Delete sub-service logic (not implemented yet, requires a controller method)
        setIsDeleteSubServiceModalOpen(false);
        setSubServiceToDelete(null);
        setCurrentServiceId(null);
    };

    // Handle image popup
    const openImageModal = (image) => {
        setSelectedImage(image);
        setIsImageModalOpen(true);
    };

    // Toggle sub-services
    const toggleSubServices = (serviceId) => {
        setExpandedServiceId(
            expandedServiceId === serviceId ? null : serviceId
        );
    };

    return (
        <Layout>
            <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50">
                <div className="max-w-7xl mx-auto p-6 lg:p-8">
                    {/* Header Section */}
                    <div className="bg-white rounded-2xl shadow-lg border border-gray-100 p-8 mb-8">
                        <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-6">
                            <div className="flex items-center gap-4">
                                <div className="p-3 bg-gradient-to-r from-blue-500 to-indigo-600 rounded-xl text-white">
                                    <Settings className="w-8 h-8" />
                                </div>
                                <div>
                                    <h1 className="text-4xl font-bold bg-gradient-to-r from-gray-800 to-gray-600 bg-clip-text text-transparent">
                                        Manage Services
                                    </h1>
                                    <p className="text-gray-600 mt-1">
                                        Create and manage your service offerings
                                    </p>
                                </div>
                            </div>
                            <div className="flex flex-col sm:flex-row gap-3">
                                <Button
                                    onClick={() => setIsAddModalOpen(true)}
                                    className="bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-105"
                                    size="lg"
                                >
                                    <Plus className="w-5 h-5 mr-2" />
                                    Add Service
                                </Button>
                                <Link href={"/"}>
                                    <Button
                                        variant="outline"
                                        className="border-2 border-gray-300 hover:border-blue-500 hover:bg-blue-50 transition-all duration-300"
                                        size="lg"
                                    >
                                        <ArrowLeft className="w-5 h-5 mr-2" />
                                        Back to Dashboard
                                    </Button>
                                </Link>
                            </div>
                        </div>
                    </div>

                    {/* Success Message */}
                    {flash?.message && (
                        <div
                            className="mb-6 p-4██████
System: 4 bg-green-100 text-green-800 rounded-lg"
                        >
                            {flash.message}
                        </div>
                    )}

                    {/* Services Table */}
                    <div className="bg-white rounded-2xl shadow-xl border border-gray-100 overflow-hidden">
                        <div className="bg-gradient-to-r from-gray-50 to-blue-50 px-8 py-6 border-b border-gray-200">
                            <h2 className="text-2xl font-semibold text-gray-800">
                                Services Overview
                            </h2>
                            <p className="text-gray-600 mt-1">
                                Manage all your services and their
                                sub-categories
                            </p>
                        </div>

                        <div className="overflow-x-auto">
                            <Table>
                                <TableHeader>
                                    <TableRow className="bg-gray-50/50 hover:bg-gray-50">
                                        <TableHead className="font-semibold text-gray-700 py-4">
                                            Service Title
                                        </TableHead>
                                        <TableHead className="font-semibold text-gray-700 py-4">
                                            Description
                                        </TableHead>
                                        <TableHead className="font-semibold text-gray-700 py-4">
                                            Image Preview
                                        </TableHead>
                                        <TableHead className="font-semibold text-gray-700 py-4 text-center">
                                            Actions
                                        </TableHead>
                                    </TableRow>
                                </TableHeader>
                                <TableBody>
                                    {services.map((service, index) => (
                                        <React.Fragment key={service.id}>
                                            <TableRow
                                                className={`transition-all duration-200 hover:bg-blue-50/50 ${
                                                    index % 2 === 0
                                                        ? "bg-white"
                                                        : "bg-gray-50/30"
                                                }`}
                                            >
                                                <TableCell className="py-6">
                                                    <div className="font-semibold text-gray-800 text-lg">
                                                        {service.name}
                                                    </div>
                                                </TableCell>
                                                <TableCell className="py-6">
                                                    <div className="text-gray-600 max-w-xs">
                                                        {service.description}
                                                    </div>
                                                </TableCell>
                                                <TableCell className="py-6">
                                                    <button
                                                        onClick={() =>
                                                            openImageModal(
                                                                service.image
                                                            )
                                                        }
                                                        className="group relative overflow-hidden rounded-xl shadow-md hover:shadow-lg transition-all duration-300 transform hover:scale-105"
                                                    >
                                                        <img
                                                            src={service.image}
                                                            alt={service.name}
                                                            className="h-16 w-16 object-cover"
                                                        />
                                                        <div className="absolute inset-0 bg-black/20 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center">
                                                            <Image className="w-6 h-6 text-white" />
                                                        </div>
                                                    </button>
                                                </TableCell>
                                                <TableCell className="py-6">
                                                    <div className="flex items-center justify-center gap-2 flex-wrap">
                                                        <Button
                                                            variant="outline"
                                                            size="sm"
                                                            onClick={() =>
                                                                openUpdateModal(
                                                                    service
                                                                )
                                                            }
                                                            className="bg-green-50 border-green-200 text-green-700 hover:bg-green-100 hover:border-green-300 transition-all duration-200"
                                                        >
                                                            <Edit3 className="w-4 h-4 mr-1" />
                                                            Edit
                                                        </Button>
                                                        <Button
                                                            variant="outline"
                                                            size="sm"
                                                            onClick={() =>
                                                                confirmDelete(
                                                                    service
                                                                )
                                                            }
                                                            className="bg-red-50 border-red-200 text-red-700 hover:bg-red-100 hover:border-red-300 transition-all duration-200"
                                                        >
                                                            <Trash2 className="w-4 h-4 mr-1" />
                                                            Delete
                                                        </Button>
                                                        <Button
                                                            variant="outline"
                                                            size="sm"
                                                            onClick={() =>
                                                                toggleSubServices(
                                                                    service.id
                                                                )
                                                            }
                                                            className="bg-blue-50 border-blue-200 text-blue-700 hover:bg-blue-100 hover:border-blue-300 transition-all duration-200"
                                                        >
                                                            {expandedServiceId ===
                                                            service.id ? (
                                                                <>
                                                                    <EyeOff className="w-4 h-4 mr-1" />
                                                                    Hide
                                                                </>
                                                            ) : (
                                                                <>
                                                                    <Eye className="w-4 h-4 mr-1" />
                                                                    View
                                                                </>
                                                            )}
                                                        </Button>
                                                    </div>
                                                </TableCell>
                                            </TableRow>
                                            {expandedServiceId ===
                                                service.id && (
                                                <TableRow>
                                                    <TableCell
                                                        colSpan={4}
                                                        className="bg-gradient-to-r from-blue-50 to-indigo-50 p-0"
                                                    >
                                                        <div className="p-8 border-t border-blue-100">
                                                            <div className="flex justify-between items-center mb-6">
                                                                <div>
                                                                    <h3 className="text-xl font-semibold text-gray-800 flex items-center gap-2">
                                                                        <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                                                                        Sub-Services
                                                                        for{" "}
                                                                        {
                                                                            service.name
                                                                        }
                                                                    </h3>
                                                                    <p className="text-gray-600 mt-1">
                                                                        Manage
                                                                        specialized
                                                                        services
                                                                        under
                                                                        this
                                                                        category
                                                                    </p>
                                                                </div>
                                                                <Button
                                                                    onClick={() =>
                                                                        openAddSubServiceModal(
                                                                            service.id
                                                                        )
                                                                    }
                                                                    className="bg-gradient-to-r from-indigo-500 to-purple-600 hover:from-indigo-600 hover:to-purple-700 text-white shadow-lg hover:shadow-xl transition-all duration-300"
                                                                >
                                                                    <Plus className="w-4 h-4 mr-2" />
                                                                    Add
                                                                    Sub-Service
                                                                </Button>
                                                            </div>

                                                            <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
                                                                <Table>
                                                                    <TableHeader>
                                                                        <TableRow className="bg-gray-50">
                                                                            <TableHead className="font-semibold text-gray-700">
                                                                                Sub-Service
                                                                                Title
                                                                            </TableHead>
                                                                            <TableHead className="font-semibold text-gray-700">
                                                                                Description
                                                                            </TableHead>
                                                                            <TableHead className="font-semibold text-gray-700 text-center">
                                                                                Actions
                                                                            </TableHead>
                                                                        </TableRow>
                                                                    </TableHeader>
                                                                    <TableBody>
                                                                        {service.subservices.map(
                                                                            (
                                                                                subService,
                                                                                subIndex
                                                                            ) => (
                                                                                <TableRow
                                                                                    key={
                                                                                        subService.id
                                                                                    }
                                                                                    className={`transition-all duration-200 hover:bg-blue-50/50 ${
                                                                                        subIndex %
                                                                                            2 ===
                                                                                        0
                                                                                            ? "bg-white"
                                                                                            : "bg-gray-50/30"
                                                                                    }`}
                                                                                >
                                                                                    <TableCell className="py-4">
                                                                                        <div className="font-medium text-gray-800">
                                                                                            {
                                                                                                subService.name
                                                                                            }
                                                                                        </div>
                                                                                    </TableCell>
                                                                                    <TableCell className="py-4">
                                                                                        <div className="text-gray-600">
                                                                                            {
                                                                                                subService.description
                                                                                            }
                                                                                        </div>
                                                                                    </TableCell>
                                                                                    <TableCell className="py-4 text-center">
                                                                                        <Button
                                                                                            variant="outline"
                                                                                            size="sm"
                                                                                            onClick={() =>
                                                                                                confirmDeleteSubService(
                                                                                                    service.id,
                                                                                                    subService
                                                                                                )
                                                                                            }
                                                                                            className="bg-red-50 border-red-200 text-red-700 hover:bg-red-100 hover:border-red-300 transition-all duration-200"
                                                                                        >
                                                                                            <Trash2 className="w-4 h-4 mr-1" />
                                                                                            Delete
                                                                                        </Button>
                                                                                    </TableCell>
                                                                                </TableRow>
                                                                            )
                                                                        )}
                                                                        {service
                                                                            .subservices
                                                                            .length ===
                                                                            0 && (
                                                                            <TableRow>
                                                                                <TableCell
                                                                                    colSpan={
                                                                                        3
                                                                                    }
                                                                                    className="py-8 text-center text-gray-500"
                                                                                >
                                                                                    No
                                                                                    sub-services
                                                                                    available.
                                                                                    Add
                                                                                    one
                                                                                    to
                                                                                    get
                                                                                    started.
                                                                                </TableCell>
                                                                            </TableRow>
                                                                        )}
                                                                    </TableBody>
                                                                </Table>
                                                            </div>
                                                        </div>
                                                    </TableCell>
                                                </TableRow>
                                            )}
                                        </React.Fragment>
                                    ))}
                                </TableBody>
                            </Table>
                        </div>
                    </div>

                    {/* Add Service Modal */}
                    <Dialog
                        open={isAddModalOpen}
                        onOpenChange={setIsAddModalOpen}
                    >
                        <DialogContent className="sm:max-w-md">
                            <DialogHeader>
                                <DialogTitle className="text-2xl font-semibold text-gray-800 flex items-center gap-2">
                                    <Plus className="w-6 h-6 text-green-600" />
                                    Add New Service
                                </DialogTitle>
                            </DialogHeader>
                            <form
                                onSubmit={handleAddService}
                                encType="multipart/form-data"
                            >
                                <div className="space-y-6 py-4">
                                    <div className="space-y-2">
                                        <Label
                                            htmlFor="name"
                                            className="text-sm font-semibold text-gray-700"
                                        >
                                            Service Name
                                        </Label>
                                        <Input
                                            id="name"
                                            value={data.name}
                                            onChange={(e) =>
                                                setData("name", e.target.value)
                                            }
                                            className={`border-gray-300 focus:border-blue-500 focus:ring-blue-500 ${
                                                errors.name
                                                    ? "border-red-500"
                                                    : ""
                                            }`}
                                            placeholder="Enter service name"
                                        />
                                        {errors.name && (
                                            <p className="text-red-500 text-sm">
                                                {errors.name}
                                            </p>
                                        )}
                                    </div>
                                    <div className="space-y-2">
                                        <Label
                                            htmlFor="description"
                                            className="text-sm font-semibold text-gray-700"
                                        >
                                            Description
                                        </Label>
                                        <Input
                                            id="description"
                                            value={data.description}
                                            onChange={(e) =>
                                                setData(
                                                    "description",
                                                    e.target.value
                                                )
                                            }
                                            className={`border-gray-300 focus:border-blue-500 focus:ring-blue-500 ${
                                                errors.description
                                                    ? "border-red-500"
                                                    : ""
                                            }`}
                                            placeholder="Enter service description"
                                        />
                                        {errors.description && (
                                            <p className="text-red-500 text-sm">
                                                {errors.description}
                                            </p>
                                        )}
                                    </div>
                                    <div className="space-y-2">
                                        <Label
                                            htmlFor="image"
                                            className="text-sm font-semibold text-gray-700"
                                        >
                                            Service Image
                                        </Label>
                                        <Input
                                            id="image"
                                            type="file"
                                            accept="image/*"
                                            onChange={(e) =>
                                                setData(
                                                    "image",
                                                    e.target.files[0]
                                                )
                                            }
                                            className={`border-gray-300 focus:border-blue-500 focus:ring-blue-500 ${
                                                errors.image
                                                    ? "border-red-500"
                                                    : ""
                                            }`}
                                        />
                                        {errors.image && (
                                            <p className="text-red-500 text-sm">
                                                {errors.image}
                                            </p>
                                        )}
                                    </div>
                                </div>
                                <DialogFooter className="gap-2">
                                    <Button
                                        variant="outline"
                                        type="button"
                                        onClick={() => setIsAddModalOpen(false)}
                                        className="border-gray-300 hover:bg-gray-50"
                                    >
                                        Cancel
                                    </Button>
                                    <Button
                                        type="submit"
                                        className="bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700"
                                    >
                                        Add Service
                                    </Button>
                                </DialogFooter>
                            </form>
                        </DialogContent>
                    </Dialog>

                    {/* Update Modal */}
                    <Dialog
                        open={isUpdateModalOpen}
                        onOpenChange={setIsUpdateModalOpen}
                    >
                        <DialogContent className="sm:max-w-md">
                            <DialogHeader>
                                <DialogTitle className="text-2xl font-semibold text-gray-800 flex items-center gap-2">
                                    <Edit3 className="w-6 h-6 text-blue-600" />
                                    Update Service
                                </DialogTitle>
                            </DialogHeader>
                            <div className="space-y-6 py-4">
                                <div className="space-y-2">
                                    <Label
                                        htmlFor="title"
                                        className="text-sm font-semibold text-gray-700"
                                    >
                                        Service Title
                                    </Label>
                                    <Input
                                        id="title"
                                        value={serviceFormData?.title}
                                        onChange={(e) =>
                                            setServiceFormData({
                                                ...serviceFormData,
                                                title: e.target.value,
                                            })
                                        }
                                        className="border-gray-300 focus:border-blue-500 focus:ring-blue-500"
                                        placeholder="Enter service title"
                                    />
                                </div>
                                <div className="space-y-2">
                                    <Label
                                        htmlFor="description"
                                        className="text-sm font-semibold text-gray-700"
                                    >
                                        Description
                                    </Label>
                                    <Input
                                        id="description"
                                        value={serviceFormData?.description}
                                        onChange={(e) =>
                                            setServiceFormData({
                                                ...serviceFormData,
                                                description: e.target.value,
                                            })
                                        }
                                        className="border-gray-300 focus:border-blue-500 focus:ring-blue-500"
                                        placeholder="Enter service description"
                                    />
                                </div>
                                <div className="space-y-2 overflow-hidden">
                                    <Label
                                        htmlFor="images"
                                        className="text-sm font-semibold text-gray-700"
                                    >
                                        Service Image
                                    </Label>
                                    <Input
                                        id="images"
                                        type="file"
                                        accept="image/*"
                                        onChange={(e) =>
                                            setServiceFormData({
                                                ...serviceFormData,
                                                images: e.target.files[0],
                                            })
                                        }
                                        className="border-gray-300 focus:border-blue-500 focus:ring-blue-500"
                                    />
                                </div>
                            </div>
                            <DialogFooter className="gap-2">
                                <Button
                                    variant="outline"
                                    onClick={() => setIsUpdateModalOpen(false)}
                                    className="border-gray-300 hover:bg-gray-50"
                                >
                                    Cancel
                                </Button>
                                <Button
                                    onClick={handleUpdate}
                                    className="bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700"
                                >
                                    Save Changes
                                </Button>
                            </DialogFooter>
                        </DialogContent>
                    </Dialog>

                    <Dialog
                        open={isAddSubServiceModalOpen}
                        onOpenChange={setIsAddSubServiceModalOpen}
                    >
                        <DialogContent className="sm:max-w-md">
                            <DialogHeader>
                                <DialogTitle className="text-2xl font-semibold text-gray-800 flex items-center gap-2">
                                    <Plus className="w-6 h-6 text-indigo-600" />
                                    Add Sub-Service
                                </DialogTitle>
                            </DialogHeader>
                            <form
                                onSubmit={handleAddSubService}
                                encType="multipart/form-data"
                            >
                                <div className="space-y-6 py-4">
                                    <div className="space-y-2">
                                        <Label
                                            htmlFor="name"
                                            className="text-sm font-semibold text-gray-700"
                                        >
                                            Sub-Service Name
                                        </Label>
                                        <Input
                                            id="name"
                                            value={subServiceForm.data.name}
                                            onChange={(e) =>
                                                subServiceForm.setData(
                                                    "name",
                                                    e.target.value
                                                )
                                            }
                                            className={`border-gray-300 focus:border-blue-500 focus:ring-blue-500 ${
                                                subServiceForm.errors.name
                                                    ? "border-red-500"
                                                    : ""
                                            }`}
                                            placeholder="Enter sub-service name"
                                        />
                                        {subServiceForm.errors.name && (
                                            <p className="text-red-500 text-sm">
                                                {subServiceForm.errors.name}
                                            </p>
                                        )}
                                    </div>
                                    <div className="space-y-2">
                                        <Label
                                            htmlFor="description"
                                            className="text-sm font-semibold text-gray-700"
                                        >
                                            Description
                                        </Label>
                                        <Input
                                            id="description"
                                            value={
                                                subServiceForm.data.description
                                            }
                                            onChange={(e) =>
                                                subServiceForm.setData(
                                                    "description",
                                                    e.target.value
                                                )
                                            }
                                            className={`border-gray-300 focus:border-blue-500 focus:ring-blue-500 ${
                                                subServiceForm.errors
                                                    .description
                                                    ? "border-red-500"
                                                    : ""
                                            }`}
                                            placeholder="Enter sub-service description"
                                        />
                                        {subServiceForm.errors.description && (
                                            <p className="text-red-500 text-sm">
                                                {
                                                    subServiceForm.errors
                                                        .description
                                                }
                                            </p>
                                        )}
                                    </div>
                                    <div className="space-y-2">
                                        <Label
                                            htmlFor="image"
                                            className="text-sm font-semibold text-gray-700"
                                        >
                                            Sub-Service Image (Optional)
                                        </Label>
                                        <Input
                                            id="image"
                                            type="file"
                                            accept="image/*"
                                            onChange={(e) =>
                                                subServiceForm.setData(
                                                    "image",
                                                    e.target.files[0]
                                                )
                                            }
                                            className={`border-gray-300 focus:border-blue-500 focus:ring-blue-500 ${
                                                subServiceForm.errors.image
                                                    ? "border-red-500"
                                                    : ""
                                            }`}
                                        />
                                        {subServiceForm.errors.image && (
                                            <p className="text-red-500 text-sm">
                                                {subServiceForm.errors.image}
                                            </p>
                                        )}
                                    </div>
                                </div>
                                <DialogFooter className="gap-2">
                                    <Button
                                        type="button"
                                        variant="outline"
                                        onClick={() =>
                                            setIsAddSubServiceModalOpen(false)
                                        }
                                        className="border-gray-300 hover:bg-gray-50"
                                    >
                                        Cancel
                                    </Button>
                                    <Button
                                        type="submit"
                                        className="bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700"
                                    >
                                        Add Sub-Service
                                    </Button>
                                </DialogFooter>
                            </form>
                        </DialogContent>
                    </Dialog>

                    {/* Delete Confirmation Modal (Service) */}
                    <Dialog
                        open={isDeleteModalOpen}
                        onOpenChange={setIsDeleteModalOpen}
                    >
                        <DialogContent className="sm:max-w-md">
                            <DialogHeader>
                                <DialogTitle className="text-2xl font-semibold text-red-600 flex items-center gap-2">
                                    <Trash2 className="w-6 h-6" />
                                    Confirm Deletion
                                </DialogTitle>
                            </DialogHeader>
                            <div className="py-4">
                                <p className="text-gray-600">
                                    Are you sure you want to delete{" "}
                                    <span className="font-semibold text-gray-800">
                                        "{serviceToDelete?.name}"
                                    </span>
                                    ? This action cannot be undone.
                                </p>
                            </div>
                            <DialogFooter className="gap-2">
                                <Button
                                    variant="outline"
                                    onClick={() => setIsDeleteModalOpen(false)}
                                    className="border-gray-300 hover:bg-gray-50"
                                >
                                    Cancel
                                </Button>
                                <Button
                                    variant="destructive"
                                    onClick={handleDelete}
                                    className="bg-red-600 hover:bg-red-700"
                                >
                                    Delete Service
                                </Button>
                            </DialogFooter>
                        </DialogContent>
                    </Dialog>

                    {/* Delete Sub-Service Modal */}
                    <Dialog
                        open={isDeleteSubServiceModalOpen}
                        onOpenChange={setIsDeleteSubServiceModalOpen}
                    >
                        <DialogContent className="sm:max-w-md">
                            <DialogHeader>
                                <DialogTitle className="text-2xl font-semibold text-red-600 flex items-center gap-2">
                                    <Trash2 className="w-6 h-6" />
                                    Confirm Sub-Service Deletion indicator
                                </DialogTitle>
                            </DialogHeader>
                            <div className="py-4">
                                <p className="text-gray-600">
                                    Are you sure you want to delete{" "}
                                    <span className="font-semibold text-gray-800">
                                        "{subServiceToDelete?.title}"
                                    </span>
                                    ? This action cannot be undone.
                                </p>
                            </div>
                            <DialogFooter className="gap-2">
                                <Button
                                    variant="outline"
                                    onClick={() =>
                                        setIsDeleteSubServiceModalOpen(false)
                                    }
                                    className="border-gray-300 hover:bg-gray-50"
                                >
                                    Cancel
                                </Button>
                                <Button
                                    variant="destructive"
                                    onClick={handleDeleteSubService}
                                    className="bg-red-600 hover:bg-red-700"
                                >
                                    Delete Sub-Service
                                </Button>
                            </DialogFooter>
                        </DialogContent>
                    </Dialog>

                    {/* Image Modal */}
                    <Dialog
                        open={isImageModalOpen}
                        onOpenChange={setIsImageModalOpen}
                    >
                        <DialogContent className="sm:max-w-2xl">
                            <DialogHeader>
                                <DialogTitle className="text-2xl font-semibold text-gray-800 flex items-center gap-2">
                                    <Image className="w-6 h-6 text-blue-600" />
                                    Service Image
                                </DialogTitle>
                            </DialogHeader>
                            <div className="py-4">
                                <div className="flex justify-center bg-gray-50 rounded-xl p-4">
                                    <img
                                        src={selectedImage}
                                        alt="Service"
                                        className="max-w-full max-h-[60vh] object-contain rounded-lg shadow-lg"
                                    />
                                </div>
                            </div>
                            <DialogFooter>
                                <Button
                                    variant="outline"
                                    onClick={() => setIsImageModalOpen(false)}
                                    className="border-gray-300 hover:bg-gray-50"
                                >
                                    Close
                                </Button>
                            </DialogFooter>
                        </DialogContent>
                    </Dialog>
                </div>
            </div>
        </Layout>
    );
};

export default Services;

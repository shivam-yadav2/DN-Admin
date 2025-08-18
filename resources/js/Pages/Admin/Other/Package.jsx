import { useState } from "react";
import { useForm, usePage, router } from "@inertiajs/react";
import { Plus, Edit, Trash2, X, Package, Upload, Image, DollarSign, Target, FileText } from "lucide-react";
import AuthenticatedLayout from "@/Layouts/AuthenticatedLayout";
import Layout from "@/Layouts/Layout";

const Packages = () => {
    const { auth, packages, flash } = usePage().props;
    const [editingPackage, setEditingPackage] = useState(null);
    const [alertMessage, setAlertMessage] = useState("");
    const [alertType, setAlertType] = useState("");
    const [imagePreview, setImagePreview] = useState("");

    console.log(packages)

    // Single form for both create and edit
    const form = useForm({
        heading: "",
        img: null,
        price: "",
        description: "",
        target_audience: "",
    });

    const showAlert = (message, type = 'success') => {
        setAlertMessage(message);
        setAlertType(type);
        setTimeout(() => {
            setAlertMessage("");
            setAlertType("");
        }, 4000);
    };

    const resetForm = () => {
        form.reset();
        form.setData({
            heading: "",
            img: null,
            price: "",
            description: "",
            target_audience: "",
        });
        form.clearErrors();
        setEditingPackage(null);
        setImagePreview("");
    };

    const handleEdit = (pkg) => {
        setEditingPackage(pkg);
        form.setData({
            heading: pkg.heading || "",
            img: null,
            price: pkg.price || "",
            description: pkg.description || "",
            target_audience: pkg.target_audience || "",
        });
        form.clearErrors();
        
        // Set image preview for existing package
        if (pkg.img) {
            setImagePreview(`/assets/images/package/${pkg.img}`);
        }
        
        // Scroll to form
        document.getElementById('packageForm')?.scrollIntoView({ behavior: 'smooth' });
    };

    const handleImageChange = (e) => {
        const file = e.target.files[0];
        if (file) {
            form.setData('img', file);
            
            // Create preview
            const reader = new FileReader();
            reader.onload = (e) => {
                setImagePreview(e.target.result);
            };
            reader.readAsDataURL(file);
        }
    };

    const handleSubmit = () => {
        if (editingPackage) {
            // Update existing package
            form.post(route("packages.update", editingPackage.id), {
                forceFormData: true,
                _method: 'PUT',
                onSuccess: () => {
                    resetForm();
                    showAlert("Package updated successfully!");
                },
                onError: (errors) => {
                    showAlert("Failed to update package. Please check the form.", "error");
                },
            });
        } else {
            // Create new package
            form.post(route("packages.store"), {
                forceFormData: true,
                onSuccess: () => {
                    resetForm();
                    showAlert("Package added successfully!");
                },
                onError: (errors) => {
                    showAlert("Failed to add package. Please check the form.", "error");
                },
            });
        }
    };

    const handleDelete = (id) => {
        if (confirm("Are you sure you want to delete this package?")) {
            router.delete(route("packages.destroy", id), {
                onSuccess: () => {
                    showAlert("Package deleted successfully!");
                },
                onError: () => {
                    showAlert("Failed to delete package.", "error");
                },
            });
        }
    };

    return (
        <Layout
            
        >
            <div className="min-h-screen bg-gray-50">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                    
                    {/* Alert Messages */}
                    {(alertMessage || flash?.message) && (
                        <div className={`mb-6 p-4 rounded-lg border ${
                            (alertType === 'error' || flash?.type === 'error') 
                                ? 'bg-red-50 border-red-200 text-red-800' 
                                : 'bg-green-50 border-green-200 text-green-800'
                        }`}>
                            <div className="flex items-center justify-between">
                                <span>{alertMessage || flash?.message}</span>
                                <button 
                                    onClick={() => setAlertMessage("")}
                                    className="text-gray-400 hover:text-gray-600"
                                >
                                    <X className="h-4 w-4" />
                                </button>
                            </div>
                        </div>
                    )}

                    {/* Add/Edit Form */}
                    <div id="packageForm" className="bg-white rounded-lg shadow-md p-6 mb-8">
                        <h2 className="text-xl font-semibold text-gray-900 mb-6 flex items-center gap-2">
                            <Plus className="h-5 w-5" />
                            {editingPackage ? 'Edit Package' : 'Add New Package'}
                        </h2>

                        <div className="space-y-6">
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                {/* Package Title Field */}
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-2">
                                        Package Title *
                                    </label>
                                    <input
                                        type="text"
                                        value={form.data.heading}
                                        onChange={(e) => form.setData('heading', e.target.value)}
                                        className={`w-full px-3 py-2 border rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 ${
                                            form.errors.heading ? 'border-red-300' : 'border-gray-300'
                                        }`}
                                        placeholder="Enter package title"
                                    />
                                    {form.errors.heading && (
                                        <p className="text-red-500 text-sm mt-1">{form.errors.heading}</p>
                                    )}
                                </div>

                                {/* Price Field */}
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-2">
                                        Price ($) *
                                    </label>
                                    <div className="relative">
                                        <DollarSign className="absolute left-3 top-2.5 h-5 w-5 text-gray-400" />
                                        <input
                                            type="number"
                                            min="0"
                                            step="0.01"
                                            value={form.data.price}
                                            onChange={(e) => form.setData('price', e.target.value)}
                                            className={`w-full pl-10 pr-3 py-2 border rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 ${
                                                form.errors.price ? 'border-red-300' : 'border-gray-300'
                                            }`}
                                            placeholder="0.00"
                                        />
                                    </div>
                                    {form.errors.price && (
                                        <p className="text-red-500 text-sm mt-1">{form.errors.price}</p>
                                    )}
                                </div>

                                {/* Target Audience Field */}
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-2">
                                        Target Audience *
                                    </label>
                                    <div className="relative">
                                        <Target className="absolute left-3 top-2.5 h-5 w-5 text-gray-400" />
                                        <input
                                            type="text"
                                            value={form.data.target_audience}
                                            onChange={(e) => form.setData('target_audience', e.target.value)}
                                            className={`w-full pl-10 pr-3 py-2 border rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 ${
                                                form.errors.target_audience ? 'border-red-300' : 'border-gray-300'
                                            }`}
                                            placeholder="e.g., Beginners, Advanced, Professionals"
                                        />
                                    </div>
                                    {form.errors.target_audience && (
                                        <p className="text-red-500 text-sm mt-1">{form.errors.target_audience}</p>
                                    )}
                                </div>

                                {/* Image Upload */}
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-2">
                                        Package Image {!editingPackage && '*'}
                                    </label>
                                    <div className="space-y-3">
                                        <div className="flex items-center space-x-4">
                                            <label className="flex items-center px-4 py-2 bg-white border border-gray-300 rounded-md shadow-sm cursor-pointer hover:bg-gray-50 focus-within:ring-2 focus-within:ring-blue-500">
                                                <Upload className="h-5 w-5 text-gray-400 mr-2" />
                                                <span className="text-sm text-gray-600">Choose Image</span>
                                                <input
                                                    type="file"
                                                    accept="image/*"
                                                    onChange={handleImageChange}
                                                    className="hidden"
                                                />
                                            </label>
                                            {imagePreview && (
                                                <div className="relative">
                                                    <img
                                                        src={imagePreview}
                                                        alt="Preview"
                                                        className="h-16 w-16 object-cover rounded-lg border"
                                                    />
                                                    <button
                                                        type="button"
                                                        onClick={() => {
                                                            setImagePreview("");
                                                            form.setData('img', null);
                                                        }}
                                                        className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full p-1 hover:bg-red-600"
                                                    >
                                                        <X className="h-3 w-3" />
                                                    </button>
                                                </div>
                                            )}
                                        </div>
                                        <p className="text-sm text-gray-500">
                                            Supported formats: JPEG, JPG, PNG. Max size: 2MB. Images will be resized to 200x200px and converted to WebP.
                                        </p>
                                    </div>
                                    {form.errors.img && (
                                        <p className="text-red-500 text-sm mt-1">{form.errors.img}</p>
                                    )}
                                </div>
                            </div>

                            {/* Description Field - Full Width */}
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                    Description *
                                </label>
                                <div className="relative">
                                    <FileText className="absolute left-3 top-3 h-5 w-5 text-gray-400" />
                                    <textarea
                                        value={form.data.description}
                                        onChange={(e) => form.setData('description', e.target.value)}
                                        rows={4}
                                        className={`w-full pl-10 pr-3 py-2 border rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 resize-none ${
                                            form.errors.description ? 'border-red-300' : 'border-gray-300'
                                        }`}
                                        placeholder="Provide a detailed description of the package..."
                                    />
                                </div>
                                {form.errors.description && (
                                    <p className="text-red-500 text-sm mt-1">{form.errors.description}</p>
                                )}
                            </div>

                            {/* Form Actions */}
                            <div className="flex items-center justify-end space-x-4 pt-4 border-t">
                                {editingPackage && (
                                    <button
                                        type="button"
                                        onClick={resetForm}
                                        className="px-4 py-2 text-gray-600 bg-gray-100 rounded-md hover:bg-gray-200 transition-colors"
                                    >
                                        Cancel
                                    </button>
                                )}
                                <button
                                    type="button"
                                    onClick={handleSubmit}
                                    disabled={form.processing}
                                    className="px-6 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors flex items-center gap-2"
                                >
                                    {form.processing ? (
                                        <>
                                            <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                                            Processing...
                                        </>
                                    ) : (
                                        <>
                                            {editingPackage ? <Edit className="h-4 w-4" /> : <Plus className="h-4 w-4" />}
                                            {editingPackage ? 'Update Package' : 'Add Package'}
                                        </>
                                    )}
                                </button>
                            </div>
                        </div>
                    </div>

                    {/* Packages List */}
                    <div className="bg-white rounded-lg shadow-md overflow-hidden">
                        <div className="px-6 py-4 border-b border-gray-200">
                            <h2 className="text-xl font-semibold text-gray-900">Packages</h2>
                        </div>

                        {packages && packages.length > 0 ? (
                            <div className="overflow-x-auto">
                                <table className="min-w-full divide-y divide-gray-200">
                                    <thead className="bg-gray-50">
                                        <tr>
                                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                                Package
                                            </th>
                                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                                Price
                                            </th>
                                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                                Target Audience
                                            </th>
                                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                                Description
                                            </th>
                                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                                Actions
                                            </th>
                                        </tr>
                                    </thead>
                                    <tbody className="bg-white divide-y divide-gray-200">
                                        {packages.map((pkg) => (
                                            <tr key={pkg.id} className="hover:bg-gray-50">
                                                <td className="px-6 py-4 whitespace-nowrap">
                                                    <div className="flex items-center">
                                                        <div className="flex-shrink-0 h-12 w-12">
                                                            {pkg.img ? (
                                                                <img
                                                                    className="h-12 w-12 rounded-lg object-cover"
                                                                    src={`/assets/images/package/${pkg.img}`}
                                                                    alt={pkg.heading}
                                                                    
                                                                />
                                                            ) : (
                                                                <div className="h-12 w-12 rounded-lg bg-gray-300 flex items-center justify-center">
                                                                    <Image className="h-6 w-6 text-gray-500" />
                                                                </div>
                                                            )}
                                                        </div>
                                                        <div className="ml-4">
                                                            <div className="text-sm font-medium text-gray-900">
                                                                {pkg.heading}
                                                            </div>
                                                        </div>
                                                    </div>
                                                </td>
                                                <td className="px-6 py-4 whitespace-nowrap">
                                                    <div className="text-sm font-semibold text-green-600">
                                                        ${Number(pkg.price).toFixed(2)}
                                                    </div>
                                                </td>
                                                <td className="px-6 py-4 whitespace-nowrap">
                                                    <span className="px-2 py-1 text-xs font-medium bg-blue-100 text-blue-800 rounded-full">
                                                        {pkg.target_audience}
                                                    </span>
                                                </td>
                                                <td className="px-6 py-4">
                                                    <div className="text-sm text-gray-900 max-w-xs truncate">
                                                        {pkg.description}
                                                    </div>
                                                </td>
                                                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                                                    <div className="flex items-center space-x-3">
                                                        <button
                                                            onClick={() => handleEdit(pkg)}
                                                            className="text-blue-600 hover:text-blue-900 flex items-center gap-1"
                                                        >
                                                            <Edit className="h-4 w-4" />
                                                            Edit
                                                        </button>
                                                        <button
                                                            onClick={() => handleDelete(pkg.id)}
                                                            className="text-red-600 hover:text-red-900 flex items-center gap-1"
                                                        >
                                                            <Trash2 className="h-4 w-4" />
                                                            Delete
                                                        </button>
                                                    </div>
                                                </td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>
                        ) : (
                            <div className="text-center py-12">
                                {/* <Package className="mx-auto h-12 w-12 text-gray-400" /> */}
                                <h3 className="mt-2 text-sm font-medium text-gray-900">No packages</h3>
                                <p className="mt-1 text-sm text-gray-500">
                                    Get started by adding your first package.
                                </p>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </Layout>
    );
};

export default Packages;
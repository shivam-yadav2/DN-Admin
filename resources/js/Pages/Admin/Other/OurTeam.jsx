import { useState } from "react";
import { useForm, usePage, router } from "@inertiajs/react";
import { Plus, Edit, Trash2, X, Users, Calendar, Briefcase, ImageIcon, Upload } from "lucide-react";
import Layout from "@/Layouts/Layout";

const OurTeam = () => {
    const { teamMembers, flash } = usePage().props;
    const [editingMember, setEditingMember] = useState(null);
    const [alertMessage, setAlertMessage] = useState("");
    const [alertType, setAlertType] = useState("");
    const [imagePreview, setImagePreview] = useState("");

    // Single form for both create and edit
    const form = useForm({
        name: "",
        designation: "",
        image: null,
        joining_date: "",
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
            name: "",
            designation: "",
            image: null,
            joining_date: "",
        });
        form.clearErrors();
        setEditingMember(null);
        setImagePreview("");
    };

    const handleEdit = (member) => {
        setEditingMember(member);
        form.setData({
            name: member.name || "",
            designation: member.designation || "",
            image: null,
            joining_date: member.joining_date || "",
        });
        form.clearErrors();
        
        // Set image preview for existing member
        if (member.img) {
            setImagePreview(`${member.img}`);
        }
        
        // Scroll to form
        document.getElementById('teamForm')?.scrollIntoView({ behavior: 'smooth' });
    };

    const handleImageChange = (e) => {
        const file = e.target.files[0];
        if (file) {
            form.setData('image', file);
            
            // Create preview
            const reader = new FileReader();
            reader.onload = (e) => {
                setImagePreview(e.target.result);
            };
            reader.readAsDataURL(file);
        }
    };

    const handleSubmit = () => {
        
        if (editingMember) {
            // Update existing member
            form.post(route("our-team.update", editingMember.id), {
                forceFormData: true,
                _method: 'PUT',
                onSuccess: () => {
                    resetForm();
                    showAlert("Team member updated successfully!");
                },
                onError: (errors) => {
                    showAlert("Failed to update team member. Please check the form.", "error");
                },
            });
        } else {
            // Create new member
            form.post(route("our-team.store"), {
                forceFormData: true,
                onSuccess: () => {
                    resetForm();
                    showAlert("Team member added successfully!");
                },
                onError: (errors) => {
                    showAlert("Failed to add team member. Please check the form.", "error");
                },
            });
        }
    };

    const handleDelete = (id) => {
        if (confirm("Are you sure you want to delete this team member?")) {
            router.delete(route("our-team.destroy", id), {
                onSuccess: () => {
                    showAlert("Team member deleted successfully!");
                },
                onError: () => {
                    showAlert("Failed to delete team member.", "error");
                },
            });
        }
    };

    const formatDate = (dateString) => {
        return new Date(dateString).toLocaleDateString('en-US', {
            year: 'numeric',
            month: 'long',
            day: 'numeric'
        });
    };

    return (
        <Layout>
            <div className="min-h-screen bg-gray-50">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                    {/* Header */}
                    <div className="mb-8">
                        <div className="flex items-center justify-between">
                            <div>
                                <h1 className="text-3xl font-bold text-gray-900 flex items-center gap-2">
                                    <Users className="h-8 w-8 text-blue-600" />
                                    Our Team Management
                                </h1>
                                <p className="text-gray-600 mt-2">Manage your team members and their information</p>
                            </div>
                            <div className="text-sm text-gray-500">
                                {teamMembers?.length || 0} team members
                            </div>
                        </div>
                    </div>

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
                    <div id="teamForm" className="bg-white rounded-lg shadow-md p-6 mb-8">
                        <h2 className="text-xl font-semibold text-gray-900 mb-6 flex items-center gap-2">
                            <Plus className="h-5 w-5" />
                            {editingMember ? 'Edit Team Member' : 'Add New Team Member'}
                        </h2>

                        <div className="space-y-6">
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                {/* Name Field */}
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-2">
                                        Full Name *
                                    </label>
                                    <input
                                        type="text"
                                        value={form.data.name}
                                        onChange={(e) => form.setData('name', e.target.value)}
                                        className={`w-full px-3 py-2 border rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 ${
                                            form.errors.name ? 'border-red-300' : 'border-gray-300'
                                        }`}
                                        placeholder="Enter full name"
                                    />
                                    {form.errors.name && (
                                        <p className="text-red-500 text-sm mt-1">{form.errors.name}</p>
                                    )}
                                </div>

                                {/* Designation Field */}
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-2">
                                        Designation *
                                    </label>
                                    <div className="relative">
                                        <Briefcase className="absolute left-3 top-2.5 h-5 w-5 text-gray-400" />
                                        <input
                                            type="text"
                                            value={form.data.designation}
                                            onChange={(e) => form.setData('designation', e.target.value)}
                                            className={`w-full pl-10 pr-3 py-2 border rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 ${
                                                form.errors.designation ? 'border-red-300' : 'border-gray-300'
                                            }`}
                                            placeholder="Enter designation"
                                        />
                                    </div>
                                    {form.errors.designation && (
                                        <p className="text-red-500 text-sm mt-1">{form.errors.designation}</p>
                                    )}
                                </div>

                                {/* Joining Date Field */}
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-2">
                                        Joining Date *
                                    </label>
                                    <div className="relative">
                                        <Calendar className="absolute left-3 top-2.5 h-5 w-5 text-gray-400" />
                                        <input
                                            type="date"
                                            value={form.data.joining_date}
                                            onChange={(e) => form.setData('joining_date', e.target.value)}
                                            className={`w-full pl-10 pr-3 py-2 border rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 ${
                                                form.errors.joining_date ? 'border-red-300' : 'border-gray-300'
                                            }`}
                                        />
                                    </div>
                                    {form.errors.joining_date && (
                                        <p className="text-red-500 text-sm mt-1">{form.errors.joining_date}</p>
                                    )}
                                </div>

                                {/* Image Upload */}
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-2">
                                        Profile Image {!editingMember && '*'}
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
                                                            form.setData('image', null);
                                                        }}
                                                        className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full p-1 hover:bg-red-600"
                                                    >
                                                        <X className="h-3 w-3" />
                                                    </button>
                                                </div>
                                            )}
                                        </div>
                                        <p className="text-sm text-gray-500">
                                            Supported formats: JPEG, JPG, PNG, WebP. Max size: 2MB. Images will be resized to 500x500px.
                                        </p>
                                    </div>
                                    {form.errors.image && (
                                        <p className="text-red-500 text-sm mt-1">{form.errors.image}</p>
                                    )}
                                </div>
                            </div>

                            {/* Form Actions */}
                            <div className="flex items-center justify-end space-x-4 pt-4 border-t">
                                {editingMember && (
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
                                            {editingMember ? <Edit className="h-4 w-4" /> : <Plus className="h-4 w-4" />}
                                            {editingMember ? 'Update Member' : 'Add Member'}
                                        </>
                                    )}
                                </button>
                            </div>
                        </div>
                    </div>

                    {/* Team Members List */}
                    <div className="bg-white rounded-lg shadow-md overflow-hidden">
                        <div className="px-6 py-4 border-b border-gray-200">
                            <h2 className="text-xl font-semibold text-gray-900">Team Members</h2>
                        </div>

                        {teamMembers && teamMembers.length > 0 ? (
                            <div className="overflow-x-auto">
                                <table className="min-w-full divide-y divide-gray-200">
                                    <thead className="bg-gray-50">
                                        <tr>
                                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                                Member
                                            </th>
                                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                                Designation
                                            </th>
                                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                                Joining Date
                                            </th>
                                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                                Actions
                                            </th>
                                        </tr>
                                    </thead>
                                    <tbody className="bg-white divide-y divide-gray-200">
                                        {teamMembers.map((member) => (
                                            <tr key={member.id} className="hover:bg-gray-50">
                                                <td className="px-6 py-4 whitespace-nowrap">
                                                    <div className="flex items-center">
                                                        <div className="flex-shrink-0 h-12 w-12">
                                                            {member.img ? (
                                                                <img
                                                                    className="h-12 w-12 rounded-full object-cover"
                                                                    src={`${member.img}`}
                                                                    alt={member.name}
                                                                />
                                                            ) : (
                                                                <div className="h-12 w-12 rounded-full bg-gray-300 flex items-center justify-center">
                                                                    <ImageIcon className="h-6 w-6 text-gray-500" />
                                                                </div>
                                                            )}
                                                        </div>
                                                        <div className="ml-4">
                                                            <div className="text-sm font-medium text-gray-900">
                                                                {member.name}
                                                            </div>
                                                        </div>
                                                    </div>
                                                </td>
                                                <td className="px-6 py-4 whitespace-nowrap">
                                                    <div className="text-sm text-gray-900">{member.designation}</div>
                                                </td>
                                                <td className="px-6 py-4 whitespace-nowrap">
                                                    <div className="text-sm text-gray-900">
                                                        {formatDate(member.joining_date)}
                                                    </div>
                                                </td>
                                                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                                                    <div className="flex items-center space-x-3">
                                                        <button
                                                            onClick={() => handleEdit(member)}
                                                            className="text-blue-600 hover:text-blue-900 flex items-center gap-1"
                                                        >
                                                            <Edit className="h-4 w-4" />
                                                            Edit
                                                        </button>
                                                        <button
                                                            onClick={() => handleDelete(member.id)}
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
                                <Users className="mx-auto h-12 w-12 text-gray-400" />
                                <h3 className="mt-2 text-sm font-medium text-gray-900">No team members</h3>
                                <p className="mt-1 text-sm text-gray-500">
                                    Get started by adding your first team member.
                                </p>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </Layout>
    );
};

export default OurTeam;
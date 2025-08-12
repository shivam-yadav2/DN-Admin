import { useState } from "react";
import { useForm, usePage, router } from "@inertiajs/react";
import { Plus, Edit, Trash2, X, Tag, Upload, Image, Globe, Hash, FileText, Link } from "lucide-react";
import AuthenticatedLayout from "@/Layouts/AuthenticatedLayout";
import Layout from "@/Layouts/Layout";

const TagManagement = () => {
    const { auth, tags, flash } = usePage().props;
    const [editingTag, setEditingTag] = useState(null);
    const [alertMessage, setAlertMessage] = useState("");
    const [alertType, setAlertType] = useState("");
    const [imagePreview, setImagePreview] = useState("");

    console.log(tags)

    // Single form for both create and edit
    const form = useForm({
        title: "",
        description: "",
        keyword: "",
        page_url: "",
        image: null,
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
            title: "",
            description: "",
            keyword: "",
            page_url: "",
            image: null,
        });
        form.clearErrors();
        setEditingTag(null);
        setImagePreview("");
    };

    const handleEdit = (tag) => {
        setEditingTag(tag);
        form.setData({
            title: tag.title || "",
            description: tag.description || "",
            keyword: tag.keyword || "",
            page_url: tag.page_url || "",
            image: null,
        });
        form.clearErrors();
        
        // Set image preview for existing tag
        if (tag.image) {
            setImagePreview(`/assets/images/tags/${tag.image}`);
        }
        
        // Scroll to form
        document.getElementById('tagForm')?.scrollIntoView({ behavior: 'smooth' });
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
        if (editingTag) {
            // Update existing tag
            form.post(route("tags.update", editingTag.id), {
                forceFormData: true,
                _method: 'PUT',
                onSuccess: () => {
                    resetForm();
                    showAlert("Tag updated successfully!");
                },
                onError: (errors) => {
                    showAlert("Failed to update tag. Please check the form.", "error");
                },
            });
        } else {
            // Create new tag
            form.post(route("tags.store"), {
                forceFormData: true,
                onSuccess: () => {
                    resetForm();
                    showAlert("Tag added successfully!");
                },
                onError: (errors) => {
                    showAlert("Failed to add tag. Please check the form.", "error");
                },
            });
        }
    };

    const handleDelete = (id) => {
        if (confirm("Are you sure you want to delete this tag?")) {
            router.delete(route("tags.destroy", id), {
                onSuccess: () => {
                    showAlert("Tag deleted successfully!");
                },
                onError: () => {
                    showAlert("Failed to delete tag.", "error");
                },
            });
        }
    };

    const truncateText = (text, maxLength = 50) => {
        if (!text) return '';
        return text.length > maxLength ? text.substring(0, maxLength) + '...' : text;
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
                    <div id="tagForm" className="bg-white rounded-lg shadow-md p-6 mb-8">
                        <h2 className="text-xl font-semibold text-gray-900 mb-6 flex items-center gap-2">
                            <Plus className="h-5 w-5" />
                            {editingTag ? 'Edit Tag' : 'Add New Tag'}
                        </h2>

                        <div className="space-y-6">
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                {/* Title Field */}
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-2">
                                        Title *
                                    </label>
                                    <input
                                        type="text"
                                        value={form.data.title}
                                        onChange={(e) => form.setData('title', e.target.value)}
                                        className={`w-full px-3 py-2 border rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 ${
                                            form.errors.title ? 'border-red-300' : 'border-gray-300'
                                        }`}
                                        placeholder="Enter tag title"
                                    />
                                    {form.errors.title && (
                                        <p className="text-red-500 text-sm mt-1">{form.errors.title}</p>
                                    )}
                                </div>

                                {/* Page URL Field */}
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-2">
                                        Page URL *
                                    </label>
                                    <div className="relative">
                                        <Link className="absolute left-3 top-2.5 h-5 w-5 text-gray-400" />
                                        <input
                                            type="url"
                                            value={form.data.page_url}
                                            onChange={(e) => form.setData('page_url', e.target.value)}
                                            className={`w-full pl-10 pr-3 py-2 border rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 ${
                                                form.errors.page_url ? 'border-red-300' : 'border-gray-300'
                                            }`}
                                            placeholder="https://example.com/page"
                                        />
                                    </div>
                                    {form.errors.page_url && (
                                        <p className="text-red-500 text-sm mt-1">{form.errors.page_url}</p>
                                    )}
                                </div>

                                {/* Keywords Field */}
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-2">
                                        Keywords
                                    </label>
                                    <div className="relative">
                                        <Hash className="absolute left-3 top-2.5 h-5 w-5 text-gray-400" />
                                        <input
                                            type="text"
                                            value={form.data.keyword}
                                            onChange={(e) => form.setData('keyword', e.target.value)}
                                            className={`w-full pl-10 pr-3 py-2 border rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 ${
                                                form.errors.keyword ? 'border-red-300' : 'border-gray-300'
                                            }`}
                                            placeholder="keyword1, keyword2, keyword3"
                                        />
                                    </div>
                                    {form.errors.keyword && (
                                        <p className="text-red-500 text-sm mt-1">{form.errors.keyword}</p>
                                    )}
                                </div>

                                {/* Image Upload */}
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-2">
                                        Tag Image {!editingTag && '*'}
                                    </label>
                                    <div className="space-y-3">
                                        <div className="flex items-center space-x-4">
                                            <label className="flex items-center px-4 py-2 bg-white border border-gray-300 rounded-md shadow-sm cursor-pointer hover:bg-gray-50 focus-within:ring-2 focus-within:ring-blue-500">
                                                <Upload className="h-5 w-5 text-gray-400 mr-2" />
                                                <span className="text-sm text-gray-600">Choose Image</span>
                                                <input
                                                    type="file"
                                                    accept="image/jpeg,image/jpg,image/png,image/webp"
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
                                            Supported formats: JPEG, JPG, PNG, WebP. Max size: 512KB. Images will be converted to WebP format.
                                        </p>
                                    </div>
                                    {form.errors.image && (
                                        <p className="text-red-500 text-sm mt-1">{form.errors.image}</p>
                                    )}
                                </div>
                            </div>

                            {/* Description Field - Full Width */}
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                    Description
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
                                        placeholder="Provide a description for this tag..."
                                        maxLength={500}
                                    />
                                </div>
                                <div className="flex justify-between items-center mt-1">
                                    <div>
                                        {form.errors.description && (
                                            <p className="text-red-500 text-sm">{form.errors.description}</p>
                                        )}
                                    </div>
                                    <p className="text-xs text-gray-500">
                                        {form.data.description?.length || 0}/500 characters
                                    </p>
                                </div>
                            </div>

                            {/* Form Actions */}
                            <div className="flex items-center justify-end space-x-4 pt-4 border-t">
                                {editingTag && (
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
                                            {editingTag ? <Edit className="h-4 w-4" /> : <Plus className="h-4 w-4" />}
                                            {editingTag ? 'Update Tag' : 'Add Tag'}
                                        </>
                                    )}
                                </button>
                            </div>
                        </div>
                    </div>

                    {/* Tags List */}
                    <div className="bg-white rounded-lg shadow-md overflow-hidden">
                        <div className="px-6 py-4 border-b border-gray-200">
                            <h2 className="text-xl font-semibold text-gray-900">Tags</h2>
                        </div>

                        {tags && tags.length > 0 ? (
                            <div className="overflow-x-auto">
                                <table className="min-w-full divide-y divide-gray-200">
                                    <thead className="bg-gray-50">
                                        <tr>
                                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                                Tag
                                            </th>
                                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                                Page URL
                                            </th>
                                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                                Keywords
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
                                        {tags.map((tag) => (
                                            <tr key={tag.id} className="hover:bg-gray-50">
                                                <td className="px-6 py-4 whitespace-nowrap">
                                                    <div className="flex items-center">
                                                        <div className="flex-shrink-0 h-12 w-12">
                                                            {tag.image ? (
                                                                <img
                                                                    className="h-12 w-12 rounded-lg object-cover"
                                                                    src={`/assets/images/tags/${tag.image}`}
                                                                    alt={tag.title}
                                                                    onError={(e) => {
                                                                        e.target.src = '/placeholder-image.jpg';
                                                                    }}
                                                                />
                                                            ) : (
                                                                <div className="h-12 w-12 rounded-lg bg-gray-300 flex items-center justify-center">
                                                                    <Image className="h-6 w-6 text-gray-500" />
                                                                </div>
                                                            )}
                                                        </div>
                                                        <div className="ml-4">
                                                            <div className="text-sm font-medium text-gray-900">
                                                                {tag.title}
                                                            </div>
                                                        </div>
                                                    </div>
                                                </td>
                                                <td className="px-6 py-4">
                                                    <div className="text-sm text-blue-600 hover:text-blue-800">
                                                        <a 
                                                            href={tag.page_url} 
                                                            target="_blank" 
                                                            rel="noopener noreferrer"
                                                            className="flex items-center gap-1"
                                                        >
                                                            <Globe className="h-4 w-4" />
                                                            {truncateText(tag.page_url, 30)}
                                                        </a>
                                                    </div>
                                                </td>
                                                <td className="px-6 py-4">
                                                    {tag.keyword ? (
                                                        <span className="px-2 py-1 text-xs font-medium bg-blue-100 text-blue-800 rounded-full">
                                                            {truncateText(tag.keyword, 20)}
                                                        </span>
                                                    ) : (
                                                        <span className="text-gray-400 text-sm">No keywords</span>
                                                    )}
                                                </td>
                                                <td className="px-6 py-4">
                                                    <div className="text-sm text-gray-900 max-w-xs">
                                                        {tag.description ? truncateText(tag.description, 50) : (
                                                            <span className="text-gray-400">No description</span>
                                                        )}
                                                    </div>
                                                </td>
                                                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                                                    <div className="flex items-center space-x-3">
                                                        <button
                                                            onClick={() => handleEdit(tag)}
                                                            className="text-blue-600 hover:text-blue-900 flex items-center gap-1"
                                                        >
                                                            <Edit className="h-4 w-4" />
                                                            Edit
                                                        </button>
                                                        <button
                                                            onClick={() => handleDelete(tag.id)}
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
                                <Tag className="mx-auto h-12 w-12 text-gray-400" />
                                <h3 className="mt-2 text-sm font-medium text-gray-900">No tags</h3>
                                <p className="mt-1 text-sm text-gray-500">
                                    Get started by adding your first tag.
                                </p>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </Layout>
    );
};

export default TagManagement;
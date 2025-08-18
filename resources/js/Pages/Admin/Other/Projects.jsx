import React, { useState, useEffect } from "react";
import { useForm, usePage, router } from "@inertiajs/react";
import { Plus, Edit, Trash2, X, Globe, Calendar, Code, ImageIcon, Upload, Play, ExternalLink } from "lucide-react";
import Layout from "@/Layouts/Layout";

// Enhanced SingleInputArray component
const SingleInputArray = ({ form, field, label, placeholder }) => {
    const [tempValue, setTempValue] = useState("");

    const handleAdd = () => {
        if (tempValue.trim() !== "") {
            form.setData({
                ...form.data,
                [field]: [...form.data[field], tempValue.trim()]
            });
            setTempValue("");
        }
    };

    const handleKeyPress = (e) => {
        if (e.key === 'Enter') {
            e.preventDefault();
            handleAdd();
        }
    };

    const handleRemove = (index) => {
        const updated = form.data[field].filter((_, i) => i !== index);
        form.setData({
            ...form.data,
            [field]: updated
        });
    };

    return (
        <div className="space-y-3">
            <label className="block text-sm font-semibold text-gray-700">{label}</label>
            <div className="flex gap-3">
                <input
                    type="text"
                    value={tempValue}
                    onChange={(e) => setTempValue(e.target.value)}
                    onKeyPress={handleKeyPress}
                    placeholder={placeholder}
                    className="flex-1 px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                />
                <button
                    type="button"
                    onClick={handleAdd}
                    className="px-6 py-3 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors font-medium"
                >
                    Add
                </button>
            </div>

            {/* Show added items */}
            <div className="space-y-2">
                {form.data[field].map((item, index) => (
                    item?.trim() && (
                        <div
                            key={index}
                            className="flex justify-between items-center px-4 py-3 bg-gray-50 border border-gray-200 rounded-lg"
                        >
                            <span className="text-gray-800 flex-1">{item}</span>
                            <button
                                type="button"
                                onClick={() => handleRemove(index)}
                                className="text-red-600 hover:text-red-800 transition-colors font-medium"
                            >
                                Remove
                            </button>
                        </div>
                    )
                ))}
            </div>
            
            {form.errors[field] && (
                <p className="text-sm text-red-600">
                    {form.errors[field]}
                </p>
            )}
        </div>
    );
};

const Projects = () => {
    const { projects, flash } = usePage().props;
    const [editingProject, setEditingProject] = useState(null);
    const [alertMessage, setAlertMessage] = useState("");
    const [alertType, setAlertType] = useState("");
    const [imagePreview, setImagePreview] = useState("");
    const [videoPreview, setVideoPreview] = useState("");

    // Single form for both create and edit
    const form = useForm({
        type: "",
        title: "",
        image: null,
        video: null,
        description: "",
        starting_date: "",
        ending_date: "",
        tech_used: [], // Array for technologies
        url: "",
        duration: "", // Calculated and set dynamically
    });

    useEffect(() => {
        if (flash?.message) {
            showAlert(flash.message, flash.type || 'success');
        }
    }, [flash]);

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
            type: "",
            title: "",
            image: null,
            video: null,
            description: "",
            starting_date: "",
            ending_date: "",
            tech_used: [],
            url: "",
            duration: "",
        });
        form.clearErrors();
        setEditingProject(null);
        setImagePreview("");
        setVideoPreview("");
    };

    const handleEdit = (project) => {
        setEditingProject(project);
        form.setData({
            type: project.type || "",
            title: project.title || "",
            image: null,
            video: null,
            description: project.description || "",
            starting_date: project.starting_date || "",
            ending_date: project.ending_date || "",
            tech_used: project.tech_used ? project.tech_used.split(',').map(item => item.trim()) : [],
            url: project.url || "",
            duration: project.duration || "",
        });
        form.clearErrors();
        
        // Set previews for existing project
        if (project.image) {
            setImagePreview(`/assets/images/projects/${project.image}`);
        }
        if (project.video) {
            setVideoPreview(`/assets/videos/projects/${project.video}`);
        }

        // Scroll to form
        document.getElementById('projectForm')?.scrollIntoView({ behavior: 'smooth' });
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

    const handleVideoChange = (e) => {
        const file = e.target.files[0];
        if (file) {
            form.setData('video', file);
            
            // Create preview
            const reader = new FileReader();
            reader.onload = (e) => {
                setVideoPreview(e.target.result);
            };
            reader.readAsDataURL(file);
        }
    };

    const calculateDuration = (startDate, endDate) => {
        if (!startDate || !endDate) return "";
        const start = new Date(startDate);
        const end = new Date(endDate);
        if (isNaN(start) || isNaN(end) || end < start) return "";

        const diffTime = Math.abs(end - start);
        const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
        const months = Math.floor(diffDays / 30);
        const days = diffDays % 30;

        let duration = "";
        if (months > 0) duration += `${months} month${months > 1 ? 's' : ''}`;
        if (days > 0) duration += `${months > 0 ? ', ' : ''}${days} day${days > 1 ? 's' : ''}`;
        return duration || "0 days";
    };

    useEffect(() => {
        const duration = calculateDuration(form.data.starting_date, form.data.ending_date);
        form.setData('duration', duration);
    }, [form.data.starting_date, form.data.ending_date]);

    const handleSubmit = (e) => {
        e.preventDefault();
        
        // Send tech_used as an array (no join needed since backend expects array)
        const formData = { ...form.data };

        if (editingProject) {
            // Update existing project
            form.post(route("projects.update", editingProject.id), {
                forceFormData: true,
                _method: 'PUT',
                data: formData,
                onSuccess: () => {
                    resetForm();
                    showAlert("Project updated successfully!");
                },
                onError: (errors) => {
                    showAlert("Failed to update project. Please check the form.", "error");
                },
            });
        } else {
            // Create new project
            form.post(route("projects.store"), {
                forceFormData: true,
                data: formData,
                onSuccess: () => {
                    resetForm();
                    showAlert("Project added successfully!");
                },
                onError: (errors) => {
                    showAlert("Failed to add project. Please check the form.", "error");
                },
            });
        }
    };

    const handleDelete = (id) => {
        if (confirm("Are you sure you want to delete this project?")) {
            router.delete(route("projects.destroy", id), {
                onSuccess: () => {
                    showAlert("Project deleted successfully!");
                },
                onError: () => {
                    showAlert("Failed to delete project.", "error");
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
            <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50 p-6">
                <div className="max-w-7xl mx-auto">
                    {/* Header */}
                    <div className="mb-8">
                        <h1 className="text-4xl font-bold text-gray-900 mb-2">Our Projects</h1>
                        <p className="text-gray-600">Manage and showcase your company's projects</p>
                    </div>

                    {/* Alert Message */}
                    {alertMessage && (
                        <div className={`mb-6 p-4 rounded-lg border ${
                            alertType === 'error' 
                                ? 'bg-red-50 border-red-200 text-red-800' 
                                : 'bg-green-50 border-green-200 text-green-800'
                        }`}>
                            <div className="flex items-center justify-between">
                                <span>{alertMessage}</span>
                                <button 
                                    onClick={() => setAlertMessage("")}
                                    className="text-gray-500 hover:text-gray-700"
                                >
                                    <X className="h-4 w-4" />
                                </button>
                            </div>
                        </div>
                    )}

                    {/* Add/Edit Form */}
                    <div className="bg-white rounded-xl shadow-sm border border-gray-200 mb-8" id="projectForm">
                        <div className="p-6 border-b border-gray-200">
                            <h2 className="text-xl font-semibold text-gray-900 flex items-center gap-2">
                                <Plus className="h-5 w-5" />
                                {editingProject ? 'Edit Project' : 'Add New Project'}
                            </h2>
                        </div>
                        
                        <form onSubmit={handleSubmit} className="p-6">
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                {/* Project Type */}
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-2">
                                        Project Type *
                                    </label>
                                    <select
                                        value={form.data.type}
                                        onChange={(e) => form.setData('type', e.target.value)}
                                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                        required
                                    >
                                        <option value="" disabled>Select project type</option>
                                        <option value="Website">Website</option>
                                        <option value="Creative">Creative</option>
                                        <option value="Reel">Reel</option>
                                    </select>
                                    {form.errors.type && (
                                        <p className="mt-1 text-sm text-red-600">{form.errors.type}</p>
                                    )}
                                </div>

                                {/* Project Title */}
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-2">
                                        Project Title *
                                    </label>
                                    <input
                                        type="text"
                                        value={form.data.title}
                                        onChange={(e) => form.setData('title', e.target.value)}
                                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                        placeholder="Enter project title"
                                        required
                                    />
                                    {form.errors.title && (
                                        <p className="mt-1 text-sm text-red-600">{form.errors.title}</p>
                                    )}
                                </div>

                                {/* Starting Date */}
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-2">
                                        Starting Date *
                                    </label>
                                    <input
                                        type="date"
                                        value={form.data.starting_date}
                                        onChange={(e) => form.setData('starting_date', e.target.value)}
                                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                        required
                                    />
                                    {form.errors.starting_date && (
                                        <p className="mt-1 text-sm text-red-600">{form.errors.starting_date}</p>
                                    )}
                                </div>

                                {/* Ending Date */}
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-2">
                                        Ending Date *
                                    </label>
                                    <input
                                        type="date"
                                        value={form.data.ending_date}
                                        onChange={(e) => form.setData('ending_date', e.target.value)}
                                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                        required
                                    />
                                    {form.errors.ending_date && (
                                        <p className="mt-1 text-sm text-red-600">{form.errors.ending_date}</p>
                                    )}
                                </div>

                                {/* Technologies Used */}
                                <div className="md:col-span-2">
                                    <SingleInputArray
                                        form={form}
                                        field="tech_used"
                                        label="Technologies Used *"
                                        placeholder="Type a technology and press Enter or Add"
                                    />
                                </div>

                                {/* Project URL */}
                                <div className="md:col-span-2">
                                    <label className="block text-sm font-medium text-gray-700 mb-2">
                                        Project URL
                                    </label>
                                    <input
                                        type="url"
                                        value={form.data.url}
                                        onChange={(e) => form.setData('url', e.target.value)}
                                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                        placeholder="https://example.com"
                                    />
                                    {form.errors.url && (
                                        <p className="mt-1 text-sm text-red-600">{form.errors.url}</p>
                                    )}
                                </div>

                                {/* Description */}
                                <div className="md:col-span-2">
                                    <label className="block text-sm font-medium text-gray-700 mb-2">
                                        Description *
                                    </label>
                                    <textarea
                                        value={form.data.description}
                                        onChange={(e) => form.setData('description', e.target.value)}
                                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                        placeholder="Describe the project..."
                                        rows="4"
                                        required
                                    />
                                    {form.errors.description && (
                                        <p className="mt-1 text-sm text-red-600">{form.errors.description}</p>
                                    )}
                                </div>

                                {/* Image Upload */}
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-2">
                                        Project Image (Optional)
                                    </label>
                                    <div className="space-y-4">
                                        <div className="flex items-center justify-center w-full">
                                            <label className="flex flex-col items-center justify-center w-full h-32 border-2 border-gray-300 border-dashed rounded-lg cursor-pointer bg-gray-50 hover:bg-gray-100">
                                                <div className="flex flex-col items-center justify-center pt-5 pb-6">
                                                    <Upload className="w-8 h-8 mb-4 text-gray-500" />
                                                    <p className="mb-2 text-sm text-gray-500">
                                                        <span className="font-semibold">Click to upload image</span>
                                                    </p>
                                                    <p className="text-xs text-gray-500">JPG, JPEG, PNG, WEBP (MAX. 2MB)</p>
                                                </div>
                                                <input
                                                    type="file"
                                                    className="hidden"
                                                    accept="image/*"
                                                    onChange={handleImageChange}
                                                />
                                            </label>
                                        </div>
                                        {imagePreview && (
                                            <div className="relative">
                                                <img
                                                    src={imagePreview}
                                                    alt="Preview"
                                                    className="w-full h-32 object-cover rounded-lg"
                                                />
                                                <button
                                                    type="button"
                                                    onClick={() => {
                                                        setImagePreview("");
                                                        form.setData('image', null);
                                                    }}
                                                    className="absolute top-2 right-2 bg-red-500 text-white rounded-full p-1 hover:bg-red-600"
                                                >
                                                    <X className="h-4 w-4" />
                                                </button>
                                            </div>
                                        )}
                                    </div>
                                    {form.errors.image && (
                                        <p className="mt-1 text-sm text-red-600">{form.errors.image}</p>
                                    )}
                                </div>

                                {/* Video Upload */}
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-2">
                                        Project Video (Optional)
                                    </label>
                                    <div className="space-y-4">
                                        <div className="flex items-center justify-center w-full">
                                            <label className="flex flex-col items-center justify-center w-full h-32 border-2 border-gray-300 border-dashed rounded-lg cursor-pointer bg-gray-50 hover:bg-gray-100">
                                                <div className="flex flex-col items-center justify-center pt-5 pb-6">
                                                    <Play className="w-8 h-8 mb-4 text-gray-500" />
                                                    <p className="mb-2 text-sm text-gray-500">
                                                        <span className="font-semibold">Click to upload video</span>
                                                    </p>
                                                    <p className="text-xs text-gray-500">WEBM (MAX. 5MB)</p>
                                                </div>
                                                <input
                                                    type="file"
                                                    className="hidden"
                                                    accept="video/webm"
                                                    onChange={handleVideoChange}
                                                />
                                            </label>
                                        </div>
                                        {videoPreview && (
                                            <div className="relative">
                                                <video
                                                    src={videoPreview}
                                                    className="w-full h-32 object-cover rounded-lg"
                                                    controls
                                                />
                                                <button
                                                    type="button"
                                                    onClick={() => {
                                                        setVideoPreview("");
                                                        form.setData('video', null);
                                                    }}
                                                    className="absolute top-2 right-2 bg-red-500 text-white rounded-full p-1 hover:bg-red-600"
                                                >
                                                    <X className="h-4 w-4" />
                                                </button>
                                            </div>
                                        )}
                                    </div>
                                    {form.errors.video && (
                                        <p className="mt-1 text-sm text-red-600">{form.errors.video}</p>
                                    )}
                                </div>
                            </div>

                            {/* Form Actions */}
                            <div className="flex items-center justify-end gap-4 mt-6 pt-6 border-t border-gray-200">
                                {editingProject && (
                                    <button
                                        type="button"
                                        onClick={resetForm}
                                        className="px-4 py-2 text-gray-700 bg-gray-100 rounded-lg hover:bg-gray-200 transition-colors"
                                    >
                                        Cancel
                                    </button>
                                )}
                                <button
                                    type="submit"
                                    disabled={form.processing}
                                    className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                                >
                                    {form.processing ? 'Processing...' : (editingProject ? 'Update Project' : 'Add Project')}
                                </button>
                            </div>
                        </form>
                    </div>

                    {/* Projects Grid */}
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {projects && projects.length > 0 ? (
                            projects.map((project) => (
                                <div key={project.id} className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden hover:shadow-md transition-shadow">
                                    {/* Project Image */}
                                    {project.image && (
                                        <div className="relative h-48 bg-gray-100">
                                            <img
                                                src={`/assets/images/projects/${project.image}`}
                                                alt={project.title}
                                                className="w-full h-full object-cover"
                                            />
                                            {project.video && (
                                                <div className="absolute top-3 right-3 bg-black bg-opacity-50 text-white px-2 py-1 rounded-full text-sm flex items-center gap-1">
                                                    <Play className="h-3 w-3" />
                                                    Video
                                                </div>
                                            )}
                                        </div>
                                    )}

                                    <div className="p-6">
                                        {/* Project Header */}
                                        <div className="flex items-start justify-between mb-3">
                                            <div>
                                                <span className="inline-block bg-blue-100 text-blue-800 text-xs px-2 py-1 rounded-full mb-2">
                                                    {project.type}
                                                </span>
                                                <h3 className="text-lg font-semibold text-gray-900 mb-1">{project.title}</h3>
                                            </div>
                                            <div className="flex gap-2">
                                                <button
                                                    onClick={() => handleEdit(project)}
                                                    className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                                                    title="Edit project"
                                                >
                                                    <Edit className="h-4 w-4" />
                                                </button>
                                                <button
                                                    onClick={() => handleDelete(project.id)}
                                                    className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                                                    title="Delete project"
                                                >
                                                    <Trash2 className="h-4 w-4" />
                                                </button>
                                            </div>
                                        </div>

                                        {/* Project Description */}
                                        <p className="text-gray-600 text-sm mb-4 line-clamp-3">
                                            {project.description}
                                        </p>

                                        {/* Project Details */}
                                        <div className="space-y-2 mb-4">
                                            <div className="flex items-center gap-2 text-sm text-gray-600">
                                                <Calendar className="h-4 w-4" />
                                                <span>Duration: {project.duration}</span>
                                            </div>
                                            <div className="flex items-center gap-2 text-sm text-gray-600">
                                                <Code className="h-4 w-4" />
                                                <span>Tech: {project.tech_used.join(', ')}</span>
                                            </div>
                                            {project.url && (
                                                <div className="flex items-center gap-2 text-sm">
                                                    <Globe className="h-4 w-4 text-gray-600" />
                                                    <a
                                                        href={project.url}
                                                        target="_blank"
                                                        rel="noopener noreferrer"
                                                        className="text-blue-600 hover:text-blue-800 hover:underline flex items-center gap-1"
                                                    >
                                                        Visit Project <ExternalLink className="h-3 w-3" />
                                                    </a>
                                                </div>
                                            )}
                                        </div>

                                        {/* Video Preview */}
                                        {project.video && (
                                            <div className="mt-4">
                                                <video
                                                    src={`/assets/videos/projects/${project.video}`}
                                                    className="w-full h-32 object-cover rounded-lg"
                                                    controls
                                                    poster={project.image ? `/assets/images/projects/${project.image}` : undefined}
                                                />
                                            </div>
                                        )}

                                        {/* Project Footer */}
                                        <div className="flex items-center justify-between pt-4 border-t border-gray-100 text-xs text-gray-500">
                                            <span>Created {formatDate(project.created_at)}</span>
                                            {project.updated_at !== project.created_at && (
                                                <span>Updated {formatDate(project.updated_at)}</span>
                                            )}
                                        </div>
                                    </div>
                                </div>
                            ))
                        ) : (
                            <div className="col-span-full text-center py-12">
                                <div className="flex flex-col items-center gap-4">
                                    <div className="w-24 h-24 bg-gray-100 rounded-full flex items-center justify-center">
                                        <ImageIcon className="h-12 w-12 text-gray-400" />
                                    </div>
                                    <div>
                                        <h3 className="text-lg font-medium text-gray-900 mb-2">No projects yet</h3>
                                        <p className="text-gray-600 mb-4">Get started by adding your first project.</p>
                                        <button
                                            onClick={() => document.getElementById('projectForm')?.scrollIntoView({ behavior: 'smooth' })}
                                            className="inline-flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                                        >
                                            <Plus className="h-4 w-4" />
                                            Add Your First Project
                                        </button>
                                    </div>
                                </div>
                            </div>
                        )}
                    </div>

                    {/* Stats Summary */}
                    {projects && projects.length > 0 && (
                        <div className="mt-8 bg-white rounded-xl shadow-sm border border-gray-200 p-6">
                            <h3 className="text-lg font-semibold text-gray-900 mb-4">Project Statistics</h3>
                            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                                <div className="text-center p-4 bg-blue-50 rounded-lg">
                                    <div className="text-2xl font-bold text-blue-600">{projects.length}</div>
                                    <div className="text-sm text-gray-600">Total Projects</div>
                                </div>
                                <div className="text-center p-4 bg-green-50 rounded-lg">
                                    <div className="text-2xl font-bold text-green-600">
                                        {projects.filter(p => p.url).length}
                                    </div>
                                    <div className="text-sm text-gray-600">Live Projects</div>
                                </div>
                                <div className="text-center p-4 bg-purple-50 rounded-lg">
                                    <div className="text-2xl font-bold text-purple-600">
                                        {projects.filter(p => p.video).length}
                                    </div>
                                    <div className="text-sm text-gray-600">With Videos</div>
                                </div>
                                <div className="text-center p-4 bg-orange-50 rounded-lg">
                                    <div className="text-2xl font-bold text-orange-600">
                                        {[...new Set(projects.map(p => p.type))].length}
                                    </div>
                                    <div className="text-sm text-gray-600">Project Types</div>
                                </div>
                            </div>
                        </div>
                    )}
                </div>
            </div>
        </Layout>
    );
};

export default Projects;
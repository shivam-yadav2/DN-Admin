import { useState } from "react";
import { Link, useForm, usePage, router } from "@inertiajs/react";
import { Plus, Edit, Trash2, X } from "lucide-react";
import Layout from "@/Layouts/Layout";

const Career = () => {
    const { careers, flash } = usePage().props;
    const [editingCareer, setEditingCareer] = useState(null);
    const [alertMessage, setAlertMessage] = useState("");
    const [alertType, setAlertType] = useState(""); // 'success' or 'error'

    
    // Single form for both create and edit
    const form = useForm({
        desig: "",
        title: "",
        city: "",
        job_type: "part-time",
        work_mode: "onsite",
        about_role: "",
        responsibilities: [""],
        requirements: [""],
        benefits_perks: [""],
    });
        console.log(form)

    const showAlert = (message, type = 'success') => {
        setAlertMessage(message);
        setAlertType(type);
        setTimeout(() => {
            setAlertMessage("");
            setAlertType("");
        }, 3000);
    };

    const resetForm = () => {
        form.reset();
        form.setData({
            desig: "",
            title: "",
            city: "",
            job_type: "part-time",
            work_mode: "onsite",
            about_role: "",
            responsibilities: [""],
            requirements: [""],
            benefits_perks: [""],
        });
        form.clearErrors();
        setEditingCareer(null);
    };

    const handleEdit = (career) => {
        setEditingCareer(career);
        form.setData({
            desig: career.desig,
            title: career.title,
            city: career.city,
            job_type: career.job_type,
            work_mode: career.work_mode,
            about_role: career.about_role,
            responsibilities: career.responsibilities,
            requirements: career.requirements,
            benefits_perks: career.benefits_perks,
        });
        form.clearErrors();
        
        // Scroll to form
        document.getElementById('careerForm').scrollIntoView({ behavior: 'smooth' });
    };

    const handleSubmit = () => {
        const cleanedData = {
            ...form.data,
            responsibilities: form.data.responsibilities.filter((r) => r.trim()),
            requirements: form.data.requirements.filter((r) => r.trim()),
            benefits_perks: form.data.benefits_perks.filter((b) => b.trim()),
        };

        if (editingCareer) {
            // Update existing career
            form.put(route("career.update", editingCareer.id), {
                data: cleanedData,
                onSuccess: () => {
                    resetForm();
                    showAlert("Career updated successfully!");
                },
                onError: (errors) => {
                    showAlert("Failed to update career. Please check the form.", "error");
                },
            });
        } else {
            // Create new career
            form.post(route("career.store"), {
                data: cleanedData,
                onSuccess: () => {
                    resetForm();
                    showAlert("Career created successfully!");
                },
                onError: (errors) => {
                    console.log(errors)
                    showAlert("Failed to create career. Please check the form.", "error");
                },
            });
        }
    };

    const handleDelete = (id) => {
        router.delete(route("career.destroy", id), {
            onSuccess: () => {
                showAlert("Career deleted successfully!");
            },
            onError: (errors) => {
                showAlert("Failed to delete career.", "error");
            },
        });
    };

    return (
        <Layout>
            <div className="p-6 max-w-7xl mx-auto">
                <div className="flex justify-between items-center mb-6">
                    <h1 className="text-3xl font-bold text-gray-900">
                        Career Management
                    </h1>
                    <a href="#careerForm">
                        <button 
                            onClick={() => resetForm()}
                            className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                        >
                            <Plus className="w-4 h-4" />
                            Add Career
                        </button>
                    </a>
                </div>

                {/* Alert Box */}
                {alertMessage && (
                    <div className={`mb-4 p-4 rounded-lg ${
                        alertType === 'success' 
                            ? 'bg-green-100 border border-green-400 text-green-700'
                            : 'bg-red-100 border border-red-400 text-red-700'
                    }`}>
                        {alertMessage}
                    </div>
                )}

                {/* Flash Messages */}
                {flash?.message && (
                    <div className="mb-4 p-4 bg-green-100 border border-green-400 text-green-700 rounded-lg">
                        {flash.message}
                    </div>
                )}

                {/* Careers Table */}
                <div className="bg-white rounded-lg shadow overflow-hidden mb-8">
                    <div className="overflow-x-auto">
                        <table className="min-w-full divide-y divide-gray-200">
                            <thead className="bg-gray-50">
                                <tr>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                        Position
                                    </th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                        Location & Type
                                    </th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                        About Role
                                    </th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                        Created
                                    </th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                        Actions
                                    </th>
                                </tr>
                            </thead>
                            <tbody className="bg-white divide-y divide-gray-200">
                                {careers && careers.length === 0 ? (
                                    <tr>
                                        <td
                                            colSpan="5"
                                            className="px-6 py-8 text-center text-gray-500"
                                        >
                                            <div className="flex flex-col items-center">
                                                <div className="text-lg mb-2">
                                                    No careers found
                                                </div>
                                                <div className="text-sm">
                                                    Click "Add Career" to create
                                                    your first job posting
                                                </div>
                                            </div>
                                        </td>
                                    </tr>
                                ) : (
                                    careers?.map((career) => (
                                        <tr
                                            key={career.id}
                                            className="hover:bg-gray-50"
                                        >
                                            <td className="px-6 py-4 whitespace-nowrap">
                                                <div>
                                                    <div className="text-sm font-medium text-gray-900">
                                                        {career.desig}
                                                    </div>
                                                    <div className="text-sm text-gray-500">
                                                        {career.title}
                                                    </div>
                                                </div>
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap">
                                                <div>
                                                    <div className="text-sm text-gray-900">
                                                        {career.city}
                                                    </div>
                                                    <div className="flex gap-2 mt-1">
                                                        <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                                                            {career.job_type}
                                                        </span>
                                                        <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
                                                            {career.work_mode}
                                                        </span>
                                                    </div>
                                                </div>
                                            </td>
                                            <td className="px-6 py-4">
                                                <div className="text-sm text-gray-900 max-w-xs truncate">
                                                    {career.about_role}
                                                </div>
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                                {new Date(
                                                    career.created_at
                                                ).toLocaleDateString()}
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                                                <div className="flex gap-2">
                                                    <button
                                                        onClick={() => handleEdit(career)}
                                                        className="inline-flex items-center px-3 py-1 text-sm bg-blue-100 text-blue-700 rounded-md hover:bg-blue-200 transition-colors"
                                                        title="Edit Career"
                                                    >
                                                        <Edit className="w-4 h-4 mr-1" />
                                                        Edit
                                                    </button>
                                                    <button
                                                        onClick={() => handleDelete(career.id)}
                                                        className="inline-flex items-center px-3 py-1 text-sm bg-red-100 text-red-700 rounded-md hover:bg-red-200 transition-colors"
                                                        title="Delete Career"
                                                    >
                                                        <Trash2 className="w-4 h-4 mr-1" />
                                                        Delete
                                                    </button>
                                                </div>
                                            </td>
                                        </tr>
                                    ))
                                )}
                            </tbody>
                        </table>
                    </div>
                </div>

                {/* Career Form */}
                <div
                    id="careerForm"
                    className="bg-white rounded-xl shadow-lg border border-gray-200"
                >
                    <div className="p-8">
                        <div className="flex justify-between items-center mb-6">
                            <div>
                                <h2 className="text-2xl font-bold text-gray-900">
                                    {editingCareer ? "Edit Career" : "Add New Career"}
                                </h2>
                                <p className="text-gray-600 mt-1">
                                    {editingCareer 
                                        ? "Update the career opportunity details" 
                                        : "Create a new career opportunity for your organization"
                                    }
                                </p>
                            </div>
                            {editingCareer && (
                                <button
                                    onClick={resetForm}
                                    className="flex items-center gap-2 px-4 py-2 text-gray-600 hover:text-gray-800 transition-colors"
                                    title="Cancel Edit"
                                >
                                    <X className="w-4 h-4" />
                                    Cancel
                                </button>
                            )}
                        </div>

                        {/* Display Form Errors */}
                        {Object.keys(form.errors).length > 0 && (
                            <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg">
                                <h3 className="text-sm font-medium text-red-800 mb-2">Please fix the following errors:</h3>
                                <ul className="list-disc list-inside text-sm text-red-700 space-y-1">
                                    {Object.values(form.errors).map((error, index) => (
                                        <li key={index}>{error}</li>
                                    ))}
                                </ul>
                            </div>
                        )}

                        {/* Form Fields */}
                        <div className="space-y-6">
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                <div>
                                    <label className="block text-sm font-semibold text-gray-700 mb-2">
                                        Designation *
                                    </label>
                                    <input
                                        type="text"
                                        value={form.data.desig}
                                        onChange={(e) => form.setData("desig", e.target.value)}
                                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                                        placeholder="e.g., Senior Software Engineer"
                                    />
                                    {form.errors.desig && (
                                        <p className="mt-1 text-sm text-red-600">
                                            {form.errors.desig}
                                        </p>
                                    )}
                                </div>

                                <div>
                                    <label className="block text-sm font-semibold text-gray-700 mb-2">
                                        Title *
                                    </label>
                                    <input
                                        type="text"
                                        value={form.data.title}
                                        onChange={(e) => form.setData("title", e.target.value)}
                                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                                        placeholder="e.g., Full Stack Developer"
                                    />
                                    {form.errors.title && (
                                        <p className="mt-1 text-sm text-red-600">
                                            {form.errors.title}
                                        </p>
                                    )}
                                </div>

                                <div>
                                    <label className="block text-sm font-semibold text-gray-700 mb-2">
                                        City *
                                    </label>
                                    <input
                                        type="text"
                                        value={form.data.city}
                                        onChange={(e) => form.setData("city", e.target.value)}
                                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                                        placeholder="e.g., New York"
                                    />
                                    {form.errors.city && (
                                        <p className="mt-1 text-sm text-red-600">
                                            {form.errors.city}
                                        </p>
                                    )}
                                </div>

                                <div>
                                    <label className="block text-sm font-semibold text-gray-700 mb-2">
                                        Job Type
                                    </label>
                                    <select
                                        value={form.data.job_type}
                                        onChange={(e) => form.setData("job_type", e.target.value)}
                                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                                    >
                                        <option value="part-time">Part Time</option>
                                        <option value="full-time">Full Time</option>
                                        <option value="contract">Contract</option>
                                        <option value="internship">Internship</option>
                                    </select>
                                </div>
                            </div>

                            <div>
                                <label className="block text-sm font-semibold text-gray-700 mb-2">
                                    Work Mode
                                </label>
                                <select
                                    value={form.data.work_mode}
                                    onChange={(e) => form.setData("work_mode", e.target.value)}
                                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all md:w-1/2"
                                >
                                    <option value="onsite">Onsite</option>
                                    <option value="remote">Remote</option>
                                    <option value="hybrid">Hybrid</option>
                                </select>
                            </div>

                            <div>
                                <label className="block text-sm font-semibold text-gray-700 mb-2">
                                    About Role *
                                </label>
                                <textarea
                                    value={form.data.about_role}
                                    onChange={(e) => form.setData("about_role", e.target.value)}
                                    rows={4}
                                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all resize-none"
                                    placeholder="Brief description about the role and what the candidate will be doing..."
                                />
                                {form.errors.about_role && (
                                    <p className="mt-1 text-sm text-red-600">
                                        {form.errors.about_role}
                                    </p>
                                )}
                            </div>

                            <SingleInputArray
                                form={form}
                                field="responsibilities"
                                label="Responsibilities *"
                                placeholder="Add a responsibility"
                            />

                            <SingleInputArray
                                form={form}
                                field="requirements"
                                label="Requirements *"
                                placeholder="Add a requirement"
                            />

                            <SingleInputArray
                                form={form}
                                field="benefits_perks"
                                label="Benefits & Perks *"
                                placeholder="Add a benefit or perk"
                            />
                        </div>

                        {/* Form Actions */}
                        <div className="flex justify-end gap-4 mt-8 pt-6 border-t border-gray-200">
                            <button
                                onClick={resetForm}
                                disabled={form.processing}
                                className="px-6 py-3 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors font-medium disabled:opacity-50"
                            >
                                {editingCareer ? "Cancel" : "Reset"}
                            </button>
                            <button
                                onClick={handleSubmit}
                                disabled={form.processing}
                                className="px-8 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-medium disabled:opacity-50 disabled:cursor-not-allowed"
                            >
                                {form.processing
                                    ? (editingCareer ? "Updating..." : "Creating...")
                                    : (editingCareer ? "Update Career" : "Create Career")
                                }
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </Layout>
    );
};

export default Career;

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
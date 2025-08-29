import { useState, useEffect } from "react";
import { useForm, usePage } from "@inertiajs/react";
import { Head } from "@inertiajs/react";
import Layout from "@/Layouts/Layout";
import ShowImg from "@/Pages/utils/ShowImg";

export default function SeoDigital({ seoDigitals }) {
    const { flash } = usePage().props;

    // Form for creating a new SEO digital record
    const {
        data: createData,
        setData: setCreateData,
        post,
        processing: createProcessing,
        errors: createErrors,
        reset,
        delete: deleteData,
    } = useForm({
        icon: "",
        heading: "",
        description: "",
    });

    // Form for editing an existing SEO digital record
    const [editId, setEditId] = useState(null);
    const {
        data: editData,
        setData: setEditData,
        put,
        processing: editProcessing,
        errors: editErrors,
    } = useForm({
        icon: "",
        heading: "",
        description: "",
    });

    // Handle create form submission
    const handleCreate = (e) => {
        e.preventDefault();
        post(route("seo-digital.store"), {
            onSuccess: () => reset(),
        });
    };

    // Handle edit form submission
    const handleUpdate = (e) => {
        e.preventDefault();
        put(route("seo-digital.update", editId), {
            onSuccess: () => setEditId(null),
        });
    };

    // Handle edit button click
    const startEditing = (seoDigital) => {
        setEditId(seoDigital.id);
        setEditData({
            icon: seoDigital.icon,
            heading: seoDigital.heading,
            description: seoDigital.description,
        });
    };

    // Handle delete
    const handleDelete = (id) => {
        if (confirm("Are you sure you want to delete this SEO process?")) {
            deleteData(route("seo-digital.destroy", id), {
                onSuccess: () => {
                    setEditId(null);
                },
            });
        }
    };

    return (
        <Layout>
            <div className="container mx-auto p-6">
                <Head title="SEO Digital Processes" />
                <div className="flex justify-between items-center mb-6">
                    <h1 className="text-3xl font-bold mb-6">
                        SEO Digital Processes
                    </h1>
                    <ShowImg img="/assets/refImg/SEOdigital.png" />
                </div>

                {/* Flash Messages */}
                {flash?.message && (
                    <div className="mb-4 p-4 bg-green-100 text-green-700 rounded">
                        {flash.message}
                    </div>
                )}
                {flash?.error && (
                    <div className="mb-4 p-4 bg-red-100 text-red-700 rounded">
                        {flash.error}
                    </div>
                )}

                {/* Create Form */}
                <div className="mb-8 p-6 bg-white rounded-lg shadow">
                    <h2 className="text-2xl font-semibold mb-4">
                        Create New SEO Process
                    </h2>
                    <form onSubmit={handleCreate} className="space-y-4">
                        <div>
                            <label className="block text-sm font-medium text-gray-700">
                                Icon
                            </label>
                            <input
                                type="text"
                                value={createData.icon}
                                onChange={(e) =>
                                    setCreateData("icon", e.target.value)
                                }
                                className="mt-1 block w-full border-gray-300 rounded-md shadow-sm"
                            />
                            {createErrors.icon && (
                                <p className="text-red-500 text-sm">
                                    {createErrors.icon}
                                </p>
                            )}
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-700">
                                Heading
                            </label>
                            <input
                                type="text"
                                value={createData.heading}
                                onChange={(e) =>
                                    setCreateData("heading", e.target.value)
                                }
                                className="mt-1 block w-full border-gray-300 rounded-md shadow-sm"
                            />
                            {createErrors.heading && (
                                <p className="text-red-500 text-sm">
                                    {createErrors.heading}
                                </p>
                            )}
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-700">
                                Description
                            </label>
                            <textarea
                                value={createData.description}
                                onChange={(e) =>
                                    setCreateData("description", e.target.value)
                                }
                                className="mt-1 block w-full border-gray-300 rounded-md shadow-sm"
                            />
                            {createErrors.description && (
                                <p className="text-red-500 text-sm">
                                    {createErrors.description}
                                </p>
                            )}
                        </div>
                        <button
                            type="submit"
                            disabled={createProcessing}
                            className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 disabled:bg-blue-300"
                        >
                            Create
                        </button>
                    </form>
                </div>

                {/* Edit Form */}
                {editId && (
                    <div className="mb-8 p-6 bg-white rounded-lg shadow">
                        <h2 className="text-2xl font-semibold mb-4">
                            Edit SEO Process
                        </h2>
                        <form onSubmit={handleUpdate} className="space-y-4">
                            <div>
                                <label className="block text-sm font-medium text-gray-700">
                                    Icon
                                </label>
                                <input
                                    type="text"
                                    value={editData.icon}
                                    onChange={(e) =>
                                        setEditData("icon", e.target.value)
                                    }
                                    className="mt-1 block w-full border-gray-300 rounded-md shadow-sm"
                                />
                                {editErrors.icon && (
                                    <p className="text-red-500 text-sm">
                                        {editErrors.icon}
                                    </p>
                                )}
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700">
                                    Heading
                                </label>
                                <input
                                    type="text"
                                    value={editData.heading}
                                    onChange={(e) =>
                                        setEditData("heading", e.target.value)
                                    }
                                    className="mt-1 block w-full border-gray-300 rounded-md shadow-sm"
                                />
                                {editErrors.heading && (
                                    <p className="text-red-500 text-sm">
                                        {editErrors.heading}
                                    </p>
                                )}
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700">
                                    Description
                                </label>
                                <textarea
                                    value={editData.description}
                                    onChange={(e) =>
                                        setEditData(
                                            "description",
                                            e.target.value
                                        )
                                    }
                                    className="mt-1 block w-full border-gray-300 rounded-md shadow-sm"
                                />
                                {editErrors.description && (
                                    <p className="text-red-500 text-sm">
                                        {editErrors.description}
                                    </p>
                                )}
                            </div>
                            <div className="space-x-2">
                                <button
                                    type="submit"
                                    disabled={editProcessing}
                                    className="px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700 disabled:bg-green-300"
                                >
                                    Update
                                </button>
                                <button
                                    type="button"
                                    onClick={() => setEditId(null)}
                                    className="px-4 py-2 bg-gray-600 text-white rounded hover:bg-gray-700"
                                >
                                    Cancel
                                </button>
                            </div>
                        </form>
                    </div>
                )}

                {/* List of SEO Digital Records */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {seoDigitals.map((seoDigital) => (
                        <div
                            key={seoDigital.id}
                            className="p-6 bg-white rounded-lg shadow"
                        >
                            <div className="flex items-center mb-2">
                                <span className="text-2xl mr-2">
                                    {seoDigital.icon}
                                </span>
                                <h3 className="text-xl font-semibold">
                                    {seoDigital.heading}
                                </h3>
                            </div>
                            <p className="text-gray-600 mb-4">
                                {seoDigital.description}
                            </p>
                            <div className="space-x-2">
                                <button
                                    onClick={() => startEditing(seoDigital)}
                                    className="px-4 py-2 bg-yellow-600 text-white rounded hover:bg-yellow-700"
                                >
                                    Edit
                                </button>
                                <button
                                    onClick={() => handleDelete(seoDigital.id)}
                                    className="px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700"
                                >
                                    Delete
                                </button>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </Layout>
    );
}

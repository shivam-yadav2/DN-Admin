import { useState, useRef } from "react";
import { useForm, usePage } from "@inertiajs/react";
import { Head } from "@inertiajs/react";
import Layout from "@/Layouts/Layout";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";

export default function GraphicsLogo({ graphicLogos }) {
    const { flash } = usePage().props;

    // Form for creating a new Graphic Logo record
    const {
        data: createData,
        setData: setCreateData,
        post,
        processing: createProcessing,
        errors: createErrors,
        reset,
    } = useForm({
        name: "",
        img: null,
        url: "",
    });

    // Form for editing an existing Graphic Logo record
    const [editId, setEditId] = useState(null);
    const {
        data: editData,
        setData: setEditData,
        put,
        processing: editProcessing,
        errors: editErrors,
        delete: deleteData,
    } = useForm({
        name: "",
        img: null,
        url: "",
    });

    // Drag-and-drop refs
    const createDropRef = useRef(null);
    const editDropRef = useRef(null);
    const createFileInputRef = useRef(null);
    const editFileInputRef = useRef(null);

    // Handle create form submission
    const handleCreate = (e) => {
        e.preventDefault();
        post(route("graphics-logo.store"), {
            onSuccess: () => reset(),
            forceFormData: true,
        });
    };

    // Handle edit form submission
    const handleUpdate = (e) => {
        e.preventDefault();
        put(route("graphics-logo.update", editId), {
            onSuccess: () => setEditId(null),
            forceFormData: true,
        });
    };

    // Handle edit button click
    const startEditing = (graphicLogo) => {
        setEditId(graphicLogo.id);
        setEditData({
            name: graphicLogo.name,
            img: null,
            url: graphicLogo.url,
        });
    };

    // Handle delete
    const handleDelete = (id) => {
        if (confirm("Are you sure you want to delete this Graphic Logo?")) {
            deleteData(route("graphics-logo.destroy", id), {
                onSuccess: () => setEditId(null),
            });
        }
    };

    // Handle file input (create)
    const handleCreateFileChange = (e) => {
        const file = e.target.files[0];
        if (file) {
            setCreateData("img", file);
        }
    };

    // Handle file input (edit)
    const handleEditFileChange = (e) => {
        const file = e.target.files[0];
        if (file) {
            setEditData("img", file);
        }
    };

    // Trigger file input click
    const handleDropAreaClick = (ref) => {
        ref.current.click();
    };

    // Drag-and-drop handlers
    const handleDragOver = (e, ref) => {
        e.preventDefault();
        ref.current.classList.add("border-indigo-500", "bg-indigo-50");
    };

    const handleDragLeave = (e, ref) => {
        e.preventDefault();
        ref.current.classList.remove("border-indigo-500", "bg-indigo-50");
    };

    const handleDrop = (e, formType) => {
        e.preventDefault();
        e.currentTarget.classList.remove("border-indigo-500", "bg-indigo-50");
        const file = e.dataTransfer.files[0];
        if (file && ["image/jpeg", "image/png", "image/webp"].includes(file.type)) {
            if (formType === "create") {
                setCreateData("img", file);
            } else {
                setEditData("img", file);
            }
        }
    };

    return (
        <Layout>
            <div className="container mx-auto p-6 bg-gray-50 min-h-screen">
                <Head title="Graphic Logos" />
                <h1 className="text-4xl font-extrabold mb-8 text-center text-indigo-600">
                    Graphic Logo Gallery
                </h1>

                {/* Flash Messages */}
                {flash?.success && (
                    <Alert className="mb-6 max-w-2xl mx-auto">
                        <AlertTitle>Success</AlertTitle>
                        <AlertDescription>{flash.success}</AlertDescription>
                    </Alert>
                )}
                {flash?.error && (
                    <Alert variant="destructive" className="mb-6 max-w-2xl mx-auto">
                        <AlertTitle>Error</AlertTitle>
                        <AlertDescription>{flash.error}</AlertDescription>
                    </Alert>
                )}

                {/* Create Form */}
                <Card className="mb-8 shadow-lg">
                    <CardHeader>
                        <CardTitle className="text-2xl text-indigo-600">Add New Graphic Logo</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <form onSubmit={handleCreate} className="space-y-6">
                            <div>
                                <Label htmlFor="create_name" className="text-lg">Name</Label>
                                <Input
                                    id="create_name"
                                    value={createData.name}
                                    onChange={(e) => setCreateData("name", e.target.value)}
                                    className="mt-1 border-indigo-300 focus:ring-indigo-500"
                                    placeholder="Enter logo name"
                                />
                                {createErrors.name && (
                                    <p className="text-red-500 text-sm mt-1">{createErrors.name}</p>
                                )}
                            </div>
                            <div>
                                <Label htmlFor="create_img" className="text-lg">Logo Image</Label>
                                <div
                                    ref={createDropRef}
                                    onDragOver={(e) => handleDragOver(e, createDropRef)}
                                    onDragLeave={(e) => handleDragLeave(e, createDropRef)}
                                    onDrop={(e) => handleDrop(e, "create")}
                                    onClick={() => handleDropAreaClick(createFileInputRef)}
                                    className="mt-1 border-2 border-dashed border-gray-300 rounded-lg p-6 text-center hover:border-indigo-500 transition-colors cursor-pointer"
                                >
                                    <p className="text-gray-500">
                                        Drag and drop an image here, or click to select
                                    </p>
                                    <Input
                                        id="create_img"
                                        type="file"
                                        accept="image/jpeg,image/png,image/webp"
                                        onChange={handleCreateFileChange}
                                        ref={createFileInputRef}
                                        className="hidden"
                                    />
                                    {createData.img && (
                                        <p className="mt-2 text-sm text-indigo-600">
                                            Selected: {createData.img.name}
                                        </p>
                                    )}
                                </div>
                                {createErrors.img && (
                                    <p className="text-red-500 text-sm mt-1">{createErrors.img}</p>
                                )}
                            </div>
                            <div>
                                <Label htmlFor="create_url" className="text-lg">URL</Label>
                                <Input
                                    id="create_url"
                                    value={createData.url}
                                    onChange={(e) => setCreateData("url", e.target.value)}
                                    className="mt-1 border-indigo-300 focus:ring-indigo-500"
                                    placeholder="Enter logo URL"
                                />
                                {createErrors.url && (
                                    <p className="text-red-500 text-sm mt-1">{createErrors.url}</p>
                                )}
                            </div>
                            <Button
                                type="submit"
                                disabled={createProcessing}
                                className="bg-indigo-600 hover:bg-indigo-700"
                            >
                                Create
                            </Button>
                        </form>
                    </CardContent>
                </Card>

                {/* Edit Form */}
                {editId && (
                    <Card className="mb-8 shadow-lg">
                        <CardHeader>
                            <CardTitle className="text-2xl text-indigo-600">Edit Graphic Logo</CardTitle>
                        </CardHeader>
                        <CardContent>
                            <form onSubmit={handleUpdate} className="space-y-6">
                                <div>
                                    <Label htmlFor="edit_name" className="text-lg">Name</Label>
                                    <Input
                                        id="edit_name"
                                        value={editData.name}
                                        onChange={(e) => setEditData("name", e.target.value)}
                                        className="mt-1 border-indigo-300 focus:ring-indigo-500"
                                        placeholder="Enter logo name"
                                    />
                                    {editErrors.name && (
                                        <p className="text-red-500 text-sm mt-1">{editErrors.name}</p>
                                    )}
                                </div>
                                <div>
                                    <Label htmlFor="edit_img" className="text-lg">Logo Image</Label>
                                    <div
                                        ref={editDropRef}
                                        onDragOver={(e) => handleDragOver(e, editDropRef)}
                                        onDragLeave={(e) => handleDragLeave(e, editDropRef)}
                                        onDrop={(e) => handleDrop(e, "edit")}
                                        onClick={() => handleDropAreaClick(editFileInputRef)}
                                        className="mt-1 border-2 border-dashed border-gray-300 rounded-lg p-6 text-center hover:border-indigo-500 transition-colors cursor-pointer"
                                    >
                                        <p className="text-gray-500">
                                            Drag and drop an image here, or click to select
                                        </p>
                                        <Input
                                            id="edit_img"
                                            type="file"
                                            accept="image/jpeg,image/png,image/webp"
                                            onChange={handleEditFileChange}
                                            ref={editFileInputRef}
                                            className="hidden"
                                        />
                                        {editData.img && (
                                            <p className="mt-2 text-sm text-indigo-600">
                                                Selected: {editData.img.name}
                                            </p>
                                        )}
                                    </div>
                                    {editErrors.img && (
                                        <p className="text-red-500 text-sm mt-1">{editErrors.img}</p>
                                    )}
                                </div>
                                <div>
                                    <Label htmlFor="edit_url" className="text-lg">URL</Label>
                                    <Input
                                        id="edit_url"
                                        value={editData.url}
                                        onChange={(e) => setEditData("url", e.target.value)}
                                        className="mt-1 border-indigo-300 focus:ring-indigo-500"
                                        placeholder="Enter logo URL"
                                    />
                                    {editErrors.url && (
                                        <p className="text-red-500 text-sm mt-1">{editErrors.url}</p>
                                    )}
                                </div>
                                <div className="space-x-2">
                                    <Button
                                        type="submit"
                                        disabled={editProcessing}
                                        className="bg-indigo-600 hover:bg-indigo-700"
                                    >
                                        Update
                                    </Button>
                                    <Button
                                        variant="secondary"
                                        onClick={() => setEditId(null)}
                                    >
                                        Cancel
                                    </Button>
                                </div>
                            </form>
                        </CardContent>
                    </Card>
                )}

                {/* List of Graphic Logo Records */}
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                    {graphicLogos.map((graphicLogo) => (
                        <Card
                            key={graphicLogo.id}
                            className="group relative overflow-hidden shadow-lg hover:shadow-xl transition-shadow duration-300"
                        >
                            <CardContent className="p-0">
                                <div className="relative">
                                    <img
                                        src={`/${graphicLogo.img}`}
                                        alt={graphicLogo.name}
                                        className="w-full h-48 object-cover transition-transform duration-300 group-hover:scale-105"
                                    />
                                    <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-40 transition-opacity duration-300 flex items-center justify-center opacity-0 group-hover:opacity-100">
                                        <a
                                            href={graphicLogo.url}
                                            target="_blank"
                                            rel="noopener noreferrer"
                                            className="text-white font-semibold px-4 py-2 bg-indigo-600 rounded hover:bg-indigo-700"
                                        >
                                            Visit Link
                                        </a>
                                    </div>
                                </div>
                                <div className="p-4">
                                    <h3 className="text-lg font-semibold text-indigo-600">{graphicLogo.name}</h3>
                                    <p className="text-gray-600 text-sm mt-1">URL: {graphicLogo.url}</p>
                                    <div className="mt-4 flex space-x-2">
                                        <Button
                                            onClick={() => startEditing(graphicLogo)}
                                            variant="outline"
                                            className="border-indigo-300 text-indigo-600 hover:bg-indigo-50"
                                        >
                                            Edit
                                        </Button>
                                        <Button
                                            onClick={() => handleDelete(graphicLogo.id)}
                                            variant="destructive"
                                        >
                                            Delete
                                        </Button>
                                    </div>
                                </div>
                            </CardContent>
                        </Card>
                    ))}
                </div>
            </div>
        </Layout>
    );
}
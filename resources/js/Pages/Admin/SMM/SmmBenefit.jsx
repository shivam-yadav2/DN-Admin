import { useState, useRef } from "react";
import { useForm, usePage } from "@inertiajs/react";
import { Head } from "@inertiajs/react";
import Layout from "@/Layouts/Layout";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";

export default function SmmBenefit({ smmBenefits }) {
    const { flash } = usePage().props;

    // Form for creating a new SMM Benefit record
    const {
        data: createData,
        setData: setCreateData,
        post,
        processing: createProcessing,
        errors: createErrors,
        reset,
    } = useForm({
        image: null,
        heading: "",
        description: "",
    });

    // Form for editing an existing SMM Benefit record
    const [editId, setEditId] = useState(null);
    const {
        data: editData,
        setData: setEditData,
        put,
        processing: editProcessing,
        errors: editErrors,
        delete: deleteData,
    } = useForm({
        image: null,
        heading: "",
        description: "",
    });

    // Drag-and-drop refs
    const createDropRef = useRef(null);
    const editDropRef = useRef(null);
    const createFileInputRef = useRef(null);
    const editFileInputRef = useRef(null);

    // Handle create form submission
    const handleCreate = (e) => {
        e.preventDefault();
        post(route("smm-benefit.store"), {
            onSuccess: () => reset(),
            forceFormData: true,
        });
    };

    // Handle edit form submission
    const handleUpdate = (e) => {
        e.preventDefault();
        put(route("smm-benefit.update", editId), {
            onSuccess: () => setEditId(null),
            forceFormData: true,
        });
    };

    // Handle edit button click
    const startEditing = (smmBenefit) => {
        setEditId(smmBenefit.id);
        setEditData({
            image: null,
            heading: smmBenefit.heading,
            description: smmBenefit.description,
        });
    };

    // Handle delete
    const handleDelete = (id) => {
        if (confirm("Are you sure you want to delete this SMM Benefit?")) {
            deleteData(route("smm-benefit.destroy", id), {
                onSuccess: () => setEditId(null),
            });
        }
    };

    // Handle file input (create)
    const handleCreateFileChange = (e) => {
        const file = e.target.files[0];
        if (file) {
            setCreateData("image", file);
        }
    };

    // Handle file input (edit)
    const handleEditFileChange = (e) => {
        const file = e.target.files[0];
        if (file) {
            setEditData("image", file);
        }
    };

    // Trigger file input click
    const handleDropAreaClick = (ref) => {
        ref.current.click();
    };

    // Drag-and-drop handlers
    const handleDragOver = (e, ref) => {
        e.preventDefault();
        ref.current.classList.add("border-teal-500", "bg-teal-50");
    };

    const handleDragLeave = (e, ref) => {
        e.preventDefault();
        ref.current.classList.remove("border-teal-500", "bg-teal-50");
    };

    const handleDrop = (e, formType) => {
        e.preventDefault();
        e.currentTarget.classList.remove("border-teal-500", "bg-teal-50");
        const file = e.dataTransfer.files[0];
        if (file && ["image/jpeg", "image/png", "image/webp"].includes(file.type)) {
            if (formType === "create") {
                setCreateData("image", file);
            } else {
                setEditData("image", file);
            }
        }
    };

    return (
        <Layout>
            <div className="container mx-auto p-6 bg-gradient-to-br from-teal-50 to-blue-50 min-h-screen">
                <Head title="SMM Benefits" />
                <h1 className="text-4xl font-extrabold mb-8 text-center text-teal-600">
                    SMM Benefits Dashboard
                </h1>

                {/* Flash Messages */}
                {flash?.success && (
                    <Alert className="mb-6 max-w-2xl mx-auto border-teal-500">
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
                <Card className="mb-8 shadow-lg border-t-4 border-teal-500">
                    <CardHeader>
                        <CardTitle className="text-2xl text-teal-600">Add New SMM Benefit</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <form onSubmit={handleCreate} className="space-y-6">
                            <div>
                                <Label htmlFor="create_image" className="text-lg">Image</Label>
                                <div
                                    ref={createDropRef}
                                    onDragOver={(e) => handleDragOver(e, createDropRef)}
                                    onDragLeave={(e) => handleDragLeave(e, createDropRef)}
                                    onDrop={(e) => handleDrop(e, "create")}
                                    onClick={() => handleDropAreaClick(createFileInputRef)}
                                    className="mt-1 border-2 border-dashed border-gray-300 rounded-lg p-6 text-center hover:border-teal-500 transition-colors cursor-pointer"
                                >
                                    <p className="text-gray-500">
                                        Drag and drop an image here, or click to select
                                    </p>
                                    <Input
                                        id="create_image"
                                        type="file"
                                        accept="image/jpeg,image/png,image/webp"
                                        onChange={handleCreateFileChange}
                                        ref={createFileInputRef}
                                        className="hidden"
                                    />
                                    {createData.image && (
                                        <p className="mt-2 text-sm text-teal-600">
                                            Selected: {createData.image.name}
                                        </p>
                                    )}
                                </div>
                                {createErrors.image && (
                                    <p className="text-red-500 text-sm mt-1">{createErrors.image}</p>
                                )}
                            </div>
                            <div>
                                <Label htmlFor="create_heading" className="text-lg">Heading</Label>
                                <Input
                                    id="create_heading"
                                    value={createData.heading}
                                    onChange={(e) => setCreateData("heading", e.target.value)}
                                    className="mt-1 border-teal-300 focus:ring-teal-500"
                                    placeholder="Enter benefit heading"
                                />
                                {createErrors.heading && (
                                    <p className="text-red-500 text-sm mt-1">{createErrors.heading}</p>
                                )}
                            </div>
                            <div>
                                <Label htmlFor="create_description" className="text-lg">Description</Label>
                                <Textarea
                                    id="create_description"
                                    value={createData.description}
                                    onChange={(e) => setCreateData("description", e.target.value)}
                                    className="mt-1 border-teal-300 focus:ring-teal-500"
                                    placeholder="Enter benefit description"
                                />
                                {createErrors.description && (
                                    <p className="text-red-500 text-sm mt-1">{createErrors.description}</p>
                                )}
                            </div>
                            <Button
                                type="submit"
                                disabled={createProcessing}
                                className="bg-teal-600 hover:bg-teal-700"
                            >
                                Create
                            </Button>
                        </form>
                    </CardContent>
                </Card>

                {/* Edit Form */}
                {editId && (
                    <Card className="mb-8 shadow-lg border-t-4 border-teal-500">
                        <CardHeader>
                            <CardTitle className="text-2xl text-teal-600">Edit SMM Benefit</CardTitle>
                        </CardHeader>
                        <CardContent>
                            <form onSubmit={handleUpdate} className="space-y-6">
                                <div>
                                    <Label htmlFor="edit_image" className="text-lg">Image</Label>
                                    <div
                                        ref={editDropRef}
                                        onDragOver={(e) => handleDragOver(e, editDropRef)}
                                        onDragLeave={(e) => handleDragLeave(e, editDropRef)}
                                        onDrop={(e) => handleDrop(e, "edit")}
                                        onClick={() => handleDropAreaClick(editFileInputRef)}
                                        className="mt-1 border-2 border-dashed border-gray-300 rounded-lg p-6 text-center hover:border-teal-500 transition-colors cursor-pointer"
                                    >
                                        <p className="text-gray-500">
                                            Drag and drop an image here, or click to select
                                        </p>
                                        <Input
                                            id="edit_image"
                                            type="file"
                                            accept="image/jpeg,image/png,image/webp"
                                            onChange={handleEditFileChange}
                                            ref={editFileInputRef}
                                            className="hidden"
                                        />
                                        {editData.image && (
                                            <p className="mt-2 text-sm text-teal-600">
                                                Selected: {editData.image.name}
                                            </p>
                                        )}
                                    </div>
                                    {editErrors.image && (
                                        <p className="text-red-500 text-sm mt-1">{editErrors.image}</p>
                                    )}
                                </div>
                                <div>
                                    <Label htmlFor="edit_heading" className="text-lg">Heading</Label>
                                    <Input
                                        id="edit_heading"
                                        value={editData.heading}
                                        onChange={(e) => setEditData("heading", e.target.value)}
                                        className="mt-1 border-teal-300 focus:ring-teal-500"
                                        placeholder="Enter benefit heading"
                                    />
                                    {editErrors.heading && (
                                        <p className="text-red-500 text-sm mt-1">{editErrors.heading}</p>
                                    )}
                                </div>
                                <div>
                                    <Label htmlFor="edit_description" className="text-lg">Description</Label>
                                    <Textarea
                                        id="edit_description"
                                        value={editData.description}
                                        onChange={(e) => setEditData("description", e.target.value)}
                                        className="mt-1 border-teal-300 focus:ring-teal-500"
                                        placeholder="Enter benefit description"
                                    />
                                    {editErrors.description && (
                                        <p className="text-red-500 text-sm mt-1">{editErrors.description}</p>
                                    )}
                                </div>
                                <div className="space-x-2">
                                    <Button
                                        type="submit"
                                        disabled={editProcessing}
                                        className="bg-teal-600 hover:bg-teal-700"
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

                {/* List of SMM Benefit Records */}
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                    {smmBenefits.map((smmBenefit) => (
                        <Card
                            key={smmBenefit.id}
                            className="group relative overflow-hidden shadow-lg hover:shadow-xl transition-shadow duration-300 border-t-2 border-teal-500"
                        >
                            <CardContent className="p-0">
                                <div className="relative">
                                    <img
                                        src={`/${smmBenefit.image}`}
                                        alt={smmBenefit.heading}
                                        className="w-full h-40 object-cover transition-transform duration-300 group-hover:scale-105"
                                    />
                                    <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                                </div>
                                <div className="p-4">
                                    <h3 className="text-lg font-semibold text-teal-600">{smmBenefit.heading}</h3>
                                    <p className="text-gray-600 text-sm mt-1 line-clamp-3">{smmBenefit.description}</p>
                                    <div className="mt-4 flex space-x-2">
                                        <Button
                                            onClick={() => startEditing(smmBenefit)}
                                            variant="outline"
                                            className="border-teal-300 text-teal-600 hover:bg-teal-50"
                                        >
                                            Edit
                                        </Button>
                                        <Button
                                            onClick={() => handleDelete(smmBenefit.id)}
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
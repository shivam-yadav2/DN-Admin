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
import { X } from "lucide-react";

export default function SmmYoutube({ smmYoutube }) {
    const { flash } = usePage().props;

    // Form for creating a new SMM YouTube record
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
        features: [],
    });

    // Form for editing an existing SMM YouTube record
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
        features: [],
    });

    // Drag-and-drop refs
    const createDropRef = useRef(null);
    const editDropRef = useRef(null);
    const createFileInputRef = useRef(null);
    const editFileInputRef = useRef(null);

    // Feature input state for create form
    const [createFeatureInput, setCreateFeatureInput] = useState("");
    // Feature input state for edit form
    const [editFeatureInput, setEditFeatureInput] = useState("");

    // Handle create form submission
    const handleCreate = (e) => {
        e.preventDefault();
        post(route("smm-youtube.store"), {
            onSuccess: () => {
                reset();
                setCreateFeatureInput("");
            },
            forceFormData: true,
        });
    };

    // Handle edit form submission
    const handleUpdate = (e) => {
        e.preventDefault();
        put(route("smm-youtube.update", editId), {
            onSuccess: () => {
                setEditId(null);
                setEditFeatureInput("");
            },
            forceFormData: true,
        });
    };

    // Handle edit button click
    const startEditing = (smmYoutubeItem) => {
        setEditId(smmYoutubeItem.id);
        setEditData({
            image: null,
            heading: smmYoutubeItem.heading,
            description: smmYoutubeItem.description,
            features: smmYoutubeItem.features,
        });
    };

    // Handle delete
    const handleDelete = (id) => {
        if (confirm("Are you sure you want to delete this YouTube marketing service?")) {
            deleteData(route("smm-youtube.destroy", id), {
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
        ref.current.classList.add("border-red-500", "bg-red-50");
    };

    const handleDragLeave = (e, ref) => {
        e.preventDefault();
        ref.current.classList.remove("border-red-500", "bg-red-50");
    };

    const handleDrop = (e, formType) => {
        e.preventDefault();
        e.currentTarget.classList.remove("border-red-500", "bg-red-50");
        const file = e.dataTransfer.files[0];
        if (file && ["image/jpeg", "image/png", "image/webp"].includes(file.type)) {
            if (formType === "create") {
                setCreateData("image", file);
            } else {
                setEditData("image", file);
            }
        }
    };

    // Handle feature addition (create)
    const addCreateFeature = () => {
        if (createFeatureInput.trim()) {
            setCreateData("features", [...createData.features, createFeatureInput.trim()]);
            setCreateFeatureInput("");
        }
    };

    // Handle feature removal (create)
    const removeCreateFeature = (index) => {
        setCreateData("features", createData.features.filter((_, i) => i !== index));
    };

    // Handle feature addition (edit)
    const addEditFeature = () => {
        if (editFeatureInput.trim()) {
            setEditData("features", [...editData.features, editFeatureInput.trim()]);
            setEditFeatureInput("");
        }
    };

    // Handle feature removal (edit)
    const removeEditFeature = (index) => {
        setEditData("features", editData.features.filter((_, i) => i !== index));
    };

    return (
        <Layout>
            <div className="container mx-auto p-6 bg-gradient-to-br from-red-50 to-white min-h-screen">
                <Head title="YouTube Marketing Services" />
                <h1 className="text-4xl font-extrabold mb-8 text-center text-red-600">
                    YouTube Marketing Services
                </h1>

                {/* Flash Messages */}
                {flash?.success && (
                    <Alert className="mb-6 max-w-2xl mx-auto border-red-500">
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
                <Card className="mb-8 shadow-lg border-t-4 border-red-500">
                    <CardHeader>
                        <CardTitle className="text-2xl text-red-600">Add New YouTube Marketing Service</CardTitle>
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
                                    className="mt-1 border-2 border-dashed border-gray-300 rounded-lg p-6 text-center hover:border-red-500 transition-colors cursor-pointer"
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
                                        <p className="mt-2 text-sm text-red-600">
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
                                    className="mt-1 border-red-300 focus:ring-red-500"
                                    placeholder="Enter service heading"
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
                                    className="mt-1 border-red-300 focus:ring-red-500"
                                    placeholder="Enter service description"
                                />
                                {createErrors.description && (
                                    <p className="text-red-500 text-sm mt-1">{createErrors.description}</p>
                                )}
                            </div>
                            <div>
                                <Label htmlFor="create_features" className="text-lg">Features</Label>
                                <div className="flex gap-2 mt-1">
                                    <Input
                                        id="create_features"
                                        value={createFeatureInput}
                                        onChange={(e) => setCreateFeatureInput(e.target.value)}
                                        placeholder="Enter a feature"
                                        className="border-red-300 focus:ring-red-500"
                                    />
                                    <Button
                                        type="button"
                                        onClick={addCreateFeature}
                                        className="bg-red-600 hover:bg-red-700"
                                    >
                                        Add
                                    </Button>
                                </div>
                                {createData.features.length > 0 && (
                                    <ul className="mt-2 space-y-1">
                                        {createData.features.map((feature, index) => (
                                            <li
                                                key={index}
                                                className="flex items-center justify-between bg-red-50 p-2 rounded"
                                            >
                                                <span>{feature}</span>
                                                <Button
                                                    variant="ghost"
                                                    size="sm"
                                                    onClick={() => removeCreateFeature(index)}
                                                >
                                                    <X className="h-4 w-4 text-red-600" />
                                                </Button>
                                            </li>
                                        ))}
                                    </ul>
                                )}
                                {createErrors.features && (
                                    <p className="text-red-500 text-sm mt-1">{createErrors.features}</p>
                                )}
                            </div>
                            <Button
                                type="submit"
                                disabled={createProcessing}
                                className="bg-red-600 hover:bg-red-700"
                            >
                                Create
                            </Button>
                        </form>
                    </CardContent>
                </Card>

                {/* Edit Form */}
                {editId && (
                    <Card className="mb-8 shadow-lg border-t-4 border-red-500">
                        <CardHeader>
                            <CardTitle className="text-2xl text-red-600">Edit YouTube Marketing Service</CardTitle>
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
                                        className="mt-1 border-2 border-dashed border-gray-300 rounded-lg p-6 text-center hover:border-red-500 transition-colors cursor-pointer"
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
                                            <p className="mt-2 text-sm text-red-600">
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
                                        className="mt-1 border-red-300 focus:ring-red-500"
                                        placeholder="Enter service heading"
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
                                        className="mt-1 border-red-300 focus:ring-red-500"
                                        placeholder="Enter service description"
                                    />
                                    {editErrors.description && (
                                        <p className="text-red-500 text-sm mt-1">{editErrors.description}</p>
                                    )}
                                </div>
                                <div>
                                    <Label htmlFor="edit_features" className="text-lg">Features</Label>
                                    <div className="flex gap-2 mt-1">
                                        <Input
                                            id="edit_features"
                                            value={editFeatureInput}
                                            onChange={(e) => setEditFeatureInput(e.target.value)}
                                            placeholder="Enter a feature"
                                            className="border-red-300 focus:ring-red-500"
                                        />
                                        <Button
                                            type="button"
                                            onClick={addEditFeature}
                                            className="bg-red-600 hover:bg-red-700"
                                        >
                                            Add
                                        </Button>
                                    </div>
                                    {editData.features.length > 0 && (
                                        <ul className="mt-2 space-y-1">
                                            {editData.features.map((feature, index) => (
                                                <li
                                                    key={index}
                                                    className="flex items-center justify-between bg-red-50 p-2 rounded"
                                                >
                                                    <span>{feature}</span>
                                                    <Button
                                                        variant="ghost"
                                                        size="sm"
                                                        onClick={() => removeEditFeature(index)}
                                                    >
                                                        <X className="h-4 w-4 text-red-600" />
                                                    </Button>
                                                </li>
                                            ))}
                                        </ul>
                                    )}
                                    {editErrors.features && (
                                        <p className="text-red-500 text-sm mt-1">{editErrors.features}</p>
                                    )}
                                </div>
                                <div className="space-x-2">
                                    <Button
                                        type="submit"
                                        disabled={editProcessing}
                                        className="bg-red-600 hover:bg-red-700"
                                    >
                                        Update
                                    </Button>
                                    <Button
                                        variant="secondary"
                                        onClick={() => {
                                            setEditId(null);
                                            setEditFeatureInput("");
                                        }}
                                    >
                                        Cancel
                                    </Button>
                                </div>
                            </form>
                        </CardContent>
                    </Card>
                )}

                {/* List of SMM YouTube Records */}
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                    {smmYoutube.map((smmYoutubeItem) => (
                        <Card
                            key={smmYoutubeItem.id}
                            className="group relative overflow-hidden shadow-lg hover:shadow-xl transition-shadow duration-300 border-t-2 border-red-500"
                        >
                            <CardContent className="p-0">
                                <div className="relative">
                                    <img
                                        src={`/${smmYoutubeItem.image}`}
                                        alt={smmYoutubeItem.heading}
                                        className="w-full h-40 object-cover transition-transform duration-300 group-hover:scale-105"
                                    />
                                    <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                                </div>
                                <div className="p-4">
                                    <h3 className="text-lg font-semibold text-red-600">{smmYoutubeItem.heading}</h3>
                                    <p className="text-gray-600 text-sm mt-1 line-clamp-3">{smmYoutubeItem.description}</p>
                                    <div className="mt-2">
                                        <p className="text-sm font-medium text-gray-700">Features:</p>
                                        <ul className="list-disc list-inside text-sm text-gray-600">
                                            {smmYoutubeItem.features.map((feature, index) => (
                                                <li key={index}>{feature}</li>
                                            ))}
                                        </ul>
                                    </div>
                                    <div className="mt-4 flex space-x-2">
                                        <Button
                                            onClick={() => startEditing(smmYoutubeItem)}
                                            variant="outline"
                                            className="border-red-300 text-red-600 hover:bg-red-50"
                                        >
                                            Edit
                                        </Button>
                                        <Button
                                            onClick={() => handleDelete(smmYoutubeItem.id)}
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
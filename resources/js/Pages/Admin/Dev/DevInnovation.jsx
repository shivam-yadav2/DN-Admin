import { useState } from "react";
import { useForm, usePage } from "@inertiajs/react";
import { Head } from "@inertiajs/react";
import Layout from "@/Layouts/Layout";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Badge } from "@/components/ui/badge";

export default function DevInnovation({ devInnovations }) {
    const { flash } = usePage().props;

    // Form for creating a new Dev Innovation record
    const {
        data: createData,
        setData: setCreateData,
        post,
        processing: createProcessing,
        errors: createErrors,
        reset,
    } = useForm({
        icon: "",
        heading: "",
        sub_heading: "",
        description: "",
        features: [],
    });

    // Form for editing an existing Dev Innovation record
    const [editId, setEditId] = useState(null);
    const {
        data: editData,
        setData: setEditData,
        put,
        processing: editProcessing,
        errors: editErrors,
        delete: deleteData,
    } = useForm({
        icon: "",
        heading: "",
        sub_heading: "",
        description: "",
        features: [],
    });

    // Handle create form submission
    const handleCreate = (e) => {
        e.preventDefault();
        post(route("dev-innovation.store"), {
            onSuccess: () => reset(),
        });
    };

    // Handle edit form submission
    const handleUpdate = (e) => {
        e.preventDefault();
        put(route("dev-innovation.update", editId), {
            onSuccess: () => setEditId(null),
        });
    };

    // Handle edit button click
    const startEditing = (devInnovation) => {
        setEditId(devInnovation.id);
        setEditData({
            icon: devInnovation.icon,
            heading: devInnovation.heading,
            sub_heading: devInnovation.sub_heading,
            description: devInnovation.description,
            features: devInnovation.features,
        });
    };

    // Handle delete
    const handleDelete = (id) => {
        if (confirm("Are you sure you want to delete this Development Innovation?")) {
            deleteData(route("dev-innovation.destroy", id), {
                onSuccess: () => setEditId(null),
            });
        }
    };

    // Handle features input
    const handleFeaturesChange = (e, formType) => {
        const features = e.target.value.split(",").map((feature) => feature.trim());
        if (formType === "create") {
            setCreateData("features", features);
        } else {
            setEditData("features", features);
        }
    };

    return (
        <Layout>
            <div className="container mx-auto p-6">
                <Head title="Development Innovations" />
                <h1 className="text-3xl font-bold mb-6">Development Innovations</h1>

                {/* Flash Messages */}
                {flash?.success && (
                    <Alert className="mb-4">
                        <AlertTitle>Success</AlertTitle>
                        <AlertDescription>{flash.success}</AlertDescription>
                    </Alert>
                )}
                {flash?.error && (
                    <Alert variant="destructive" className="mb-4">
                        <AlertTitle>Error</AlertTitle>
                        <AlertDescription>{flash.error}</AlertDescription>
                    </Alert>
                )}

                {/* Create Form */}
                <Card className="mb-8">
                    <CardHeader>
                        <CardTitle>Create New Development Innovation</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <form onSubmit={handleCreate} className="space-y-4">
                            <div>
                                <Label htmlFor="create_icon">Icon</Label>
                                <Input
                                    id="create_icon"
                                    value={createData.icon}
                                    onChange={(e) => setCreateData("icon", e.target.value)}
                                    className="mt-1"
                                />
                                {createErrors.icon && (
                                    <p className="text-red-500 text-sm">{createErrors.icon}</p>
                                )}
                            </div>
                            <div>
                                <Label htmlFor="create_heading">Heading</Label>
                                <Input
                                    id="create_heading"
                                    value={createData.heading}
                                    onChange={(e) => setCreateData("heading", e.target.value)}
                                    className="mt-1"
                                />
                                {createErrors.heading && (
                                    <p className="text-red-500 text-sm">{createErrors.heading}</p>
                                )}
                            </div>
                            <div>
                                <Label htmlFor="create_sub_heading">Sub Heading</Label>
                                <Input
                                    id="create_sub_heading"
                                    value={createData.sub_heading}
                                    onChange={(e) => setCreateData("sub_heading", e.target.value)}
                                    className="mt-1"
                                />
                                {createErrors.sub_heading && (
                                    <p className="text-red-500 text-sm">{createErrors.sub_heading}</p>
                                )}
                            </div>
                            <div>
                                <Label htmlFor="create_description">Description</Label>
                                <Textarea
                                    id="create_description"
                                    value={createData.description}
                                    onChange={(e) => setCreateData("description", e.target.value)}
                                    className="mt-1"
                                />
                                {createErrors.description && (
                                    <p className="text-red-500 text-sm">{createErrors.description}</p>
                                )}
                            </div>
                            <div>
                                <Label htmlFor="create_features">Features (comma-separated)</Label>
                                <Input
                                    id="create_features"
                                    value={createData.features.join(", ")}
                                    onChange={(e) => handleFeaturesChange(e, "create")}
                                    className="mt-1"
                                />
                                {createErrors.features && (
                                    <p className="text-red-500 text-sm">{createErrors.features}</p>
                                )}
                            </div>
                            <Button type="submit" disabled={createProcessing}>
                                Create
                            </Button>
                        </form>
                    </CardContent>
                </Card>

                {/* Edit Form */}
                {editId && (
                    <Card className="mb-8">
                        <CardHeader>
                            <CardTitle>Edit Development Innovation</CardTitle>
                        </CardHeader>
                        <CardContent>
                            <form onSubmit={handleUpdate} className="space-y-4">
                                <div>
                                    <Label htmlFor="edit_icon">Icon</Label>
                                    <Input
                                        id="edit_icon"
                                        value={editData.icon}
                                        onChange={(e) => setEditData("icon", e.target.value)}
                                        className="mt-1"
                                    />
                                    {editErrors.icon && (
                                        <p className="text-red-500 text-sm">{editErrors.icon}</p>
                                    )}
                                </div>
                                <div>
                                    <Label htmlFor="edit_heading">Heading</Label>
                                    <Input
                                        id="edit_heading"
                                        value={editData.heading}
                                        onChange={(e) => setEditData("heading", e.target.value)}
                                        className="mt-1"
                                    />
                                    {editErrors.heading && (
                                        <p className="text-red-500 text-sm">{editErrors.heading}</p>
                                    )}
                                </div>
                                <div>
                                    <Label htmlFor="edit_sub_heading">Sub Heading</Label>
                                    <Input
                                        id="edit_sub_heading"
                                        value={editData.sub_heading}
                                        onChange={(e) => setEditData("sub_heading", e.target.value)}
                                        className="mt-1"
                                    />
                                    {editErrors.sub_heading && (
                                        <p className="text-red-500 text-sm">{editErrors.sub_heading}</p>
                                    )}
                                </div>
                                <div>
                                    <Label htmlFor="edit_description">Description</Label>
                                    <Textarea
                                        id="edit_description"
                                        value={editData.description}
                                        onChange={(e) => setEditData("description", e.target.value)}
                                        className="mt-1"
                                    />
                                    {editErrors.description && (
                                        <p className="text-red-500 text-sm">{editErrors.description}</p>
                                    )}
                                </div>
                                <div>
                                    <Label htmlFor="edit_features">Features (comma-separated)</Label>
                                    <Input
                                        id="edit_features"
                                        value={editData.features.join(", ")}
                                        onChange={(e) => handleFeaturesChange(e, "edit")}
                                        className="mt-1"
                                    />
                                    {editErrors.features && (
                                        <p className="text-red-500 text-sm">{editErrors.features}</p>
                                    )}
                                </div>
                                <div className="space-x-2">
                                    <Button type="submit" disabled={editProcessing}>
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

                {/* List of Dev Innovation Records */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {devInnovations.map((devInnovation) => (
                        <Card key={devInnovation.id}>
                            <CardHeader>
                                <CardTitle>{devInnovation.heading}</CardTitle>
                            </CardHeader>
                            <CardContent>
                                <div className="flex items-center mb-2">
                                    <span className="text-2xl mr-2">{devInnovation.icon}</span>
                                    <h3 className="text-xl font-semibold">{devInnovation.sub_heading}</h3>
                                </div>
                                <p className="text-gray-600 mb-2">{devInnovation.description}</p>
                                <p className="text-gray-600 mb-4">
                                    <strong>Features:</strong>{" "}
                                    {devInnovation.features.map((feature, index) => (
                                        <Badge key={index} className="mr-1">
                                            {feature}
                                        </Badge>
                                    ))}
                                </p>
                                <div className="space-x-2">
                                    <Button
                                        onClick={() => startEditing(devInnovation)}
                                        variant="outline"
                                    >
                                        Edit
                                    </Button>
                                    <Button
                                        onClick={() => handleDelete(devInnovation.id)}
                                        variant="destructive"
                                    >
                                        Delete
                                    </Button>
                                </div>
                            </CardContent>
                        </Card>
                    ))}
                </div>
            </div>
        </Layout>
    );
}
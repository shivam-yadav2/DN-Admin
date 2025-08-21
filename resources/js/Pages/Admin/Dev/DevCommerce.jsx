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

export default function DevCommerce({ devCommerces }) {
    const { flash } = usePage().props;

    // Form for creating a new Dev Commerce record
    const {
        data: createData,
        setData: setCreateData,
        post,
        processing: createProcessing,
        errors: createErrors,
        reset,
    } = useForm({
        tag: "",
        image: null,
        heading: "",
        description: "",
        skills: [],
        label: "",
    });

    // Form for editing an existing Dev Commerce record
    const [editId, setEditId] = useState(null);
    const {
        data: editData,
        setData: setEditData,
        put,
        processing: editProcessing,
        errors: editErrors,
        delete: deleteData,
    } = useForm({
        tag: "",
        image: null,
        heading: "",
        description: "",
        skills: [],
        label: "",
    });

    // Handle create form submission
    const handleCreate = (e) => {
        e.preventDefault();
        post(route("dev-commerce.store"), {
            onSuccess: () => reset(),
            forceFormData: true,
        });
    };

    // Handle edit form submission
    const handleUpdate = (e) => {
        e.preventDefault();
        put(route("dev-commerce.update", editId), {
            onSuccess: () => setEditId(null),
            forceFormData: true,
        });
    };

    // Handle edit button click
    const startEditing = (devCommerce) => {
        setEditId(devCommerce.id);
        setEditData({
            tag: devCommerce.tag,
            image: null,
            heading: devCommerce.heading,
            description: devCommerce.description,
            skills: devCommerce.skills,
            label: devCommerce.label,
        });
    };

    // Handle delete
    const handleDelete = (id) => {
        if (confirm("Are you sure you want to delete this Dev Commerce?")) {
            deleteData(route("dev-commerce.destroy", id), {
                onSuccess: () => setEditId(null),
            });
        }
    };

    // Handle skills input
    const handleSkillsChange = (e, formType) => {
        const skills = e.target.value.split(",").map((skill) => skill.trim());
        if (formType === "create") {
            setCreateData("skills", skills);
        } else {
            setEditData("skills", skills);
        }
    };

    return (
        <Layout>
            <div className="container mx-auto p-6">
                <Head title="Dev Commerce Records" />
                <h1 className="text-3xl font-bold mb-6">Dev Commerce Records</h1>

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
                        <CardTitle>Create New Dev Commerce</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <form onSubmit={handleCreate} className="space-y-4">
                            <div>
                                <Label htmlFor="create_tag">Tag</Label>
                                <Input
                                    id="create_tag"
                                    value={createData.tag}
                                    onChange={(e) => setCreateData("tag", e.target.value)}
                                    className="mt-1"
                                />
                                {createErrors.tag && (
                                    <p className="text-red-500 text-sm">{createErrors.tag}</p>
                                )}
                            </div>
                            <div>
                                <Label htmlFor="create_image">Image</Label>
                                <Input
                                    id="create_image"
                                    type="file"
                                    accept="image/jpeg,image/png,image/gif"
                                    onChange={(e) => setCreateData("image", e.target.files[0])}
                                    className="mt-1"
                                />
                                {createErrors.image && (
                                    <p className="text-red-500 text-sm">{createErrors.image}</p>
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
                                <Label htmlFor="create_skills">Skills (comma-separated)</Label>
                                <Input
                                    id="create_skills"
                                    value={createData.skills.join(", ")}
                                    onChange={(e) => handleSkillsChange(e, "create")}
                                    className="mt-1"
                                />
                                {createErrors.skills && (
                                    <p className="text-red-500 text-sm">{createErrors.skills}</p>
                                )}
                            </div>
                            <div>
                                <Label htmlFor="create_label">Label</Label>
                                <Input
                                    id="create_label"
                                    value={createData.label}
                                    onChange={(e) => setCreateData("label", e.target.value)}
                                    className="mt-1"
                                />
                                {createErrors.label && (
                                    <p className="text-red-500 text-sm">{createErrors.label}</p>
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
                            <CardTitle>Edit Dev Commerce</CardTitle>
                        </CardHeader>
                        <CardContent>
                            <form onSubmit={handleUpdate} className="space-y-4">
                                <div>
                                    <Label htmlFor="edit_tag">Tag</Label>
                                    <Input
                                        id="edit_tag"
                                        value={editData.tag}
                                        onChange={(e) => setEditData("tag", e.target.value)}
                                        className="mt-1"
                                    />
                                    {editErrors.tag && (
                                        <p className="text-red-500 text-sm">{editErrors.tag}</p>
                                    )}
                                </div>
                                <div>
                                    <Label htmlFor="edit_image">Image</Label>
                                    <Input
                                        id="edit_image"
                                        type="file"
                                        accept="image/jpeg,image/png,image/gif"
                                        onChange={(e) => setEditData("image", e.target.files[0])}
                                        className="mt-1"
                                    />
                                    {editErrors.image && (
                                        <p className="text-red-500 text-sm">{editErrors.image}</p>
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
                                    <Label htmlFor="edit_skills">Skills (comma-separated)</Label>
                                    <Input
                                        id="edit_skills"
                                        value={editData.skills.join(", ")}
                                        onChange={(e) => handleSkillsChange(e, "edit")}
                                        className="mt-1"
                                    />
                                    {editErrors.skills && (
                                        <p className="text-red-500 text-sm">{editErrors.skills}</p>
                                    )}
                                </div>
                                <div>
                                    <Label htmlFor="edit_label">Label</Label>
                                    <Input
                                        id="edit_label"
                                        value={editData.label}
                                        onChange={(e) => setEditData("label", e.target.value)}
                                        className="mt-1"
                                    />
                                    {editErrors.label && (
                                        <p className="text-red-500 text-sm">{editErrors.label}</p>
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

                {/* List of Dev Commerce Records */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {devCommerces.map((devCommerce) => (
                        <Card key={devCommerce.id}>
                            <CardHeader>
                                <CardTitle>{devCommerce.heading}</CardTitle>
                            </CardHeader>
                            <CardContent>
                                <img
                                    src={`/${devCommerce.image}`}
                                    alt={devCommerce.heading}
                                    className="w-full h-48 object-cover mb-4 rounded"
                                />
                                <p className="text-gray-600 mb-2">
                                    <strong>Tag:</strong> {devCommerce.tag}
                                </p>
                                <p className="text-gray-600 mb-2">
                                    <strong>Description:</strong> {devCommerce.description}
                                </p>
                                <p className="text-gray-600 mb-2">
                                    <strong>Skills:</strong>{" "}
                                    {devCommerce.skills.map((skill, index) => (
                                        <Badge key={index} className="mr-1">
                                            {skill}
                                        </Badge>
                                    ))}
                                </p>
                                <p className="text-gray-600 mb-4">
                                    <strong>Label:</strong> {devCommerce.label}
                                </p>
                                <div className="space-x-2">
                                    <Button
                                        onClick={() => startEditing(devCommerce)}
                                        variant="outline"
                                    >
                                        Edit
                                    </Button>
                                    <Button
                                        onClick={() => handleDelete(devCommerce.id)}
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
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

export default function GoogleMedia({ googleMedia }) {
    const { flash } = usePage().props;

    // Form for creating a new Google Media record
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
        description: "",
        platform: "",
        benefit: "",
    });

    // Form for editing an existing Google Media record
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
        description: "",
        platform: "",
        benefit: "",
    });

    // Handle create form submission
    const handleCreate = (e) => {
        e.preventDefault();
        post(route("google-media.store"), {
            onSuccess: () => reset(),
        });
    };

    // Handle edit form submission
    const handleUpdate = (e) => {
        e.preventDefault();
        put(route("google-media.update", editId), {
            onSuccess: () => setEditId(null),
        });
    };

    // Handle edit button click
    const startEditing = (googleMediaItem) => {
        setEditId(googleMediaItem.id);
        setEditData({
            icon: googleMediaItem.icon,
            heading: googleMediaItem.heading,
            description: googleMediaItem.description,
            platform: googleMediaItem.platform,
            benefit: googleMediaItem.benefit,
        });
    };

    // Handle delete
    const handleDelete = (id) => {
        if (confirm("Are you sure you want to delete this Google Media?")) {
            deleteData(route("google-media.destroy", id), {
                onSuccess: () => setEditId(null),
            });
        }
    };

    return (
        <Layout>
            <div className="container mx-auto p-6">
                <Head title="Google Media" />
                <h1 className="text-3xl font-bold mb-6">Google Media</h1>

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
                        <CardTitle>Create New Google Media</CardTitle>
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
                                <Label htmlFor="create_platform">Platform</Label>
                                <Input
                                    id="create_platform"
                                    value={createData.platform}
                                    onChange={(e) => setCreateData("platform", e.target.value)}
                                    className="mt-1"
                                />
                                {createErrors.platform && (
                                    <p className="text-red-500 text-sm">{createErrors.platform}</p>
                                )}
                            </div>
                            <div>
                                <Label htmlFor="create_benefit">Benefit</Label>
                                <Textarea
                                    id="create_benefit"
                                    value={createData.benefit}
                                    onChange={(e) => setCreateData("benefit", e.target.value)}
                                    className="mt-1"
                                />
                                {createErrors.benefit && (
                                    <p className="text-red-500 text-sm">{createErrors.benefit}</p>
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
                            <CardTitle>Edit Google Media</CardTitle>
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
                                    <Label htmlFor="edit_platform">Platform</Label>
                                    <Input
                                        id="edit_platform"
                                        value={editData.platform}
                                        onChange={(e) => setEditData("platform", e.target.value)}
                                        className="mt-1"
                                    />
                                    {editErrors.platform && (
                                        <p className="text-red-500 text-sm">{editErrors.platform}</p>
                                    )}
                                </div>
                                <div>
                                    <Label htmlFor="edit_benefit">Benefit</Label>
                                    <Textarea
                                        id="edit_benefit"
                                        value={editData.benefit}
                                        onChange={(e) => setEditData("benefit", e.target.value)}
                                        className="mt-1"
                                    />
                                    {editErrors.benefit && (
                                        <p className="text-red-500 text-sm">{editErrors.benefit}</p>
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

                {/* List of Google Media Records */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {googleMedia.map((googleMediaItem) => (
                        <Card key={googleMediaItem.id}>
                            <CardHeader>
                                <CardTitle>{googleMediaItem.heading}</CardTitle>
                            </CardHeader>
                            <CardContent>
                                <div className="flex items-center mb-2">
                                    <span className="text-2xl mr-2">{googleMediaItem.icon}</span>
                                    <h3 className="text-xl font-semibold">{googleMediaItem.heading}</h3>
                                </div>
                                <p className="text-gray-600 mb-2"><strong>Description:</strong> {googleMediaItem.description}</p>
                                <p className="text-gray-600 mb-2"><strong>Platform:</strong> {googleMediaItem.platform}</p>
                                <p className="text-gray-600 mb-4"><strong>Benefit:</strong> {googleMediaItem.benefit}</p>
                                <div className="space-x-2">
                                    <Button
                                        onClick={() => startEditing(googleMediaItem)}
                                        variant="outline"
                                    >
                                        Edit
                                    </Button>
                                    <Button
                                        onClick={() => handleDelete(googleMediaItem.id)}
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
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

export default function SmmFacebook({ smmFacebook }) {
    const { flash } = usePage().props;

    // Form for creating a new SMM Facebook record
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
    });

    // Form for editing an existing SMM Facebook record
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
    });

    // Handle create form submission
    const handleCreate = (e) => {
        e.preventDefault();
        post(route("smm-facebook.store"), {
            onSuccess: () => reset(),
        });
    };

    // Handle edit form submission
    const handleUpdate = (e) => {
        e.preventDefault();
        put(route("smm-facebook.update", editId), {
            onSuccess: () => setEditId(null),
        });
    };

    // Handle edit button click
    const startEditing = (smmFacebookItem) => {
        setEditId(smmFacebookItem.id);
        setEditData({
            icon: smmFacebookItem.icon,
            heading: smmFacebookItem.heading,
            description: smmFacebookItem.description,
        });
    };

    // Handle delete
    const handleDelete = (id) => {
        if (confirm("Are you sure you want to delete this Facebook marketing service?")) {
            deleteData(route("smm-facebook.destroy", id), {
                onSuccess: () => setEditId(null),
            });
        }
    };

    return (
        <Layout>
            <div className="container mx-auto p-6 bg-gradient-to-br from-blue-50 to-white min-h-screen">
                <Head title="Facebook Marketing Services" />
                <h1 className="text-4xl font-extrabold mb-8 text-center text-blue-600">
                    Facebook Marketing Services
                </h1>

                {/* Flash Messages */}
                {flash?.success && (
                    <Alert className="mb-6 max-w-2xl mx-auto border-blue-500">
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
                <Card className="mb-8 shadow-lg border-t-4 border-blue-500">
                    <CardHeader>
                        <CardTitle className="text-2xl text-blue-600">Add New Facebook Marketing Service</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <form onSubmit={handleCreate} className="space-y-6">
                            <div>
                                <Label htmlFor="create_icon" className="text-lg">Icon</Label>
                                <Input
                                    id="create_icon"
                                    value={createData.icon}
                                    onChange={(e) => setCreateData("icon", e.target.value)}
                                    className="mt-1 border-blue-300 focus:ring-blue-500"
                                    placeholder="Enter icon (e.g., emoji or FontAwesome class)"
                                />
                                {createErrors.icon && (
                                    <p className="text-red-500 text-sm mt-1">{createErrors.icon}</p>
                                )}
                            </div>
                            <div>
                                <Label htmlFor="create_heading" className="text-lg">Heading</Label>
                                <Input
                                    id="create_heading"
                                    value={createData.heading}
                                    onChange={(e) => setCreateData("heading", e.target.value)}
                                    className="mt-1 border-blue-300 focus:ring-blue-500"
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
                                    className="mt-1 border-blue-300 focus:ring-blue-500"
                                    placeholder="Enter service description"
                                />
                                {createErrors.description && (
                                    <p className="text-red-500 text-sm mt-1">{createErrors.description}</p>
                                )}
                            </div>
                            <Button
                                type="submit"
                                disabled={createProcessing}
                                className="bg-blue-600 hover:bg-blue-700"
                            >
                                Create
                            </Button>
                        </form>
                    </CardContent>
                </Card>

                {/* Edit Form */}
                {editId && (
                    <Card className="mb-8 shadow-lg border-t-4 border-blue-500">
                        <CardHeader>
                            <CardTitle className="text-2xl text-blue-600">Edit Facebook Marketing Service</CardTitle>
                        </CardHeader>
                        <CardContent>
                            <form onSubmit={handleUpdate} className="space-y-6">
                                <div>
                                    <Label htmlFor="edit_icon" className="text-lg">Icon</Label>
                                    <Input
                                        id="edit_icon"
                                        value={editData.icon}
                                        onChange={(e) => setEditData("icon", e.target.value)}
                                        className="mt-1 border-blue-300 focus:ring-blue-500"
                                        placeholder="Enter icon (e.g., emoji or FontAwesome class)"
                                    />
                                    {editErrors.icon && (
                                        <p className="text-red-500 text-sm mt-1">{editErrors.icon}</p>
                                    )}
                                </div>
                                <div>
                                    <Label htmlFor="edit_heading" className="text-lg">Heading</Label>
                                    <Input
                                        id="edit_heading"
                                        value={editData.heading}
                                        onChange={(e) => setEditData("heading", e.target.value)}
                                        className="mt-1 border-blue-300 focus:ring-blue-500"
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
                                        className="mt-1 border-blue-300 focus:ring-blue-500"
                                        placeholder="Enter service description"
                                    />
                                    {editErrors.description && (
                                        <p className="text-red-500 text-sm mt-1">{editErrors.description}</p>
                                    )}
                                </div>
                                <div className="space-x-2">
                                    <Button
                                        type="submit"
                                        disabled={editProcessing}
                                        className="bg-blue-600 hover:bg-blue-700"
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

                {/* List of SMM Facebook Records */}
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                    {smmFacebook.map((smmFacebookItem) => (
                        <Card
                            key={smmFacebookItem.id}
                            className="group relative overflow-hidden shadow-lg hover:shadow-xl transition-shadow duration-300 border-t-2 border-blue-500"
                        >
                            <CardContent className="p-4">
                                <div className="flex items-center mb-3">
                                    <span className="text-3xl mr-3">{smmFacebookItem.icon}</span>
                                    <h3 className="text-lg font-semibold text-blue-600">{smmFacebookItem.heading}</h3>
                                </div>
                                <p className="text-gray-600 text-sm line-clamp-3">{smmFacebookItem.description}</p>
                                <div className="mt-4 flex space-x-2">
                                    <Button
                                        onClick={() => startEditing(smmFacebookItem)}
                                        variant="outline"
                                        className="border-blue-300 text-blue-600 hover:bg-blue-50"
                                    >
                                        Edit
                                    </Button>
                                    <Button
                                        onClick={() => handleDelete(smmFacebookItem.id)}
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
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

export default function GooglePpc({ googlePpc }) {
    const { flash } = usePage().props;

    // Form for creating a new Google PPC record
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

    // Form for editing an existing Google PPC record
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
        post(route("google-ppc.store"), {
            onSuccess: () => reset(),
        });
    };

    // Handle edit form submission
    const handleUpdate = (e) => {
        e.preventDefault();
        put(route("google-ppc.update", editId), {
            onSuccess: () => setEditId(null),
        });
    };

    // Handle edit button click
    const startEditing = (googlePpcItem) => {
        setEditId(googlePpcItem.id);
        setEditData({
            icon: googlePpcItem.icon,
            heading: googlePpcItem.heading,
            description: googlePpcItem.description,
        });
    };

    // Handle delete
    const handleDelete = (id) => {
        if (
            confirm("Are you sure you want to delete this Google PPC service?")
        ) {
            deleteData(route("google-ppc.destroy", id), {
                onSuccess: () => setEditId(null),
            });
        }
    };

    return (
        <Layout>
            <div className="container mx-auto p-6">
                <Head title="Google PPC Services" />
                <h1 className="text-3xl font-bold mb-6">Google PPC Services</h1>

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
                        <CardTitle>Create New Google PPC Service</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <form onSubmit={handleCreate} className="space-y-4">
                            <div>
                                <Label htmlFor="create_icon">Icon</Label>
                                <Input
                                    id="create_icon"
                                    value={createData.icon}
                                    onChange={(e) =>
                                        setCreateData("icon", e.target.value)
                                    }
                                    className="mt-1"
                                />
                                {createErrors.icon && (
                                    <p className="text-red-500 text-sm">
                                        {createErrors.icon}
                                    </p>
                                )}
                            </div>
                            <div>
                                <Label htmlFor="create_heading">Heading</Label>
                                <Input
                                    id="create_heading"
                                    value={createData.heading}
                                    onChange={(e) =>
                                        setCreateData("heading", e.target.value)
                                    }
                                    className="mt-1"
                                />
                                {createErrors.heading && (
                                    <p className="text-red-500 text-sm">
                                        {createErrors.heading}
                                    </p>
                                )}
                            </div>
                            <div>
                                <Label htmlFor="create_description">
                                    Description
                                </Label>
                                <Textarea
                                    id="create_description"
                                    value={createData.description}
                                    onChange={(e) =>
                                        setCreateData(
                                            "description",
                                            e.target.value
                                        )
                                    }
                                    className="mt-1"
                                />
                                {createErrors.description && (
                                    <p className="text-red-500 text-sm">
                                        {createErrors.description}
                                    </p>
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
                            <CardTitle>Edit Google PPC Service</CardTitle>
                        </CardHeader>
                        <CardContent>
                            <form onSubmit={handleUpdate} className="space-y-4">
                                <div>
                                    <Label htmlFor="edit_icon">Icon</Label>
                                    <Input
                                        id="edit_icon"
                                        value={editData.icon}
                                        onChange={(e) =>
                                            setEditData("icon", e.target.value)
                                        }
                                        className="mt-1"
                                    />
                                    {editErrors.icon && (
                                        <p className="text-red-500 text-sm">
                                            {editErrors.icon}
                                        </p>
                                    )}
                                </div>
                                <div>
                                    <Label htmlFor="edit_heading">
                                        Heading
                                    </Label>
                                    <Input
                                        id="edit_heading"
                                        value={editData.heading}
                                        onChange={(e) =>
                                            setEditData(
                                                "heading",
                                                e.target.value
                                            )
                                        }
                                        className="mt-1"
                                    />
                                    {editErrors.heading && (
                                        <p className="text-red-500 text-sm">
                                            {editErrors.heading}
                                        </p>
                                    )}
                                </div>
                                <div>
                                    <Label htmlFor="edit_description">
                                        Description
                                    </Label>
                                    <Textarea
                                        id="edit_description"
                                        value={editData.description}
                                        onChange={(e) =>
                                            setEditData(
                                                "description",
                                                e.target.value
                                            )
                                        }
                                        className="mt-1"
                                    />
                                    {editErrors.description && (
                                        <p className="text-red-500 text-sm">
                                            {editErrors.description}
                                        </p>
                                    )}
                                </div>
                                <div className="space-x-2">
                                    <Button
                                        type="submit"
                                        disabled={editProcessing}
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

                {/* List of Google PPC Records */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {googlePpc.map((googlePpcItem) => (
                        <Card key={googlePpcItem.id}>
                            <CardHeader>
                                <CardTitle>{googlePpcItem.heading}</CardTitle>
                            </CardHeader>
                            <CardContent>
                                <div className="flex items-center mb-2">
                                    <span className="text-2xl mr-2">
                                        {googlePpcItem.icon}
                                    </span>
                                    <h3 className="text-xl font-semibold">
                                        {googlePpcItem.heading}
                                    </h3>
                                </div>
                                <p className="text-gray-600 mb-4">
                                    {googlePpcItem.description}
                                </p>
                                <div className="space-x-2">
                                    <Button
                                        onClick={() =>
                                            startEditing(googlePpcItem)
                                        }
                                        variant="outline"
                                    >
                                        Edit
                                    </Button>
                                    <Button
                                        onClick={() =>
                                            handleDelete(googlePpcItem.id)
                                        }
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

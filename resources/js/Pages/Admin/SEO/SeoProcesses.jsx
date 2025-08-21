import { useState } from "react";
import { usePage, useForm } from "@inertiajs/react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Trash2, Pencil } from "lucide-react";
import Layout from "@/Layouts/Layout";


export default function SeoProcesses() {
    const { props } = usePage();
    const { seo_processes, flash } = props;

    const [editingId, setEditingId] = useState(null);

    // Form for creating new SEO process
    const {
        data: createData,
        setData: setCreateData,
        post,
        processing: createProcessing,
        errors: createErrors,
        reset: resetCreate,
        delete: destroy,
    } = useForm({
        icon: "",
        heading: "",
        description: "",
    });

    // Form for updating existing SEO process
    const {
        data: updateData,
        setData: setUpdateData,
        put,
        processing: updateProcessing,
        errors: updateErrors,
        reset: resetUpdate,
    } = useForm({
        icon: "",
        heading: "",
        description: "",
    });

    // Handle create form submission
    const handleCreate = (e) => {
        e.preventDefault();
        post(route("seo-processes.store"), {
            onSuccess: () => {
                resetCreate();
            },
        });
    };

    // Handle update form submission
    const handleUpdate = (e) => {
        e.preventDefault();
        put(route("seo-processes.update", editingId), {
            onSuccess: () => {
                setEditingId(null);
                resetUpdate();
            },
        });
    };

    // Start editing a process
    const startEditing = (process) => {
        setEditingId(process.id);
        setUpdateData({
            icon: process.icon,
            heading: process.heading,
            description: process.description,
        });
    };

    // Handle delete
    const handleDelete = (id) => {
        if (confirm("Are you sure you want to delete this SEO process?")) {
            destroy(route("seo-processes.destroy", id));
        }
    };

    return (
        <Layout>
            <div className="container mx-auto p-4">
                <h1 className="text-2xl font-bold mb-6">
                    SEO Processes Management
                </h1>

                {/* Flash Messages */}
                {flash?.message && (
                    <Alert
                        className={`mb-4 ${
                            flash.type === "error"
                                ? "border-red-500"
                                : "border-green-500"
                        }`}
                    >
                        <AlertDescription
                            className={
                                flash.type === "error"
                                    ? "text-red-500"
                                    : "text-green-500"
                            }
                        >
                            {flash.message}
                        </AlertDescription>
                    </Alert>
                )}

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {/* Create Form */}
                    <Card>
                        <CardHeader>
                            <CardTitle>Add New SEO Process</CardTitle>
                        </CardHeader>
                        <CardContent>
                            <form onSubmit={handleCreate} className="space-y-4">
                                <div>
                                    <Input
                                        placeholder="Icon (e.g., fa-icon-name)"
                                        value={createData.icon}
                                        onChange={(e) =>
                                            setCreateData(
                                                "icon",
                                                e.target.value
                                            )
                                        }
                                    />
                                    {createErrors.icon && (
                                        <p className="text-red-500 text-sm mt-1">
                                            {createErrors.icon}
                                        </p>
                                    )}
                                </div>
                                <div>
                                    <Input
                                        placeholder="Heading"
                                        value={createData.heading}
                                        onChange={(e) =>
                                            setCreateData(
                                                "heading",
                                                e.target.value
                                            )
                                        }
                                    />
                                    {createErrors.heading && (
                                        <p className="text-red-500 text-sm mt-1">
                                            {createErrors.heading}
                                        </p>
                                    )}
                                </div>
                                <div>
                                    <Textarea
                                        placeholder="Description"
                                        value={createData.description}
                                        onChange={(e) =>
                                            setCreateData(
                                                "description",
                                                e.target.value
                                            )
                                        }
                                    />
                                    {createErrors.description && (
                                        <p className="text-red-500 text-sm mt-1">
                                            {createErrors.description}
                                        </p>
                                    )}
                                </div>
                                <Button
                                    type="submit"
                                    disabled={createProcessing}
                                >
                                    {createProcessing
                                        ? "Creating..."
                                        : "Create Process"}
                                </Button>
                            </form>
                        </CardContent>
                    </Card>

                    {/* Update Form */}
                    {editingId && (
                        <Card>
                            <CardHeader>
                                <CardTitle>Edit SEO Process</CardTitle>
                            </CardHeader>
                            <CardContent>
                                <form
                                    onSubmit={handleUpdate}
                                    className="space-y-4"
                                >
                                    <div>
                                        <Input
                                            placeholder="Icon (e.g., fa-icon-name)"
                                            value={updateData.icon}
                                            onChange={(e) =>
                                                setUpdateData(
                                                    "icon",
                                                    e.target.value
                                                )
                                            }
                                        />
                                        {updateErrors.icon && (
                                            <p className="text-red-500 text-sm mt-1">
                                                {updateErrors.icon}
                                            </p>
                                        )}
                                    </div>
                                    <div>
                                        <Input
                                            placeholder="Heading"
                                            value={updateData.heading}
                                            onChange={(e) =>
                                                setUpdateData(
                                                    "heading",
                                                    e.target.value
                                                )
                                            }
                                        />
                                        {updateErrors.heading && (
                                            <p className="text-red-500 text-sm mt-1">
                                                {updateErrors.heading}
                                            </p>
                                        )}
                                    </div>
                                    <div>
                                        <Textarea
                                            placeholder="Description"
                                            value={updateData.description}
                                            onChange={(e) =>
                                                setUpdateData(
                                                    "description",
                                                    e.target.value
                                                )
                                            }
                                        />
                                        {updateErrors.description && (
                                            <p className="text-red-500 text-sm mt-1">
                                                {updateErrors.description}
                                            </p>
                                        )}
                                    </div>
                                    <div className="flex space-x-2">
                                        <Button
                                            type="submit"
                                            disabled={updateProcessing}
                                        >
                                            {updateProcessing
                                                ? "Updating..."
                                                : "Update Process"}
                                        </Button>
                                        <Button
                                            variant="outline"
                                            onClick={() => setEditingId(null)}
                                        >
                                            Cancel
                                        </Button>
                                    </div>
                                </form>
                            </CardContent>
                        </Card>
                    )}
                </div>

                {/* Processes Table */}
                <Card className="mt-6">
                    <CardHeader>
                        <CardTitle>SEO Processes List</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <Table>
                            <TableHeader>
                                <TableRow>
                                    <TableHead>Icon</TableHead>
                                    <TableHead>Heading</TableHead>
                                    <TableHead>Description</TableHead>
                                    <TableHead>Actions</TableHead>
                                </TableRow>
                            </TableHeader>
                            <TableBody>
                                {seo_processes.map((process) => (
                                    <TableRow key={process.id}>
                                        <TableCell>{process.icon}</TableCell>
                                        <TableCell>{process.heading}</TableCell>
                                        <TableCell>
                                            {process.description}
                                        </TableCell>
                                        <TableCell>
                                            <div className="flex space-x-2">
                                                <Button
                                                    variant="outline"
                                                    size="sm"
                                                    onClick={() =>
                                                        startEditing(process)
                                                    }
                                                >
                                                    <Pencil className="h-4 w-4" />
                                                </Button>
                                                <Button
                                                    variant="destructive"
                                                    size="sm"
                                                    onClick={() =>
                                                        handleDelete(process.id)
                                                    }
                                                >
                                                    <Trash2 className="h-4 w-4" />
                                                </Button>
                                            </div>
                                        </TableCell>
                                    </TableRow>
                                ))}
                            </TableBody>
                        </Table>
                    </CardContent>
                </Card>
            </div>
        </Layout>
    );
}

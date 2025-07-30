import { useState } from "react";
import { useForm, usePage, router } from "@inertiajs/react";
import { Plus, Edit, Trash2, X, Home, FileText, BarChart3 } from "lucide-react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Badge } from "@/components/ui/badge";

const About = () => {
    const { homeAbouts = [], flash } = usePage().props;
    const [editingItem, setEditingItem] = useState(null);
    const [alertMessage, setAlertMessage] = useState("");
    const [alertType, setAlertType] = useState("");
    const [showForm, setShowForm] = useState(false);

    // Form for both create and edit
    const form = useForm({
        title: "",
        description: "",
        metric: "",
    });

    const showAlert = (message, type = 'success') => {
        setAlertMessage(message);
        setAlertType(type);
        setTimeout(() => {
            setAlertMessage("");
            setAlertType("");
        }, 4000);
    };

    const resetForm = () => {
        form.reset();
        form.setData({
            title: "",
            description: "",
            metric: "",
        });
        form.clearErrors();
        setEditingItem(null);
        setShowForm(false);
    };

    const handleEdit = (item) => {
        setEditingItem(item);
        setShowForm(true);
        form.setData({
            title: item.title || "",
            description: item.description || "",
            metric: item.metric || "",
        });
        form.clearErrors();
        
        // Scroll to form
        setTimeout(() => {
            document.getElementById('homeAboutForm')?.scrollIntoView({ behavior: 'smooth' });
        }, 100);
    };

    const handleCreate = () => {
        resetForm();
        setShowForm(true);
        setTimeout(() => {
            document.getElementById('homeAboutForm')?.scrollIntoView({ behavior: 'smooth' });
        }, 100);
    };

    const handleSubmit = () => {
        
        if (editingItem) {
            // Update existing item
            form.put(route("home-about.update", editingItem.id), {
                onSuccess: () => {
                    resetForm();
                    showAlert("Home About updated successfully!");
                },
                onError: (errors) => {
                    const errorMessages = Object.values(errors).flat();
                    showAlert(errorMessages.join(', '), "error");
                },
            });
        } else {
            // Create new item
            form.post(route("home-about.store"), {
                onSuccess: () => {
                    resetForm();
                    showAlert("Home About created successfully!");
                },
                onError: (errors) => {
                    const errorMessages = Object.values(errors).flat();
                    showAlert(errorMessages.join(', '), "error");
                },
            });
        }
    };

    const handleDelete = (id) => {
        if (confirm("Are you sure you want to delete this item?")) {
            router.delete(route("home-about.destroy", id), {
                onSuccess: () => {
                    showAlert("Home About deleted successfully!");
                },
                onError: (errors) => {
                    showAlert("Failed to delete item.", "error");
                },
            });
        }
    };

    return (
        <div className="container mx-auto p-6 space-y-6">
            {/* Header */}
            <div className="flex justify-between items-center">
                <div>
                    <h1 className="text-3xl font-bold text-gray-900">Home About Management</h1>
                    <p className="text-gray-600 mt-2">Manage your home about sections</p>
                </div>
                <Button 
                    onClick={handleCreate}
                    className="bg-blue-600 hover:bg-blue-700"
                >
                    <Plus className="w-4 h-4 mr-2" />
                    Add New Item
                </Button>
            </div>

            {/* Alert */}
            {alertMessage && (
                <Alert className={`${alertType === 'error' ? 'border-red-500 bg-red-50' : 'border-green-500 bg-green-50'}`}>
                    <AlertDescription className={alertType === 'error' ? 'text-red-700' : 'text-green-700'}>
                        {alertMessage}
                    </AlertDescription>
                </Alert>
            )}

            {/* Form */}
            {showForm && (
                <Card id="homeAboutForm" className="border-2 border-blue-200">
                    <CardHeader>
                        <div className="flex justify-between items-center">
                            <div>
                                <CardTitle className="text-xl">
                                    {editingItem ? 'Edit Home About' : 'Create New Home About'}
                                </CardTitle>
                                <CardDescription>
                                    {editingItem ? 'Update the home about information' : 'Add a new home about section'}
                                </CardDescription>
                            </div>
                            <Button
                                variant="ghost"
                                size="sm"
                                onClick={resetForm}
                            >
                                <X className="w-4 h-4" />
                            </Button>
                        </div>
                    </CardHeader>
                    <CardContent>
                        <div className="space-y-4">
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                {/* Title */}
                                <div className="space-y-2">
                                    <Label htmlFor="title" className="text-sm font-medium">
                                        Title *
                                    </Label>
                                    <Input
                                        id="title"
                                        type="text"
                                        value={form.data.title}
                                        onChange={(e) => form.setData('title', e.target.value)}
                                        placeholder="Enter title"
                                        className={form.errors.title ? 'border-red-500' : ''}
                                    />
                                    {form.errors.title && (
                                        <p className="text-sm text-red-600">{form.errors.title}</p>
                                    )}
                                </div>

                                {/* Metric */}
                                <div className="space-y-2">
                                    <Label htmlFor="metric" className="text-sm font-medium">
                                        Metric *
                                    </Label>
                                    <Input
                                        id="metric"
                                        type="text"
                                        value={form.data.metric}
                                        onChange={(e) => form.setData('metric', e.target.value)}
                                        placeholder="Enter metric (e.g., 100+, 5 years)"
                                        className={form.errors.metric ? 'border-red-500' : ''}
                                    />
                                    {form.errors.metric && (
                                        <p className="text-sm text-red-600">{form.errors.metric}</p>
                                    )}
                                </div>
                            </div>

                            {/* Description */}
                            <div className="space-y-2">
                                <Label htmlFor="description" className="text-sm font-medium">
                                    Description *
                                </Label>
                                <Textarea
                                    id="description"
                                    value={form.data.description}
                                    onChange={(e) => form.setData('description', e.target.value)}
                                    placeholder="Enter description"
                                    rows={4}
                                    className={form.errors.description ? 'border-red-500' : ''}
                                />
                                {form.errors.description && (
                                    <p className="text-sm text-red-600">{form.errors.description}</p>
                                )}
                            </div>

                            {/* Form Actions */}
                            <div className="flex gap-3 pt-4">
                                <Button
                                    type="button"
                                    onClick={handleSubmit}
                                    disabled={form.processing}
                                    className="bg-blue-600 hover:bg-blue-700"
                                >
                                    {form.processing ? (
                                        <>
                                            <div className="w-4 h-4 mr-2 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                                            {editingItem ? 'Updating...' : 'Creating...'}
                                        </>
                                    ) : (
                                        <>
                                            {editingItem ? 'Update' : 'Create'}
                                        </>
                                    )}
                                </Button>
                                <Button
                                    type="button"
                                    variant="outline"
                                    onClick={resetForm}
                                >
                                    Cancel
                                </Button>
                            </div>
                        </div>
                    </CardContent>
                </Card>
            )}

            {/* Items List */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {homeAbouts.length > 0 ? (
                    homeAbouts.map((item) => (
                        <Card key={item.id} className="hover:shadow-lg transition-shadow">
                            <CardHeader className="pb-3">
                                <div className="flex justify-between items-start">
                                    <div className="flex items-center space-x-2">
                                        <Home className="w-5 h-5 text-blue-600" />
                                        <CardTitle className="text-lg">{item.title}</CardTitle>
                                    </div>
                                    <Badge variant="secondary" className="bg-blue-100 text-blue-800">
                                        {item.metric}
                                    </Badge>
                                </div>
                            </CardHeader>
                            <CardContent>
                                <div className="space-y-3">
                                    <div className="flex items-start space-x-2">
                                        <FileText className="w-4 h-4 text-gray-500 mt-0.5 flex-shrink-0" />
                                        <p className="text-sm text-gray-600 line-clamp-3">
                                            {item.description}
                                        </p>
                                    </div>
                                    
                                    <div className="flex justify-end space-x-2 pt-3 border-t">
                                        <Button
                                            variant="outline"
                                            size="sm"
                                            onClick={() => handleEdit(item)}
                                            className="text-blue-600 hover:text-blue-700 hover:bg-blue-50"
                                        >
                                            <Edit className="w-4 h-4" />
                                        </Button>
                                        <Button
                                            variant="outline"
                                            size="sm"
                                            onClick={() => handleDelete(item.id)}
                                            className="text-red-600 hover:text-red-700 hover:bg-red-50"
                                        >
                                            <Trash2 className="w-4 h-4" />
                                        </Button>
                                    </div>
                                </div>
                            </CardContent>
                        </Card>
                    ))
                ) : (
                    <div className="col-span-full">
                        <Card className="text-center py-12">
                            <CardContent>
                                <Home className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                                <h3 className="text-lg font-medium text-gray-900 mb-2">No items found</h3>
                                <p className="text-gray-600 mb-4">Get started by creating your first home about section.</p>
                                <Button onClick={handleCreate} className="bg-blue-600 hover:bg-blue-700">
                                    <Plus className="w-4 h-4 mr-2" />
                                    Add First Item
                                </Button>
                            </CardContent>
                        </Card>
                    </div>
                )}
            </div>
        </div>
    );
};

export default About;
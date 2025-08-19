import { useState } from "react";
import { useForm, usePage, router } from "@inertiajs/react";
import {
    Plus,
    Edit,
    Trash2,
    X,
    Home,
    FileText,
    Tag,
    Link,
    Upload,
    Eye,
    Image as ImageIcon,
} from "lucide-react";
import {
    Card,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Badge } from "@/components/ui/badge";
import Layout from "@/Layouts/Layout";

const About = () => {
    const { homeAbouts = [], flash } = usePage().props;
    const [editingItem, setEditingItem] = useState(null);
    const [alertMessage, setAlertMessage] = useState("");
    const [alertType, setAlertType] = useState("");
    const [showForm, setShowForm] = useState(false);
    const [imagePreview, setImagePreview] = useState(null);

    // Form for both create and edit
    const form = useForm({
        tag: "",
        heading: "",
        sub_heading: "",
        image: null,
        content: "",
        button_text: "",
        button_url: "",
    });

    const showAlert = (message, type = "success") => {
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
            tag: "",
            heading: "",
            sub_heading: "",
            image: null,
            content: "",
            button_text: "",
            button_url: "",
        });
        form.clearErrors();
        setEditingItem(null);
        setShowForm(false);
        setImagePreview(null);
    };

    const handleImageChange = (e) => {
        const file = e.target.files[0];
        if (file) {
            form.setData("image", file);

            // Create preview
            const reader = new FileReader();
            reader.onload = (e) => {
                setImagePreview(e.target.result);
            };
            reader.readAsDataURL(file);
        }
    };

    const handleEdit = (item) => {
        setEditingItem(item);
        setShowForm(true);
        form.setData({
            tag: item.tag || "",
            heading: item.heading || "",
            sub_heading: item.sub_heading || "",
            image: null,
            content: item.content || "",
            button_text: item.button_text || "",
            button_url: item.button_url || "",
        });
        form.clearErrors();
        setImagePreview(`/assets/images/homeAbout/${item.image}`);

        // Scroll to form
        setTimeout(() => {
            document
                .getElementById("homeAboutForm")
                ?.scrollIntoView({ behavior: "smooth" });
        }, 100);
    };

    const handleCreate = () => {
        resetForm();
        setShowForm(true);
        setTimeout(() => {
            document
                .getElementById("homeAboutForm")
                ?.scrollIntoView({ behavior: "smooth" });
        }, 100);
    };

    const handleSubmit = () => {
        if (editingItem) {
            // Update existing item
            form.post(route("home-about.update", editingItem.id), {
                forceFormData: true,
                _method: "put",
                onSuccess: () => {
                    resetForm();
                    showAlert("Home About updated successfully!");
                },
                onError: (errors) => {
                    const errorMessages = Object.values(errors).flat();
                    showAlert(errorMessages.join(", "), "error");
                },
            });
        } else {
            // Create new item
            form.post(route("home-about.store"), {
                forceFormData: true,
                onSuccess: () => {
                    resetForm();
                    showAlert("Home About created successfully!");
                },
                onError: (errors) => {
                    const errorMessages = Object.values(errors).flat();
                    showAlert(errorMessages.join(", "), "error");
                },
            });
        }
    };

    const handleDelete = (id) => {
        if (
            confirm(
                "Are you sure you want to delete this item? This will also delete the associated image."
            )
        ) {
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
        <Layout>
            <div className="container mx-auto p-6 space-y-6">
                {/* Header */}
                <div className="flex justify-between items-center">
                    <div>
                        <h1 className="text-3xl font-bold text-gray-900">
                            Home About Management
                        </h1>
                        <p className="text-gray-600 mt-2">
                            Manage your home about sections with images and
                            content
                        </p>
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
                    <Alert
                        className={`${
                            alertType === "error"
                                ? "border-red-500 bg-red-50"
                                : "border-green-500 bg-green-50"
                        }`}
                    >
                        <AlertDescription
                            className={
                                alertType === "error"
                                    ? "text-red-700"
                                    : "text-green-700"
                            }
                        >
                            {alertMessage}
                        </AlertDescription>
                    </Alert>
                )}

                {/* Form */}
                {showForm && (
                    <Card
                        id="homeAboutForm"
                        className="border-2 border-blue-200"
                    >
                        <CardHeader>
                            <div className="flex justify-between items-center">
                                <div>
                                    <CardTitle className="text-xl">
                                        {editingItem
                                            ? "Edit Home About"
                                            : "Create New Home About"}
                                    </CardTitle>
                                    <CardDescription>
                                        {editingItem
                                            ? "Update the home about information"
                                            : "Add a new home about section with image"}
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
                                    {/* Tag */}
                                    <div className="space-y-2">
                                        <Label
                                            htmlFor="tag"
                                            className="text-sm font-medium"
                                        >
                                            Tag *
                                        </Label>
                                        <Input
                                            id="tag"
                                            type="text"
                                            value={form.data.tag}
                                            onChange={(e) =>
                                                form.setData(
                                                    "tag",
                                                    e.target.value
                                                )
                                            }
                                            placeholder="Enter tag"
                                            className={
                                                form.errors.tag
                                                    ? "border-red-500"
                                                    : ""
                                            }
                                        />
                                        {form.errors.tag && (
                                            <p className="text-sm text-red-600">
                                                {form.errors.tag}
                                            </p>
                                        )}
                                    </div>

                                    {/* Button Text */}
                                    <div className="space-y-2">
                                        <Label
                                            htmlFor="button_text"
                                            className="text-sm font-medium"
                                        >
                                            Button Text *
                                        </Label>
                                        <Input
                                            id="button_text"
                                            type="text"
                                            value={form.data.button_text}
                                            onChange={(e) =>
                                                form.setData(
                                                    "button_text",
                                                    e.target.value
                                                )
                                            }
                                            placeholder="Enter button text"
                                            className={
                                                form.errors.button_text
                                                    ? "border-red-500"
                                                    : ""
                                            }
                                        />
                                        {form.errors.button_text && (
                                            <p className="text-sm text-red-600">
                                                {form.errors.button_text}
                                            </p>
                                        )}
                                    </div>
                                </div>

                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                    {/* Heading */}
                                    <div className="space-y-2">
                                        <Label
                                            htmlFor="heading"
                                            className="text-sm font-medium"
                                        >
                                            Heading *
                                        </Label>
                                        <Input
                                            id="heading"
                                            type="text"
                                            value={form.data.heading}
                                            onChange={(e) =>
                                                form.setData(
                                                    "heading",
                                                    e.target.value
                                                )
                                            }
                                            placeholder="Enter heading"
                                            className={
                                                form.errors.heading
                                                    ? "border-red-500"
                                                    : ""
                                            }
                                        />
                                        {form.errors.heading && (
                                            <p className="text-sm text-red-600">
                                                {form.errors.heading}
                                            </p>
                                        )}
                                    </div>

                                    {/* Sub Heading */}
                                    <div className="space-y-2">
                                        <Label
                                            htmlFor="sub_heading"
                                            className="text-sm font-medium"
                                        >
                                            Sub Heading *
                                        </Label>
                                        <Input
                                            id="sub_heading"
                                            type="text"
                                            value={form.data.sub_heading}
                                            onChange={(e) =>
                                                form.setData(
                                                    "sub_heading",
                                                    e.target.value
                                                )
                                            }
                                            placeholder="Enter sub heading"
                                            className={
                                                form.errors.sub_heading
                                                    ? "border-red-500"
                                                    : ""
                                            }
                                        />
                                        {form.errors.sub_heading && (
                                            <p className="text-sm text-red-600">
                                                {form.errors.sub_heading}
                                            </p>
                                        )}
                                    </div>
                                </div>

                                {/* Button URL */}
                                <div className="space-y-2">
                                    <Label
                                        htmlFor="button_url"
                                        className="text-sm font-medium"
                                    >
                                        Button URL *
                                    </Label>
                                    <Input
                                        id="button_url"
                                        type="url"
                                        value={form.data.button_url}
                                        onChange={(e) =>
                                            form.setData(
                                                "button_url",
                                                e.target.value
                                            )
                                        }
                                        placeholder="https://example.com"
                                        className={
                                            form.errors.button_url
                                                ? "border-red-500"
                                                : ""
                                        }
                                    />
                                    {form.errors.button_url && (
                                        <p className="text-sm text-red-600">
                                            {form.errors.button_url}
                                        </p>
                                    )}
                                </div>

                                {/* Image Upload */}
                                <div className="space-y-2">
                                    <Label
                                        htmlFor="image"
                                        className="text-sm font-medium"
                                    >
                                        Image {!editingItem && "*"}
                                    </Label>
                                    <div className="flex items-center space-x-4">
                                        <Input
                                            id="image"
                                            type="file"
                                            accept="image/jpeg,image/jpg,image/png,image/webp"
                                            onChange={handleImageChange}
                                            className={
                                                form.errors.image
                                                    ? "border-red-500"
                                                    : ""
                                            }
                                        />
                                        {imagePreview && (
                                            <div className="relative">
                                                <img
                                                    src={imagePreview}
                                                    alt="Preview"
                                                    className="w-16 h-16 object-cover rounded-lg border"
                                                />
                                            </div>
                                        )}
                                    </div>
                                    <p className="text-xs text-gray-500">
                                        Supported formats: JPG, JPEG, PNG, WEBP
                                        (Max: 512KB)
                                    </p>
                                    {form.errors.image && (
                                        <p className="text-sm text-red-600">
                                            {form.errors.image}
                                        </p>
                                    )}
                                </div>

                                {/* Content */}
                                <div className="space-y-2">
                                    <Label
                                        htmlFor="content"
                                        className="text-sm font-medium"
                                    >
                                        Content *
                                    </Label>
                                    <Textarea
                                        id="content"
                                        value={form.data.content}
                                        onChange={(e) =>
                                            form.setData(
                                                "content",
                                                e.target.value
                                            )
                                        }
                                        placeholder="Enter content (max 1000 characters)"
                                        rows={4}
                                        maxLength={1000}
                                        className={
                                            form.errors.content
                                                ? "border-red-500"
                                                : ""
                                        }
                                    />
                                    <div className="flex justify-between">
                                        {form.errors.content && (
                                            <p className="text-sm text-red-600">
                                                {form.errors.content}
                                            </p>
                                        )}
                                        <p className="text-xs text-gray-500 ml-auto">
                                            {form.data.content.length}/1000
                                            characters
                                        </p>
                                    </div>
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
                                                {editingItem
                                                    ? "Updating..."
                                                    : "Creating..."}
                                            </>
                                        ) : (
                                            <>
                                                {editingItem
                                                    ? "Update"
                                                    : "Create"}
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
                        homeAbouts.map((item) => {
                            console.log(item)
                            return (
                                <Card
                                    key={item.id}
                                    className="hover:shadow-lg transition-shadow"
                                >
                                    <CardHeader className="pb-3">
                                        <div className="flex justify-between items-start">
                                            <Badge
                                                variant="secondary"
                                                className="bg-blue-100 text-blue-800 mb-2"
                                            >
                                                {item.tag}
                                            </Badge>
                                        </div>
                                        {item.image && (
                                            <div className="w-full h-48 mb-3">
                                                <img
                                                    src={`/assets/images/homeAbout/${item.image}`}
                                                    alt={item.heading}
                                                    className="w-full h-full object-cover rounded-lg"
                                                />
                                            </div>
                                        )}
                                        <CardTitle className="text-lg">
                                            {item.heading}
                                        </CardTitle>
                                        <CardDescription className="text-sm text-gray-600">
                                            {item.sub_heading}
                                        </CardDescription>
                                    </CardHeader>
                                    <CardContent>
                                        <div className="space-y-3">
                                            <div className="flex items-start space-x-2">
                                                <FileText className="w-4 h-4 text-gray-500 mt-0.5 flex-shrink-0" />
                                                <p className="text-sm text-gray-600 line-clamp-3">
                                                    {item.content}
                                                </p>
                                            </div>
    
                                            <div className="flex items-center space-x-2">
                                                <Link className="w-4 h-4 text-gray-500" />
                                                <a
                                                    href={item.button_url}
                                                    target="_blank"
                                                    rel="noopener noreferrer"
                                                    className="text-sm text-blue-600 hover:underline truncate"
                                                >
                                                    {item.button_text}
                                                </a>
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
                                                    onClick={() =>
                                                        handleDelete(item.id)
                                                    }
                                                    className="text-red-600 hover:text-red-700 hover:bg-red-50"
                                                >
                                                    <Trash2 className="w-4 h-4" />
                                                </Button>
                                            </div>
                                        </div>
                                    </CardContent>
                                </Card>
                            )
                        })
                    ) : (
                        <div className="col-span-full">
                            <Card className="text-center py-12">
                                <CardContent>
                                    <ImageIcon className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                                    <h3 className="text-lg font-medium text-gray-900 mb-2">
                                        No items found
                                    </h3>
                                    <p className="text-gray-600 mb-4">
                                        Get started by creating your first home
                                        about section.
                                    </p>
                                    <Button
                                        onClick={handleCreate}
                                        className="bg-blue-600 hover:bg-blue-700"
                                    >
                                        <Plus className="w-4 h-4 mr-2" />
                                        Add First Item
                                    </Button>
                                </CardContent>
                            </Card>
                        </div>
                    )}
                </div>
            </div>
        </Layout>
    );
};

export default About;

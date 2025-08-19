import { useState } from "react";
import { Link, useForm, usePage } from "@inertiajs/react";
import { Button } from "@/Components/ui/button";
import { Input } from "@/Components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/Components/ui/card";
import { Alert, AlertDescription } from "@/Components/ui/alert";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/Components/ui/alert-dialog";
import { Badge } from "@/Components/ui/badge";
import { Separator } from "@/Components/ui/separator";
import Layout from "@/Layouts/Layout";
import {
  Settings,
  Plus,
  Trash2,
  Calendar,
  CheckCircle2,
  XCircle,
  Save,
  Upload,
  Image as ImageIcon,
  Monitor,
  Code,
  Cpu,
  Database
} from "lucide-react";

export default function ToolsPage() {
    const { technologies, flash } = usePage().props;
    const [imagePreview, setImagePreview] = useState(null);
    const [deleteId, setDeleteId] = useState(null);
    const {
        data,
        setData,
        post,
        delete: destroy,
        processing,
        errors,
    } = useForm({
        img: null,
        heading: "",
    });

    const handleSubmit = (e) => {
        e.preventDefault();
        const formData = new FormData();
        formData.append("img", data.img);
        formData.append("heading", data.heading);

        post("/technologies", formData, {
            forceFormData: true,
            onSuccess: () => {
                setData({ img: null, heading: "" });
                setImagePreview(null);
                // Reset file input
                const fileInput = document.querySelector('input[type="file"]');
                if (fileInput) fileInput.value = '';
            },
        });
    };

    const handleDelete = (id) => {
        destroy(`/technologies/${id}`, {
            onSuccess: () => {
                setDeleteId(null);
            },
        });
    };

    const handleImageChange = (e) => {
        const file = e.target.files[0];
        if (file) {
            setData("img", file);
            setImagePreview(URL.createObjectURL(file));
        }
    };

    const isFormValid = data.img && data.heading;

    const getTechIcon = (heading) => {
        const lowerHeading = heading.toLowerCase();
        if (lowerHeading.includes('database') || lowerHeading.includes('sql') || lowerHeading.includes('mongo')) {
            return <Database className="h-4 w-4" />;
        } else if (lowerHeading.includes('react') || lowerHeading.includes('vue') || lowerHeading.includes('angular')) {
            return <Code className="h-4 w-4" />;
        } else if (lowerHeading.includes('server') || lowerHeading.includes('node') || lowerHeading.includes('api')) {
            return <Cpu className="h-4 w-4" />;
        } else {
            return <Monitor className="h-4 w-4" />;
        }
    };

    return (
        <Layout>
            <div className="min-h-screen bg-gradient-to-br from-cyan-50 via-blue-50 to-indigo-100">
                <div className="container mx-auto p-6 max-w-7xl">
                    {/* Header Section */}
                    <div className="text-center mb-8">
                        <h1 className="text-4xl font-bold text-gray-900 mb-2 flex items-center justify-center gap-3">
                            <Settings className="h-10 w-10 text-cyan-600" />
                            Technologies & Tools
                        </h1>
                        <p className="text-lg text-gray-600">
                            Manage your technology stack and development tools
                        </p>
                    </div>

                    {/* Flash Messages */}
                    {flash?.message && (
                        <Alert className="mb-6 border-green-200 bg-green-50 max-w-4xl mx-auto">
                            <CheckCircle2 className="h-4 w-4 text-green-600" />
                            <AlertDescription className="text-green-800">
                                {flash.message}
                            </AlertDescription>
                        </Alert>
                    )}

                    <div className="grid lg:grid-cols-2 gap-8">
                        {/* Form Section */}
                        <div className="space-y-6">
                            <Card className="shadow-lg border-0 bg-white/80 backdrop-blur-sm">
                                <CardHeader className="bg-gradient-to-r from-cyan-500 to-blue-600 text-white rounded-t-lg">
                                    <CardTitle className="flex items-center gap-2 text-xl">
                                        <Plus className="h-5 w-5" />
                                        Add New Technology
                                    </CardTitle>
                                </CardHeader>
                                <CardContent className="p-6">
                                    <form onSubmit={handleSubmit} className="space-y-6">
                                        {/* Image Upload */}
                                        <div className="space-y-4">
                                            <label className="text-sm font-semibold text-gray-700 flex items-center gap-2">
                                                <ImageIcon className="h-4 w-4 text-cyan-600" />
                                                Technology Logo/Icon
                                            </label>
                                            
                                            <div className="space-y-4">
                                                <div className="relative">
                                                    <Input
                                                        type="file"
                                                        accept="image/*"
                                                        onChange={handleImageChange}
                                                        className="file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:text-sm file:font-semibold file:bg-cyan-100 file:text-cyan-800 hover:file:bg-cyan-200 file:cursor-pointer cursor-pointer transition-all duration-200"
                                                    />
                                                </div>
                                                
                                                {imagePreview && (
                                                    <div className="flex items-center gap-4 p-4 bg-gray-50 rounded-lg border-2 border-dashed border-gray-300">
                                                        <div className="relative">
                                                            <img
                                                                src={imagePreview}
                                                                alt="Preview"
                                                                className="w-20 h-20 object-contain rounded-lg bg-white p-2 shadow-sm"
                                                            />
                                                            <Badge className="absolute -top-2 -right-2 bg-green-500 text-white text-xs px-2 py-1">
                                                                Preview
                                                            </Badge>
                                                        </div>
                                                        <div className="flex-1">
                                                            <p className="text-sm font-medium text-gray-700">Image uploaded successfully</p>
                                                            <p className="text-xs text-gray-500 mt-1">This is how your technology logo will appear</p>
                                                        </div>
                                                    </div>
                                                )}
                                            </div>
                                            
                                            {errors.img && (
                                                <p className="text-red-500 text-sm flex items-center gap-1">
                                                    <XCircle className="h-3 w-3" />
                                                    {errors.img}
                                                </p>
                                            )}
                                        </div>

                                        {/* Technology Name */}
                                        <div className="space-y-2">
                                            <label className="text-sm font-semibold text-gray-700 flex items-center gap-2">
                                                <Code className="h-4 w-4 text-blue-600" />
                                                Technology Name
                                            </label>
                                            <Input
                                                type="text"
                                                placeholder="e.g., React, Node.js, MongoDB..."
                                                value={data.heading}
                                                onChange={(e) => setData("heading", e.target.value)}
                                                className="w-full transition-all duration-200 focus:ring-2 focus:ring-cyan-500"
                                            />
                                            {errors.heading && (
                                                <p className="text-red-500 text-sm flex items-center gap-1">
                                                    <XCircle className="h-3 w-3" />
                                                    {errors.heading}
                                                </p>
                                            )}
                                        </div>

                                        {/* Form Actions */}
                                        <div className="pt-4">
                                            <Button
                                                type="submit"
                                                disabled={processing || !isFormValid}
                                                className="w-full bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-600 hover:to-blue-700 transition-all duration-200"
                                            >
                                                <Save className="h-4 w-4 mr-2" />
                                                {processing ? "Adding Technology..." : "Add Technology"}
                                            </Button>
                                        </div>
                                    </form>
                                </CardContent>
                            </Card>

                            {/* Info Card */}
                            <Card className="bg-gradient-to-r from-blue-500 to-indigo-600 text-white border-0">
                                <CardContent className="p-6">
                                    <h3 className="font-semibold mb-2 flex items-center gap-2">
                                        <Upload className="h-4 w-4" />
                                        Upload Guidelines
                                    </h3>
                                    <ul className="text-sm space-y-1 opacity-90">
                                        <li>• Use high-quality logos or icons</li>
                                        <li>• Recommended size: 64x64 pixels or larger</li>
                                        <li>• Supported formats: JPG, PNG, SVG</li>
                                        <li>• Transparent backgrounds work best</li>
                                    </ul>
                                </CardContent>
                            </Card>
                        </div>

                        {/* Technologies List Section */}
                        <div className="space-y-6">
                            <div className="flex items-center justify-between">
                                <h2 className="text-2xl font-bold text-gray-900">
                                    Your Technologies ({technologies?.length || 0})
                                </h2>
                            </div>

                            <div className="space-y-4 max-h-[800px] overflow-y-auto pr-2">
                                {technologies?.length === 0 ? (
                                    <Card className="shadow-md">
                                        <CardContent className="p-8 text-center">
                                            <div className="text-gray-400 mb-4">
                                                <Settings className="h-12 w-12 mx-auto mb-2" />
                                            </div>
                                            <p className="text-gray-500 text-lg">No technologies added yet</p>
                                            <p className="text-gray-400 text-sm mt-2">
                                                Add your first technology using the form on the left
                                            </p>
                                        </CardContent>
                                    </Card>
                                ) : (
                                    <div className="grid gap-4">
                                        {technologies.map((tool, index) => (
                                            <Card key={tool.id} className="shadow-lg hover:shadow-xl transition-all duration-300 border-0 bg-white/90 backdrop-blur-sm group">
                                                <CardContent className="p-6">
                                                    <div className="flex items-center justify-between">
                                                        <div className="flex items-center gap-4">
                                                            <div className="relative">
                                                                <div className="w-16 h-16 bg-gradient-to-br from-gray-100 to-gray-200 rounded-xl flex items-center justify-center shadow-inner">
                                                                    <img
                                                                        src={`${tool.img}`}
                                                                        alt={tool.heading}
                                                                        className="w-12 h-12 object-contain"
                                                                        onError={(e) => {
                                                                            e.target.style.display = 'none';
                                                                            e.target.nextSibling.style.display = 'block';
                                                                        }}
                                                                    />
                                                                    <div className="w-12 h-12 hidden items-center justify-center text-gray-400">
                                                                        <ImageIcon className="h-6 w-6" />
                                                                    </div>
                                                                </div>
                                                                <Badge className="absolute -top-1 -right-1 bg-cyan-500 text-white text-xs px-1.5 py-0.5">
                                                                    {index + 1}
                                                                </Badge>
                                                            </div>
                                                            
                                                            <div className="flex-1">
                                                                <div className="flex items-center gap-2 mb-1">
                                                                    {getTechIcon(tool.heading)}
                                                                    <h3 className="text-lg font-semibold text-gray-900">
                                                                        {tool.heading}
                                                                    </h3>
                                                                </div>
                                                                <p className="text-sm text-gray-500">
                                                                    Technology #{index + 1}
                                                                </p>
                                                            </div>
                                                        </div>
                                                        
                                                        <AlertDialog>
                                                            <AlertDialogTrigger asChild>
                                                                <Button
                                                                    variant="destructive"
                                                                    size="sm"
                                                                    disabled={processing}
                                                                    className="hover:bg-red-600 transition-colors opacity-80 group-hover:opacity-100"
                                                                >
                                                                    <Trash2 className="h-3 w-3 mr-1" />
                                                                    Delete
                                                                </Button>
                                                            </AlertDialogTrigger>
                                                            <AlertDialogContent>
                                                                <AlertDialogHeader>
                                                                    <AlertDialogTitle className="flex items-center gap-2">
                                                                        <Trash2 className="h-5 w-5 text-red-500" />
                                                                        Confirm Deletion
                                                                    </AlertDialogTitle>
                                                                    <AlertDialogDescription>
                                                                        Are you sure you want to delete this technology?
                                                                        <div className="mt-3 p-3 bg-gray-50 rounded text-sm flex items-center gap-3">
                                                                            <img
                                                                                src={`/assets/technology/${tool.img}`}
                                                                                alt={tool.heading}
                                                                                className="w-8 h-8 object-contain"
                                                                            />
                                                                            <strong>{tool.heading}</strong>
                                                                        </div>
                                                                        This action cannot be undone.
                                                                    </AlertDialogDescription>
                                                                </AlertDialogHeader>
                                                                <AlertDialogFooter>
                                                                    <AlertDialogCancel>Cancel</AlertDialogCancel>
                                                                    <AlertDialogAction
                                                                        onClick={() => handleDelete(tool.id)}
                                                                        className="bg-red-500 hover:bg-red-600"
                                                                    >
                                                                        Delete
                                                                    </AlertDialogAction>
                                                                </AlertDialogFooter>
                                                            </AlertDialogContent>
                                                        </AlertDialog>
                                                    </div>

                                                    {/* Footer with metadata */}
                                                    {tool.created_at && (
                                                        <div className="flex items-center gap-2 mt-4 pt-4 border-t border-gray-200">
                                                            <Calendar className="h-3 w-3 text-gray-400" />
                                                            <span className="text-xs text-gray-500">
                                                                Added: {new Date(tool.created_at).toLocaleDateString('en-US', {
                                                                    year: 'numeric',
                                                                    month: 'long',
                                                                    day: 'numeric'
                                                                })}
                                                            </span>
                                                        </div>
                                                    )}
                                                </CardContent>
                                            </Card>
                                        ))}
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </Layout>
    );
}
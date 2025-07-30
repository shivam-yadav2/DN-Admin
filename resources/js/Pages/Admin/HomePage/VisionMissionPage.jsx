import { useState, useEffect } from "react";
import { useForm, usePage } from "@inertiajs/react";
import { Button } from "@/Components/ui/button";
import { Input } from "@/Components/ui/input";
import { Textarea } from "@/Components/ui/textarea";
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
    Eye, 
    Target, 
    Plus, 
    Edit3, 
    Trash2, 
    Calendar, 
    CheckCircle2,
    XCircle,
    Save,
    X
} from "lucide-react";

export default function VisionMissionPage({ visions }) {
    const { flash, errors } = usePage().props;
    const [deleteId, setDeleteId] = useState(null);

    const { data, setData, post, put, delete: destroy, processing, reset } = useForm({
        heading: "",
        para: "",
        vision_heading: "",
        vision_description: "",
        mission_heading: "",
        mission_description: "",
        editingId: null,
    });

    const handleSubmit = (e) => {
        e.preventDefault();
        if (data.editingId) {
            put(route("vision-mission.update", data.editingId), {
                onSuccess: () => reset(),
            });
        } else {
            post(route("vision-mission.store"), {
                onSuccess: () => reset(),
            });
        }
    };

    const handleEdit = (vision) => {
        setData({
            heading: vision.heading,
            para: vision.para,
            vision_heading: vision.vision_heading,
            vision_description: vision.vision_description,
            mission_heading: vision.mission_heading,
            mission_description: vision.mission_description,
            editingId: vision.id,
        });
    };

    const handleDelete = (id) => {
        console.log("hre")
        destroy(route("vision-mission.destroy", id), {
            onSuccess: () => {
                reset();
                setDeleteId(null);
            },
        });
    };

    const handleCancelEdit = () => {
        reset();
    };

    const isFormValid = data.heading && data.para && data.vision_heading && 
                       data.vision_description && data.mission_heading && data.mission_description;

    return (
        <Layout>
            <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100">
                <div className="container mx-auto p-6 max-w-7xl">
                    {/* Header Section */}
                    <div className="text-center mb-8">
                        <h1 className="text-4xl font-bold text-gray-900 mb-2">
                            Vision & Mission Management
                        </h1>
                        <p className="text-lg text-gray-600">
                            Define and manage your organization's vision and mission statements
                        </p>
                    </div>

                    {/* Flash Messages */}
                    {flash?.message && (
                        <Alert className="mb-6 border-green-200 bg-green-50">
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
                                <CardHeader className="bg-gradient-to-r from-blue-500 to-indigo-600 text-white rounded-t-lg">
                                    <CardTitle className="flex items-center gap-2 text-xl">
                                        {data.editingId ? (
                                            <>
                                                <Edit3 className="h-5 w-5" />
                                                Edit Vision/Mission
                                            </>
                                        ) : (
                                            <>
                                                <Plus className="h-5 w-5" />
                                                Add Vision/Mission
                                            </>
                                        )}
                                    </CardTitle>
                                </CardHeader>
                                <CardContent className="p-6">
                                    <form onSubmit={handleSubmit} className="space-y-6">
                                        {/* Main Heading */}
                                        <div className="space-y-2">
                                            <label className="text-sm font-semibold text-gray-700">
                                                Main Heading
                                            </label>
                                            <Input
                                                type="text"
                                                placeholder="Enter main heading..."
                                                value={data.heading}
                                                onChange={(e) => setData("heading", e.target.value)}
                                                className="w-full transition-all duration-200 focus:ring-2 focus:ring-blue-500"
                                            />
                                            {errors.heading && (
                                                <p className="text-red-500 text-sm flex items-center gap-1">
                                                    <XCircle className="h-3 w-3" />
                                                    {errors.heading}
                                                </p>
                                            )}
                                        </div>

                                        {/* Paragraph */}
                                        <div className="space-y-2">
                                            <label className="text-sm font-semibold text-gray-700">
                                                Description
                                            </label>
                                            <Textarea
                                                placeholder="Enter description..."
                                                value={data.para}
                                                onChange={(e) => setData("para", e.target.value)}
                                                className="w-full min-h-[100px] transition-all duration-200 focus:ring-2 focus:ring-blue-500"
                                                rows={4}
                                            />
                                            {errors.para && (
                                                <p className="text-red-500 text-sm flex items-center gap-1">
                                                    <XCircle className="h-3 w-3" />
                                                    {errors.para}
                                                </p>
                                            )}
                                        </div>

                                        <Separator className="my-6" />

                                        {/* Vision Section */}
                                        <div className="space-y-4 p-4 bg-blue-50 rounded-lg border border-blue-200">
                                            <div className="flex items-center gap-2 text-blue-700">
                                                <Eye className="h-5 w-5" />
                                                <h3 className="font-semibold">Vision</h3>
                                            </div>
                                            
                                            <div className="space-y-2">
                                                <label className="text-sm font-semibold text-gray-700">
                                                    Vision Heading
                                                </label>
                                                <Input
                                                    type="text"
                                                    placeholder="Enter vision heading..."
                                                    value={data.vision_heading}
                                                    onChange={(e) => setData("vision_heading", e.target.value)}
                                                    className="w-full"
                                                />
                                                {errors.vision_heading && (
                                                    <p className="text-red-500 text-sm flex items-center gap-1">
                                                        <XCircle className="h-3 w-3" />
                                                        {errors.vision_heading}
                                                    </p>
                                                )}
                                            </div>

                                            <div className="space-y-2">
                                                <label className="text-sm font-semibold text-gray-700">
                                                    Vision Description
                                                </label>
                                                <Textarea
                                                    placeholder="Enter vision description..."
                                                    value={data.vision_description}
                                                    onChange={(e) => setData("vision_description", e.target.value)}
                                                    className="w-full"
                                                    rows={3}
                                                />
                                                {errors.vision_description && (
                                                    <p className="text-red-500 text-sm flex items-center gap-1">
                                                        <XCircle className="h-3 w-3" />
                                                        {errors.vision_description}
                                                    </p>
                                                )}
                                            </div>
                                        </div>

                                        {/* Mission Section */}
                                        <div className="space-y-4 p-4 bg-green-50 rounded-lg border border-green-200">
                                            <div className="flex items-center gap-2 text-green-700">
                                                <Target className="h-5 w-5" />
                                                <h3 className="font-semibold">Mission</h3>
                                            </div>
                                            
                                            <div className="space-y-2">
                                                <label className="text-sm font-semibold text-gray-700">
                                                    Mission Heading
                                                </label>
                                                <Input
                                                    type="text"
                                                    placeholder="Enter mission heading..."
                                                    value={data.mission_heading}
                                                    onChange={(e) => setData("mission_heading", e.target.value)}
                                                    className="w-full"
                                                />
                                                {errors.mission_heading && (
                                                    <p className="text-red-500 text-sm flex items-center gap-1">
                                                        <XCircle className="h-3 w-3" />
                                                        {errors.mission_heading}
                                                    </p>
                                                )}
                                            </div>

                                            <div className="space-y-2">
                                                <label className="text-sm font-semibold text-gray-700">
                                                    Mission Description
                                                </label>
                                                <Textarea
                                                    placeholder="Enter mission description..."
                                                    value={data.mission_description}
                                                    onChange={(e) => setData("mission_description", e.target.value)}
                                                    className="w-full"
                                                    rows={3}
                                                />
                                                {errors.mission_description && (
                                                    <p className="text-red-500 text-sm flex items-center gap-1">
                                                        <XCircle className="h-3 w-3" />
                                                        {errors.mission_description}
                                                    </p>
                                                )}
                                            </div>
                                        </div>

                                        {/* Form Actions */}
                                        <div className="flex gap-3 pt-4">
                                            <Button
                                                type="submit"
                                                disabled={processing || !isFormValid}
                                                className="flex-1 bg-gradient-to-r from-blue-500 to-indigo-600 hover:from-blue-600 hover:to-indigo-700 transition-all duration-200"
                                            >
                                                <Save className="h-4 w-4 mr-2" />
                                                {processing ? "Processing..." : data.editingId ? "Update" : "Add"} Vision/Mission
                                            </Button>
                                            {data.editingId && (
                                                <Button 
                                                    type="button" 
                                                    variant="outline" 
                                                    onClick={handleCancelEdit}
                                                    className="hover:bg-gray-50"
                                                >
                                                    <X className="h-4 w-4 mr-2" />
                                                    Cancel
                                                </Button>
                                            )}
                                        </div>
                                    </form>
                                </CardContent>
                            </Card>
                        </div>

                        {/* Display Existing Entries */}
                        <div className="space-y-6">
                            <div className="flex items-center justify-between">
                                <h2 className="text-2xl font-bold text-gray-900">
                                    Existing Entries ({visions?.length || 0})
                                </h2>
                            </div>

                            <div className="space-y-4 max-h-[800px] overflow-y-auto pr-2">
                                {visions?.length === 0 ? (
                                    <Card className="shadow-md">
                                        <CardContent className="p-8 text-center">
                                            <div className="text-gray-400 mb-4">
                                                <Eye className="h-12 w-12 mx-auto mb-2" />
                                            </div>
                                            <p className="text-gray-500 text-lg">No vision/mission entries found</p>
                                            <p className="text-gray-400 text-sm mt-2">
                                                Add your first entry using the form on the left
                                            </p>
                                        </CardContent>
                                    </Card>
                                ) : (
                                    visions?.map((vision) => (
                                        <Card key={vision.id} className="shadow-lg hover:shadow-xl transition-all duration-300 border-0 bg-white/90 backdrop-blur-sm">
                                            <CardContent className="p-6">
                                                <div className="flex items-start justify-between mb-4">
                                                    <div className="flex-1">
                                                        <h3 className="text-xl font-bold text-gray-900 mb-2">
                                                            {vision.heading}
                                                        </h3>
                                                        <p className="text-gray-600 mb-4 text-sm leading-relaxed">
                                                            {vision.para}
                                                        </p>
                                                    </div>
                                                    <div className="flex gap-2 ml-4">
                                                        <Button
                                                            variant="outline"
                                                            size="sm"
                                                            onClick={() => handleEdit(vision)}
                                                            className="hover:bg-blue-50 hover:border-blue-200 hover:text-blue-700 transition-colors"
                                                        >
                                                            <Edit3 className="h-3 w-3 mr-1" />
                                                            Edit
                                                        </Button>
                                                        <AlertDialog>
                                                            <AlertDialogTrigger asChild>
                                                                <Button
                                                                    variant="destructive"
                                                                    size="sm"
                                                                    className="hover:bg-red-600 transition-colors"
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
                                                                        Are you sure you want to delete this vision/mission entry?
                                                                        <div className="mt-2 p-3 bg-gray-50 rounded text-sm">
                                                                            <strong>"{vision.heading}"</strong>
                                                                        </div>
                                                                        This action cannot be undone.
                                                                    </AlertDialogDescription>
                                                                </AlertDialogHeader>
                                                                <AlertDialogFooter>
                                                                    <AlertDialogCancel>Cancel</AlertDialogCancel>
                                                                    <AlertDialogAction
                                                                        onClick={() => handleDelete(vision.id)}
                                                                        className="bg-red-500 hover:bg-red-600"
                                                                    >
                                                                        Delete
                                                                    </AlertDialogAction>
                                                                </AlertDialogFooter>
                                                            </AlertDialogContent>
                                                        </AlertDialog>
                                                    </div>
                                                </div>

                                                <div className="space-y-4">
                                                    {/* Vision Section */}
                                                    <div className="p-4 bg-blue-50 rounded-lg border-l-4 border-blue-400">
                                                        <div className="flex items-center gap-2 mb-2">
                                                            <Eye className="h-4 w-4 text-blue-600" />
                                                            <Badge variant="secondary" className="bg-blue-100 text-blue-700">
                                                                Vision
                                                            </Badge>
                                                        </div>
                                                        <h4 className="font-semibold text-blue-900 mb-1">
                                                            {vision.vision_heading}
                                                        </h4>
                                                        <p className="text-blue-800 text-sm leading-relaxed">
                                                            {vision.vision_description}
                                                        </p>
                                                    </div>

                                                    {/* Mission Section */}
                                                    <div className="p-4 bg-green-50 rounded-lg border-l-4 border-green-400">
                                                        <div className="flex items-center gap-2 mb-2">
                                                            <Target className="h-4 w-4 text-green-600" />
                                                            <Badge variant="secondary" className="bg-green-100 text-green-700">
                                                                Mission
                                                            </Badge>
                                                        </div>
                                                        <h4 className="font-semibold text-green-900 mb-1">
                                                            {vision.mission_heading}
                                                        </h4>
                                                        <p className="text-green-800 text-sm leading-relaxed">
                                                            {vision.mission_description}
                                                        </p>
                                                    </div>
                                                </div>

                                                {/* Footer */}
                                                <div className="flex items-center gap-2 mt-4 pt-4 border-t border-gray-200">
                                                    <Calendar className="h-3 w-3 text-gray-400" />
                                                    <span className="text-xs text-gray-500">
                                                        Created: {new Date(vision.created_at).toLocaleDateString('en-US', {
                                                            year: 'numeric',
                                                            month: 'long',
                                                            day: 'numeric'
                                                        })}
                                                    </span>
                                                </div>
                                            </CardContent>
                                        </Card>
                                    ))
                                )}
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </Layout>
    );
}
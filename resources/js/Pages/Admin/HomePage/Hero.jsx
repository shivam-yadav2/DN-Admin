import { useState, useEffect } from "react";
import { Link, useForm, usePage } from "@inertiajs/react";
import { Button } from "@/Components/ui/button";
import { Input } from "@/Components/ui/input";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/Components/ui/select";
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
  Video,
  Plus,
  Edit3,
  Trash2,
  Calendar,
  CheckCircle2,
  XCircle,
  Save,
  Upload,
  Monitor,
  Smartphone,
  Play,
  Film,
  X
} from "lucide-react";

export default function HeroVideoPage({ videos }) {
    const { flash, errors } = usePage().props;
    const [videoPreview, setVideoPreview] = useState(null);
    const [deleteId, setDeleteId] = useState(null);

    const {
        data,
        setData,
        post,
        put,
        delete: destroy,
        processing,
        reset,
    } = useForm({
        video: null,
        video_type: "",
        editingId: null,
    });

    const handleSubmit = (e) => {
        e.preventDefault();
        const formData = new FormData();
        if (data.video) formData.append("video", data.video);
        formData.append("video_type", data.video_type);

        if (data.editingId) {
            put(route("hero.update", data.editingId), {
                data: formData,
                forceFormData: true,
                onSuccess: () => {
                    reset();
                    setVideoPreview(null);
                    // Reset file input
                    const fileInput = document.querySelector('input[type="file"]');
                    if (fileInput) fileInput.value = '';
                },
            });
        } else {
            post(route("hero.store"), {
                data: formData,
                forceFormData: true,
                onSuccess: () => {
                    reset();
                    setVideoPreview(null);
                    // Reset file input
                    const fileInput = document.querySelector('input[type="file"]');
                    if (fileInput) fileInput.value = '';
                },
            });
        }
    };

    const handleEdit = (video) => {
        setData({
            video: null,
            video_type: video.video_type,
            editingId: video.id,
        });
        setVideoPreview(null);
    };

    const handleDelete = (id) => {
        destroy(route("hero.destroy", id), {
            onSuccess: () => {
                reset();
                setDeleteId(null);
            },
        });
    };

    const handleCancelEdit = () => {
        reset();
        setVideoPreview(null);
    };

    const handleVideoChange = (e) => {
        const file = e.target.files[0];
        if (file) {
            setData("video", file);
            const videoUrl = URL.createObjectURL(file);
            setVideoPreview(videoUrl);
        }
    };

    const isFormValid = (data.video || data.editingId) && data.video_type;

    const formatFileSize = (bytes) => {
        if (bytes === 0) return '0 Bytes';
        const k = 1024;
        const sizes = ['Bytes', 'KB', 'MB', 'GB'];
        const i = Math.floor(Math.log(bytes) / Math.log(k));
        return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
    };

    return (
        <Layout>
            <div className="min-h-screen bg-gradient-to-br from-violet-50 via-purple-50 to-pink-100">
                <div className="container mx-auto p-6 max-w-7xl">
                    {/* Header Section */}
                    <div className="text-center mb-8">
                        <h1 className="text-4xl font-bold text-gray-900 mb-2 flex items-center justify-center gap-3">
                            <Video className="h-10 w-10 text-violet-600" />
                            Hero Video Management
                        </h1>
                        <p className="text-lg text-gray-600">
                            Upload and manage hero videos for desktop and mobile displays
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
                                <CardHeader className="bg-gradient-to-r from-violet-500 to-purple-600 text-white rounded-t-lg">
                                    <CardTitle className="flex items-center gap-2 text-xl">
                                        {data.editingId ? (
                                            <>
                                                <Edit3 className="h-5 w-5" />
                                                Edit Hero Video
                                            </>
                                        ) : (
                                            <>
                                                <Plus className="h-5 w-5" />
                                                Upload Hero Video
                                            </>
                                        )}
                                    </CardTitle>
                                </CardHeader>
                                <CardContent className="p-6">
                                    <form onSubmit={handleSubmit} className="space-y-6">
                                        {/* Video Upload */}
                                        <div className="space-y-4">
                                            <label className="text-sm font-semibold text-gray-700 flex items-center gap-2">
                                                <Film className="h-4 w-4 text-violet-600" />
                                                Video File
                                            </label>
                                            
                                            <div className="space-y-4">
                                                <Input
                                                    type="file"
                                                    accept="video/mp4,video/webm,video/quicktime"
                                                    onChange={handleVideoChange}
                                                    className="file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:text-sm file:font-semibold file:bg-violet-100 file:text-violet-800 hover:file:bg-violet-200 file:cursor-pointer cursor-pointer transition-all duration-200"
                                                />
                                                
                                                {videoPreview && (
                                                    <div className="p-4 bg-gray-50 rounded-lg border-2 border-dashed border-gray-300">
                                                        <div className="flex items-center gap-4 mb-3">
                                                            <Badge className="bg-green-500 text-white">
                                                                Video Selected
                                                            </Badge>
                                                            {data.video && (
                                                                <span className="text-sm text-gray-600">
                                                                    Size: {formatFileSize(data.video.size)}
                                                                </span>
                                                            )}
                                                        </div>
                                                        <video
                                                            src={videoPreview}
                                                            controls
                                                            className="w-full max-w-xs mx-auto rounded-lg shadow-md"
                                                            style={{
                                                                aspectRatio: data.video_type === "mobile" ? "9/16" : "16/9"
                                                            }}
                                                        />
                                                        <p className="text-sm text-gray-500 text-center mt-2">
                                                            Preview of your selected video
                                                        </p>
                                                    </div>
                                                )}
                                            </div>
                                            
                                            {errors.video && (
                                                <p className="text-red-500 text-sm flex items-center gap-1">
                                                    <XCircle className="h-3 w-3" />
                                                    {errors.video}
                                                </p>
                                            )}
                                        </div>

                                        {/* Video Type Selection */}
                                        <div className="space-y-2">
                                            <label className="text-sm font-semibold text-gray-700 flex items-center gap-2">
                                                <Monitor className="h-4 w-4 text-purple-600" />
                                                Video Type
                                            </label>
                                            <Select
                                                onValueChange={(value) => setData("video_type", value)}
                                                value={data.video_type}
                                            >
                                                <SelectTrigger className="transition-all duration-200 focus:ring-2 focus:ring-violet-500">
                                                    <SelectValue placeholder="Select video type" />
                                                </SelectTrigger>
                                                <SelectContent>
                                                    <SelectItem value="mobile" className="flex items-center gap-2">
                                                        <div className="flex items-center gap-2">
                                                            <Smartphone className="h-4 w-4" />
                                                            Mobile (9:16 - Portrait)
                                                        </div>
                                                    </SelectItem>
                                                    <SelectItem value="desktop" className="flex items-center gap-2">
                                                        <div className="flex items-center gap-2">
                                                            <Monitor className="h-4 w-4" />
                                                            Desktop (16:9 - Landscape)
                                                        </div>
                                                    </SelectItem>
                                                </SelectContent>
                                            </Select>
                                            {errors.video_type && (
                                                <p className="text-red-500 text-sm flex items-center gap-1">
                                                    <XCircle className="h-3 w-3" />
                                                    {errors.video_type}
                                                </p>
                                            )}
                                        </div>

                                        {/* Form Actions */}
                                        <div className="flex gap-3 pt-4">
                                            <Button
                                                type="submit"
                                                disabled={processing || !isFormValid}
                                                className="flex-1 bg-gradient-to-r from-violet-500 to-purple-600 hover:from-violet-600 hover:to-purple-700 transition-all duration-200"
                                            >
                                                <Save className="h-4 w-4 mr-2" />
                                                {processing ? "Processing..." : data.editingId ? "Update Video" : "Upload Video"}
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

                            {/* Info Card */}
                            <Card className="bg-gradient-to-r from-purple-500 to-pink-600 text-white border-0">
                                <CardContent className="p-6">
                                    <h3 className="font-semibold mb-3 flex items-center gap-2">
                                        <Upload className="h-4 w-4" />
                                        Video Guidelines
                                    </h3>
                                    <div className="space-y-3 text-sm opacity-90">
                                        <div className="flex items-start gap-2">
                                            <Monitor className="h-4 w-4 mt-0.5 flex-shrink-0" />
                                            <div>
                                                <strong>Desktop:</strong> 1920x1080 (16:9 aspect ratio)
                                            </div>
                                        </div>
                                        <div className="flex items-start gap-2">
                                            <Smartphone className="h-4 w-4 mt-0.5 flex-shrink-0" />
                                            <div>
                                                <strong>Mobile:</strong> 1080x1920 (9:16 aspect ratio)
                                            </div>
                                        </div>
                                        <div className="mt-2 pt-2 border-t border-white/20">
                                            <p>• Supported formats: MP4, WebM, QuickTime</p>
                                            <p>• Recommended max size: 50MB</p>
                                            <p>• Duration: 10-30 seconds for best performance</p>
                                        </div>
                                    </div>
                                </CardContent>
                            </Card>
                        </div>

                        {/* Videos List Section */}
                        <div className="space-y-6">
                            <div className="flex items-center justify-between">
                                <h2 className="text-2xl font-bold text-gray-900">
                                    Hero Videos ({videos?.length || 0})
                                </h2>
                            </div>

                            <div className="space-y-4 max-h-[800px] overflow-y-auto pr-2">
                                {videos?.length === 0 ? (
                                    <Card className="shadow-md">
                                        <CardContent className="p-8 text-center">
                                            <div className="text-gray-400 mb-4">
                                                <Video className="h-12 w-12 mx-auto mb-2" />
                                            </div>
                                            <p className="text-gray-500 text-lg">No hero videos uploaded</p>
                                            <p className="text-gray-400 text-sm mt-2">
                                                Upload your first hero video using the form on the left
                                            </p>
                                        </CardContent>
                                    </Card>
                                ) : (
                                    videos?.map((video, index) => (
                                        <Card key={video.id} className="shadow-lg hover:shadow-xl transition-all duration-300 border-0 bg-white/90 backdrop-blur-sm">
                                            <CardContent className="p-6">
                                                <div className="flex items-start justify-between mb-4">
                                                    <div className="flex items-center gap-3">
                                                        <div className="flex items-center gap-2">
                                                            {video.video_type === "mobile" ? (
                                                                <Smartphone className="h-5 w-5 text-violet-600" />
                                                            ) : (
                                                                <Monitor className="h-5 w-5 text-purple-600" />
                                                            )}
                                                            <Badge 
                                                                variant="secondary" 
                                                                className={`${video.video_type === "mobile" ? "bg-violet-100 text-violet-700" : "bg-purple-100 text-purple-700"} capitalize font-semibold`}
                                                            >
                                                                {video.video_type}
                                                            </Badge>
                                                        </div>
                                                        <Badge className="bg-gray-100 text-gray-700 text-xs">
                                                            Video #{index + 1}
                                                        </Badge>
                                                    </div>
                                                    
                                                    <div className="flex gap-2">
                                                        <Button
                                                            variant="outline"
                                                            size="sm"
                                                            onClick={() => handleEdit(video)}
                                                            className="hover:bg-violet-50 hover:border-violet-200 hover:text-violet-700 transition-colors"
                                                        >
                                                            <Edit3 className="h-3 w-3 mr-1" />
                                                            Edit Type
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
                                                                        Are you sure you want to delete this hero video?
                                                                        <div className="mt-3 p-3 bg-gray-50 rounded text-sm">
                                                                            <strong>Type:</strong> {video.video_type} video
                                                                            <br />
                                                                            <strong>Created:</strong> {new Date(video.created_at).toLocaleDateString()}
                                                                        </div>
                                                                        This action cannot be undone.
                                                                    </AlertDialogDescription>
                                                                </AlertDialogHeader>
                                                                <AlertDialogFooter>
                                                                    <AlertDialogCancel>Cancel</AlertDialogCancel>
                                                                    <AlertDialogAction
                                                                        onClick={() => handleDelete(video.id)}
                                                                        className="bg-red-500 hover:bg-red-600"
                                                                    >
                                                                        Delete
                                                                    </AlertDialogAction>
                                                                </AlertDialogFooter>
                                                            </AlertDialogContent>
                                                        </AlertDialog>
                                                    </div>
                                                </div>

                                                <Separator className="mb-4" />

                                                {/* Video Player */}
                                                <div className="relative">
                                                    <video
                                                        controls
                                                        className="w-full max-w-sm mx-auto rounded-lg shadow-md bg-black"
                                                        style={{
                                                            aspectRatio: video.video_type === "mobile" ? "9/16" : "16/9",
                                                        }}
                                                        preload="metadata"
                                                    >
                                                        <source
                                                            src={`/assets/heros/${video.video_path}`}
                                                            type="video/mp4"
                                                        />
                                                        Your browser does not support the video tag.
                                                    </video>
                                                    
                                                    <div className="absolute top-2 left-2">
                                                        <Badge className="bg-black/70 text-white text-xs">
                                                            <Play className="h-3 w-3 mr-1" />
                                                            {video.video_type === "mobile" ? "9:16" : "16:9"}
                                                        </Badge>
                                                    </div>
                                                </div>

                                                {/* Footer with metadata */}
                                                <div className="flex items-center justify-between mt-4 pt-4 border-t border-gray-200">
                                                    <div className="flex items-center gap-2">
                                                        <Calendar className="h-3 w-3 text-gray-400" />
                                                        <span className="text-xs text-gray-500">
                                                            Uploaded: {new Date(video.created_at).toLocaleDateString('en-US', {
                                                                year: 'numeric',
                                                                month: 'long',
                                                                day: 'numeric'
                                                            })}
                                                        </span>
                                                    </div>
                                                    <Badge variant="outline" className="text-xs">
                                                        {video.video_type === "mobile" ? "Portrait" : "Landscape"}
                                                    </Badge>
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
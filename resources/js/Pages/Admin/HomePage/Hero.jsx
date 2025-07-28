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
import Layout from "@/Layouts/Layout";

export default function HeroVideoPage({ videos }) {
    const { flash, errors } = usePage().props;
    console.log(videos);

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
        editingId: null, // Track which video is being edited
    });

    const handleSubmit = (e) => {
        e.preventDefault();
        const formData = new FormData();
        if (data.video) formData.append("video", data.video);
        formData.append("video_type", data.video_type);

        if (data.editingId) {
            // Update existing video
            put(route("hero.update", data.editingId), {
                data: formData,
                forceFormData: true,
                onSuccess: () => reset(),
            });
        } else {
            // Create new video
            post(route("hero.store"), {
                data: formData,
                forceFormData: true,
                onSuccess: () => reset(),
            });
        }
    };

    const handleEdit = (video) => {
        setData({
            video: null,
            video_type: video.video_type,
            editingId: video.id,
        });
    };

    const handleDelete = (id) => {
        if (confirm("Are you sure you want to delete this video?")) {
            destroy(route("hero.destroy", id), {
                onSuccess: () => reset(),
            });
        }
    };

    // Reset form when switching from edit to create
    const handleCancelEdit = () => {
        reset();
    };

    return (
        <Layout>
            <div className="container mx-auto p-4">
                {/* Display flash messages */}
                {flash?.message && (
                    <Alert className="mb-4">
                        <AlertDescription>{flash?.message}</AlertDescription>
                    </Alert>
                )}

                {/* Form for creating/updating videos */}
                <Card className="max-w-2xl mx-auto">
                    <CardHeader>
                        <CardTitle>
                            {data.editingId
                                ? "Edit Hero Video"
                                : "Upload Hero Video"}
                        </CardTitle>
                    </CardHeader>
                    <CardContent>
                        <form onSubmit={handleSubmit} className="space-y-4">
                            <div>
                                <Input
                                    type="file"
                                    accept="video/mp4,video/webm,video/quicktime"
                                    onChange={(e) =>
                                        setData("video", e.target.files[0])
                                    }
                                    className="file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-gray-100 file:text-gray-700 hover:file:bg-gray-200"
                                />
                                {errors.video && (
                                    <p className="text-red-500 text-sm mt-1">
                                        {errors.video}
                                    </p>
                                )}
                            </div>
                            <div>
                                <Select
                                    onValueChange={(value) =>
                                        setData("video_type", value)
                                    }
                                    value={data.video_type}
                                >
                                    <SelectTrigger>
                                        <SelectValue placeholder="Select video type" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        <SelectItem value="mobile">
                                            Mobile (1080x1920)
                                        </SelectItem>
                                        <SelectItem value="desktop">
                                            Desktop (1920x1080)
                                        </SelectItem>
                                    </SelectContent>
                                </Select>
                                {errors.video_type && (
                                    <p className="text-red-500 text-sm mt-1">
                                        {errors.video_type}
                                    </p>
                                )}
                            </div>
                            <div className="flex gap-2">
                                <Button
                                    type="submit"
                                    disabled={
                                        processing ||
                                        (!data.video && !data.editingId) ||
                                        !data.video_type
                                    }
                                >
                                    {data.editingId
                                        ? "Update Video"
                                        : "Upload Video"}
                                </Button>
                                {data.editingId && (
                                    <Button
                                        type="button"
                                        variant="outline"
                                        onClick={handleCancelEdit}
                                    >
                                        Cancel
                                    </Button>
                                )}
                            </div>
                        </form>
                    </CardContent>
                </Card>

                {/* Display existing videos */}
                <div className="mt-8 grid lg:grid-cols-2 gap-4">
                    {videos?.map((video) => (
                        <Card key={video.id}>
                            <CardContent className="p-4">
                                <div className="flex items-center justify-between">
                                    <span className="text-sm font-medium">
                                        {video.video_type}
                                    </span>
                                    <div className="flex gap-2">
                                        <Button
                                            variant="destructive"
                                            size="sm"
                                            onClick={() =>
                                                handleDelete(video.id)
                                            }
                                        >
                                            Delete
                                        </Button>
                                    </div>
                                </div>
                                <div className="flex items-center justify-between mt-2">
                                    <span className="text-sm text-gray-500">
                                        {new Date(
                                            video.created_at
                                        ).toLocaleDateString()}
                                    </span>
                                </div>
                                <video
                                    controls
                                    className="mt-2 w-full max-w-[320px] mx-auto"
                                    style={{
                                        aspectRatio:
                                            video.video_type === "mobile"
                                                ? "9/16"
                                                : "16/9",
                                    }}
                                >
                                    <source
                                        src={`/assets/heros/${video.video_path}`}
                                        type="video/mp4"
                                    />
                                </video>
                            </CardContent>
                        </Card>
                    ))}
                </div>
            </div>
        </Layout>
    );
}
import { useState } from "react";
import { Inertia } from "@inertiajs/inertia";
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
import Layout from "@/Layouts/Layout";

export default function HeroVideoPage({ videos }) {
    const [file, setFile] = useState(null);
    const [videoType, setVideoType] = useState("");

    const handleSubmit = (e) => {
        e.preventDefault();
        const formData = new FormData();
        formData.append("video", file);
        formData.append("video_type", videoType);

        Inertia.post("/hero-videos", formData, {
            forceFormData: true,
            onSuccess: () => {
                setFile(null);
                setVideoType("");
            },
        });
    };

    return (
        <Layout>
            <div className="container mx-auto p-4">
                <Card className="max-w-2xl mx-auto">
                    <CardHeader>
                        <CardTitle>Upload Hero Video</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <form onSubmit={handleSubmit} className="space-y-4">
                            <div>
                                <Input
                                    type="file"
                                    accept="video/*"
                                    onChange={(e) => setFile(e.target.files[0])}
                                    className="file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-gray-100 file:text-gray-700 hover:file:bg-gray-200"
                                />
                            </div>
                            <div>
                                <Select
                                    onValueChange={setVideoType}
                                    value={videoType}
                                >
                                    <SelectTrigger>
                                        <SelectValue placeholder="Select video type" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        <SelectItem value="REEL">
                                            REEL (1080x1920)
                                        </SelectItem>
                                        <SelectItem value="WEB">
                                            DN's Web Video (1920x1080)
                                        </SelectItem>
                                    </SelectContent>
                                </Select>
                            </div>
                            <Button
                                type="submit"
                                disabled={!file || !videoType}
                            >
                                Upload Video
                            </Button>
                        </form>
                    </CardContent>
                </Card>

                <div className="mt-8 grid gap-4">
                    {videos?.map((video) => (
                        <Card key={video.id}>
                            <CardContent className="p-4">
                                <div className="flex items-center justify-between">
                                    <span className="text-sm font-medium">
                                        {video.video_type}
                                    </span>
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
                                            video.video_type === "REEL"
                                                ? "9/16"
                                                : "16/9",
                                    }}
                                >
                                    <source
                                        src={video.video_path}
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

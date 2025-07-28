import { useState, useEffect } from "react";
import { useForm, usePage } from "@inertiajs/react";
import { Button } from "@/Components/ui/button";
import { Input } from "@/Components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/Components/ui/card";
import { Alert, AlertDescription } from "@/Components/ui/alert";
import Layout from "@/Layouts/Layout";

export default function VisionMissionPage({ visions }) {
    const { flash, errors } = usePage().props;

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
        if (confirm("Are you sure you want to delete this vision/mission entry?")) {
            destroy(route("vision-mission.destroy", id), {
                onSuccess: () => reset(),
            });
        }
    };

    const handleCancelEdit = () => {
        reset();
    };

    return (
        <Layout>
            <div className="container mx-auto p-4">
                {/* Flash Messages */}
                {flash?.message && (
                    <Alert className="mb-4">
                        <AlertDescription>{flash.message}</AlertDescription>
                    </Alert>
                )}

                {/* Form for creating/updating */}
                <Card className="max-w-2xl mx-auto">
                    <CardHeader>
                        <CardTitle>
                            {data.editingId ? "Edit Vision/Mission" : "Add Vision/Mission"}
                        </CardTitle>
                    </CardHeader>
                    <CardContent>
                        <form onSubmit={handleSubmit} className="space-y-4">
                            <div>
                                <Input
                                    type="text"
                                    placeholder="Main Heading"
                                    value={data.heading}
                                    onChange={(e) => setData("heading", e.target.value)}
                                    className="w-full"
                                />
                                {errors.heading && (
                                    <p className="text-red-500 text-sm mt-1">{errors.heading}</p>
                                )}
                            </div>
                            <div>
                                <Input
                                    type="text"
                                    placeholder="Paragraph"
                                    value={data.para}
                                    onChange={(e) => setData("para", e.target.value)}
                                    className="w-full"
                                />
                                {errors.para && (
                                    <p className="text-red-500 text-sm mt-1">{errors.para}</p>
                                )}
                            </div>
                            <div>
                                <Input
                                    type="text"
                                    placeholder="Vision Heading"
                                    value={data.vision_heading}
                                    onChange={(e) => setData("vision_heading", e.target.value)}
                                    className="w-full"
                                />
                                {errors.vision_heading && (
                                    <p className="text-red-500 text-sm mt-1">{errors.vision_heading}</p>
                                )}
                            </div>
                            <div>
                                <Input
                                    type="text"
                                    placeholder="Vision Description"
                                    value={data.vision_description}
                                    onChange={(e) => setData("vision_description", e.target.value)}
                                    className="w-full"
                                />
                                {errors.vision_description && (
                                    <p className="text-red-500 text-sm mt-1">{errors.vision_description}</p>
                                )}
                            </div>
                            <div>
                                <Input
                                    type="text"
                                    placeholder="Mission Heading"
                                    value={data.mission_heading}
                                    onChange={(e) => setData("mission_heading", e.target.value)}
                                    className="w-full"
                                />
                                {errors.mission_heading && (
                                    <p className="text-red-500 text-sm mt-1">{errors.mission_heading}</p>
                                )}
                            </div>
                            <div>
                                <Input
                                    type="text"
                                    placeholder="Mission Description"
                                    value={data.mission_description}
                                    onChange={(e) => setData("mission_description", e.target.value)}
                                    className="w-full"
                                />
                                {errors.mission_description && (
                                    <p className="text-red-500 text-sm mt-1">{errors.mission_description}</p>
                                )}
                            </div>
                            <div className="flex gap-2">
                                <Button
                                    type="submit"
                                    disabled={
                                        processing ||
                                        !data.heading ||
                                        !data.para ||
                                        !data.vision_heading ||
                                        !data.vision_description ||
                                        !data.mission_heading ||
                                        !data.mission_description
                                    }
                                >
                                    {data.editingId ? "Update" : "Add"} Vision/Mission
                                </Button>
                                {data.editingId && (
                                    <Button type="button" variant="outline" onClick={handleCancelEdit}>
                                        Cancel
                                    </Button>
                                )}
                            </div>
                        </form>
                    </CardContent>
                </Card>

                {/* Display existing entries */}
                <div className="mt-8 grid gap-4">
                    {visions?.map((vision) => (
                        <Card key={vision.id}>
                            <CardContent className="p-4">
                                <div className="flex items-center justify-between">
                                    <span className="text-sm font-medium">{vision.heading}</span>
                                    <div className="flex gap-2">
                                        <Button
                                            variant="outline"
                                            size="sm"
                                            onClick={() => handleEdit(vision)}
                                        >
                                            Edit
                                        </Button>
                                        <Button
                                            variant="destructive"
                                            size="sm"
                                            onClick={() => handleDelete(vision.id)}
                                        >
                                            Delete
                                        </Button>
                                    </div>
                                </div>
                                <div className="mt-2">
                                    <p className="text-sm text-gray-600">{vision.para}</p>
                                    <p className="text-sm font-medium mt-2">Vision: {vision.vision_heading}</p>
                                    <p className="text-sm text-gray-600">{vision.vision_description}</p>
                                    <p className="text-sm font-medium mt-2">Mission: {vision.mission_heading}</p>
                                    <p className="text-sm text-gray-600">{vision.mission_description}</p>
                                    <p className="text-sm text-gray-500 mt-2">
                                        Created: {new Date(vision.created_at).toLocaleDateString()}
                                    </p>
                                </div>
                            </CardContent>
                        </Card>
                    ))}
                </div>
            </div>
        </Layout>
    );
}
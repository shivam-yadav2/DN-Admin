import { useState } from "react";
import { Link, useForm, usePage } from "@inertiajs/react";
import { Button } from "@/Components/ui/button";
import { Input } from "@/Components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/Components/ui/card";
import Layout from "@/Layouts/Layout";

export default function ToolsPage() {
    const { technologies } = usePage().props;
    const [imagePreview, setImagePreview] = useState(null);
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
            },
        });
    };

    const handleDelete = (id) => {
        if (confirm("Are you sure you want to delete this technology?")) {
            destroy(`/technologies/${id}`, {
                onSuccess: () => {
                    // The page will re-render with updated data from the server
                },
            });
        }
    };

    const handleImageChange = (e) => {
        const file = e.target.files[0];
        setData("img", file);
        setImagePreview(URL.createObjectURL(file));
    };

    return (
        <Layout>
            <div className="container mx-auto p-4">
                <Card className="max-w-2xl mx-auto">
                    <CardHeader>
                        <CardTitle>Add Technology</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <form onSubmit={handleSubmit} className="space-y-4">
                            <div>
                                <Input
                                    type="file"
                                    accept="image/*"
                                    onChange={handleImageChange}
                                    className="file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-gray-100 file:text-gray-700 hover:file:bg-gray-200"
                                />
                                {imagePreview && (
                                    <img
                                        src={imagePreview}
                                        alt="Preview"
                                        className="mt-2 w-16 h-16 object-contain"
                                    />
                                )}
                                {errors.img && (
                                    <span className="text-red-500 text-sm">
                                        {errors.img}
                                    </span>
                                )}
                            </div>
                            <div>
                                <Input
                                    type="text"
                                    placeholder="Heading"
                                    value={data.heading}
                                    onChange={(e) =>
                                        setData("heading", e.target.value)
                                    }
                                    className="w-full"
                                />
                                {errors.heading && (
                                    <span className="text-red-500 text-sm">
                                        {errors.heading}
                                    </span>
                                )}
                            </div>
                            <Button type="submit" disabled={processing}>
                                Add Technology
                            </Button>
                        </form>
                    </CardContent>
                </Card>

                <div className="mt-8 grid gap-4">
                    {technologies.map((tool) => (
                        <Card key={tool.id}>
                            <CardContent className="p-4 flex items-center justify-between">
                                <div className="flex items-center space-x-4">
                                    <img
                                        src={`/assets/technology/${tool.img}`}
                                        alt={tool.heading}
                                        className="w-16 h-16 object-contain"
                                    />
                                    <span className="text-sm font-medium">
                                        {tool.heading}
                                    </span>
                                </div>
                                <Button
                                    variant="destructive"
                                    onClick={() => handleDelete(tool.id)}
                                    disabled={processing}
                                >
                                    Delete
                                </Button>
                            </CardContent>
                        </Card>
                    ))}
                </div>
            </div>
        </Layout>
    );
}

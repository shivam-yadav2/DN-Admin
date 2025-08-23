import { useState, useEffect } from 'react';
import { useForm, usePage } from '@inertiajs/react';
import { Head } from '@inertiajs/react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle } from '@/components/ui/alert-dialog';
import { toast } from 'sonner';
import Layout from '@/Layouts/Layout';

export default function SeoStrategy({ seoStrategies }) {
    useEffect(() => {
        console.log(seoStrategies);
        // window.location.reload();
    }, [seoStrategies]);
    
    // const { toast } = useToast();
    const { flash } = usePage().props;

    // Form for creating a new SEO strategy
    const { data: createData, setData: setCreateData, post, processing: createProcessing, errors: createErrors, reset , delete:destroy } = useForm({
        image: null,
        heading: '',
        description: '',
    });

    // Form for editing an existing SEO strategy
    const [editId, setEditId] = useState(null);
    const { data: editData, setData: setEditData, put, processing: editProcessing, errors: editErrors } = useForm({
        image: null,
        heading: '',
        description: '',
    });

    // Handle create form submission
    const handleCreate = (e) => {
        e.preventDefault();
        post(route("seo-strategy.store"), {
            forceFormData: true, // Required for file uploads
            onSuccess: () => {
                reset();
                toast.success(flash.message);
            },
            onError: () => {
                toast.error('Failed to create SEO strategy.');
            },
        });
    };

    // Handle edit form submission
    const handleUpdate = (e) => {
        e.preventDefault();
        put(route("seo-strategy.update", editId), {
            forceFormData: true, // Required for file uploads
            onSuccess: () => {
                setEditId(null);
                toast.success(flash?.message);
            },
            onError: () => {
                toast.error('Failed to update SEO strategy.');
            },
        });
    };

    // Handle edit button click
    const startEditing = (seoStrategy) => {
        setEditId(seoStrategy.id);
        setEditData({
            image: null, // File input starts empty
            heading: seoStrategy.heading,
            description: seoStrategy.description,
        });
    };

    // Handle delete
    const [deleteId, setDeleteId] = useState(null);
    const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);

    const handleDelete = (id) => {
        setDeleteId(id);
        setIsDeleteDialogOpen(true);
    };

    const confirmDelete = () => {
            destroy(route("seo-strategy.destroy", deleteId), {
            onSuccess: () => {
                setIsDeleteDialogOpen(false);
                toast.success(flash?.message);
            },
            onError: () => {
                toast.error('Failed to delete SEO strategy.');
            },
        });
    };

    return (
        <Layout>


        <div className="container mx-auto p-6">
            <Head title="SEO Strategies" />
            <h1 className="text-3xl font-bold mb-6">SEO Strategies</h1>

            {/* Flash Messages */}
            {flash?.message && (
                <div className="mb-4 p-4 bg-green-100 text-green-700 rounded">
                    {flash.message}
                </div>
            )}
            {flash?.error && (
                <div className="mb-4 p-4 bg-red-100 text-red-700 rounded">
                    {flash.error}
                </div>
            )}

            {/* Create Form */}
            <Card className="mb-8">
                <CardHeader>
                    <CardTitle>Create New SEO Strategy</CardTitle>
                </CardHeader>
                <CardContent>
                    <form onSubmit={handleCreate} className="space-y-4">
                        <div>
                            <label className="block text-sm font-medium text-gray-700">Image (JPEG, PNG, max 512KB)</label>
                            <Input
                                type="file"
                                accept="image/jpeg,image/png,image/gif"
                                onChange={(e) => setCreateData('image', e.target.files[0])}
                                className="mt-1"
                            />
                            {createErrors.image && <p className="text-red-500 text-sm mt-1">{createErrors.image}</p>}
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-700">Heading</label>
                            <Input
                                value={createData.heading}
                                onChange={(e) => setCreateData('heading', e.target.value)}
                                placeholder="Enter heading"
                                className="mt-1"
                            />
                            {createErrors.heading && <p className="text-red-500 text-sm mt-1">{createErrors.heading}</p>}
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-700">Description</label>
                            <Textarea
                                value={createData.description}
                                onChange={(e) => setCreateData('description', e.target.value)}
                                placeholder="Enter description"
                                className="mt-1"
                            />
                            {createErrors.description && <p className="text-red-500 text-sm mt-1">{createErrors.description}</p>}
                        </div>
                        <Button type="submit" disabled={createProcessing || !createData.image || !createData.heading || !createData.description}>
                            Create
                        </Button>
                    </form>
                </CardContent>
            </Card>

            {/* Edit Dialog */}
            {editId && (
                <Dialog open={!!editId} onOpenChange={() => setEditId(null)}>
                    <DialogContent>
                        <DialogHeader>
                            <DialogTitle>Edit SEO Strategy</DialogTitle>
                        </DialogHeader>
                        <form onSubmit={handleUpdate} className="space-y-4">
                            <div>
                                <label className="block text-sm font-medium text-gray-700">Image (JPEG, PNG, max 512KB, optional)</label>
                                <Input
                                    type="file"
                                    accept="image/jpeg,image/png,image/gif"
                                    onChange={(e) => setEditData('image', e.target.files[0])}
                                    className="mt-1"
                                />
                                {editErrors.image && <p className="text-red-500 text-sm mt-1">{editErrors.image}</p>}
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700">Heading</label>
                                <Input
                                    value={editData.heading}
                                    onChange={(e) => setEditData('heading', e.target.value)}
                                    placeholder="Enter heading"
                                    className="mt-1"
                                />
                                {editErrors.heading && <p className="text-red-500 text-sm mt-1">{editErrors.heading}</p>}
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700">Description</label>
                                <Textarea
                                    value={editData.description}
                                    onChange={(e) => setEditData('description', e.target.value)}
                                    placeholder="Enter description"
                                    className="mt-1"
                                />
                                {editErrors.description && <p className="text-red-500 text-sm mt-1">{editErrors.description}</p>}
                            </div>
                            <div className="flex justify-end space-x-2">
                                <Button type="submit" disabled={editProcessing}>
                                    Update
                                </Button>
                                <Button variant="outline" onClick={() => setEditId(null)}>
                                    Cancel
                                </Button>
                            </div>
                        </form>
                    </DialogContent>
                </Dialog>
            )}

            {/* List of SEO Strategies */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {seoStrategies.map((seoStrategy) => (
                    <Card key={seoStrategy.id}>
                        <CardHeader>
                            <CardTitle>{seoStrategy.heading}</CardTitle>
                        </CardHeader>
                        <CardContent>
                            <img
                                src={`/${seoStrategy.image}`}
                                alt={seoStrategy.heading}
                                className="w-full h-48 object-cover rounded-md mb-4"
                            />
                            <p className="text-gray-600 mb-4">{seoStrategy.description}</p>
                            <div className="space-x-2">
                                <Button variant="outline" onClick={() => startEditing(seoStrategy)}>
                                    Edit
                                </Button>
                                <Button
                                    variant="destructive"
                                    onClick={() => handleDelete(seoStrategy.id)}
                                >
                                    Delete
                                </Button>
                            </div>
                        </CardContent>
                    </Card>
                ))}
            </div>

            {/* Delete Confirmation Dialog */}
            <AlertDialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
                <AlertDialogContent>
                    <AlertDialogHeader>
                        <AlertDialogTitle>Are you sure?</AlertDialogTitle>
                        <AlertDialogDescription>
                            This action cannot be undone. This will permanently delete the SEO strategy and its associated image.
                        </AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter>
                        <AlertDialogCancel>Cancel</AlertDialogCancel>
                        <AlertDialogAction onClick={confirmDelete}>Delete</AlertDialogAction>
                    </AlertDialogFooter>
                </AlertDialogContent>
            </AlertDialog>
        </div>
        </Layout>
    );
}
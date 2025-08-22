import { useState } from 'react';
import { useForm, usePage } from '@inertiajs/react';
import { Head } from '@inertiajs/react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle } from '@/components/ui/alert-dialog';
import { toast } from 'sonner';
// import { useToast } from '@/components/ui/use-toast';
import Layout from '@/Layouts/Layout';

export default function SeoOptimization({ seoOptimizations }) {
    // const { toast } = useToast();
    const { flash } = usePage().props;

    // Form for creating a new SEO optimization
    const { data: createData, setData: setCreateData, post, processing: createProcessing, errors: createErrors, reset , delete:destroy } = useForm({
        icon: '',
        heading: '',
        description: '',
    });

    // Form for editing an existing SEO optimization
    const [editId, setEditId] = useState(null);
    const { data: editData, setData: setEditData, put, processing: editProcessing, errors: editErrors } = useForm({
        icon: '',
        heading: '',
        description: '',
    });

    // Handle create form submission
    const handleCreate = (e) => {
        e.preventDefault();
        post('/seo-optimization', {
            onSuccess: () => {
                reset();
                toast.success(flash.message);
            },
            onError: () => {
                toast.error('Failed to create SEO optimization.');
            },
        });
    };

    // Handle edit form submission
    const handleUpdate = (e) => {
        e.preventDefault();
        put(`/seo-optimization/${editId}`, {
            onSuccess: () => {
                setEditId(null);
                toast.success(flash.message);
            },
            onError: () => {
                toast.error('Failed to update SEO optimization.');
            },
        });
    };

    // Handle edit button click
    const startEditing = (seoOptimization) => {
        setEditId(seoOptimization.id);
        setEditData({
            icon: seoOptimization.icon,
            heading: seoOptimization.heading,
            description: seoOptimization.description,
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
        destroy(`/seo-optimization/${deleteId}`, {
            onSuccess: () => {
                setIsDeleteDialogOpen(false);
                toast.success(flash.message);
            },
            onError: () => {
                toast.error('Failed to delete SEO optimization.');
            },
        });
    };

    return (
        <Layout>


        <div className="container mx-auto p-6">
            <Head title="SEO Optimizations" />
            <h1 className="text-3xl font-bold mb-6">SEO Optimizations</h1>

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
                    <CardTitle>Create New SEO Optimization</CardTitle>
                </CardHeader>
                <CardContent>
                    <form onSubmit={handleCreate} className="space-y-4">
                        <div>
                            <label className="block text-sm font-medium text-gray-700">Icon</label>
                            <Input
                                value={createData.icon}
                                onChange={(e) => setCreateData('icon', e.target.value)}
                                placeholder="e.g., 📈"
                                className="mt-1"
                            />
                            {createErrors.icon && <p className="text-red-500 text-sm mt-1">{createErrors.icon}</p>}
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
                        <Button type="submit" disabled={createProcessing}>
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
                            <DialogTitle>Edit SEO Optimization</DialogTitle>
                        </DialogHeader>
                        <form onSubmit={handleUpdate} className="space-y-4">
                            <div>
                                <label className="block text-sm font-medium text-gray-700">Icon</label>
                                <Input
                                    value={editData.icon}
                                    onChange={(e) => setEditData('icon', e.target.value)}
                                    placeholder="e.g., 📈"
                                    className="mt-1"
                                />
                                {editErrors.icon && <p className="text-red-500 text-sm mt-1">{editErrors.icon}</p>}
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

            {/* List of SEO Optimizations */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {seoOptimizations.map((seoOptimization) => (
                    <Card key={seoOptimization.id}>
                        <CardHeader>
                            <CardTitle className="flex items-center">
                                <span className="text-2xl mr-2">{seoOptimization.icon}</span>
                                {seoOptimization.heading}
                            </CardTitle>
                        </CardHeader>
                        <CardContent>
                            <p className="text-gray-600 mb-4">{seoOptimization.description}</p>
                            <div className="space-x-2">
                                <Button variant="outline" onClick={() => startEditing(seoOptimization)}>
                                    Edit
                                </Button>
                                <Button
                                    variant="destructive"
                                    onClick={() => handleDelete(seoOptimization.id)}
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
                            This action cannot be undone. This will permanently delete the SEO optimization.
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
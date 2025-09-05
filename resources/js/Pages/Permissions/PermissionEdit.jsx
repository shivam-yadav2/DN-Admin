// resources/js/Pages/Permissions/PermissionEdit.jsx
import { useForm, usePage } from '@inertiajs/react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useEffect } from 'react';
import Layout from '@/Layouts/Layout';

export default function PermissionEdit() {
    const { props } = usePage();
    const { permission, errors: pageErrors } = props;

    const { data, setData, put, processing, errors, reset } = useForm({
        name: permission?.data?.name || '',
    });

    useEffect(() => {
        return () => {
            reset();
        };
    }, []);

    const submit = (e) => {
        e.preventDefault();
        put(`/permissions/${permission.data.id}`, {
            preserveState: true,
            preserveScroll: true,
            onError: (err) => {
                console.error('Form submission errors:', err);
            },
            onSuccess: () => {
                console.log('Permission updated successfully');
            },
        });
    };

    return (
        <Layout>
            <div className="container mx-auto py-8 px-4 max-w-7xl">
                <h1 className="text-2xl font-bold mb-4">Edit Permission</h1>
                {pageErrors && Object.keys(pageErrors).length > 0 && (
                    <div className="mb-4 p-4 bg-red-100 text-red-700 rounded-lg">
                        {Object.values(pageErrors).map((error, index) => (
                            <p key={index}>{error}</p>
                        ))}
                    </div>
                )}
                <form onSubmit={submit} className="space-y-4">
                    <div>
                        <Label htmlFor="name">Name</Label>
                        <Input
                            id="name"
                            value={data.name}
                            onChange={(e) => setData('name', e.target.value)}
                            required
                            className="w-full"
                        />
                        {errors.name && <p className="text-red-500 text-sm mt-1">{errors.name}</p>}
                    </div>
                    
                    <Button type="submit" disabled={processing}>
                        {processing ? 'Updating...' : 'Update'}
                    </Button>
                </form>
            </div>
        </Layout>
    );
}
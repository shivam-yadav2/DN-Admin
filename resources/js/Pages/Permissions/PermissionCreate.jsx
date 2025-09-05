// resources/js/Pages/Permissions/PermissionCreate.jsx
import { useForm } from '@inertiajs/react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useEffect } from 'react';
import Layout from '@/Layouts/Layout';

export default function PermissionCreate() {
    const { data, setData, post, processing, errors, reset } = useForm({
        name: '',
       
    });

    useEffect(() => {
        return () => {
            reset();
        };
    }, []);

    const submit = (e) => {
        e.preventDefault();
        post('/permissions');
    };

    return (
        <Layout>
            <div className="container mx-auto py-8 px-4 max-w-7xl">
                <h1 className="text-2xl font-bold mb-4">Create Permission</h1>
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
                        {processing ? 'Creating...' : 'Create'}
                    </Button>
                </form>
            </div>
        </Layout>
    );
}
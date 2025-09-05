// resources/js/Pages/Permissions/PermissionShow.jsx
import { usePage, Link } from '@inertiajs/react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import Layout from '@/Layouts/Layout';

export default function PermissionShow() {
    const { props } = usePage();
    const { permission } = props;

    return (
        <Layout>
            <div className="container mx-auto py-8 px-4 max-w-7xl">
                <div className="flex justify-between items-center mb-4">
                    <h1 className="text-2xl font-bold">Permission Details</h1>
                    <Link href="/permissions">
                        <Button variant="outline">Back to List</Button>
                    </Link>
                </div>
                <Card>
                    <CardHeader>
                        <CardTitle>{permission.data.name}</CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-2">
                        <p><strong>ID:</strong> {permission.data.id}</p>
                        <p><strong>Guard Name:</strong> {permission.data.guard_name}</p>
                        <p><strong>Created At:</strong> {new Date(permission.data.created_at).toLocaleString()}</p>
                        <p><strong>Updated At:</strong> {new Date(permission.data.updated_at).toLocaleString()}</p>
                    </CardContent>
                </Card>
            </div>
        </Layout>
    );
}
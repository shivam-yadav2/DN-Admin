import { usePage, Link } from '@inertiajs/react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import Layout from '@/Layouts/Layout';

export default function UserShow() {
    const { props } = usePage();
    const { user } = props;

    return (
        <Layout>
            <div className="container mx-auto py-8 px-4 max-w-7xl">
                <div className="flex justify-between items-center mb-4">
                    <h1 className="text-2xl font-bold">User Details</h1>
                    <Link href="/users">
                        <Button variant="outline">Back to List</Button>
                    </Link>
                </div>
                <Card>
                    <CardHeader>
                        <CardTitle>{user.data.name}</CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-2">
                        <p><strong>ID:</strong> {user.data.id}</p>
                        <p><strong>Email:</strong> {user.data.email}</p>
                        {/* <p><strong>Created At:</strong> {new Date(user.data.created_at).toLocaleString()}</p>
                        <p><strong>Updated At:</strong> {new Date(user.data.updated_at).toLocaleString()}</p> */}
                    </CardContent>
                </Card>
            </div>
        </Layout>
    );
}
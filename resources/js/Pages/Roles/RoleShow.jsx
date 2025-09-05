// resources/js/Pages/Roles/RoleShow.jsx
import { usePage, Link } from "@inertiajs/react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import Layout from "@/Layouts/Layout";

export default function RoleShow() {
    const { props } = usePage();
    const { role } = props;
    console.log(role)

    return (
        <Layout>
            <div className="p-6">
                <div className="flex justify-between items-center mb-4">
                    <h1 className="text-2xl font-bold">Role Details</h1>
                    <Link href="/roles">
                        <Button variant="outline">Back to List</Button>
                    </Link>
                </div>
                <Card>
                    <CardHeader>
                        <CardTitle>{role.data.name}</CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-2">
                        <p>
                            <strong>ID:</strong> {role.data.id}
                        </p>
                        <p>
                            <strong>Guard Name:</strong> {role.data.guard_name}
                        </p>
                        <p>
                            <strong>Created At:</strong> {role.data.created_at}
                        </p>
                        <p>
                            <strong>Updated At:</strong> {role.data.updated_at}
                        </p>
                    </CardContent>
                </Card>
            </div>
        </Layout>
    );
}

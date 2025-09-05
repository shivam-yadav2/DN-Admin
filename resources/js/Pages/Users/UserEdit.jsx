import { useForm, usePage } from "@inertiajs/react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useEffect, useState } from "react";
import Layout from "@/Layouts/Layout";
import Multiselect from "multiselect-react-dropdown";

export default function UserEdit() {
    const { props } = usePage();
    const { user, errors: pageErrors, roles, permissions, flash } = props;

    console.log(props)

    // Initialize states with user's current roles and permissions
    const [selectedRoles, setSelectedRoles] = useState(user.data?.roles);
    const [selectedPermissions, setSelectedPermissions] = useState(
        user.data?.permissions
    );

    const { data, setData, put, processing, errors, reset } = useForm({
        name: user.data?.name || "",
        email: user.data?.email || "",
        roles: [],
        permissions: [],
    });

    const submit = (e) => {
        e.preventDefault();
        setData(
            "roles",
            selectedRoles.map((r) => r.name)
        );
        setData(
            "permissions",
            selectedPermissions.map((p) => p.name)
        );
        put(`/users/${user.data.id}`, {
            preserveState: true,
            preserveScroll: true,
            onError: (err) => {
                console.error("Form submission errors:", err);
            },
            onSuccess: () => {
                console.log("User updated successfully");
            },
        });
    };

    return (
        <Layout>
            <div className="container mx-auto py-8 px-4 max-w-7xl">
                <h1 className="text-2xl font-bold mb-4">Edit User</h1>
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
                            onChange={(e) => setData("name", e.target.value)}
                            required
                            className="w-full"
                        />
                        {errors.name && (
                            <p className="text-red-500 text-sm mt-1">
                                {errors.name}
                            </p>
                        )}
                    </div>
                    <div>
                        <Label htmlFor="email">Email</Label>
                        <Input
                            id="email"
                            type="email"
                            value={data.email}
                            onChange={(e) => setData("email", e.target.value)}
                            required
                            className="w-full"
                        />
                        {errors.email && (
                            <p className="text-red-500 text-sm mt-1">
                                {errors.email}
                            </p>
                        )}
                    </div>
                    <div>
                        <Label htmlFor="roles">Roles</Label>
                        <Multiselect
                            options={roles?.data}
                            selectedValues={selectedRoles}
                            onSelect={(selectedList) =>
                                setSelectedRoles(selectedList)
                            }
                            onRemove={(selectedList) =>
                                setSelectedRoles(selectedList)
                            }
                            displayValue="name"
                            placeholder="Select Roles"
                        />
                        {errors.roles && (
                            <p className="text-red-500 text-sm mt-1">
                                {errors.roles}
                            </p>
                        )}
                    </div>
                    <div>
                        <Label htmlFor="permissions">Permissions</Label>
                        <Multiselect
                            options={permissions?.data}
                            selectedValues={selectedPermissions}
                            onSelect={(selectedList) =>
                                setSelectedPermissions(selectedList)
                            }
                            onRemove={(selectedList) =>
                                setSelectedPermissions(selectedList)
                            }
                            displayValue="name"
                            placeholder="Select Permissions"
                        />
                        {errors.permissions && (
                            <p className="text-red-500 text-sm mt-1">
                                {errors.permissions}
                            </p>
                        )}
                    </div>
                    
                    <Button type="submit" disabled={processing}>
                        {processing ? "Updating..." : "Update"}
                    </Button>
                </form>
            </div>
        </Layout>
    );
}

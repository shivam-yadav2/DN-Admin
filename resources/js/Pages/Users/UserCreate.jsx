import { useForm, usePage } from "@inertiajs/react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useEffect, useState } from "react";
import Layout from "@/Layouts/Layout";
import Multiselect from "multiselect-react-dropdown";

export default function UserCreate() {
    const { props } = usePage();

    const {  errors: pageErrors, roles, permissions, flash } = props;

    console.log(props);

    // Initialize states with user's current roles and permissions
    const [selectedRoles, setSelectedRoles] = useState();
    const [selectedPermissions, setSelectedPermissions] = useState(
       
    );

    const { data, setData, post, processing, errors, reset } = useForm({
        name: "",
        email: "",
        password: "",
        password_confirmation: "",
        roles: [],
        permissions: [],
    });

    useEffect(() => {
        return () => {
            reset("password", "password_confirmation");
        };
    }, []);

    const submit = (e) => {
        e.preventDefault();
        setData(
            "roles",
            selectedRoles?.map((r) => r.name)
        );
        setData(
            "permissions",
            selectedPermissions?.map((p) => p.name)
        );
        post("/users", {
            onSuccess: () => {
                console.log("User created successfully");
            },
            onError: (err) => {
                console.error("Form submission errors:", err);
            },
        });
    };

    return (
        <Layout>
            <div className="container mx-auto py-8 px-4 max-w-7xl">
                <h1 className="text-2xl font-bold mb-4">Create User</h1>
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
                        <Label htmlFor="password">Password</Label>
                        <Input
                            id="password"
                            type="password"
                            value={data.password}
                            onChange={(e) =>
                                setData("password", e.target.value)
                            }
                            required
                            className="w-full"
                        />
                        {errors.password && (
                            <p className="text-red-500 text-sm mt-1">
                                {errors.password}
                            </p>
                        )}
                    </div>
                    <div>
                        <Label htmlFor="password_confirmation">
                            Confirm Password
                        </Label>
                        <Input
                            id="password_confirmation"
                            type="password"
                            value={data.password_confirmation}
                            onChange={(e) =>
                                setData("password_confirmation", e.target.value)
                            }
                            required
                            className="w-full"
                        />
                        {errors.password_confirmation && (
                            <p className="text-red-500 text-sm mt-1">
                                {errors.password_confirmation}
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
                        {processing ? "Creating..." : "Create"}
                    </Button>
                </form>
            </div>
        </Layout>
    );
}

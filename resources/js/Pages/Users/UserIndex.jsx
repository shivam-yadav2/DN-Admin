import React, { useState } from "react";
import { usePage, Link, router } from "@inertiajs/react";
import { Button } from "@/components/ui/button";
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table";
import {
    AlertDialog,
    AlertDialogAction,
    AlertDialogCancel,
    AlertDialogContent,
    AlertDialogDescription,
    AlertDialogFooter,
    AlertDialogHeader,
    AlertDialogTitle,
    AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { Search, Users, Shield } from "lucide-react";
import Layout from "@/Layouts/Layout";

const UserIndex = () => {
    const { props } = usePage();
    const { users } = props;
    const [searchTerm, setSearchTerm] = useState("");
    console.log(props)

    const handleDelete = (id) => {
        router.delete(`/users/${id}`, {
            onSuccess: () => {
                console.log("User deleted successfully");
            },
        });
    };

    // Filter users based on search term
    const filteredUsers = users.data.filter(
        (user) =>
            user.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
            user.email.toLowerCase().includes(searchTerm.toLowerCase())
    );

    // Helper function to render roles
    const renderRoles = (roles) => {
        if (!roles || roles.length === 0) {
            return <span className="text-gray-400 italic">No roles</span>;
        }
        
        return (
            <div className="flex flex-wrap gap-1">
                {roles.map((role) => (
                    <span
                        key={role.id}
                        className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-blue-100 text-blue-800"
                    >
                        <Users className="w-3 h-3 mr-1" />
                        {role.name}
                    </span>
                ))}
            </div>
        );
    };

    // Helper function to render permissions
    const renderPermissions = (permissions) => {
        if (!permissions || permissions.length === 0) {
            return <span className="text-gray-400 italic">No permissions</span>;
        }

        const displayCount = 2; // Show first 2 permissions
        const visiblePermissions = permissions;
        const remainingCount = permissions.length - displayCount;

        return (
            <div className="space-y-1">
                <div className="flex flex-wrap gap-1">
                    {visiblePermissions.map((permission) => (
                        <span
                            key={permission.id}
                            className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-green-100 text-green-800"
                        >
                            <Shield className="w-3 h-3 mr-1" />
                            {permission.name}
                        </span>
                    ))}
                </div>
                {/* {remainingCount > 0 && (
                    <span className="text-xs text-gray-500 font-medium">
                        +{remainingCount} more
                    </span>
                )} */}
            </div>
        );
    };

    return (
        <Layout>
            <div className="container mx-auto py-8 px-4 max-w-7xl">
                {/* Header Section */}
                <div className="flex flex-col space-y-6 mb-8">
                    <div className="flex items-center justify-between">
                        <div>
                            <h1 className="text-4xl font-bold tracking-tight text-gray-900">
                                Users Management
                            </h1>
                            <p className="text-lg text-gray-600 mt-2">
                                Manage users for your application
                            </p>
                        </div>
                        <Link href="/users/create">
                            <Button>Create New User</Button>
                        </Link>
                    </div>

                    {/* Search */}
                    <div className="relative flex-1 max-w-sm">
                        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                        <input
                            type="text"
                            placeholder="Search users..."
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        />
                    </div>
                </div>

                {/* Users Table */}
                {filteredUsers.length === 0 ? (
                    <div className="bg-white rounded-lg border shadow-sm">
                        <div className="flex flex-col items-center justify-center py-16 px-6">
                            <h3 className="text-xl font-semibold text-gray-900 mb-2">
                                No users found
                            </h3>
                            <p className="text-gray-500 text-center mb-6 max-w-md">
                                {searchTerm
                                    ? "No users match your search criteria. Try adjusting your search terms."
                                    : "Get started by creating your first user."}
                            </p>
                            {!searchTerm && (
                                <Link href="/users/create">
                                    <Button>Create First User</Button>
                                </Link>
                            )}
                        </div>
                    </div>
                ) : (
                    <div className="bg-white rounded-lg border shadow-sm overflow-hidden">
                        <div className="overflow-x-auto">
                            <Table>
                                <TableHeader>
                                    <TableRow>
                                        <TableHead className="w-[80px]">ID</TableHead>
                                        <TableHead className="min-w-[150px]">Name</TableHead>
                                        <TableHead className="min-w-[200px]">Email</TableHead>
                                        <TableHead className="min-w-[200px]">Roles</TableHead>
                                        <TableHead className="min-w-[250px]">Permissions</TableHead>
                                        <TableHead className="text-right min-w-[200px]">
                                            Actions
                                        </TableHead>
                                    </TableRow>
                                </TableHeader>
                                <TableBody>
                                    {filteredUsers.map((user) => (
                                        <TableRow key={user.id}>
                                            <TableCell className="font-medium">
                                                {user.id}
                                            </TableCell>
                                            <TableCell className="font-medium">
                                                {user.name}
                                            </TableCell>
                                            <TableCell>{user.email}</TableCell>
                                            <TableCell>
                                                {renderRoles(user.roles)}
                                            </TableCell>
                                            <TableCell>
                                                {renderPermissions(user.permissions)}
                                            </TableCell>
                                            <TableCell className="text-right">
                                                <div className="flex justify-end space-x-2">
                                                    <Link href={`/users/${user.id}`}>
                                                        <Button
                                                            variant="outline"
                                                            size="sm"
                                                        >
                                                            View
                                                        </Button>
                                                    </Link>
                                                    <Link
                                                        href={`/users/${user.id}/edit`}
                                                    >
                                                        <Button
                                                            variant="outline"
                                                            size="sm"
                                                        >
                                                            Edit
                                                        </Button>
                                                    </Link>
                                                    <AlertDialog>
                                                        <AlertDialogTrigger asChild>
                                                            <Button
                                                                variant="destructive"
                                                                size="sm"
                                                            >
                                                                Delete
                                                            </Button>
                                                        </AlertDialogTrigger>
                                                        <AlertDialogContent>
                                                            <AlertDialogHeader>
                                                                <AlertDialogTitle>
                                                                    Are you sure?
                                                                </AlertDialogTitle>
                                                                <AlertDialogDescription>
                                                                    This action cannot
                                                                    be undone. This will
                                                                    permanently delete
                                                                    the user "
                                                                    {user.name}".
                                                                </AlertDialogDescription>
                                                            </AlertDialogHeader>
                                                            <AlertDialogFooter>
                                                                <AlertDialogCancel>
                                                                    Cancel
                                                                </AlertDialogCancel>
                                                                <AlertDialogAction
                                                                    onClick={() =>
                                                                        handleDelete(
                                                                            user.id
                                                                        )
                                                                    }
                                                                >
                                                                    Delete
                                                                </AlertDialogAction>
                                                            </AlertDialogFooter>
                                                        </AlertDialogContent>
                                                    </AlertDialog>
                                                </div>
                                            </TableCell>
                                        </TableRow>
                                    ))}
                                </TableBody>
                            </Table>
                        </div>
                    </div>
                )}
            </div>
        </Layout>
    );
};

export default UserIndex;
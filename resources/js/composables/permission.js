import { Link, usePage } from "@inertiajs/react";
import { use } from "react";

export default function usePermission() {
    console.log(usePage().props);

    const hasRole = (name) =>
        usePage().props.auth.user?.data?.roles?.includes(name);

    const haRoles = (names) =>
        names.some((name) =>
            usePage().props.auth.user?.data?.roles?.includes(name)
        );
    const hasPermissions = (name) =>
        usePage().props.auth.user?.data?.permissions?.includes(name);
    return { hasRole, hasPermissions , haRoles };
}

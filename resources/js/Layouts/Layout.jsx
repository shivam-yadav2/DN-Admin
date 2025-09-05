// resources/js/Layouts/Layout.jsx
import React from "react";
import { usePage, Link, router } from "@inertiajs/react";
import { SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar";
import { AppSidebar } from "@/components/app-sidebar";
import { Toaster } from "@/components/ui/sonner";
import UserMenu from "@/Components/UserMenu"; // ← add this
import NavLink from "@/Components/NavLink";

import usePermission from "@/composables/permission.js";

function LogoutButton({ className }) {
    const onLogout = (e) => {

        e.preventDefault();
        router.post(route("logout"));
    };
    return (
        <button onClick={onLogout} className={className}>
            Log out
        </button>
    );
}

const Layout = ({ children }) => {
  const {hasRole} = usePermission()

    const { props } = usePage();
    const user = props?.auth?.user;
    console.log(props);

    return (
        <div className="min-h-screen flex bg-background">
            <SidebarProvider>
                <AppSidebar user={user} />

                <main className="flex-1">
                    <div className="flex items-center justify-between px-4 py-3 border-b">
                        <div className="flex items-center gap-3">
                            <SidebarTrigger />
                            <NavLink
                                href={route("dashboard")}
                                active={route().current("dashboard")}
                                className="font-semibold"
                            >
                                Dashboard
                            </NavLink>
                            {/* {hasRole("admin") && (
                                <NavLink
                                    href={route("admin.index")}
                                    active={route().current("admin.index")}
                                >
                                    Admin
                                </NavLink>
                            )} */}
                            {hasRole("admin") && (
                                <NavLink
                                    href={route("users.index")}
                                    active={route().current("users.index")}
                                >
                                    Users
                                </NavLink>
                            )}
                            {hasRole("admin") && (
                                <NavLink
                                    href={route("roles.index")}
                                    active={route().current("roles.index")}
                                >
                                    Roles
                                </NavLink>
                            )}
                            {hasRole("admin") && (
                                <NavLink
                                    href={route("permissions.index")}
                                    active={route().current("permissions.index")}
                                >
                                    Permissions
                                </NavLink>
                            )}
                        </div>

                        <div className="flex items-center gap-4">
                            {user ? (
                                <>
                                    {/* either keep the simple logout button... */}
                                    {/* <LogoutButton className="text-sm underline" /> */}

                                    {/* ...or replace with the richer menu: */}
                                    <UserMenu user={user} />
                                </>
                            ) : (
                                <Link
                                    href={route("login")}
                                    className="text-sm underline"
                                >
                                    Log in
                                </Link>
                            )}
                        </div>
                    </div>

                    <div className="p-5">{children}</div>
                    <Toaster />
                </main>
            </SidebarProvider>
        </div>
    );
};
export default Layout;

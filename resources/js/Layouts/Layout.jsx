// resources/js/Layouts/Layout.jsx
import React from "react";
import { usePage, Link, router } from "@inertiajs/react";
import { SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar";
import { AppSidebar } from "@/components/app-sidebar";
import { Toaster } from "@/components/ui/sonner";
import UserMenu from "@/Components/UserMenu"; // ← add this

function LogoutButton({ className }) {
  const onLogout = (e) => { e.preventDefault(); router.post(route("logout")); };
  return <button onClick={onLogout} className={className}>Log out</button>;
}

const Layout = ({ children }) => {
  const { props } = usePage();
  const user = props?.auth?.user;

  return (
    <div className="min-h-screen flex bg-background">
      <SidebarProvider>
        <AppSidebar user={user} />

        <main className="flex-1">
          <div className="flex items-center justify-between px-4 py-3 border-b">
            <div className="flex items-center gap-3">
              <SidebarTrigger />
              <Link href={route("dashboard")} className="font-semibold">
                Dashboard
              </Link>
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
                <Link href={route("login")} className="text-sm underline">
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

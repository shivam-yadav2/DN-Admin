import React from "react";
import { SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar";
import { AppSidebar } from "@/components/app-sidebar";
import { Toaster } from "@/components/ui/sonner"
const Layout = ({ children }) => {
    return (
        <div>
            <SidebarProvider>
                <AppSidebar />
                <main className="w-full">
                    <SidebarTrigger />
                    <div className="p-5">{children}</div>
                </main>
                <Toaster />
            </SidebarProvider>
        </div>
    );
};

export default Layout;

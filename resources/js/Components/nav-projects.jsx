import { Folder, Forward, MoreHorizontal, Trash2 } from "lucide-react";

import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { usePage } from "@inertiajs/react";
import {
    SidebarGroup,
    SidebarGroupLabel,
    SidebarMenu,
    SidebarMenuAction,
    SidebarMenuButton,
    SidebarMenuItem,
    useSidebar,
} from "@/components/ui/sidebar";
import { Link } from "@inertiajs/react";
import NavLink from "./NavLink";

export function NavProjects({ projects, title }) {
    const { isMobile } = useSidebar();
    const { url: currentUrl } = usePage();
 const isActivePath = (path) => {
    // normalize both to avoid trailing slash mismatch
    const norm = (s) => s.replace(/\/+$/, "");
    const cur = norm(currentUrl.split("?")[0]); // strip query
    const target = norm(path);
    return cur === target || cur.startsWith(target + "/");
  };
    return (
        <SidebarGroup className="">
            <SidebarGroupLabel>{title}</SidebarGroupLabel>
            <SidebarMenu>
                {projects.map((item) => (
                    <SidebarMenuItem key={item.name}>
                        <SidebarMenuButton asChild>
                           <NavLink href={item.url} active={isActivePath(item.url)}>
                                <item.icon />
                                <span>{item.title}</span>
                            </NavLink>
                        </SidebarMenuButton>
                    </SidebarMenuItem>
                ))}
            </SidebarMenu>
        </SidebarGroup>
    );
}

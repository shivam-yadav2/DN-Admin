import { Folder, Forward, MoreHorizontal, Trash2 } from "lucide-react";

import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
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

export function NavProjects({ projects, title }) {
    const { isMobile } = useSidebar();

    return (
        <SidebarGroup className="">
            <SidebarGroupLabel>{title}</SidebarGroupLabel>
            <SidebarMenu>
                {projects.map((item) => (
                    <SidebarMenuItem key={item.name}>
                        <SidebarMenuButton asChild>
                            <a href={item.url}>
                                <item.icon />
                                <span>{item.title}</span>
                            </a>
                        </SidebarMenuButton>
                    </SidebarMenuItem>
                ))}
            </SidebarMenu>
        </SidebarGroup>
    );
}

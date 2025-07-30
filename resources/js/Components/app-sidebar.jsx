import * as React from "react";
import {
    AudioWaveform,
    BookOpen,
    Bot,
    Command,
    Frame,
    GalleryVerticalEnd,
    Map,
    PieChart,
    MonitorSmartphone,
    Settings2,
    SquareTerminal,
    Globe2,
    Code,
    LayoutDashboard,
    Layers3,
    Users,
    FolderKanban,
    ShieldCheck,
    CreditCard,
    LifeBuoy,
    ShoppingCart,
    Megaphone,
    Brush,
    User,
    BookUser,
    HousePlus,
} from "lucide-react";

import { NavMain } from "@/components/nav-main";
import { NavProjects } from "@/components/nav-projects";
import { NavUser } from "@/components/nav-user";
import { TeamSwitcher } from "@/components/team-switcher";
import {
    Sidebar,
    SidebarContent,
    SidebarFooter,
    SidebarHeader,
    SidebarRail,
} from "@/components/ui/sidebar";

// Sample data
const data = {
    user: {
        name: "shadcn",
        email: "m@example.com",
        avatar: "/avatars/shadcn.jpg",
    },
    teams: [
        {
            name: "Acme Inc",
            logo: GalleryVerticalEnd,
            plan: "Enterprise",
        },
        {
            name: "Acme Corp.",
            logo: AudioWaveform,
            plan: "Startup",
        },
        {
            name: "Evil Corp.",
            logo: Command,
            plan: "Free",
        },
    ],
    navMain: [
        {
            title: "Dashboards",
            url: "#",
            icon: SquareTerminal,
            isActive: true,
            items: [
                {
                    title: "Fashion Academy Dashboard",
                    url: "/dashboard",
                },
                {
                    title: "Salon Dashboard",
                    url: "/dashboard/salon_dashboard",
                },
            ],
        },
        {
            title: "Fashion Academy",
            url: "#",
            icon: Bot,
            items: [
                {
                    title: "Course Category",
                    url: "/dashboard/academy_category",
                },
                {
                    title: "All Courses",
                    url: "/dashboard/courses",
                },
                {
                    title: "Add Courses",
                    url: "/dashboard/add_course",
                },
            ],
        },
        {
            title: "Salon Services",
            url: "#",
            icon: BookOpen,
            items: [
                {
                    title: "Salon Service",
                    url: "/dashboard/salon_service",
                },
            ],
        },
    ],
    projects: [
        {
            title: "Admin Dashboard",
            url: "/dashboard",
            icon: Frame,
        },
        {
            title: "Meta Data",
            url: "/meta-data",
            icon: Frame,
        },
    ],
    Pages: [
        {
            title: "All Services",
            url: "/services",
            icon: PieChart,
        },
        {
            title: "SEO Service",
            url: "/#",
            icon: PieChart,
        },
        {
            title: "Marketing Service",
            url: "/#",
            icon: Map,
        },
        {
            title: "Development Service",
            url: "/#",
            icon: User,
        },
    ],
    Other: [
        {
            title: "Career",
            url: "/career",
            icon: BookOpen,
        },
        {
            title: "Blog",
            url: "/blogs",
            icon: Map,
        },
        {
            title: "Contact Details",
            url: "/contact-details",
            icon: BookOpen,
        },
        {
            title: "Our Team",
            url: "/our-team",
            icon: BookOpen,
        },
    ],
    Enquiry: [
        {
            title: "Hero Section",
            url: "/hero-videos",
            icon: BookOpen,
        },
        {
            title: "About Section",
            url: "/about",
            icon: BookOpen,
        },
        {
            title: "Tools and Technologies",
            url: "/technologies",
            icon: Map,
        },
        {
            title: "FAQs",
            url: "/faqs",
            icon: BookOpen,
        },
        {
            title: "Vision-Mission",
            url: "/vision-mission",
            icon: BookOpen,
        },
    ],
};

export function AppSidebar({ ...props }) {
    return (
        <Sidebar collapsible="icon" {...props}>
            <SidebarHeader>
                <TeamSwitcher teams={data.teams} />
            </SidebarHeader>
            <SidebarContent>
                <NavMain />
                <NavProjects title="Dashboard" projects={data.projects} />
                <NavProjects title="Pages" projects={data.Pages} />
                <NavProjects title="Home Page" projects={data.Enquiry} />
                <NavProjects title="Other Pages" projects={data.Other} />
            </SidebarContent>
            <SidebarFooter>
                <button
                    // onClick={logout}
                    className="w-full bg-red-600 border flex text-white text-xl items-center justify-center font-semibold gap-2 rounded-md p-2 hover:bg-red-700 transition-colors"
                >
                    Logout
                </button>
            </SidebarFooter>
            <SidebarRail />
        </Sidebar>
    );
}

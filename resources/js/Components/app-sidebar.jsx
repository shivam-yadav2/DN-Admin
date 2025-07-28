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
    Enquiry: [
        {
            title: "Hero Section",
            url: "/home_hero",
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
        
    ],
};

const data2 = {
    user: {
        name: "Admin User",
        email: "admin@digitalhub.com",
        avatar: "/avatars/admin.jpg",
    },
    teams: [
        {
            name: "Digital Nawab",
            logo: MonitorSmartphone,
            plan: "Pro",
        },
        {
            name: "WebVerse",
            logo: Globe2,
            plan: "Enterprise",
        },
        {
            name: "CodeCraft",
            logo: Code,
            plan: "Startup",
        },
    ],
    navMain: [
        {
            title: "Dashboard",
            url: "/dashboard",
            icon: LayoutDashboard,
            isActive: true,
            items: [
                {
                    title: "Overview",
                    url: "/dashboard",
                },
                {
                    title: "Analytics",
                    url: "/dashboard",
                },
                {
                    title: "Reports",
                    url: "/dashboard",
                },
            ],
        },
        {
            title: "Services",
            url: "/services",
            icon: Layers3,
            items: [
                {
                    title: "All Services",
                    url: "/services",
                },
                {
                    title: "Digital Marketing",
                    url: "/services",
                },
                {
                    title: "Web Development",
                    url: "/services",
                },
                {
                    title: "SEO",
                    url: "/services",
                },
                {
                    title: "Content Creation",
                    url: "/services",
                },
            ],
        },
        {
            title: "Home Page",
            url: "/#",
            icon: Layers3,
            items: [
                {
                    title: "Hero Section",
                    url: "/services",
                },
                {
                    title: "Digital Marketing",
                    url: "/services",
                },
                {
                    title: "Web Development",
                    url: "/services",
                },
                {
                    title: "SEO",
                    url: "/services",
                },
                {
                    title: "Content Creation",
                    url: "/services",
                },
            ],
        },
        {
            title: "Enquiries",
            url: "#",
            icon: Layers3,
            items: [
                {
                    title: "All Enquiries",
                    url: "/enquiries",
                },
            ],
        },
    ],
    projects: [
        {
            name: "E-Commerce Platform",
            url: "/projects/ecommerce",
            icon: ShoppingCart,
        },
        {
            name: "Social Media Campaign",
            url: "/projects/social-campaign",
            icon: Megaphone,
        },
        {
            name: "Corporate Website Redesign",
            url: "/projects/corporate-website",
            icon: Brush,
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

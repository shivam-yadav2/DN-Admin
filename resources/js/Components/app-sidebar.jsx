import * as React from "react"
import {
  AudioWaveform,
  BookOpen,
  Bot,
  Command,
  Frame,
  GalleryVerticalEnd,
  Map,
  PieChart,
  MonitorSmartphone ,
  Settings2,
  SquareTerminal,
  Globe2 ,
  Code ,
  LayoutDashboard ,
  Layers3 ,
  Users ,
  FolderKanban ,
  ShieldCheck ,
  CreditCard ,
  LifeBuoy ,
  ShoppingCart ,
  Megaphone ,
  Brush ,

} from "lucide-react"

import { NavMain } from "@/components/nav-main"
import { NavProjects } from "@/components/nav-projects"
import { NavUser } from "@/components/nav-user"
import { TeamSwitcher } from "@/components/team-switcher"
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarRail,
} from "@/components/ui/sidebar"

// This is sample data.
const data1 = {
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
      title: "Playground",
      url: "#",
      icon: SquareTerminal,
      isActive: true,
      items: [
        {
          title: "History",
          url: "#",
        },
        {
          title: "Starred",
          url: "#",
        },
        {
          title: "Settings",
          url: "#",
        },
      ],
    },
    {
      title: "Models",
      url: "#",
      icon: Bot,
      items: [
        {
          title: "Genesis",
          url: "#",
        },
        {
          title: "Explorer",
          url: "#",
        },
        {
          title: "Quantum",
          url: "#",
        },
      ],
    },
    {
      title: "Documentation",
      url: "#",
      icon: BookOpen,
      items: [
        {
          title: "Introduction",
          url: "#",
        },
        {
          title: "Get Started",
          url: "#",
        },
        {
          title: "Tutorials",
          url: "#",
        },
        {
          title: "Changelog",
          url: "#",
        },
      ],
    },
    {
      title: "Settings",
      url: "#",
      icon: Settings2,
      items: [
        {
          title: "General",
          url: "#",
        },
        {
          title: "Team",
          url: "#",
        },
        {
          title: "Billing",
          url: "#",
        },
        {
          title: "Limits",
          url: "#",
        },
      ],
    },
  ],
  projects: [
    {
      name: "Design Engineering",
      url: "#",
      icon: Frame,
    },
    {
      name: "Sales & Marketing",
      url: "#",
      icon: PieChart,
    },
    {
      name: "Travel",
      url: "#",
      icon: Map,
    },
  ],
}

const data = {
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
      title: "Clients",
      url: "#",
      icon: Users,
      items: [
        {
          title: "Active Clients",
          url: "#",
        },
        {
          title: "Leads",
          url: "#",
        },
        {
          title: "Contracts",
          url: "#",
        },
      ],
    },
    {
      title: "Projects",
      url: "#",
      icon: FolderKanban,
      items: [
        {
          title: "Ongoing",
          url: "#",
        },
        {
          title: "Completed",
          url: "#",
        },
        {
          title: "Archived",
          url: "#",
        },
      ],
    },
    {
      title: "Team & Roles",
      url: "#",
      icon: ShieldCheck,
      items: [
        {
          title: "Team Members",
          url: "#",
        },
        {
          title: "Roles & Permissions",
          url: "#",
        },
      ],
    },
    {
      title: "Billing",
      url: "#",
      icon: CreditCard,
      items: [
        {
          title: "Invoices",
          url: "#",
        },
        {
          title: "Plans",
          url: "#",
        },
        {
          title: "Payment Methods",
          url: "#",
        },
      ],
    },
    {
      title: "Settings",
      url: "#",
      icon: Settings2,
      items: [
        {
          title: "Profile",
          url: "#",
        },
        {
          title: "Notifications",
          url: "#",
        },
        {
          title: "Security",
          url: "#",
        },
      ],
    },
    {
      title: "Support",
      url: "#",
      icon: LifeBuoy,
      items: [
        {
          title: "Help Center",
          url: "#",
        },
        {
          title: "Contact Support",
          url: "#",
        },
        {
          title: "System Status",
          url: "#",
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
}


export function AppSidebar({
  ...props
}) {
  return (
    <Sidebar collapsible="icon" {...props}>
      <SidebarHeader>
        <TeamSwitcher teams={data.teams} />
      </SidebarHeader>
      <SidebarContent>
        <NavMain items={data.navMain} />
        <NavProjects projects={data.projects} />
      </SidebarContent>
      <SidebarFooter>
        <NavUser user={data.user} />
      </SidebarFooter>
      <SidebarRail />
    </Sidebar>
  );
}

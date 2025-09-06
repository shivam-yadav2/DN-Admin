// resources/js/Components/UserMenu.jsx
import React from "react";
import { Link, router } from "@inertiajs/react";
import {
    DropdownMenu,
    DropdownMenuTrigger,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuSeparator,
    DropdownMenuLabel,
} from "@/components/ui/dropdown-menu";

export default function UserMenu({ user }) {
    if (!user) return null;
    console.log(user)

    return (
        <DropdownMenu>
            <DropdownMenuTrigger className="flex items-center gap-2 rounded px-2 py-1 hover:bg-accent">
                <span className="text-sm">{user.data.name} ({user.data.roles[0]})</span>
                <svg width="16" height="16" viewBox="0 0 20 20">
                    <path
                        d="M5.5 7.5l4.5 4.5 4.5-4.5"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="1.5"
                    />
                </svg>
            </DropdownMenuTrigger>

            <DropdownMenuContent align="end" className="w-56">
                <DropdownMenuLabel className="leading-tight">
                    <div className="font-medium">{user.data.name} ({user.data.roles[0]})</div>
                    <div className="text-xs opacity-70">{user.data.email}</div>
                </DropdownMenuLabel>
                <DropdownMenuSeparator />

                {/* Account / Profile page (Breeze) */}
                <DropdownMenuItem asChild>
                    <Link href={route("profile.edit")}>Account</Link>
                </DropdownMenuItem>

                {/* you can add more: api tokens, billing, etc. */}

                <DropdownMenuSeparator />
                <DropdownMenuItem
                    onClick={(e) => {
                        e.preventDefault();
                        router.post(route("logout"));
                    }}
                >
                    Log out
                </DropdownMenuItem>
            </DropdownMenuContent>
        </DropdownMenu>
    );
}

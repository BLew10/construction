"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { useAuthStore } from "../../../../store/authStore";
import {
	LayoutDashboard,
	FolderKanban,
	CalendarDays,
	FileText,
	CircleDollarSign,
	AlertCircle,
	Users,
	Settings,
	Menu,
} from "lucide-react";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { useState } from "react";

const navigation = [
	{ name: "Dashboard", href: "/dashboard", icon: LayoutDashboard },
	{ name: "Projects", href: "/projects", icon: FolderKanban },
	{ name: "Schedule", href: "/schedule", icon: CalendarDays },
	{ name: "Documents", href: "/documents", icon: FileText },
	{ name: "Budget", href: "/budget", icon: CircleDollarSign },
	{ name: "Issues", href: "/issues", icon: AlertCircle },
	{ name: "Team", href: "/team", icon: Users },
	{ name: "Settings", href: "/settings", icon: Settings },
];

interface SidebarLinkProps {
	href: string;
	icon: React.ElementType;
	children: React.ReactNode;
	isActive: boolean;
	onClick?: () => void;
}

function SidebarLink({
	href,
	icon: Icon,
	children,
	isActive,
	onClick,
}: SidebarLinkProps) {
	return (
		<Link
			href={href}
			className={cn(
				"flex items-center gap-x-3 px-3 py-2 text-sm font-medium rounded-md",
				isActive
					? "bg-primary/10 text-primary"
					: "text-muted-foreground hover:bg-muted hover:text-foreground",
			)}
			onClick={onClick}
		>
			<Icon className="h-5 w-5" />
			{children}
		</Link>
	);
}

export default function Sidebar() {
	const pathname = usePathname();
	const { user } = useAuthStore();
	const [open, setOpen] = useState(false);

	const initials = user?.name
		?.split(" ")
		.map((n) => n[0])
		.join("")
		.toUpperCase() || "";

	const SidebarContent = () => (
		<div className="space-y-6">
			<div className="px-3 py-2">
				<h2 className="mb-2 px-4 text-lg font-semibold tracking-tight">
					ConstructionPro
				</h2>
				<div className="space-y-1">
					{navigation.map((item) => (
						<SidebarLink
							key={item.name}
							href={item.href}
							icon={item.icon}
							isActive={pathname.startsWith(item.href)}
							onClick={() => setOpen(false)}
						>
							{item.name}
						</SidebarLink>
					))}
				</div>
			</div>
		</div>
	);

	return (
		<>
			{/* Mobile Sidebar */}
			<Sheet open={open} onOpenChange={setOpen}>
				<SheetTrigger asChild className="fixed top-2 left-2 z-40 lg:hidden">
					<Button variant="outline" size="icon">
						<Menu className="h-5 w-5" />
						<span className="sr-only">Toggle Menu</span>
					</Button>
				</SheetTrigger>
				<SheetContent side="left" className="w-64 p-0 pt-10">
					<SidebarContent />
					
					{user && (
						<div className="mt-auto p-4 border-t">
							<div className="flex items-center gap-3">
								<div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-primary/10 text-primary font-semibold">
									{initials}
								</div>
								<div className="flex flex-col overflow-hidden">
									<span className="text-sm font-medium truncate">{user?.name}</span>
									<span className="text-xs text-muted-foreground truncate">
										{user?.companyName}
									</span>
								</div>
							</div>
						</div>
					)}
				</SheetContent>
			</Sheet>

			{/* Desktop Sidebar */}
			<div className="hidden lg:flex lg:flex-col lg:w-64 lg:border-r">
				<div className="flex flex-col flex-1 h-screen">
					<SidebarContent />

					{user && (
						<div className="mt-auto p-4 border-t">
							<div className="flex items-center gap-3">
								<div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-primary/10 text-primary font-semibold">
									{initials}
								</div>
								<div className="flex flex-col overflow-hidden">
									<span className="text-sm font-medium truncate">{user?.name}</span>
									<span className="text-xs text-muted-foreground truncate">
										{user?.companyName}
									</span>
								</div>
							</div>
						</div>
					)}
				</div>
			</div>
		</>
	);
}

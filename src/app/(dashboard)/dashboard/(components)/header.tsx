"use client";

import { useAuthStore } from "../../../../store/authStore";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import {
	DropdownMenu,
	DropdownMenuContent,
	DropdownMenuItem,
	DropdownMenuLabel,
	DropdownMenuSeparator,
	DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { BellIcon } from "lucide-react";
import { ModeToggle } from "@/components/mode-toggle";

export default function Header() {
	const { user, logout } = useAuthStore();
	const router = useRouter();

	const handleLogout = () => {
		logout();
		router.push("/login");
	};

	const initials = user?.name
		?.split(" ")
		.map((n) => n[0])
		.join("")
		.toUpperCase() || "";

	return (
		<header className="border-b bg-background z-10 sticky top-0">
			<div className="flex h-16 items-center justify-between px-2 sm:px-4 md:px-6">
				<div className="lg:hidden w-12">
					{/* Empty space for mobile to balance the header */}
				</div>

				<div className="hidden lg:block">
					{/* Title only visible on desktop since sidebar shows the title on large screens */}
					<h1 className="text-xl font-semibold">ConstructionPro</h1>
				</div>

				<div className="flex items-center gap-2 sm:gap-4">
					<Button variant="outline" size="icon" className="hidden sm:flex">
						<BellIcon className="h-5 w-5" />
					</Button>

					<ModeToggle />

					<DropdownMenu>
						<DropdownMenuTrigger asChild>
							<Button variant="ghost" className="relative h-8 w-8 sm:h-9 sm:w-9 rounded-full">
								<div className="flex h-full w-full items-center justify-center rounded-full bg-primary/10 text-primary font-semibold">
									{initials}
								</div>
							</Button>
						</DropdownMenuTrigger>
						<DropdownMenuContent className="w-56" align="end" forceMount>
							<DropdownMenuLabel>
								<div className="flex flex-col space-y-1">
									<p className="text-sm font-medium leading-none">
										{user?.name}
									</p>
									<p className="text-xs leading-none text-muted-foreground">
										{user?.email}
									</p>
								</div>
							</DropdownMenuLabel>
							<DropdownMenuSeparator />
							<DropdownMenuItem>Profile</DropdownMenuItem>
							<DropdownMenuItem>Settings</DropdownMenuItem>
							<DropdownMenuSeparator />
							<DropdownMenuItem onClick={handleLogout} className="text-red-600">
								Log out
							</DropdownMenuItem>
						</DropdownMenuContent>
					</DropdownMenu>
				</div>
			</div>
		</header>
	);
}

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

	return (
		<header className="border-b bg-background z-10">
			<div className="flex h-16 items-center justify-between px-6">
				<div></div>

				<div className="flex items-center gap-4">
					<Button variant="outline" size="icon">
						<BellIcon className="h-5 w-5" />
					</Button>

					<ModeToggle />

					<DropdownMenu>
						<DropdownMenuTrigger asChild>
							<Button variant="ghost" className="relative h-9 w-9 rounded-full">
								<div className="flex h-9 w-9 items-center justify-center rounded-full bg-primary/10 text-primary font-semibold">
									{user?.name.charAt(0).toUpperCase()}
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

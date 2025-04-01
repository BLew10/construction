"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAuthStore } from "../../store/authStore";
import Sidebar from "@/app/(dashboard)/dashboard/(components)/sidebar";
import Header from "@/app/(dashboard)/dashboard/(components)/header";

export default function DashboardLayout({
	children,
}: {
	children: React.ReactNode;
}) {
	const { isAuthenticated } = useAuthStore();
	const router = useRouter();

	useEffect(() => {
		if (!isAuthenticated) {
			router.push("/login");
		}
	}, [isAuthenticated, router]);

	if (!isAuthenticated) {
		return null;
	}

	return (
		<div className="flex min-h-screen bg-muted/40">
			<Sidebar />
			<div className="flex flex-col flex-1 min-w-0">
				<Header />
				<main className="flex-1 overflow-y-auto p-6">{children}</main>
			</div>
		</div>
	);
}

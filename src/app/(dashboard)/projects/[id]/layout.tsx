"use client";

import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { usePathname, useRouter } from "next/navigation";
import { Pencil } from "lucide-react";

export default function ProjectLayout({
	children,
	params,
}: {
	children: React.ReactNode;
	params: { id: string };
}) {
	const pathname = usePathname();
	const router = useRouter();
	const projectId = params.id;

	const tabs = [
		{ value: "overview", label: "Overview", path: `/projects/${projectId}` },
		{
			value: "schedule",
			label: "Schedule",
			path: `/projects/${projectId}/schedule`,
		},
		{
			value: "documents",
			label: "Documents",
			path: `/projects/${projectId}/documents`,
		},
		{ value: "budget", label: "Budget", path: `/projects/${projectId}/budget` },
		{ value: "team", label: "Team", path: `/projects/${projectId}/team` },
		// Add more tabs as needed
	];

	const currentTab =
		tabs.find((tab) => pathname === tab.path)?.value || "overview";

	return (
		<div className="space-y-6">
			<div className="flex items-center justify-between">
				<Tabs
					value={currentTab}
					onValueChange={(value) => {
						const tab = tabs.find((t) => t.value === value);
						if (tab) router.push(tab.path);
					}}
					className="w-full"
				>
					<div className="flex items-center justify-between mb-4">
						<TabsList className="w-full">
							{tabs.map((tab) => (
								<TabsTrigger key={tab.value} value={tab.value}>
									{tab.label}
								</TabsTrigger>
							))}
						</TabsList>
						<Button
							variant="outline"
							onClick={() => router.push(`/projects/${projectId}/edit`)}
							className="ml-4"
						>
							<Pencil className="mr-2 h-4 w-4" />
							Edit Project
						</Button>
					</div>
				</Tabs>
			</div>
			{children}
		</div>
	);
}

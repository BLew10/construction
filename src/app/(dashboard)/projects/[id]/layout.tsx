"use client";

import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { usePathname, useRouter } from "next/navigation";
import { 
	Pencil, 
	LayoutDashboard, 
	Calendar, 
	FileText, 
	CircleDollarSign, 
	Users 
} from "lucide-react";

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
		{ 
			value: "overview", 
			label: "Overview", 
			path: `/projects/${projectId}`,
			icon: <LayoutDashboard className="h-4 w-4 mr-2" />
		},
		{
			value: "schedule",
			label: "Schedule",
			path: `/projects/${projectId}/schedule`,
			icon: <Calendar className="h-4 w-4 mr-2" />
		},
		{
			value: "documents",
			label: "Documents",
			path: `/projects/${projectId}/documents`,
			icon: <FileText className="h-4 w-4 mr-2" />
		},
		{ 
			value: "budget", 
			label: "Budget", 
			path: `/projects/${projectId}/budget`,
			icon: <CircleDollarSign className="h-4 w-4 mr-2" />
		},
		{ 
			value: "team", 
			label: "Team", 
			path: `/projects/${projectId}/team`,
			icon: <Users className="h-4 w-4 mr-2" />
		},
		// Add more tabs as needed
	];

	const currentTab =
		tabs.find((tab) => pathname === tab.path)?.value || "overview";

	return (
		<div className="space-y-6">
			<div className="flex flex-col space-y-4">
				<div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
					<Tabs
						value={currentTab}
						onValueChange={(value) => {
							const tab = tabs.find((t) => t.value === value);
							if (tab) router.push(tab.path);
						}}
						className="w-full"
					>
						<TabsList className="mb-4 overflow-x-auto">
							{tabs.map((tab) => (
								<TabsTrigger 
									key={tab.value} 
									value={tab.value} 
									className="whitespace-nowrap data-[state=active]:border-primary/50"
								>
									{tab.icon}
									{tab.label}
								</TabsTrigger>
							))}
						</TabsList>
					</Tabs>
					<Button
						variant="outline"
						onClick={() => router.push(`/projects/${projectId}/edit`)}
						className="sm:ml-4 w-full sm:w-auto"
					>
						<Pencil className="mr-2 h-4 w-4" />
						Edit Project
					</Button>
				</div>
			</div>
			{children}
		</div>
	);
}

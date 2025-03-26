"use client";

import { useAuthStore } from "@/store/authStore";
import {
	Card,
	CardContent,
	CardDescription,
	CardHeader,
	CardTitle,
} from "@/components/ui/card";
import {
	CircleDollarSign,
	AlertCircle,
	FileText,
	CalendarDays,
} from "lucide-react";

export default function DashboardPage() {
	const { user } = useAuthStore();

	return (
		<div className="space-y-6">
			<div className="flex items-center justify-between">
				<h1 className="text-3xl font-bold tracking-tight">
					Welcome, {user?.name}
				</h1>
			</div>

			<div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
				<DashboardCard
					title="Active Projects"
					value="5"
					description="+2 since last month"
					icon={<FileText className="h-4 w-4 text-muted-foreground" />}
				/>
				<DashboardCard
					title="Pending Approvals"
					value="12"
					description="+4 since yesterday"
					icon={<AlertCircle className="h-4 w-4 text-muted-foreground" />}
				/>
				<DashboardCard
					title="Upcoming Deadlines"
					value="8"
					description="This week"
					icon={<CalendarDays className="h-4 w-4 text-muted-foreground" />}
				/>
				<DashboardCard
					title="Budget Status"
					value="$1.2M"
					description="$45k under budget"
					icon={<CircleDollarSign className="h-4 w-4 text-muted-foreground" />}
				/>
			</div>

			<div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
				<Card className="col-span-2">
					<CardHeader>
						<CardTitle>Recent Projects</CardTitle>
						<CardDescription>Your latest active projects</CardDescription>
					</CardHeader>
					<CardContent>
						<div className="text-center py-8 text-muted-foreground">
							Projects will appear here once created
						</div>
					</CardContent>
				</Card>

				<Card>
					<CardHeader>
						<CardTitle>Recent Activity</CardTitle>
						<CardDescription>
							Latest updates across your projects
						</CardDescription>
					</CardHeader>
					<CardContent>
						<div className="text-center py-8 text-muted-foreground">
							Activity will appear here as you work on projects
						</div>
					</CardContent>
				</Card>
			</div>
		</div>
	);
}

function DashboardCard({
	title,
	value,
	description,
	icon,
}: {
	title: string;
	value: string;
	description: string;
	icon: React.ReactNode;
}) {
	return (
		<Card>
			<CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
				<CardTitle className="text-sm font-medium">{title}</CardTitle>
				{icon}
			</CardHeader>
			<CardContent>
				<div className="text-2xl font-bold">{value}</div>
				<p className="text-xs text-muted-foreground">{description}</p>
			</CardContent>
		</Card>
	);
}

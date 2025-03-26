"use client";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
	Table,
	TableBody,
	TableCell,
	TableHead,
	TableHeader,
	TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { useProjectsStore } from "@/store/projectsStore";
import { Plus, Calendar, AlertCircle, List } from "lucide-react";
import { useParams } from "next/navigation";
import { Progress } from "@/components/ui/progress";
import { useState } from "react";
import { TimelineView } from "@/components/schedule/timeline-view";

// Mock schedule data - replace with actual data from your store
const tasks = [
	{
		id: "1",
		name: "Site Preparation",
		startDate: "2024-01-01",
		endDate: "2024-01-15",
		progress: 100,
		status: "completed",
		phase: "Foundation",
		dependencies: [],
		assignedTo: ["John Doe"],
		criticalPath: true,
	},
	{
		id: "2",
		name: "Foundation Work",
		startDate: "2024-01-16",
		endDate: "2024-02-15",
		progress: 65,
		status: "inProgress",
		phase: "Foundation",
		dependencies: ["1"],
		assignedTo: ["Jane Smith"],
		criticalPath: true,
	},
	{
		id: "3",
		name: "Structural Steel",
		startDate: "2024-02-16",
		endDate: "2024-03-30",
		progress: 0,
		status: "notStarted",
		phase: "Superstructure",
		dependencies: ["2"],
		assignedTo: ["Bob Wilson"],
		criticalPath: true,
	},
];

function TaskStatusBadge({ status }: { status: string }) {
	const statusConfig = {
		completed: { label: "Completed", variant: "default" as const },
		inProgress: { label: "In Progress", variant: "secondary" as const },
		notStarted: { label: "Not Started", variant: "outline" as const },
		delayed: { label: "Delayed", variant: "destructive" as const },
	};

	const config = statusConfig[status as keyof typeof statusConfig];
	return <Badge variant={config.variant}>{config.label}</Badge>;
}

export default function SchedulePage() {
	const params = useParams();
	const projectId = params.id as string;
	const { currentProject } = useProjectsStore();
	const [view, setView] = useState<"list" | "timeline">("list");

	if (!currentProject) {
		return <div>Loading...</div>;
	}

	// Calculate project date range
	const projectStart = new Date(
		Math.min(...tasks.map((t) => new Date(t.startDate).getTime())),
	);
	const projectEnd = new Date(
		Math.max(...tasks.map((t) => new Date(t.endDate).getTime())),
	);

	return (
		<div className="space-y-6">
			<div className="flex items-center justify-between">
				<div>
					<h1 className="text-3xl font-bold tracking-tight">
						Project Schedule
					</h1>
					<p className="text-muted-foreground mt-2">
						Track project timeline and task dependencies
					</p>
				</div>
				<div className="flex gap-4">
					<Button
						variant={view === "timeline" ? "default" : "outline"}
						onClick={() => setView("timeline")}
					>
						<Calendar className="mr-2 h-4 w-4" />
						Timeline
					</Button>
					<Button
						variant={view === "list" ? "default" : "outline"}
						onClick={() => setView("list")}
					>
						<List className="mr-2 h-4 w-4" />
						List
					</Button>
					<Button>
						<Plus className="mr-2 h-4 w-4" />
						Add Task
					</Button>
				</div>
			</div>

			<div className="grid gap-6 grid-cols-1 md:grid-cols-4">
				<Card>
					<CardHeader className="flex flex-row items-center justify-between py-4">
						<CardTitle className="text-sm font-medium">Total Tasks</CardTitle>
					</CardHeader>
					<CardContent>
						<div className="text-2xl font-bold">{tasks.length}</div>
						<p className="text-xs text-muted-foreground">
							{tasks.filter((t) => t.status === "completed").length} completed
						</p>
					</CardContent>
				</Card>

				<Card>
					<CardHeader className="flex flex-row items-center justify-between py-4">
						<CardTitle className="text-sm font-medium">Progress</CardTitle>
					</CardHeader>
					<CardContent>
						<div className="text-2xl font-bold">
							{Math.round(
								(tasks.reduce((acc, task) => acc + task.progress, 0) /
									(tasks.length * 100)) *
									100,
							)}
							%
						</div>
						<Progress
							value={
								(tasks.reduce((acc, task) => acc + task.progress, 0) /
									(tasks.length * 100)) *
								100
							}
							className="mt-2"
						/>
					</CardContent>
				</Card>

				<Card>
					<CardHeader className="flex flex-row items-center justify-between py-4">
						<CardTitle className="text-sm font-medium">
							Critical Tasks
						</CardTitle>
					</CardHeader>
					<CardContent>
						<div className="text-2xl font-bold">
							{tasks.filter((t) => t.criticalPath).length}
						</div>
						<p className="text-xs text-muted-foreground">On critical path</p>
					</CardContent>
				</Card>

				<Card>
					<CardHeader className="flex flex-row items-center justify-between py-4">
						<CardTitle className="text-sm font-medium">Delayed Tasks</CardTitle>
					</CardHeader>
					<CardContent>
						<div className="text-2xl font-bold text-destructive">
							{tasks.filter((t) => t.status === "delayed").length}
						</div>
						<p className="text-xs text-muted-foreground">Require attention</p>
					</CardContent>
				</Card>
			</div>

			{view === "list" ? (
				<Card>
					<CardHeader>
						<CardTitle>Task List</CardTitle>
					</CardHeader>
					<CardContent>
						<Table>
							<TableHeader>
								<TableRow>
									<TableHead>Task Name</TableHead>
									<TableHead>Phase</TableHead>
									<TableHead>Start Date</TableHead>
									<TableHead>End Date</TableHead>
									<TableHead>Progress</TableHead>
									<TableHead>Status</TableHead>
									<TableHead>Assigned To</TableHead>
								</TableRow>
							</TableHeader>
							<TableBody>
								{tasks.map((task) => (
									<TableRow key={task.id}>
										<TableCell className="font-medium">
											<div className="flex items-center gap-2">
												{task.criticalPath && (
													<AlertCircle className="h-4 w-4 text-destructive" />
												)}
												{task.name}
											</div>
										</TableCell>
										<TableCell>{task.phase}</TableCell>
										<TableCell>
											{new Date(task.startDate).toLocaleDateString()}
										</TableCell>
										<TableCell>
											{new Date(task.endDate).toLocaleDateString()}
										</TableCell>
										<TableCell>
											<div className="flex items-center gap-2">
												<Progress value={task.progress} className="w-[60px]" />
												<span className="text-sm text-muted-foreground">
													{task.progress}%
												</span>
											</div>
										</TableCell>
										<TableCell>
											<TaskStatusBadge status={task.status} />
										</TableCell>
										<TableCell>{task.assignedTo.join(", ")}</TableCell>
									</TableRow>
								))}
							</TableBody>
						</Table>
					</CardContent>
				</Card>
			) : (
				<TimelineView
					tasks={tasks}
					startDate={projectStart}
					endDate={projectEnd}
				/>
			)}
		</div>
	);
}

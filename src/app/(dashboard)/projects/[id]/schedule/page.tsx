"use client";

import { Button } from "@/components/ui/button";
import { useProjectsStore } from "@/store/projectsStore";
import { Plus, Calendar, List } from "lucide-react";
import { useParams } from "next/navigation";
import { useState } from "react";
import { TimelineView } from "@/app/(dashboard)/projects/[id]/schedule/(components)/timeline-view";
import { MetricsCards } from "@/app/(dashboard)/projects/[id]/schedule/(components)/metrics-cards";
import { TaskList } from "@/app/(dashboard)/projects/[id]/schedule/(components)/task-list";

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
		endDate: "2027-02-15",
		progress: 65,
		status: "inProgress",
		phase: "Foundation",
		dependencies: ["1"],
		assignedTo: ["Jane Smith"],
		criticalPath: false,
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

			<MetricsCards tasks={tasks} />

			{view === "list" ? (
				<TaskList tasks={tasks} />
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

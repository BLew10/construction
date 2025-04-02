import { Project } from "@/types/project";
import { Task } from "@/store/tasksStore";

interface ScheduleMetricsProps {
	projects: Project[];
}

export function ScheduleMetrics({ projects }: ScheduleMetricsProps) {
	// Placeholder for analytics charts and data
	return (
		<div className="p-4 border rounded-md min-h-[200px] flex items-center justify-center">
			<p className="text-muted-foreground">Schedule Analytics View - Coming Soon</p>
			{/* Add charts for progress, delays, milestones etc. */}
		</div>
	);
} 
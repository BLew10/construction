import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Project } from "@/types/project";


interface ScheduleMetricsCardsProps {
	projects: Project[];
}

export function ScheduleMetricsCards({ projects }: ScheduleMetricsCardsProps) {
	const allTasks = projects.flatMap(p => p.tasks || []);

	const totalTasks = allTasks.length;
	const completedTasks = allTasks.filter((t) => t.status === "completed").length;
	// Add logic for 'delayed' status if available in Task type
	const delayedTasks = allTasks.filter((t) => {
		// Example: task is not completed and its end date is past today
		// return t.status !== 'completed' && new Date(t.endDate) < new Date();
		return false; // Placeholder
	}).length;

	const totalProgressSum = allTasks.reduce((acc, task) => acc + (task.progress || 0), 0);
	const overallProgress = totalTasks > 0 ? Math.round(totalProgressSum / totalTasks) : 0;


	return (
		<div className="grid gap-4 grid-cols-1 md:grid-cols-2 lg:grid-cols-4">
			<Card>
				<CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
					<CardTitle className="text-sm font-medium">Total Tasks</CardTitle>
					{/* Icon can go here */}
				</CardHeader>
				<CardContent>
					<div className="text-2xl font-bold">{totalTasks}</div>
					<p className="text-xs text-muted-foreground">
						Across {projects.length} selected project(s)
					</p>
				</CardContent>
			</Card>

			<Card>
				<CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
					<CardTitle className="text-sm font-medium">Completed Tasks</CardTitle>
				</CardHeader>
				<CardContent>
					<div className="text-2xl font-bold">{completedTasks}</div>
					<p className="text-xs text-muted-foreground">
						{totalTasks > 0 ? `${Math.round((completedTasks / totalTasks) * 100)}%` : '0%'} of total
					</p>
				</CardContent>
			</Card>

			<Card>
				<CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
					<CardTitle className="text-sm font-medium">Delayed Tasks</CardTitle>
				</CardHeader>
				<CardContent>
					<div className="text-2xl font-bold">{delayedTasks}</div>
					<p className="text-muted-foreground text-xs">Requires 'delayed' status logic</p>
				</CardContent>
			</Card>

			<Card>
				<CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
					<CardTitle className="text-sm font-medium">Overall Progress</CardTitle>
				</CardHeader>
				<CardContent>
					<div className="text-2xl font-bold">{overallProgress}%</div>
					<Progress value={overallProgress} className="mt-2 h-2" />
				</CardContent>
			</Card>
		</div>
	);
} 
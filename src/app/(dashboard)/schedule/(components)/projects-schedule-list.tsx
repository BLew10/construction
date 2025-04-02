import { Project } from "@/types/project";
import { Task } from "@/store/tasksStore";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { format } from "date-fns";


interface ProjectsScheduleListProps {
	projects: Project[];
}

export function ProjectsScheduleList({ projects }: ProjectsScheduleListProps) {
	return (
		<div>
			{projects.map(project => (
				<Card key={project.id} className="mb-6">
					<CardHeader>
						<CardTitle>{project.name}</CardTitle>
						{/* Add project level info if needed */}
					</CardHeader>
					<CardContent>
						{project.tasks && project.tasks.length > 0 ? (
							<Table>
								<TableHeader>
									<TableRow>
										<TableHead>Task</TableHead>
										<TableHead>Start</TableHead>
										<TableHead>End</TableHead>
										<TableHead>Status</TableHead>
										<TableHead>Progress</TableHead>
									</TableRow>
								</TableHeader>
								<TableBody>
									{project.tasks.map(task => (
										<TableRow key={task.id}>
											<TableCell className="font-medium">{task.name}</TableCell>
											<TableCell>{format(new Date(task.startDate), 'P')}</TableCell>
											<TableCell>{format(new Date(task.endDate), 'P')}</TableCell>
											<TableCell><Badge variant="outline" className="capitalize">{task.status}</Badge></TableCell>
											<TableCell>
												<div className="flex items-center gap-2">
													<Progress value={task.progress} className="w-20 h-2" />
													<span>{task.progress}%</span>
												</div>
											</TableCell>
										</TableRow>
									))}
								</TableBody>
							</Table>
						) : (
							<p className="text-muted-foreground text-sm">No tasks found for this project within the selected date range.</p>
						)}
					</CardContent>
				</Card>
			))}
			{projects.length === 0 && (
				<div className="text-center text-muted-foreground py-8">
					No projects match the current filter.
				</div>
			)}
		</div>
	);
} 
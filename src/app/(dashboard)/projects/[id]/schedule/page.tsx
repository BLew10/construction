"use client";

import { Button } from "@/components/ui/button";
import { useProjectsStore } from "@/store/projectsStore";
import { Task, useTasksStore } from "@/store/tasksStore";
import { Plus, Calendar, List } from "lucide-react";
import { useParams } from "next/navigation";
import { useState, useEffect } from "react";
import { TimelineView } from "@/app/(dashboard)/projects/[id]/schedule/(components)/timeline-view";
import { MetricsCards } from "@/app/(dashboard)/projects/[id]/schedule/(components)/metrics-cards";
import { TaskList } from "@/app/(dashboard)/projects/[id]/schedule/(components)/task-list";
import TaskForm from "@/app/(dashboard)/projects/[id]/schedule/(components)/task-form";

// Mock schedule data - replace with actual data from your store
// const tasks = [ ... ]; // Remove or comment out mock data

export default function SchedulePage() {
	const params = useParams();
	const projectId = params.id as string;
	const { currentProject } = useProjectsStore();
	const { tasks, fetchTasks, isLoading: tasksLoading } = useTasksStore();
	const [view, setView] = useState<"list" | "timeline">("list");
	const [isTaskFormOpen, setIsTaskFormOpen] = useState(false);
	const [editingTask, setEditingTask] = useState<Task | null>(null);

	useEffect(() => {
		if (projectId) {
			console.warn("Task fetching not implemented yet in useTasksStore");
		}
	}, [projectId]);

	const handleAddTask = () => {
		setEditingTask(null);
		setIsTaskFormOpen(true);
	};

	const handleEditTask = (task: Task) => {
		setEditingTask(task);
		setIsTaskFormOpen(true);
	};

	const handleCloseTaskForm = () => {
		setIsTaskFormOpen(false);
		setEditingTask(null);
	};

	if (!currentProject || tasksLoading) {
		return <div>Loading...</div>;
	}

	const projectStart =
		tasks.length > 0
			? new Date(
					Math.min(
						...tasks.map((t) => new Date(t.startDate).getTime()),
					),
			  )
			: new Date();
	const projectEnd =
		tasks.length > 0
			? new Date(
					Math.max(...tasks.map((t) => new Date(t.endDate).getTime())),
			  )
			: new Date();

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
					<Button onClick={handleAddTask}>
						<Plus className="mr-2 h-4 w-4" />
						Add Task
					</Button>
				</div>
			</div>

			<MetricsCards tasks={tasks} />

			{view === "list" ? (
				<TaskList tasks={tasks} onEditTask={handleEditTask} />
			) : (
				<TimelineView
					tasks={tasks}
					startDate={projectStart}
					endDate={projectEnd}
					onEditTask={handleEditTask}
				/>
			)}

			{isTaskFormOpen && (
				<TaskForm
					projectId={projectId}
					onClose={handleCloseTaskForm}
					existingTasks={tasks}
					initialData={tasks[0]}
				/>
			)}
		</div>
	);
}

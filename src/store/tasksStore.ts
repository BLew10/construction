import { create } from "zustand";

export type TaskStatus = "notStarted" | "inProgress" | "completed" | "delayed";
export interface Task {
	id: string;
	name: string;
	description?: string;
	startDate: string;
	endDate: string;
	status: TaskStatus;
	progress: number;
	assignedTo: string[];
	dependsOn: string[];
	trade?: string;
	phase?: string;
	isBaseline: boolean;
	projectId: string;
}

interface TasksStore {
	isLoading: boolean;
	createTask: (task: Omit<Task, "id">) => Promise<void>;
}

export const useTasksStore = create<TasksStore>((set) => ({
	isLoading: false,
	createTask: async (taskData: Omit<Task, "id">) => {
		set({ isLoading: true });
		// Implement task creation logic
		console.log("Creating task:", taskData);
		set({ isLoading: false });
	},
}));

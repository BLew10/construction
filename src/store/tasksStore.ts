import { create } from "zustand";

export type TaskStatus = "notStarted" | "inProgress" | "completed" | "delayed";

export const projectTasks: Task [] = [
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
		projectId: "1",
		isBaseline: false,
		dependsOn: [],
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
		projectId: "1",
		isBaseline: false,
		dependsOn: ["1"],
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
		projectId: "1",
		isBaseline: false,
		dependsOn: ["2"],
	},
	{
		id: "4",
		name: "Concrete Pour",
		startDate: "2024-04-01",
		endDate: "2024-04-15",
		progress: 0,
		status: "notStarted",
		phase: "Superstructure",
		dependencies: ["3"],
		assignedTo: ["Alice Johnson"],
		criticalPath: false,
		projectId: "1",
		isBaseline: false,
		dependsOn: ["3"],
	},
	{
		id: "5",
		name: "Roofing",
		startDate: "2024-05-01",
		endDate: "2024-05-15",
		progress: 0,
		status: "notStarted",
		phase: "Superstructure",
		dependencies: ["4"],
		assignedTo: ["Bob Wilson"],
		criticalPath: false,
		projectId: "1",
		isBaseline: false,
		dependsOn: ["4"],
	},
];

// Ensure Task interface matches form and data needs
export interface Task {
  id: string;
  projectId: string; // Make sure projectId is part of the task
  name: string;
  description?: string;
  startDate: string; // Store dates as ISO strings
  endDate: string; // Store dates as ISO strings
  status: TaskStatus;
  dependencies?: string[]; // Array of task IDs
  progress: number;
  assignedTo?: string[]; // Consider how you'll store/fetch user IDs/names
  dependsOn?: string[]; // Array of task IDs
  trade?: string;
  phase?: string;
  isBaseline: boolean;
  criticalPath?: boolean; // Add if needed for display/logic
  // Add other fields like createdAt, updatedAt if necessary
}

// Define the payload for creating (omit id, add projectId)
type CreateTaskPayload = Omit<Task, "id" | "criticalPath"> & {
  projectId: string;
};
// Define the payload for updating (Partial Task, but require projectId potentially)
type UpdateTaskPayload = Partial<Omit<Task, "id" | "projectId">>;

interface TasksStore {
  tasks: Task[]; // Add state to hold tasks
  isLoading: boolean;
  error: string | null; // Add error state
  fetchTasks: (projectId: string) => Promise<void>; // Add fetch function
  fetchAllTasks: () => Promise<void>; // Add fetch function
  createTask: (taskData: CreateTaskPayload) => Promise<void>;
  updateTask: (taskId: string, taskData: UpdateTaskPayload) => Promise<void>; // Add update function
  deleteTask: (taskId: string) => Promise<void>; // Add delete function
}

export const useTasksStore = create<TasksStore>((set, get) => ({
  tasks: projectTasks, // Initialize tasks state
  isLoading: false,
  error: null,

  // --- Implement API Calls (or mock for now) ---
  fetchAllTasks: async () => {
    // TODO: Implement API call to fetch all tasks for all projects that are ACTIVE
    set({ isLoading: true, error: null });
    try {
      console.log("Fetching all tasks... (Not Implemented)");

      // Mock implementation:
      await new Promise((resolve) => setTimeout(resolve, 500)); // Simulate network delay
      // Filter mock data if needed, or assume API returns filtered data
      set({ tasks: [], isLoading: false }); // Replace with actual data later
    } catch (err) {
      console.error("Fetch all tasks error:", err);
    }
  },

  fetchTasks: async (projectId: string) => {
    set({ isLoading: true, error: null });
    try {
      console.log(
        `Fetching tasks for project: ${projectId}... (Not Implemented)`
      );
      // const response = await fetch(`/api/projects/${projectId}/tasks`);
      // if (!response.ok) throw new Error('Failed to fetch tasks');
      // const fetchedTasks = await response.json();
      // set({ tasks: fetchedTasks, isLoading: false });

      // Mock implementation:
      await new Promise((resolve) => setTimeout(resolve, 500)); // Simulate network delay
      // Filter mock data if needed, or assume API returns filtered data
      set({ tasks: [], isLoading: false }); // Replace with actual data later
    } catch (err) {
      console.error("Fetch tasks error:", err);
      set({ error: (err as Error).message, isLoading: false });
    }
  },

  createTask: async (taskData: CreateTaskPayload) => {
    set({ isLoading: true, error: null });
    try {
      console.log("Creating task:", taskData, "(Not Implemented)");
      // const response = await fetch(`/api/projects/${taskData.projectId}/tasks`, {
      //   method: 'POST',
      //   headers: { 'Content-Type': 'application/json' },
      //   body: JSON.stringify(taskData),
      // });
      // if (!response.ok) throw new Error('Failed to create task');
      // const newTask = await response.json();
      // set((state) => ({ tasks: [...state.tasks, newTask], isLoading: false }));

      // Mock implementation:
      await new Promise((resolve) => setTimeout(resolve, 500));
      const newTask: Task = {
        ...taskData,
        id: `new-${Date.now()}`, // Temporary ID
        criticalPath: false, // Default value
      };
      set((state) => ({ tasks: [...state.tasks, newTask], isLoading: false }));
    } catch (err) {
      console.error("Create task error:", err);
      set({ error: (err as Error).message, isLoading: false });
      throw err; // Re-throw error so form can catch it
    }
  },

  updateTask: async (taskId: string, taskData: UpdateTaskPayload) => {
    set({ isLoading: true, error: null });
    try {
      console.log(`Updating task ${taskId}:`, taskData, "(Not Implemented)");
      // const response = await fetch(`/api/tasks/${taskId}`, { // Assuming a route like /api/tasks/:taskId
      //   method: 'PATCH', // or PUT
      //   headers: { 'Content-Type': 'application/json' },
      //   body: JSON.stringify(taskData),
      // });
      // if (!response.ok) throw new Error('Failed to update task');
      // const updatedTask = await response.json();
      // set((state) => ({
      //   tasks: state.tasks.map((task) =>
      //     task.id === taskId ? updatedTask : task
      //   ),
      //   isLoading: false,
      // }));

      // Mock implementation:
      await new Promise((resolve) => setTimeout(resolve, 500));
      set((state) => ({
        tasks: state.tasks.map((task) =>
          task.id === taskId ? { ...task, ...taskData } : task
        ),
        isLoading: false,
      }));
    } catch (err) {
      console.error("Update task error:", err);
      set({ error: (err as Error).message, isLoading: false });
      throw err; // Re-throw error
    }
  },

  deleteTask: async (taskId: string) => {
    set({ isLoading: true, error: null });
    // Optional: Add confirmation dialog logic here or in the component

    try {
      console.log(`Deleting task ${taskId}... (Not Implemented)`);
      // const response = await fetch(`/api/tasks/${taskId}`, { method: 'DELETE' });
      // if (!response.ok) throw new Error('Failed to delete task');
      // set((state) => ({
      //   tasks: state.tasks.filter((task) => task.id !== taskId),
      //   isLoading: false,
      // }));

      // Mock implementation:
      await new Promise((resolve) => setTimeout(resolve, 500));
      set((state) => ({
        tasks: state.tasks.filter((task) => task.id !== taskId),
        isLoading: false,
      }));
    } catch (err) {
      console.error("Delete task error:", err);
      set({ error: (err as Error).message, isLoading: false });
      throw err; // Re-throw error
    }
  },
}));

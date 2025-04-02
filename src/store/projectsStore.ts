import { create } from "zustand";
import { Project } from "@/types/project";
import { projectTasks, Task, TaskStatus } from "./tasksStore";
export interface ProjectsState {
  projects: Project[];
  currentProject: Project | null;
  isLoading: boolean;
  error: string | null;
  fetchProjects: () => Promise<void>;
  setCurrentProject: (id: string) => void;
  createProject: (project: Omit<Project, "id">) => Promise<void>;
  updateProject: (id: string, project: Partial<Project>) => Promise<void>;
  deleteProject: (id: string) => Promise<void>;
  fetchProjectsWithTasks: () => Promise<any[]>;
}

export const useProjectsStore = create<ProjectsState>((set, get) => ({
  projects: [],
  currentProject: null,
  isLoading: false,
  error: null,

  fetchProjects: async () => {
    set({ isLoading: true, error: null });
    try {
      // Mock API response for now
      const mockProjects: Project[] = [
        {
          id: "1",
          name: "Downtown Office Building",
          address: "123 Main St, Anytown, USA",
          startDate: "2023-06-01",
          endDate: "2024-02-28",
          status: "active",
          clientId: "client-1",
          budget: 2500000,
          description: "A 6-story office building with underground parking",
          tasks: projectTasks,
        },
        {
          id: "2",
          name: "Riverside Apartments",
          address: "456 River Rd, Anytown, USA",
          startDate: "2023-08-15",
          endDate: "2024-10-30",
          status: "planning",
          clientId: "client-2",
          budget: 4800000,
          description: "Luxury apartment complex with 24 units",
        },
        {
          id: "3",
          name: "Community Center Renovation",
          address: "789 Park Ave, Anytown, USA",
          startDate: "2023-04-10",
          endDate: "2023-12-15",
          status: "active",
          clientId: "client-3",
          budget: 1200000,
          description: "Renovation of existing community center",
        },
      ];

      // Simulate API delay
      await new Promise((resolve) => setTimeout(resolve, 500));

      set({ projects: mockProjects, isLoading: false });
    } catch (error) {
      console.log(error);
      set({ error: "Failed to fetch projects", isLoading: false });
    }
  },

  setCurrentProject: (projectId) => {
    const { projects, fetchProjects } = get();
    const project = projects.find((p) => p.id === projectId);

    if (project) {
      set({ currentProject: project });
    } else {
      // If project not found in state, fetch projects first
      fetchProjects().then(() => {
        const freshProject = get().projects.find((p) => p.id === projectId);
        set({ currentProject: freshProject || null });
      });
    }
  },

  createProject: async (project) => {
    set({ isLoading: true, error: null });
    try {
      // Mock API call
      // Simulate API delay
      await new Promise((resolve) => setTimeout(resolve, 500));

      const newProject: Project = {
        ...project,
        id: `project-${Date.now()}`,
      };

      set((state) => ({
        projects: [...state.projects, newProject],
        isLoading: false,
      }));

      return;
    } catch (error) {
      console.error("Failed to create project", error);
      set({ error: "Failed to create project", isLoading: false });
    }
  },

  updateProject: async (id, updates) => {
    set({ isLoading: true, error: null });
    try {
      // Mock API call
      // Simulate API delay
      await new Promise((resolve) => setTimeout(resolve, 500));

      set((state) => ({
        projects: state.projects.map((p) =>
          p.id === id ? { ...p, ...updates } : p
        ),
        currentProject:
          state.currentProject?.id === id
            ? { ...state.currentProject, ...updates }
            : state.currentProject,
        isLoading: false,
      }));
    } catch (error) {
      console.log(error);
      set({ error: "Failed to update project", isLoading: false });
    }
  },

  deleteProject: async (id: string) => {
    try {
      set({ isLoading: true });
      await fetch(`/api/projects/${id}`, { method: "DELETE" });
      set((state) => ({
        projects: state.projects.filter((p) => p.id !== id),
        isLoading: false,
      }));
    } catch (error) {
      set({ error: "Failed to delete project", isLoading: false });
    }
  },

  fetchProjectsWithTasks: async () => {
    set({ isLoading: true, error: null });
    try {
      // Get projects
      const { projects } = get();

      // Mock tasks for projects (in a real app, this would come from a tasksStore)
      const mockTasks = projects.map((project) =>
        createMockTasksForProject(project)
      );

      // Attach tasks to projects
      const projectsWithTasks = projects.map((project) => ({
        ...project,
        tasks:
          mockTasks.find((tasks) => tasks[0].projectId === project.id) || [],
      }));

      set({ isLoading: false });
      return projectsWithTasks;
    } catch (error) {
      console.error(error);
      set({ error: "Failed to fetch projects with tasks", isLoading: false });
      return [];
    }
  },
}));

const createMockTasksForProject = (project: Project): Task[] => {
  // Make sure we have 2-4 tasks per project for better visualization
  const numTasks = Math.floor(Math.random() * 3) + 2;
  const tasks: Task[] = [];

  // Parse project dates
  const projectStart = new Date(project.startDate);
  const projectEnd = new Date(project.endDate);
  const projectDurationMs = projectEnd.getTime() - projectStart.getTime();

  // Create sequential tasks that span the project duration
  const taskDuration = projectDurationMs / numTasks;

  // Task names by project type
  const taskNamesByType: Record<string, string[]> = {
    construction: [
      "Site Prep",
      "Foundation Work",
      "Structural Steel",
      "MEP Systems",
      "Interior Finishes",
    ],
    renovation: [
      "Demolition",
      "Structural Repairs",
      "New Systems",
      "Finishes",
      "Inspection",
    ],
    planning: [
      "Requirements",
      "Schematic Design",
      "Design Development",
      "Construction Docs",
      "Permitting",
    ],
    default: ["Phase 1", "Phase 2", "Phase 3", "Phase 4", "Phase 5"],
  };

  // Determine project type based on name
  let projectType = "default";
  if (
    project.name.toLowerCase().includes("building") ||
    project.name.toLowerCase().includes("construction")
  ) {
    projectType = "construction";
  } else if (
    project.name.toLowerCase().includes("renovation") ||
    project.name.toLowerCase().includes("remodel")
  ) {
    projectType = "renovation";
  } else if (
    project.name.toLowerCase().includes("planning") ||
    project.name.toLowerCase().includes("design")
  ) {
    projectType = "planning";
  }

  // Choose task names based on project type
  const taskNames = taskNamesByType[projectType];

  // Create the tasks
  for (let i = 0; i < numTasks; i++) {
    const taskStart = new Date(projectStart.getTime() + i * taskDuration);
    const taskEnd = new Date(
      Math.min(taskStart.getTime() + taskDuration * 0.95, projectEnd.getTime())
    );

    // Determine status based on current date and task timing
    const now = new Date();
    let status = "not started";
    let progress = 0;

    if (taskEnd < now) {
      status = "completed";
      progress = 100;
    } else if (taskStart < now) {
      status = "in progress";
      // Calculate progress based on time elapsed
      const totalTaskTime = taskEnd.getTime() - taskStart.getTime();
      const elapsedTime = now.getTime() - taskStart.getTime();
      progress = Math.round((elapsedTime / totalTaskTime) * 100);
    }

    tasks.push({
      id: `task-${project.id}-${i}`,
      name: taskNames[i % taskNames.length],
      startDate: taskStart.toISOString().split("T")[0],
      endDate: taskEnd.toISOString().split("T")[0],
      status: status as TaskStatus,
      progress,
      criticalPath: i === 0 || i === numTasks - 1, // First and last tasks are critical
      projectId: project.id,
      dependsOn: i > 0 ? [`task-${project.id}-${i - 1}`] : [],
      assignedTo: [],
      phase: "",
      isBaseline: false,
      dependencies: i > 0 ? [`task-${project.id}-${i - 1}`] : [],
    });
  }

  return tasks;
};

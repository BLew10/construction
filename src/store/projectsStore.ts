import { create } from "zustand";
import { Project } from "@/types/project";

export interface ProjectsState {
  projects: Project[];
  currentProject: Project | null;
  isLoading: boolean;
  error: string | null;
  fetchProjects: () => Promise<void>;
  setCurrentProject: (id: string) => void;
  createProject: (project: Omit<Project, "id">) => Promise<void>;
  updateProject: (id: string, project: Partial<Project>) => Promise<void>;
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
}));

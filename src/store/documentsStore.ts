import { create } from "zustand";

export type DocumentStatus = "draft" | "pending" | "approved" | "rejected";
export type DocumentType =
  | "plan"
  | "submittal"
  | "contract"
  | "permit"
  | "rfi"
  | "other";

export interface Document {
  id: string;
  projectId: string;
  name: string;
  description?: string;
  type: DocumentType;
  status: DocumentStatus;
  version: number;
  uploadedBy: string;
  uploadedAt: string;
  approvedBy?: string;
  approvedAt?: string;
  fileUrl: string;
  fileSize: number;
  fileType: string;
}

interface DocumentsState {
  documents: Document[];
  isLoading: boolean;
  error: string | null;
  fetchDocuments: (projectId: string) => Promise<void>;
  uploadDocument: (
    document: Omit<Document, "id" | "uploadedAt" | "version">
  ) => Promise<void>;
  updateDocument: (id: string, updates: Partial<Document>) => Promise<void>;
  deleteDocument: (id: string) => Promise<void>;
}

export const useDocumentsStore = create<DocumentsState>((set, get) => ({
  documents: [],
  isLoading: false,
  error: null,

  fetchDocuments: async (projectId: string) => {
    set({ isLoading: true, error: null });
    try {
      // Mock API response
      const mockDocuments: Document[] = [
        {
          id: "doc-1",
          projectId,
          name: "Floor Plans",
          description: "Detailed floor plans for all levels",
          type: "plan",
          status: "approved",
          version: 2,
          uploadedBy: "user-1",
          uploadedAt: "2023-09-15T10:30:00Z",
          approvedBy: "user-2",
          approvedAt: "2023-09-16T14:20:00Z",
          fileUrl: "/mock-files/floor-plans.pdf",
          fileSize: 2500000,
          fileType: "application/pdf",
        },
        {
          id: "doc-2",
          projectId,
          name: "Electrical Diagrams",
          description: "Wiring and electrical system diagrams",
          type: "plan",
          status: "pending",
          version: 1,
          uploadedBy: "user-3",
          uploadedAt: "2023-09-18T09:15:00Z",
          fileUrl: "/mock-files/electrical.pdf",
          fileSize: 1800000,
          fileType: "application/pdf",
        },
        {
          id: "doc-3",
          projectId,
          name: "Building Permit",
          description: "Official building permit from city",
          type: "permit",
          status: "approved",
          version: 1,
          uploadedBy: "user-1",
          uploadedAt: "2023-09-10T15:45:00Z",
          approvedBy: "user-2",
          approvedAt: "2023-09-10T16:30:00Z",
          fileUrl: "/mock-files/permit.pdf",
          fileSize: 500000,
          fileType: "application/pdf",
        },
      ];

      // Simulate API delay
      await new Promise((resolve) => setTimeout(resolve, 500));

      set({ documents: mockDocuments, isLoading: false });
    } catch (error) {
      console.error("Failed to fetch documents", error);
      set({ error: "Failed to fetch documents", isLoading: false });
    }
  },

  uploadDocument: async (document) => {
    set({ isLoading: true, error: null });
    try {
      // Mock API call
      await new Promise((resolve) => setTimeout(resolve, 1000));

      const newDocument: Document = {
        ...document,
        id: `doc-${Date.now()}`,
        uploadedAt: new Date().toISOString(),
        version: 1,
      };

      set((state) => ({
        documents: [...state.documents, newDocument],
        isLoading: false,
      }));
    } catch (error) {
      console.error("Failed to upload document", error);
      set({ error: "Failed to upload document", isLoading: false });
    }
  },

  updateDocument: async (id, updates) => {
    set({ isLoading: true, error: null });
    try {
      // Mock API call
      await new Promise((resolve) => setTimeout(resolve, 500));

      set((state) => ({
        documents: state.documents.map((d) =>
          d.id === id ? { ...d, ...updates } : d
        ),
        isLoading: false,
      }));
    } catch (error) {
      console.error("Failed to update document", error);
      set({ error: "Failed to update document", isLoading: false });
    }
  },

  deleteDocument: async (id) => {
    set({ isLoading: true, error: null });
    try {
      // Mock API call
      await new Promise((resolve) => setTimeout(resolve, 500));

      set((state) => ({
        documents: state.documents.filter((d) => d.id !== id),
        isLoading: false,
      }));
    } catch (error) {
      console.error("Failed to delete document", error);
      set({ error: "Failed to delete document", isLoading: false });
    }
  },
}));

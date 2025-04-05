import { create } from "zustand";

export type DocumentStatus = "draft" | "pending" | "approved" | "rejected";
export type DocumentType =
	| "plan"
	| "submittal"
	| "contract"
	| "permit"
	| "rfi"
	| "specification"
	| "drawing"
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
	aiProcessed: boolean;
	aiSummary?: string;
	aiKeywords?: string[];
	aiCategories?: string[];
	commentCount: number;
	previousVersions?: string[];
}

export interface DocumentComment {
	id: string;
	documentId: string;
	userId: string;
	userName: string;
	userAvatar?: string;
	content: string;
	createdAt: string;
	updatedAt?: string;
	parentId?: string;
	mentions?: string[];
	pageNumber?: number;
	resolved: boolean;
}

interface DocumentsState {
	documents: Document[];
	comments: Record<string, DocumentComment[]>;
	currentDocument: Document | null;
	isLoading: boolean;
	isProcessing: boolean;
	error: string | null;
	fetchDocuments: () => Promise<void>;
	fetchDocument: (documentId: string) => Promise<void>;
	uploadDocument: (
		document: Omit<Document, "id" | "uploadedAt" | "version" | "aiProcessed" | "commentCount">,
	) => Promise<void>;
	updateDocument: (id: string, updates: Partial<Document>) => Promise<void>;
	deleteDocument: (id: string) => Promise<void>;
	processDocumentWithAI: (documentId: string) => Promise<void>;
	addComment: (comment: Omit<DocumentComment, "id" | "createdAt">) => Promise<void>;
	updateComment: (commentId: string, content: string) => Promise<void>;
	deleteComment: (commentId: string) => Promise<void>;
	resolveComment: (commentId: string, resolved: boolean) => Promise<void>;
	fetchComments: (documentId: string) => Promise<void>;
}

export const useDocumentsStore = create<DocumentsState>((set, get) => ({
	documents: [],
	comments: {},
	currentDocument: null,
	isLoading: false,
	isProcessing: false,
	error: null,

	fetchDocuments: async () => {
		set({ isLoading: true, error: null });
		try {
			// Mock API response - Simulate fetching documents from multiple projects
			const mockDocuments: Document[] = [
				// Project 1 Documents
				{
					id: "doc-1",
					projectId: "proj-1", // Added projectId
					name: "Project Alpha Floor Plans",
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
					aiProcessed: true,
					aiSummary: "Complete floor plans for all 3 levels including dimensions and room layouts.",
					aiKeywords: ["floor plan", "dimension", "layout", "scale 1:100"],
					aiCategories: ["architectural", "design"],
					commentCount: 5,
					previousVersions: ["doc-1-v1"],
				},
				{
					id: "doc-3",
					projectId: "proj-1", // Added projectId
					name: "Project Alpha Building Permit",
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
					aiProcessed: true,
					aiSummary: "Official building permit #12345 issued by City Planning Department on Sept 10, 2023.",
					aiKeywords: ["permit", "official", "compliance", "approval"],
					aiCategories: ["legal", "compliance"],
					commentCount: 0,
				},
				// Project 2 Documents
				{
					id: "doc-2",
					projectId: "proj-2", // Added projectId
					name: "Project Beta Electrical Diagrams",
					description: "Wiring and electrical system diagrams",
					type: "plan",
					status: "pending",
					version: 1,
					uploadedBy: "user-3",
					uploadedAt: "2023-09-18T09:15:00Z",
					fileUrl: "/mock-files/electrical.pdf",
					fileSize: 1800000,
					fileType: "application/pdf",
					aiProcessed: true,
					aiSummary: "Detailed electrical wiring diagrams for all building systems including lighting, power, and low voltage.",
					aiKeywords: ["electrical", "wiring", "circuit", "panel"],
					aiCategories: ["electrical", "engineering"],
					commentCount: 2,
				},
				 {
					id: "doc-4",
					projectId: "proj-2", // Added projectId
					name: "Project Beta Contract",
					description: "Main construction contract",
					type: "contract",
					status: "draft",
					version: 1,
					uploadedBy: "user-1",
					uploadedAt: "2023-10-01T11:00:00Z",
					fileUrl: "/mock-files/contract.docx",
					fileSize: 350000,
					fileType: "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
					aiProcessed: false,
					commentCount: 1,
				},
			];

			// Simulate API delay
			await new Promise((resolve) => setTimeout(resolve, 500));

			// In a real app, you'd fetch based on the logged-in user's permissions
			set({ documents: mockDocuments, isLoading: false });
		} catch (error) {
			console.error("Failed to fetch documents", error);
			set({ error: "Failed to fetch documents", isLoading: false });
		}
	},

	fetchDocument: async (documentId: string) => {
		set({ isLoading: true, error: null });
		try {
			// Find document in the current state (already fetched by fetchDocuments)
			// In a real app, you might fetch directly by ID if not already loaded
			const document = get().documents.find(doc => doc.id === documentId);

			if (!document) {
				// Attempt to fetch all documents again if not found, or handle error
				await get().fetchDocuments();
				const potentiallyLoadedDoc = get().documents.find(doc => doc.id === documentId);
				if (!potentiallyLoadedDoc) {
					 throw new Error("Document not found");
				}
				 set({ currentDocument: potentiallyLoadedDoc, isLoading: false });
				 return;
			}

			// Simulate API delay if needed (or remove if just reading from state)
			// await new Promise((resolve) => setTimeout(resolve, 100));

			set({ currentDocument: document, isLoading: false });
		} catch (error) {
			console.error("Failed to fetch document", error);
			set({ error: "Failed to fetch document", isLoading: false });
		}
	},
	
	uploadDocument: async (document) => {
		set({ isLoading: true, error: null });
		try {
			// Mock API call - Ensure the backend saves the projectId
			await new Promise((resolve) => setTimeout(resolve, 1000));

			const newDocument: Document = {
				...document, // contains projectId from the form
				id: `doc-${Date.now()}`,
				uploadedAt: new Date().toISOString(),
				version: 1,
				aiProcessed: false,
				commentCount: 0,
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

	processDocumentWithAI: async (documentId: string) => {
		set({ isProcessing: true, error: null });
		try {
			// Mock AI processing
			await new Promise(resolve => setTimeout(resolve, 2000));
			
			// Generate mock AI analysis results
			const aiSummary = "This document contains information about the project specifications and requirements.";
			const aiKeywords = ["construction", "specifications", "requirements", "design"];
			const aiCategories = ["specifications", "requirements"];
			
			set(state => ({
				documents: state.documents.map(doc => 
					doc.id === documentId ? { 
						...doc, 
						aiProcessed: true,
						aiSummary,
						aiKeywords,
						aiCategories
					} : doc
				),
				isProcessing: false
			}));
			
		} catch (error) {
			console.error("Failed to process document with AI", error);
			set({ error: "Failed to process document with AI", isProcessing: false });
		}
	},

	// Add a method to fetch comments for a document
	fetchComments: async (documentId: string) => {
		set({ isLoading: true, error: null });
		try {
			// Mock API call to get comments
			await new Promise((resolve) => setTimeout(resolve, 500));
			
			// Generate mock comments for the document
			const mockComments: DocumentComment[] = [
				{
					id: "comment-1",
					documentId,
					userId: "user-2",
					userName: "Jane Smith",
					userAvatar: "/avatars/jane.png",
					content: "Please review the door dimensions on page 3. They seem inconsistent with the architectural specifications.",
					createdAt: "2023-09-17T14:30:00Z",
					pageNumber: 3,
					resolved: false,
				},
				{
					id: "comment-2",
					documentId,
					userId: "user-3",
					userName: "Mike Johnson",
					userAvatar: "/avatars/mike.png",
					content: "The electrical load calculations need to be updated based on the revised equipment schedule.",
					createdAt: "2023-09-18T09:45:00Z",
					resolved: true,
				},
				{
					id: "comment-3",
					documentId,
					userId: "user-1",
					userName: "Alex Brown",
					userAvatar: "/avatars/alex.png",
					content: "I've updated the calculations as requested.",
					createdAt: "2023-09-18T11:20:00Z",
					parentId: "comment-2",
					resolved: true,
				},
			];
			
			set(state => ({
				comments: {
					...state.comments,
					[documentId]: mockComments
				},
				isLoading: false
			}));
		} catch (error) {
			console.error("Failed to fetch comments", error);
			set({ error: "Failed to fetch comments", isLoading: false });
		}
	},

	addComment: async (comment) => {
		set({ isLoading: true, error: null });
		try {
			// Mock API call
			await new Promise((resolve) => setTimeout(resolve, 300));
			
			const newComment: DocumentComment = {
				...comment,
				id: `comment-${Date.now()}`,
				createdAt: new Date().toISOString(),
				resolved: false,
			};
			
			set(state => {
				// Update comments array
				const documentComments = state.comments[comment.documentId] || [];
				const updatedComments = {
					...state.comments,
					[comment.documentId]: [...documentComments, newComment]
				};
				
				// Update comment count on the document
				const updatedDocuments = state.documents.map(doc => 
					doc.id === comment.documentId ? { 
						...doc, 
						commentCount: doc.commentCount + 1
					} : doc
				);
				
				return {
					comments: updatedComments,
					documents: updatedDocuments,
					isLoading: false
				};
			});
		} catch (error) {
			console.error("Failed to add comment", error);
			set({ error: "Failed to add comment", isLoading: false });
		}
	},

	updateComment: async (commentId, content) => {
		set({ isLoading: true, error: null });
		try {
			// Mock API call
			await new Promise((resolve) => setTimeout(resolve, 300));
			
			set(state => {
				const updatedComments = { ...state.comments };
				
				// Find and update the comment
				Object.keys(updatedComments).forEach(documentId => {
					updatedComments[documentId] = updatedComments[documentId].map(comment => 
						comment.id === commentId ? {
							...comment,
							content,
							updatedAt: new Date().toISOString()
						} : comment
					);
				});
				
				return {
					comments: updatedComments,
					isLoading: false
				};
			});
		} catch (error) {
			console.error("Failed to update comment", error);
			set({ error: "Failed to update comment", isLoading: false });
		}
	},

	deleteComment: async (commentId) => {
		set({ isLoading: true, error: null });
		try {
			// Mock API call
			await new Promise((resolve) => setTimeout(resolve, 300));
			
			set(state => {
				const updatedComments = { ...state.comments };
				let documentId: string | null = null;
				
				// Find document ID and remove comment
				Object.keys(updatedComments).forEach(docId => {
					const initialLength = updatedComments[docId].length;
					updatedComments[docId] = updatedComments[docId].filter(
						comment => comment.id !== commentId && comment.parentId !== commentId
					);
					
					// If comments were removed, this is the document we need to update
					if (initialLength > updatedComments[docId].length) {
						documentId = docId;
					}
				});
				
				// If we found and removed comments, update the document's comment count
				const updatedDocuments = documentId ? state.documents.map(doc => 
					doc.id === documentId ? { 
						...doc, 
						commentCount: updatedComments[documentId].length
					} : doc
				) : state.documents;
				
				return {
					comments: updatedComments,
					documents: updatedDocuments,
					isLoading: false
				};
			});
		} catch (error) {
			console.error("Failed to delete comment", error);
			set({ error: "Failed to delete comment", isLoading: false });
		}
	},

	resolveComment: async (commentId, resolved) => {
		set({ isLoading: true, error: null });
		try {
			// Mock API call
			await new Promise((resolve) => setTimeout(resolve, 300));
			
			set(state => {
				const updatedComments = { ...state.comments };
				
				// Find and update the comment
				Object.keys(updatedComments).forEach(documentId => {
					updatedComments[documentId] = updatedComments[documentId].map(comment => 
						comment.id === commentId ? {
							...comment,
							resolved,
							updatedAt: new Date().toISOString()
						} : comment
					);
				});
				
				return {
					comments: updatedComments,
					isLoading: false
				};
			});
		} catch (error) {
			console.error("Failed to resolve comment", error);
			set({ error: "Failed to resolve comment", isLoading: false });
		}
	},
	
	updateDocument: async (id, updates) => {
		set({ isLoading: true, error: null });
		try {
			// Mock API call
			await new Promise((resolve) => setTimeout(resolve, 500));

			set((state) => ({
				documents: state.documents.map((d) =>
					d.id === id ? { ...d, ...updates } : d,
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

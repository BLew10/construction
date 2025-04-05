import { z } from "zod";

export const issueStatusSchema = z.enum(["Open", "InProgress", "Resolved", "Closed"]);
export const issuePrioritySchema = z.enum(["Low", "Medium", "High", "Critical"]);

export const issueSchema = z.object({
	id: z.string().optional(), // Optional for creation
	projectId: z.string().min(1, "Project is required"), // Link to the project
	title: z.string().min(3, "Title must be at least 3 characters").max(255),
	description: z.string().optional(),
	status: issueStatusSchema.default("Open"),
	priority: issuePrioritySchema.default("Medium"),
	assigneeId: z.string().optional(), // Link to user ID
	reporterId: z.string().optional(), // Link to user ID
	createdAt: z.date().optional().default(() => new Date()),
	updatedAt: z.date().optional(),
});

export type Issue = z.infer<typeof issueSchema> & {
	// Add related data fetched separately if needed
	projectName?: string;
	assigneeName?: string;
	reporterName?: string;
};

// Schema for the form data
export const issueFormSchema = issueSchema.omit({
	id: true, // Handled separately
	createdAt: true,
	updatedAt: true,
	reporterId: true, // Usually set automatically
}).extend({
	// Keep projectId for selection in the form
	projectId: z.string().min(1, "Please select a project"),
});

export type IssueFormData = z.infer<typeof issueFormSchema>;


// --- API Response/Store Types ---
export interface IssuesState {
	issues: Issue[];
	isLoading: boolean;
	error: string | null;
	fetchIssues: () => Promise<void>;
	createIssue: (issueData: Omit<Issue, 'id' | 'createdAt' | 'updatedAt' | 'reporterName' | 'assigneeName' | 'projectName'>) => Promise<Issue | null>;
	// Add update/delete later if needed
} 
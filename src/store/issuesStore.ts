import { create } from 'zustand';
import { Issue, IssuesState } from '@/types/issue';
import { Project } from '@/types/project'; // Assuming you have a Project type

// --- Mock API Calls (Replace with actual API calls) ---
const delay = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

// Mock projects to link issues (replace with actual project data source)
const mockProjects: Pick<Project, 'id' | 'name'>[] = [
	{ id: 'proj-1', name: 'Downtown Office Build' },
	{ id: 'proj-2', name: 'Residential Complex Phase 1' },
	{ id: 'proj-3', name: 'Bridge Renovation' },
];

// Mock users (replace with actual user data source)
const mockUsers = [
    { id: 'user-1', name: 'Alice Johnson' },
    { id: 'user-2', name: 'Bob Williams' },
    { id: 'user-3', name: 'Charlie Brown' },
];

const mockApi = {
	issues: [
		{ id: 'iss-1', projectId: 'proj-1', title: 'Leaking pipe in basement', status: 'Open', priority: 'High', assigneeId: 'user-1', reporterId: 'user-2', createdAt: new Date('2023-11-01T10:00:00Z') },
		{ id: 'iss-2', projectId: 'proj-2', title: 'Permit application delayed', status: 'InProgress', priority: 'Medium', assigneeId: 'user-2', reporterId: 'user-1', createdAt: new Date('2023-11-05T14:30:00Z') },
		{ id: 'iss-3', projectId: 'proj-1', title: 'Incorrect window size delivered', status: 'Open', priority: 'Medium', reporterId: 'user-3', createdAt: new Date('2023-11-10T09:15:00Z') },
		{ id: 'iss-4', projectId: 'proj-3', title: 'Safety railing installation needed', status: 'Resolved', priority: 'High', assigneeId: 'user-1', reporterId: 'user-2', createdAt: new Date('2023-10-25T16:00:00Z'), updatedAt: new Date('2023-11-08T11:00:00Z') },
		{ id: 'iss-5', projectId: 'proj-2', title: 'Client requested change to floor plan', status: 'Closed', priority: 'Low', assigneeId: 'user-2', reporterId: 'user-1', createdAt: new Date('2023-10-15T11:00:00Z'), updatedAt: new Date('2023-10-20T17:00:00Z') },
	] as Issue[],
	nextIssueId: 6,

	async fetchIssues(): Promise<Issue[]> {
		await delay(600);
		console.log("[Mock API] Fetching all issues");
		// Simulate joining data
		return this.issues.map(issue => ({
			...issue,
			projectName: mockProjects.find(p => p.id === issue.projectId)?.name ?? 'Unknown Project',
            assigneeName: mockUsers.find(u => u.id === issue.assigneeId)?.name,
            reporterName: mockUsers.find(u => u.id === issue.reporterId)?.name ?? 'System',
		}));
	},

	async createIssue(issueData: Omit<Issue, 'id' | 'createdAt' | 'updatedAt' | 'reporterName' | 'assigneeName' | 'projectName'>): Promise<Issue> {
		await delay(400);
		const newIssue: Issue = {
			...issueData,
			id: `iss-${this.nextIssueId++}`,
			createdAt: new Date(),
			// Simulate joining data for the response
			projectName: mockProjects.find(p => p.id === issueData.projectId)?.name ?? 'Unknown Project',
            assigneeName: mockUsers.find(u => u.id === issueData.assigneeId)?.name,
            reporterName: mockUsers.find(u => u.id === issueData.reporterId)?.name ?? 'System', // Assuming reporter is set
		};
		console.log("[Mock API] Creating Issue:", newIssue);
		this.issues.push(newIssue); // Add to the base list
		return newIssue;
	},
};
// --- End Mock API Calls ---

export const useIssuesStore = create<IssuesState>((set) => ({
	issues: [],
	isLoading: false,
	error: null,

	fetchIssues: async () => {
		set({ isLoading: true, error: null });
		try {
			const data = await mockApi.fetchIssues();
			set({ issues: data, isLoading: false });
		} catch (err) {
			console.error("Failed to fetch issues:", err);
			set({ isLoading: false, error: err instanceof Error ? err.message : "Failed to load issues" });
		}
	},

	createIssue: async (issueData) => {
		set({ isLoading: true }); // Indicate loading state potentially on the form button
		try {
			const newIssue = await mockApi.createIssue(issueData);
			set((state) => ({
				issues: [...state.issues, newIssue],
				isLoading: false, // Reset loading state
			}));
			return newIssue;
		} catch (err) {
			console.error("Failed to create issue:", err);
			set({ isLoading: false, error: err instanceof Error ? err.message : "Failed to create issue" });
			return null;
		}
	},
})); 
import { create } from 'zustand';
import { TeamMember, TeamState } from '@/types/team';

// --- Mock API Calls (Replace with actual API calls) ---
const delay = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

const mockApi = {
	members: [
		{ id: 'user-1', name: 'Alice Johnson', email: 'alice@example.com', role: 'Project Manager' },
		{ id: 'user-2', name: 'Bob Williams', email: 'bob@example.com', role: 'Engineer' },
		{ id: 'user-3', name: 'Charlie Brown', email: 'charlie@example.com', role: 'Architect' },
	] as TeamMember[],
	nextMemberId: 4,

	async fetchMembers(): Promise<TeamMember[]> {
		await delay(600);
		console.log("[Mock API] Fetching all team members");
		return this.members;
	},

	async createMember(memberData: Omit<TeamMember, 'id'>): Promise<TeamMember> {
		await delay(400);
		const newMember: TeamMember = {
			...memberData,
			id: `user-${this.nextMemberId++}`,
		};
		console.log("[Mock API] Creating Team Member:", newMember);
		this.members.push(newMember); // Add to the base list
		return newMember;
	},

	async deleteMember(memberId: string): Promise<boolean> {
		await delay(400);
		const index = this.members.findIndex(member => member.id === memberId);
		if (index !== -1) {
			this.members.splice(index, 1);
			console.log("[Mock API] Deleted Team Member:", memberId);
			return true;
		}
		return false;
	},
};
// --- End Mock API Calls ---

export const useTeamStore = create<TeamState>((set) => ({
	members: [],
	isLoading: false,
	error: null,

	fetchMembers: async () => {
		set({ isLoading: true, error: null });
		try {
			const data = await mockApi.fetchMembers();
			set({ members: data, isLoading: false });
		} catch (err) {
			console.error("Failed to fetch team members:", err);
			set({ isLoading: false, error: err instanceof Error ? err.message : "Failed to load team members" });
		}
	},

	createMember: async (memberData) => {
		set({ isLoading: true });
		try {
			const newMember = await mockApi.createMember(memberData);
			set((state) => ({
				members: [...state.members, newMember],
				isLoading: false,
			}));
			return newMember;
		} catch (err) {
			console.error("Failed to create team member:", err);
			set({ isLoading: false, error: err instanceof Error ? err.message : "Failed to create team member" });
			return null;
		}
	},

	deleteMember: async (memberId) => {
		set({ isLoading: true });
		try {
			const success = await mockApi.deleteMember(memberId);
			if (success) {
				set((state) => ({
					members: state.members.filter(member => member.id !== memberId),
					isLoading: false,
				}));
			} else {
				set({ isLoading: false, error: "Delete failed" });
			}
			return success;
		} catch (err) {
			console.error("Failed to delete team member:", err);
			set({ isLoading: false, error: err instanceof Error ? err.message : "Failed to delete team member" });
			return false;
		}
	},
})); 
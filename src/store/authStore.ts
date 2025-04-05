import { create } from "zustand";
import { persist } from "zustand/middleware";

export type UserRole =
	| "generalContractor"
	| "subcontractor"
	| "client"
	| "admin";

export interface User {
	id: string;
	email: string;
	avatarUrl: string;
	name: string;
	role: UserRole;
	companyId: string;
	companyName: string;
}

// TODO: Remove this mock user
export const mockUser: User = {
	id: "mock-user-id-123",
	email: "mock.user@example.com",
	avatarUrl: "https://via.placeholder.com/150", // Placeholder image URL
	name: "Mock User",
	role: "admin", // Default role, adjust as needed
	companyId: "mock-company-id-456",
	companyName: "Mock Company LLC",
};

interface AuthState {
	user: User | null;
	isAuthenticated: boolean;
	token: string | null;
	login: (userData: User, token: string) => void;
	logout: () => void;
}

export const useAuthStore = create<AuthState>()(
	persist(
		(set) => ({
			user: mockUser,
			isAuthenticated: true,
			token: "mock-token-123",
			login: (userData: User, token: string) =>
				set({
					user: userData,
					isAuthenticated: true,
					token,
				}),
			logout: () =>
				set({
					user: null,
					isAuthenticated: false,
					token: null,
				}),
		}),
		{
			name: "auth-storage",
		},
	),
);

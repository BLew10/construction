import { create } from "zustand";
import { persist } from "zustand/middleware";

export type UserRole =
	| "generalContractor"
	| "subcontractor"
	| "client"
	| "admin";

interface User {
	id: string;
	email: string;
	name: string;
	role: UserRole;
	companyId: string;
	companyName: string;
}

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
			user: null,
			isAuthenticated: true,
			token: null,
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

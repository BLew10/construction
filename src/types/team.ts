import { z } from "zod";

export const teamMemberSchema = z.object({
  id: z.string().optional(), // Optional for creation
  name: z.string().min(3, "Name must be at least 3 characters").max(255),
  email: z.string().email("Invalid email address"),
  role: z.string().min(1, "Role is required"),
});

export type TeamMember = z.infer<typeof teamMemberSchema>;

// Schema for the form data
export const teamMemberFormSchema = teamMemberSchema.omit({
  id: true, // Handled separately
});

export type TeamMemberFormData = z.infer<typeof teamMemberFormSchema>;

// --- API Response/Store Types ---
export interface TeamState {
  members: TeamMember[];
  isLoading: boolean;
  error: string | null;
  fetchMembers: () => Promise<void>;
  createMember: (
    memberData: Omit<TeamMember, "id">
  ) => Promise<TeamMember | null>;
  deleteMember: (memberId: string) => Promise<boolean>;
}

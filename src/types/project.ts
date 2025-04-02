import { Task } from "@/store/tasksStore";
import { z } from "zod";
export interface Project {
	// Basic Information
	id: string;
	name: string;
	projectCode?: string;
	description?: string;

	// Location & Site Information
	address: string;
	city?: string;
	state?: string;
	zipCode?: string;
	notes?: string;

	// Timeline
	startDate: string;
	endDate: string;
	actualStartDate?: string;
	actualEndDate?: string;

	// Status & Classification
	status: "planning" | "active" | "completed" | "onHold";
	phase?: "initiation" | "planning" | "execution" | "monitoring" | "closing";
	projectType?:
		| "commercial"
		| "residential"
		| "industrial"
		| "infrastructure"
		| "other";
	priority?: "low" | "medium" | "high" | "critical";

	// Financial Information
	budget: number;
	actualCost?: number;
	contingencyBudget?: number;
	contractType?: "fixedPrice" | "timeAndMaterials" | "costPlus" | "unitPrice";

	// Stakeholders
	clientId: string;
	clientContactId?: string;
	projectManagerId?: string;
	generalContractorId?: string;

	// Additional Information
	permitNumbers?: string[];
	tags?: string[];

	// Administrative
	createdBy?: string;
	createdAt?: string;
	updatedBy?: string;
	updatedAt?: string;
	tasks?: Task[];
}


export const projectFormSchema = z.object({
	name: z.string().min(2, { message: "Project name must be at least 2 characters" }),
	address: z.string().min(5, { message: "Address must be at least 5 characters" }),
	description: z.string().optional(),
	status: z.enum(["planning", "active", "completed", "onHold"]),
	startDate: z.date(),
	endDate: z.date(),
	budget: z.string().refine((val) => !isNaN(Number(val)) && Number(val) > 0, {
		message: "Budget must be a positive number",
	}),
	clientId: z.string().min(1, { message: "Please select a client" }),
	projectType: z.enum(["commercial", "residential", "industrial", "infrastructure", "other"]).optional(),
	phase: z.enum(["initiation", "planning", "execution", "monitoring", "closing"]).optional(),
	projectManagerId: z.string().optional(),
	contingencyBudget: z.string().optional().refine((val) => !val || (!isNaN(Number(val)) && Number(val) >= 0), {
		message: "Contingency budget must be a positive number",
	}),
});
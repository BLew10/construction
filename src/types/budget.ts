import { z } from "zod";

// --- Cost Item ---
export const costItemSchema = z.object({
	id: z.string().optional(), // Optional for creation
	projectId: z.string(),
	category: z.string().min(1, "Category is required"),
	description: z.string().min(1, "Description is required"),
	budgeted: z.number().positive("Budgeted amount must be positive"),
	actual: z.number().min(0, "Actual amount cannot be negative").optional().default(0), // Can start at 0
	// variance is calculated, not stored directly usually
});

export type CostItem = z.infer<typeof costItemSchema> & {
	// Add calculated fields if needed outside the schema
	variance?: number;
};

// --- Change Order ---
export const changeOrderSchema = z.object({
	id: z.string().optional(), // Optional for creation
	projectId: z.string(),
	name: z.string().min(3, "Change order name is required"),
	description: z.string().optional(),
	status: z.enum(["Pending", "Approved", "Rejected"]),
	costImpact: z.number(), // Can be positive or negative
	dateSubmitted: z.date().optional().default(() => new Date()),
	dateApproved: z.date().optional(),
});

export type ChangeOrder = z.infer<typeof changeOrderSchema> & {
	id: string; // Make id required, not optional
};

// --- API Response/Store Types (Example) ---
export interface BudgetState {
	costItems: CostItem[];
	changeOrders: ChangeOrder[];
	isLoading: boolean;
	error: string | null;
	fetchBudgetData: (projectId: string) => Promise<void>;
	createCostItem: (itemData: Omit<CostItem, 'id' | 'variance'>) => Promise<CostItem | null>;
	updateCostItem: (itemId: string, itemData: Partial<Omit<CostItem, 'id' | 'projectId' | 'variance'>>) => Promise<CostItem | null>;
	deleteCostItem: (itemId: string) => Promise<boolean>;
	createChangeOrder: (orderData: Omit<ChangeOrder, 'id'>) => Promise<ChangeOrder | null>;
	updateChangeOrder: (orderId: string, orderData: Partial<Omit<ChangeOrder, 'id' | 'projectId'>>) => Promise<ChangeOrder | null>;
	deleteChangeOrder: (orderId: string) => Promise<boolean>;
} 
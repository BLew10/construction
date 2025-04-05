import { create } from "zustand";
import { CostItem, ChangeOrder, BudgetState } from "@/types/budget";

// --- Mock API Calls (Replace with actual API calls) ---
// Simulate API delay
const delay = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));

const mockApi = {
  // In-memory storage for demo
  costItems: [
    {
      id: "ci1",
      projectId: "proj-1",
      category: "Labor",
      description: "Framing Crew",
      budgeted: 50000,
      actual: 48500,
    },
    {
      id: "ci2",
      projectId: "proj-1",
      category: "Materials",
      description: "Lumber",
      budgeted: 35000,
      actual: 36200,
    },
    {
      id: "ci3",
      projectId: "proj-1",
      category: "Subcontractor",
      description: "Electrician",
      budgeted: 20000,
      actual: 20000,
    },
    {
      id: "ci4",
      projectId: "proj-2",
      category: "Permits",
      description: "Building Permit",
      budgeted: 1500,
      actual: 1450,
    },
    {
      id: "ci5",
      projectId: "proj-2",
      category: "Materials",
      description: "Concrete",
      budgeted: 18000,
      actual: 19500,
    },
  ] as CostItem[], // Add initial cost items
  changeOrders: [
    {
      id: "co1",
      projectId: "proj-1",
      name: "Client Upgrade: Kitchen Countertops",
      status: "Approved",
      costImpact: 4500,
      dateSubmitted: new Date("2023-10-15"),
      dateApproved: new Date("2023-10-20"),
    },
    {
      id: "co2",
      projectId: "proj-1",
      name: "Weather Delay Impact",
      status: "Pending",
      costImpact: 1200,
      dateSubmitted: new Date("2023-11-01"),
    },
    {
      id: "co3",
      projectId: "proj-2",
      name: "Value Engineering: HVAC",
      status: "Approved",
      costImpact: -2500,
      dateSubmitted: new Date("2023-09-05"),
      dateApproved: new Date("2023-09-10"),
    },
  ] as ChangeOrder[], // Add initial change orders
  nextCostItemId: 6, // Start next ID after existing ones
  nextChangeOrderId: 4, // Start next ID after existing ones

  async fetchBudgetData(
    projectId: string
  ): Promise<{ costItems: CostItem[]; changeOrders: ChangeOrder[] }> {
    await delay(500);
    console.log(`[Mock API] Fetching budget data for project ${projectId}`);
    // Filter mock data by projectId
    const projectCostItems = this.costItems
      .filter((ci) => ci.projectId === projectId)
      .map((ci) => ({ ...ci, variance: (ci.actual ?? 0) - ci.budgeted })); // Calculate variance
    const projectChangeOrders = this.changeOrders.filter(
      (co) => co.projectId === projectId
    );
    return {
      costItems: projectCostItems,
      changeOrders: projectChangeOrders,
    };
  },

  async createCostItem(
    itemData: Omit<CostItem, "id" | "variance">
  ): Promise<CostItem> {
    await delay(300);
    const newItem: CostItem = {
      ...itemData,
      id: `ci${this.nextCostItemId++}`,
      actual: itemData.actual ?? 0, // Ensure actual is set
    };
    console.log("[Mock API] Creating Cost Item:", newItem);
    this.costItems.push(newItem);
    return { ...newItem, variance: (newItem.actual ?? 0) - newItem.budgeted };
  },

  async updateCostItem(
    itemId: string,
    itemData: Partial<Omit<CostItem, 'id' | 'projectId' | 'variance'>>
  ): Promise<CostItem | null> {
    await delay(300);
    const index = this.costItems.findIndex(item => item.id === itemId);
    if (index !== -1) {
      // itemData is already guaranteed not to have projectId due to the type Omit<..., 'projectId'>
      // So, we can directly merge itemData without destructuring projectId out.
      this.costItems[index] = { ...this.costItems[index], ...itemData };
      console.log("[Mock API] Updating Cost Item:", this.costItems[index]);
      const updatedItem = this.costItems[index];
      return { ...updatedItem, variance: (updatedItem.actual ?? 0) - updatedItem.budgeted };
    }
    console.warn(`[Mock API] Update Cost Item failed: ID ${itemId} not found`);
    return null;
  },

  async deleteCostItem(itemId: string): Promise<boolean> {
    await delay(300);
    const initialLength = this.costItems.length;
    this.costItems = this.costItems.filter((item) => item.id !== itemId);
    const success = this.costItems.length < initialLength;
    console.log(
      `[Mock API] Deleting Cost Item ${itemId}: ${
        success ? "Success" : "Failed (Not Found)"
      }`
    );
    return success;
  },

  async createChangeOrder(
    orderData: Omit<ChangeOrder, "id">
  ): Promise<ChangeOrder> {
    await delay(300);
    const newOrder: ChangeOrder = {
      ...orderData,
      id: `co${this.nextChangeOrderId++}`,
      // Ensure dates are Date objects if passed, otherwise use default
      dateSubmitted:
        orderData.dateSubmitted instanceof Date
          ? orderData.dateSubmitted
          : new Date(),
      dateApproved:
        orderData.dateApproved instanceof Date
          ? orderData.dateApproved
          : undefined,
    };
    console.log("[Mock API] Creating Change Order:", newOrder);
    this.changeOrders.push(newOrder);
    return newOrder;
  },

  async updateChangeOrder(
    orderId: string,
    orderData: Partial<Omit<ChangeOrder, "id" | "projectId">>
  ): Promise<ChangeOrder | null> {
    await delay(300);
    const index = this.changeOrders.findIndex((order) => order.id === orderId);
    if (index !== -1) {
      // Ensure dates are Date objects if passed
      const validatedUpdateData = {
        ...orderData,
        dateSubmitted:
          orderData.dateSubmitted instanceof Date
            ? orderData.dateSubmitted
            : this.changeOrders[index].dateSubmitted,
        dateApproved:
          orderData.dateApproved instanceof Date
            ? orderData.dateApproved
            : orderData.dateApproved === null
            ? undefined
            : this.changeOrders[index].dateApproved, // Allow setting to undefined/null
      };
      this.changeOrders[index] = {
        ...this.changeOrders[index],
        ...validatedUpdateData,
      };
      console.log(
        "[Mock API] Updating Change Order:",
        this.changeOrders[index]
      );
      return this.changeOrders[index];
    }
    console.warn(
      `[Mock API] Update Change Order failed: ID ${orderId} not found`
    );
    return null;
  },

  async deleteChangeOrder(orderId: string): Promise<boolean> {
    await delay(300);
    const initialLength = this.changeOrders.length;
    this.changeOrders = this.changeOrders.filter(
      (order) => order.id !== orderId
    );
    const success = this.changeOrders.length < initialLength;
    console.log(
      `[Mock API] Deleting Change Order ${orderId}: ${
        success ? "Success" : "Failed (Not Found)"
      }`
    );
    return success;
  },
};
// --- End Mock API Calls ---

export const useBudgetStore = create<BudgetState>((set, get) => ({
  costItems: [],
  changeOrders: [],
  isLoading: false,
  error: null,

  fetchBudgetData: async (projectId) => {
    set({ isLoading: true, error: null });
    try {
      const data = await mockApi.fetchBudgetData(projectId);
      set({
        costItems: data.costItems,
        changeOrders: data.changeOrders,
        isLoading: false,
      });
    } catch (err) {
      console.error("Failed to fetch budget data:", err);
      set({
        isLoading: false,
        error: err instanceof Error ? err.message : "Failed to load data",
      });
    }
  },

  createCostItem: async (itemData) => {
    set({ isLoading: true });
    try {
      const newItem = await mockApi.createCostItem(itemData);
      set((state) => ({
        costItems: [...state.costItems, newItem],
        isLoading: false,
      }));
      return newItem;
    } catch (err) {
      console.error("Failed to create cost item:", err);
      set({
        isLoading: false,
        error: err instanceof Error ? err.message : "Failed to create",
      });
      return null;
    }
  },

  updateCostItem: async (itemId, itemData) => {
    set({ isLoading: true });
    try {
      const updatedItem = await mockApi.updateCostItem(itemId, itemData);
      if (updatedItem) {
        set((state) => ({
          costItems: state.costItems.map((item) =>
            item.id === itemId ? updatedItem : item
          ),
          isLoading: false,
        }));
      } else {
        set({ isLoading: false, error: "Update failed: Item not found" });
      }
      return updatedItem;
    } catch (err) {
      console.error("Failed to update cost item:", err);
      set({
        isLoading: false,
        error: err instanceof Error ? err.message : "Failed to update",
      });
      return null;
    }
  },

  deleteCostItem: async (itemId) => {
    set({ isLoading: true });
    try {
      const success = await mockApi.deleteCostItem(itemId);
      if (success) {
        set((state) => ({
          costItems: state.costItems.filter((item) => item.id !== itemId),
          isLoading: false,
        }));
      } else {
        set({ isLoading: false, error: "Delete failed" });
      }
      return success;
    } catch (err) {
      console.error("Failed to delete cost item:", err);
      set({
        isLoading: false,
        error: err instanceof Error ? err.message : "Failed to delete",
      });
      return false;
    }
  },

  createChangeOrder: async (orderData) => {
    set({ isLoading: true });
    try {
      const newOrder = await mockApi.createChangeOrder(orderData);
      set((state) => ({
        changeOrders: [...state.changeOrders, newOrder],
        isLoading: false,
      }));
      return newOrder;
    } catch (err) {
      console.error("Failed to create change order:", err);
      set({
        isLoading: false,
        error: err instanceof Error ? err.message : "Failed to create",
      });
      return null;
    }
  },

  updateChangeOrder: async (orderId, orderData) => {
    set({ isLoading: true });
    try {
      const updatedOrder = await mockApi.updateChangeOrder(orderId, orderData);
      if (updatedOrder) {
        set((state) => ({
          changeOrders: state.changeOrders.map((order) =>
            order.id === orderId ? updatedOrder : order
          ),
          isLoading: false,
        }));
      } else {
        set({ isLoading: false, error: "Update failed: Order not found" });
      }
      return updatedOrder;
    } catch (err) {
      console.error("Failed to update change order:", err);
      set({
        isLoading: false,
        error: err instanceof Error ? err.message : "Failed to update",
      });
      return null;
    }
  },

  deleteChangeOrder: async (orderId) => {
    set({ isLoading: true });
    try {
      const success = await mockApi.deleteChangeOrder(orderId);
      if (success) {
        set((state) => ({
          changeOrders: state.changeOrders.filter(
            (order) => order.id !== orderId
          ),
          isLoading: false,
        }));
      } else {
        set({ isLoading: false, error: "Delete failed" });
      }
      return success;
    } catch (err) {
      console.error("Failed to delete change order:", err);
      set({
        isLoading: false,
        error: err instanceof Error ? err.message : "Failed to delete",
      });
      return false;
    }
  },
}));

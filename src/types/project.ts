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
}

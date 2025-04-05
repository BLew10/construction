import { SearchIcon } from "lucide-react";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { DocumentType, DocumentStatus } from "@/store/documentsStore";
import { Project } from "@/types/project"; // Import Project type

// Updated Filters interface (can be removed if defined in parent)
interface Filters {
  projectId: "all" | string;
  type: "all" | DocumentType;
  status: "all" | DocumentStatus;
  search: string;
}

interface DocumentFiltersProps {
  filters: Filters;
  setFilters: (filters: Filters) => void;
  projects: Project[]; // Receive projects list
}

export function DocumentFilters({ filters, setFilters, projects }: DocumentFiltersProps) {
  const handleFilterChange = <K extends keyof Filters>(key: K, value: Filters[K]) => {
    setFilters({ ...filters, [key]: value });
  };

  // Define available types and statuses (consider moving to constants)
  const documentTypes: DocumentType[] = ["plan", "submittal", "contract", "permit", "rfi", "specification", "drawing", "other"];
  const documentStatuses: DocumentStatus[] = ["draft", "pending", "approved", "rejected"];

  return (
    <div className="space-y-4 mb-6">
      {/* Search field - full width on mobile */}
      <div className="relative w-full">
        <SearchIcon className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
        <Input
          placeholder="Search documents..."
          value={filters.search}
          onChange={(e) => handleFilterChange("search", e.target.value)}
          className="pl-10 w-full"
        />
      </div>

      {/* Filters in a responsive grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
        {/* Project Filter */}
        <Select
          value={filters.projectId}
          onValueChange={(value) => handleFilterChange("projectId", value)}
        >
          <SelectTrigger className="w-full">
            <SelectValue placeholder="Filter by Project" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Projects</SelectItem>
            {projects.map((project) => (
              <SelectItem key={project.id} value={project.id}>
                {project.name}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>

        {/* Type Filter */}
        <Select
          value={filters.type}
          onValueChange={(value) => handleFilterChange("type", value as DocumentType | "all")}
        >
          <SelectTrigger className="w-full">
            <SelectValue placeholder="Filter by Type" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Types</SelectItem>
            {documentTypes.map((type) => (
              <SelectItem key={type} value={type} className="capitalize">
                {type}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>

        {/* Status Filter */}
        <Select
          value={filters.status}
          onValueChange={(value) => handleFilterChange("status", value as DocumentStatus | "all")}
        >
          <SelectTrigger className="w-full">
            <SelectValue placeholder="Filter by Status" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Statuses</SelectItem>
            {documentStatuses.map((status) => (
              <SelectItem key={status} value={status} className="capitalize">
                {status}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>
    </div>
  );
} 
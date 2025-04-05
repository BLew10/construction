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

interface Filters {
  type: "all" | DocumentType;
  status: "all" | DocumentStatus;
  search: string;
}

interface DocumentFiltersProps {
  filters: Filters;
  setFilters: (filters: Filters) => void;
}

export function DocumentFilters({ filters, setFilters }: DocumentFiltersProps) {
  return (
    <div className="flex flex-col space-y-3 md:flex-row md:space-y-0 md:gap-4 mb-4 md:mb-6">
      <div className="relative flex-1">
        <SearchIcon className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
        <Input
          type="search"
          placeholder="Search documents..."
          className="pl-8"
          value={filters.search}
          onChange={(e) => setFilters({ ...filters, search: e.target.value })}
        />
      </div>

      <div className="grid grid-cols-2 gap-3 md:flex md:w-auto">
        <Select
          value={filters.type}
          onValueChange={(value) =>
            setFilters({
              ...filters,
              type: value as "all" | DocumentType,
            })
          }
        >
          <SelectTrigger className="w-full">
            <SelectValue placeholder="Document Type" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Types</SelectItem>
            <SelectItem value="plan">Plans</SelectItem>
            <SelectItem value="submittal">Submittals</SelectItem>
            <SelectItem value="contract">Contracts</SelectItem>
            <SelectItem value="permit">Permits</SelectItem>
            <SelectItem value="rfi">RFIs</SelectItem>
            <SelectItem value="other">Other</SelectItem>
          </SelectContent>
        </Select>

        <Select
          value={filters.status}
          onValueChange={(value) =>
            setFilters({
              ...filters,
              status: value as "all" | DocumentStatus,
            })
          }
        >
          <SelectTrigger className="w-full">
            <SelectValue placeholder="Status" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Statuses</SelectItem>
            <SelectItem value="draft">Draft</SelectItem>
            <SelectItem value="pending">Pending</SelectItem>
            <SelectItem value="approved">Approved</SelectItem>
            <SelectItem value="rejected">Rejected</SelectItem>
          </SelectContent>
        </Select>
      </div>
    </div>
  );
} 
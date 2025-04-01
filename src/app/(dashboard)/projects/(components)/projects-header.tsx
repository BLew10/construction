import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Plus, Search } from "lucide-react";
import { useRouter } from "next/navigation";

interface ProjectsHeaderProps {
  searchQuery: string;
  onSearchChange: (value: string) => void;
}

export function ProjectsHeader({ searchQuery, onSearchChange }: ProjectsHeaderProps) {
  const router = useRouter();

  return (
    <div className="flex items-center justify-between">
      <div className="space-y-1">
        <h1 className="text-3xl font-bold tracking-tight">Projects</h1>
        <p className="text-muted-foreground">
          Manage and monitor all your construction projects
        </p>
      </div>
      <div className="flex items-center space-x-4">
        <div className="relative w-64">
          <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input
            type="search"
            placeholder="Search projects..."
            className="pl-8"
            value={searchQuery}
            onChange={(e) => onSearchChange(e.target.value)}
          />
        </div>
        <Button onClick={() => router.push("/projects/new")}>
          <Plus className="mr-2 h-4 w-4" /> New Project
        </Button>
      </div>
    </div>
  );
} 
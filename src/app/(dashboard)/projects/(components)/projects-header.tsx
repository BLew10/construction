import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Plus, Search } from "lucide-react";
import { useRouter } from "next/navigation";
import { useState } from "react";

interface ProjectsHeaderProps {
  searchQuery: string;
  onSearchChange: (value: string) => void;
}

export function ProjectsHeader({ searchQuery, onSearchChange }: ProjectsHeaderProps) {
  const router = useRouter();
  const [showSearch, setShowSearch] = useState(false);

  return (
    <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
      <div className="space-y-1">
        <h1 className="text-2xl sm:text-3xl font-bold tracking-tight">Projects</h1>
        <p className="text-sm text-muted-foreground sm:text-base">
          Manage and monitor all your construction projects
        </p>
      </div>
      
      {/* Mobile view */}
      <div className="flex items-center space-x-2 sm:hidden">
        {showSearch ? (
          <div className="flex-1 relative">
            <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
            <Input
              type="search"
              placeholder="Search projects..."
              className="pl-8 pr-8 h-9"
              value={searchQuery}
              onChange={(e) => onSearchChange(e.target.value)}
              onBlur={() => {
                if (!searchQuery) setShowSearch(false);
              }}
              autoFocus
            />
            <Button 
              variant="ghost" 
              size="sm" 
              className="absolute right-0 top-0 h-9 px-2"
              onClick={() => {
                onSearchChange("");
                setShowSearch(false);
              }}
            >
              ✕
            </Button>
          </div>
        ) : (
          <>
            <Button 
              variant="outline" 
              size="icon" 
              onClick={() => setShowSearch(true)}
              className="h-9 w-9"
            >
              <Search className="h-4 w-4" />
            </Button>
            <Button 
              className="h-9 flex-1"
              onClick={() => router.push("/projects/new")}
            >
              <Plus className="mr-2 h-4 w-4" /> New Project
            </Button>
          </>
        )}
      </div>

      {/* Desktop view */}
      <div className="hidden sm:flex items-center space-x-4">
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
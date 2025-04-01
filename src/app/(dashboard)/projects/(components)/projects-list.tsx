import { useRouter } from "next/navigation";
import { Project } from "@/types";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { MoreHorizontal } from "lucide-react";
import { format } from "date-fns";

interface ProjectsListProps {
  projects: Project[];
  onDelete: (id: string) => void;
}

export function ProjectsList({ projects, onDelete }: ProjectsListProps) {
  const router = useRouter();

  return (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead>Name</TableHead>
          <TableHead>Status</TableHead>
          <TableHead>Start Date</TableHead>
          <TableHead>End Date</TableHead>
          <TableHead>Budget</TableHead>
          <TableHead></TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {projects.map((project) => (
          <TableRow
            key={project.id}
            className="cursor-pointer"
            onClick={() => router.push(`/projects/${project.id}`)}
          >
            <TableCell className="font-medium">
              {project.name}
              <div className="text-sm text-muted-foreground">
                {project.address}
              </div>
            </TableCell>
            <TableCell>
              <StatusBadge status={project.status} />
            </TableCell>
            <TableCell>
              {format(new Date(project.startDate), "MMM d, yyyy")}
            </TableCell>
            <TableCell>
              {format(new Date(project.endDate), "MMM d, yyyy")}
            </TableCell>
            <TableCell>${project.budget.toLocaleString()}</TableCell>
            <TableCell>
              <DropdownMenu>
                <DropdownMenuTrigger className="h-8 w-8 p-0">
                  <span className="sr-only">Open menu</span>
                  <MoreHorizontal className="h-4 w-4" />
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end">
                  <DropdownMenuItem
                    onClick={(e) => {
                      e.stopPropagation();
                      router.push(`/projects/${project.id}/edit`);
                    }}
                  >
                    Edit
                  </DropdownMenuItem>
                  <DropdownMenuItem
                    className="text-red-600"
                    onClick={(e) => {
                      e.stopPropagation();
                      onDelete(project.id);
                    }}
                  >
                    Delete
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  );
}

function StatusBadge({ status }: { status: Project["status"] }) {
  const statusConfig = {
    planning: { label: "Planning", variant: "outline" as const },
    active: { label: "Active", variant: "default" as const },
    completed: { label: "Completed", variant: "secondary" as const },
    onHold: { label: "On Hold", variant: "destructive" as const },
  };

  const config = statusConfig[status];
  return <Badge variant={config.variant}>{config.label}</Badge>;
} 
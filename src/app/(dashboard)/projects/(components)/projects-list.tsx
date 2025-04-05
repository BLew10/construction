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
import { MoreHorizontal, Calendar, DollarSign } from "lucide-react";
import { format } from "date-fns";
import { Card } from "@/components/ui/card";
import { useMediaQuery } from "@/hooks/use-media-query";

interface ProjectsListProps {
  projects: Project[];
  onDelete: (id: string) => void;
}

export function ProjectsList({ projects, onDelete }: ProjectsListProps) {
  const router = useRouter();
  const isDesktop = useMediaQuery("(min-width: 768px)");

  if (projects.length === 0) {
    return (
      <div className="py-6 text-center text-muted-foreground">
        No projects found. Create a new project to get started.
      </div>
    );
  }

  // Mobile card view component
  const MobileCardView = () => (
    <div className="md:hidden grid gap-3 p-2">
      {projects.map((project) => (
        <Card
          key={project.id}
          className="cursor-pointer p-4 hover:bg-muted/50 transition-colors"
          onClick={() => router.push(`/projects/${project.id}`)}
        >
          <div className="flex justify-between items-start">
            <div className="flex-1">
              <h3 className="font-medium text-base mb-1">{project.name}</h3>
              <p className="text-sm text-muted-foreground mb-3">{project.address}</p>
              
              <div className="space-y-2">
                <div className="flex items-center text-sm">
                  <StatusBadge status={project.status} />
                </div>
                
                <div className="flex items-center text-sm">
                  <Calendar className="h-3.5 w-3.5 mr-1.5" />
                  <span className="text-muted-foreground">Start:</span>
                  <span className="ml-1">
                    {format(new Date(project.startDate), "MMM d, yyyy")}
                  </span>
                </div>
                
                <div className="flex items-center text-sm">
                  <DollarSign className="h-3.5 w-3.5 mr-1.5" />
                  <span className="text-muted-foreground">Budget:</span>
                  <span className="ml-1">${project.budget.toLocaleString()}</span>
                </div>
              </div>
            </div>
            
            <DropdownMenu>
              <DropdownMenuTrigger className="h-8 w-8 p-0" onClick={(e) => e.stopPropagation()}>
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
          </div>
        </Card>
      ))}
    </div>
  );

  // Table view (for desktop)
  return (
    <>
      <MobileCardView />
      
      <div className="hidden md:block">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Name</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>Start Date</TableHead>
              <TableHead>End Date</TableHead>
              <TableHead>Budget</TableHead>
              <TableHead className="w-10"></TableHead>
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
                    <DropdownMenuTrigger className="h-8 w-8 p-0" onClick={(e) => e.stopPropagation()}>
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
      </div>
    </>
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
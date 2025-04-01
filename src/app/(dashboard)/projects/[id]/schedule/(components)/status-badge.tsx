import { Badge } from "@/components/ui/badge";

type TaskStatus = "completed" | "inProgress" | "notStarted" | "delayed";

interface TaskStatusBadgeProps {
  status: TaskStatus;
}

export function TaskStatusBadge({ status }: TaskStatusBadgeProps) {
  const statusConfig = {
    completed: { label: "Completed", variant: "default" as const },
    inProgress: { label: "In Progress", variant: "secondary" as const },
    notStarted: { label: "Not Started", variant: "outline" as const },
    delayed: { label: "Delayed", variant: "destructive" as const },
  };

  const config = statusConfig[status];
  return <Badge variant={config.variant}>{config.label}</Badge>;
}

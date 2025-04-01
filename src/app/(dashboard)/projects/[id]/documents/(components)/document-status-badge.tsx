import { Badge } from "@/components/ui/badge";
import { DocumentStatus } from "@/store/documentsStore";

interface DocumentStatusBadgeProps {
  status: DocumentStatus;
}

export function DocumentStatusBadge({ status }: DocumentStatusBadgeProps) {
  const statusConfig = {
    draft: { label: "Draft", variant: "outline" as const },
    pending: { label: "Pending", variant: "secondary" as const },
    approved: { label: "Approved", variant: "default" as const },
    rejected: { label: "Rejected", variant: "destructive" as const },
  };

  const config = statusConfig[status];
  return <Badge variant={config.variant}>{config.label}</Badge>;
} 
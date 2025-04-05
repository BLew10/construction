import { Badge } from "@/components/ui/badge";
import { DocumentStatus } from "@/store/documentsStore";
import { cn } from "@/lib/utils"; // Assuming you have a utility for class names

interface DocumentStatusBadgeProps {
  status: DocumentStatus;
}

export function DocumentStatusBadge({ status }: DocumentStatusBadgeProps) {
  const statusStyles: Record<DocumentStatus, string> = {
    draft: "bg-gray-100 text-gray-800 hover:bg-gray-200 border-gray-300",
    pending: "bg-yellow-100 text-yellow-800 hover:bg-yellow-200 border-yellow-300",
    approved: "bg-green-100 text-green-800 hover:bg-green-200 border-green-300",
    rejected: "bg-red-100 text-red-800 hover:bg-red-200 border-red-300",
  };

  return (
    <Badge
      variant="outline"
      className={cn("capitalize border", statusStyles[status])}
    >
      {status}
    </Badge>
  );
} 
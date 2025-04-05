import React from "react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { ChevronLeft, Cpu, FolderKanban, Edit } from "lucide-react";
import { Document, DocumentStatus } from "@/store/documentsStore";
import { DocumentStatusBadge } from "./document-status-badge";
import { cn } from "@/lib/utils";

interface DocumentDetailHeaderProps {
  document: Document;
  projectName: string;
  isProcessing: boolean;
  onBack: () => void;
  onRunAI: () => void;
  onStatusChange: (newStatus: DocumentStatus) => void;
}

const DocumentDetailHeaderComponent: React.FC<DocumentDetailHeaderProps> = ({
  document,
  projectName,
  isProcessing,
  onBack,
  onRunAI,
  onStatusChange,
}) => {
  return (
    <div className="flex items-center justify-between flex-wrap gap-4">
      {/* Left side: Back button, Title, Project Link */}
      <div className="flex items-center gap-2">
        <Button
          variant="outline"
          size="icon"
          onClick={onBack}
          aria-label="Back to Documents"
        >
          <ChevronLeft className="h-4 w-4" />
        </Button>
        <div>
          <h1 className="text-2xl font-bold tracking-tight flex items-center gap-2">
            {document.name}
            <DocumentStatusBadge status={document.status} />
          </h1>
          <Link
            href={`/projects/${document.projectId}`}
            className="text-sm text-muted-foreground hover:underline flex items-center gap-1"
          >
            <FolderKanban className="h-3 w-3" />
            {projectName}
          </Link>
        </div>
      </div>

      {/* Right side: Action Buttons */}
      <div className="flex gap-2 flex-wrap">
        {/* AI Button */}
        {!document.aiProcessed && (
          <Button
            variant="outline"
            onClick={onRunAI}
            disabled={isProcessing}
            size="sm"
          >
            <Cpu className="mr-2 h-4 w-4" />
            {isProcessing ? "Processing..." : "Run AI Analysis"}
          </Button>
        )}

        {/* Change Status Dropdown */}
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="outline" size="sm">
              <Edit className="mr-2 h-4 w-4" />
              Change Status
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuLabel>Assign New Status</DropdownMenuLabel>
            <DropdownMenuSeparator />
            {(["draft", "pending", "approved", "rejected"] as DocumentStatus[]).map(
              (status) => (
                <DropdownMenuItem
                  key={status}
                  onClick={() => onStatusChange(status)}
                  disabled={document.status === status}
                  className={cn(
                    "capitalize",
                    document.status === status && "bg-accent text-accent-foreground" // Highlight current status slightly
                  )}
                >
                  {status}
                </DropdownMenuItem>
              )
            )}
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </div>
  );
};

export const DocumentDetailHeader = React.memo(DocumentDetailHeaderComponent); 
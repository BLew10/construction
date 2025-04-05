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
import {
  ChevronLeft,
  Cpu,
  FolderKanban,
  Edit,
  MoreVertical,
} from "lucide-react";
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
    <div className="space-y-2 sm:space-y-0 sm:flex sm:items-center sm:justify-between sm:flex-wrap sm:gap-4">
      <div className="flex items-center gap-2">
        <Button
          variant="outline"
          size="icon"
          onClick={onBack}
          aria-label="Back to Documents"
          className="h-8 w-8 sm:h-9 sm:w-9 flex-shrink-0"
        >
          <ChevronLeft className="h-4 w-4" />
        </Button>
        <div className="min-w-0 w-full pl-3 mt-2">
          <h1 className="text-xl sm:text-2xl font-bold tracking-tight flex flex-col md:flex-row gap-2">
            <span>{document.name}</span>
            <DocumentStatusBadge status={document.status} />
          </h1>
          <Link
            href={`/projects/${document.projectId}`}
            className="text-sm text-muted-foreground hover:underline flex items-center gap-1 mt-1"
          >
            <FolderKanban className="h-3 w-3" />
            <span className="truncate">{projectName}</span>
          </Link>
        </div>
      </div>

      <div className="flex items-center gap-2">
        {/* <div className="sm:hidden ml-auto">
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="outline" size="icon" className="h-8 w-8">
                <MoreVertical className="h-4 w-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-56">
              <DropdownMenuLabel>Document Actions</DropdownMenuLabel>
              <DropdownMenuSeparator />
              {!document.aiProcessed && (
                <DropdownMenuItem
                  onClick={onRunAI}
                  disabled={isProcessing}
                  className="flex items-center"
                >
                  <Cpu className="mr-2 h-4 w-4" />
                  {isProcessing ? "Processing..." : "Run AI Analysis"}
                </DropdownMenuItem>
              )}
              <DropdownMenuLabel>Change Status</DropdownMenuLabel>
              <DropdownMenuSeparator />
              {(
                ["draft", "pending", "approved", "rejected"] as DocumentStatus[]
              ).map((status) => (
                <DropdownMenuItem
                  key={status}
                  onClick={() => onStatusChange(status)}
                  disabled={document.status === status}
                  className={cn(
                    "capitalize",
                    document.status === status &&
                      "bg-accent text-accent-foreground"
                  )}
                >
                  {status}
                </DropdownMenuItem>
              ))}
            </DropdownMenuContent>
          </DropdownMenu>
        </div> */}

        {/* Desktop buttons */}
        <div className="mt-2 md:mt-0 sm:flex sm:gap-2">
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
              {(
                ["draft", "pending", "approved", "rejected"] as DocumentStatus[]
              ).map((status) => (
                <DropdownMenuItem
                  key={status}
                  onClick={() => onStatusChange(status)}
                  disabled={document.status === status}
                  className={cn(
                    "capitalize",
                    document.status === status &&
                      "bg-accent text-accent-foreground"
                  )}
                >
                  {status}
                </DropdownMenuItem>
              ))}
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>
    </div>
  );
};

export const DocumentDetailHeader = React.memo(DocumentDetailHeaderComponent);

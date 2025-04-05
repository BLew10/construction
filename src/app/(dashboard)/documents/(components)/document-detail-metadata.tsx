import React from "react";
import Link from "next/link";
import { Separator } from "@/components/ui/separator";
import { Badge } from "@/components/ui/badge";
import { FolderKanban } from "lucide-react";
import { Document } from "@/store/documentsStore";
import { format } from "date-fns";

interface DocumentDetailMetadataProps {
  document: Document;
  projectName: string;
}

// Helper functions moved here as they are only used by this component
const formatDate = (dateString: string | undefined): string => {
  if (!dateString) return "N/A";
  try {
    return format(new Date(dateString), "PP");
  } catch {
    return "Invalid Date";
  }
};

const formatFileSize = (bytes: number): string => {
  if (bytes < 1024) return bytes + " B";
  if (bytes < 1048576) return (bytes / 1024).toFixed(1) + " KB";
  return (bytes / 1048576).toFixed(1) + " MB";
};

const DocumentDetailMetadataComponent: React.FC<DocumentDetailMetadataProps> = ({
  document,
  projectName,
}) => {
  return (
    <div className="space-y-4">
      <div>
        <h3 className="text-sm font-medium text-muted-foreground mb-1">
          Description
        </h3>
        <p className="text-sm">
          {document.description || (
            <span className="italic text-muted-foreground">
              No description provided.
            </span>
          )}
        </p>
      </div>

      <Separator />

      <div className="space-y-2 text-sm">
        <div className="flex justify-between">
          <span className="text-muted-foreground">Project</span>
          <Link
            href={`/projects/${document.projectId}`}
            className="hover:underline flex items-center gap-1"
          >
            <FolderKanban className="h-3 w-3" />
            {projectName}
          </Link>
        </div>
        <div className="flex justify-between">
          <span className="text-muted-foreground">Type</span>
          <Badge variant="outline" className="capitalize">
            {document.type}
          </Badge>
        </div>
        <div className="flex justify-between">
          <span className="text-muted-foreground">Version</span>
          <span>v{document.version}</span>
        </div>
        <div className="flex justify-between">
          <span className="text-muted-foreground">File Size</span>
          <span>{formatFileSize(document.fileSize)}</span>
        </div>
        <div className="flex justify-between">
          <span className="text-muted-foreground">File Type</span>
          <span className="truncate max-w-[150px]">{document.fileType}</span>
        </div>
        <div className="flex justify-between">
          <span className="text-muted-foreground">Uploaded</span>
          <span>{formatDate(document.uploadedAt)}</span>
        </div>
        <div className="flex justify-between">
          <span className="text-muted-foreground">Uploaded By</span>
          {/* In real app, fetch user name based on ID */}
          <span>User: {document.uploadedBy}</span>
        </div>
        {document.approvedBy && (
          <div className="flex justify-between">
            <span className="text-muted-foreground">Approved By</span>
            <span>User: {document.approvedBy}</span>
          </div>
        )}
        {document.approvedAt && (
          <div className="flex justify-between">
            <span className="text-muted-foreground">Approved Date</span>
            <span>{formatDate(document.approvedAt)}</span>
          </div>
        )}
      </div>
    </div>
  );
};

export const DocumentDetailMetadata = React.memo(DocumentDetailMetadataComponent); 
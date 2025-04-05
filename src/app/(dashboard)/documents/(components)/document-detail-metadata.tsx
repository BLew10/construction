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

      <div className="grid grid-cols-2 gap-x-4 gap-y-2 text-sm">
        <div className="text-muted-foreground">Project</div>
        <div className="text-right">
          <Link
            href={`/projects/${document.projectId}`}
            className="hover:underline flex items-center justify-end gap-1"
          >
            <FolderKanban className="h-3 w-3" />
            <span className="truncate">{projectName}</span>
          </Link>
        </div>
        
        <div className="text-muted-foreground">Type</div>
        <div className="text-right">
          <Badge variant="outline" className="capitalize">
            {document.type}
          </Badge>
        </div>
        
        <div className="text-muted-foreground">Version</div>
        <div className="text-right">v{document.version}</div>
        
        <div className="text-muted-foreground">File Size</div>
        <div className="text-right">{formatFileSize(document.fileSize)}</div>
        
        <div className="text-muted-foreground">File Type</div>
        <div className="text-right truncate">{document.fileType}</div>
        
        <div className="text-muted-foreground">Uploaded</div>
        <div className="text-right">{formatDate(document.uploadedAt)}</div>
        
        <div className="text-muted-foreground">Uploaded By</div>
        <div className="text-right truncate">User: {document.uploadedBy}</div>
        
        {document.approvedBy && (
          <>
            <div className="text-muted-foreground">Approved By</div>
            <div className="text-right truncate">User: {document.approvedBy}</div>
          </>
        )}
        
        {document.approvedAt && (
          <>
            <div className="text-muted-foreground">Approved Date</div>
            <div className="text-right">{formatDate(document.approvedAt)}</div>
          </>
        )}
      </div>
    </div>
  );
};

export const DocumentDetailMetadata = React.memo(DocumentDetailMetadataComponent); 
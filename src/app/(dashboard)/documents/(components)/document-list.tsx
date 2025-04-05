import { FileIcon, FolderKanban } from "lucide-react"; // Add FolderKanban
import { format } from "date-fns";
import Link from "next/link"; // Import Link
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { DocumentStatusBadge } from "./document-status-badge";
import { Document } from "@/store/documentsStore";
import { Project } from "@/types/project"; // Import Project type

interface DocumentListProps {
  documents: Document[];
  formatFileSize: (bytes: number) => string;
  projects: Project[]; // Receive projects to map IDs to names
}

export function DocumentList({ documents, formatFileSize, projects }: DocumentListProps) {
  const getProjectName = (projectId: string): string => {
    return projects.find(p => p.id === projectId)?.name || "Unknown Project";
  };

  if (documents.length === 0) {
    return (
      <div className="text-center py-8 text-muted-foreground">
        No documents found matching your filters.
      </div>
    );
  }

  return (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead>Document</TableHead>
          <TableHead>Project</TableHead> {/* Add Project column */}
          <TableHead>Type</TableHead>
          <TableHead>Status</TableHead>
          <TableHead>Version</TableHead>
          <TableHead>Uploaded</TableHead>
          <TableHead>Size</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {documents.map((document) => (
          // Use Link to navigate to the detail page
          <TableRow
            key={document.id}
            className="cursor-pointer hover:bg-muted/50"
            onClick={() => window.location.href = `/documents/${document.id}`} // Simple navigation, Link is better
          >
            <TableCell>
              <div className="flex items-center space-x-3">
                <FileIcon className="h-5 w-5 text-muted-foreground" />
                <div>
                  <div className="font-medium">{document.name}</div>
                  {document.description && (
                    <div className="text-sm text-muted-foreground truncate max-w-[250px]">
                      {document.description}
                    </div>
                  )}
                </div>
              </div>
            </TableCell>
            {/* Project Cell */}
            <TableCell>
              <div className="flex items-center space-x-2 text-sm text-muted-foreground">
                 <FolderKanban className="h-4 w-4" />
                 <span>{getProjectName(document.projectId)}</span>
              </div>
            </TableCell>
            <TableCell>
              <Badge variant="outline" className="capitalize">
                {document.type}
              </Badge>
            </TableCell>
            <TableCell>
              <DocumentStatusBadge status={document.status} />
            </TableCell>
            <TableCell>v{document.version}</TableCell>
            <TableCell>
              <div className="text-sm">
                {format(new Date(document.uploadedAt), "MMM d, yyyy")}
              </div>
            </TableCell>
            <TableCell>{formatFileSize(document.fileSize)}</TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  );
} 
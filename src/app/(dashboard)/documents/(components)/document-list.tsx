import { FileIcon, FolderKanban, Calendar, HardDrive } from "lucide-react"; // Add more icons
import { format } from "date-fns";
import Link from "next/link";
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
import { Project } from "@/types/project";
import { Card, CardContent } from "@/components/ui/card"; // Import Card components

interface DocumentListProps {
  documents: Document[];
  formatFileSize: (bytes: number) => string;
  projects: Project[];
}

export function DocumentList({
  documents,
  formatFileSize,
  projects,
}: DocumentListProps) {
  const getProjectName = (projectId: string): string => {
    return projects.find((p) => p.id === projectId)?.name || "Unknown Project";
  };

  if (documents.length === 0) {
    return (
      <div className="text-center py-8 text-muted-foreground">
        No documents found matching your filters.
      </div>
    );
  }

  // Mobile card view
  const renderMobileCards = () => (
    <div className="space-y-4 md:hidden">
      {documents.map((document) => (
        <Card key={document.id} className="cursor-pointer hover:bg-muted/50">
          <CardContent
            className="p-4"
            onClick={() => (window.location.href = `/documents/${document.id}`)}
          >
            <div className="flex items-start gap-3">
              <FileIcon className="h-5 w-5 mt-1 text-muted-foreground flex-shrink-0" />
              <div className="space-y-2 flex-1 min-w-0">
                <div>
                  <div className="font-medium mb-2">{document.name}</div>
                  {document.description && (
                    <div className="text-sm text-muted-foreground truncate">
                      {document.description}
                    </div>
                  )}
                </div>

                <div className="flex items-center text-sm text-muted-foreground">
                  <FolderKanban className="h-3.5 w-3.5 mr-1" />
                  <span className="truncate">
                    {getProjectName(document.projectId)}
                  </span>
                </div>

                <div className="flex flex-wrap gap-2">
                  <Badge variant="outline" className="capitalize">
                    {document.type}
                  </Badge>
                  <DocumentStatusBadge status={document.status} />
                </div>

                <div className="flex flex-wrap gap-x-4 text-xs text-muted-foreground">
                  <div className="flex items-center">
                    <Calendar className="h-3 w-3 mr-1" />
                    {format(new Date(document.uploadedAt), "MMM d, yyyy")}
                  </div>
                  <div className="flex items-center">
                    <HardDrive className="h-3 w-3 mr-1" />
                    {formatFileSize(document.fileSize)}
                  </div>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );

  // Desktop table view
  const renderDesktopTable = () => (
    <div className="hidden md:block overflow-auto">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Document</TableHead>
            <TableHead>Project</TableHead>
            <TableHead>Type</TableHead>
            <TableHead>Status</TableHead>
            <TableHead>Version</TableHead>
            <TableHead>Uploaded</TableHead>
            <TableHead>Size</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {documents.map((document) => (
            <TableRow
              key={document.id}
              className="cursor-pointer hover:bg-muted/50"
              onClick={() =>
                (window.location.href = `/documents/${document.id}`)
              }
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
    </div>
  );

  return (
    <>
      {renderMobileCards()}
      {renderDesktopTable()}
    </>
  );
}

import { FileIcon } from "lucide-react";
import { format } from "date-fns";
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

interface DocumentListProps {
  documents: Document[];
  formatFileSize: (bytes: number) => string;
}

export function DocumentList({ documents, formatFileSize }: DocumentListProps) {
  if (documents.length === 0) {
    return (
      <div className="text-center py-8 text-muted-foreground">
        No documents found. Upload a document to get started.
      </div>
    );
  }

  return (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead>Document</TableHead>
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
          >
            <TableCell>
              <div className="flex items-center space-x-3">
                <FileIcon className="h-5 w-5 text-muted-foreground" />
                <div>
                  <div className="font-medium">{document.name}</div>
                  {document.description && (
                    <div className="text-sm text-muted-foreground truncate max-w-[300px]">
                      {document.description}
                    </div>
                  )}
                </div>
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
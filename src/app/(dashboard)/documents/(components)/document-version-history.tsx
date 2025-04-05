import { Document } from "@/store/documentsStore";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { format } from "date-fns";

interface DocumentVersionHistoryProps {
  document: Document;
}

export function DocumentVersionHistory({ document }: DocumentVersionHistoryProps) {
  // In a real app, you'd fetch previous versions based on document.previousVersions
  // For now, we'll just display the current version info as a placeholder

  return (
    <div className="space-y-4">
      <h3 className="text-lg font-medium">Version History</h3>
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Version</TableHead>
            <TableHead>Uploaded By</TableHead>
            <TableHead>Upload Date</TableHead>
            <TableHead>Status</TableHead>
            <TableHead>Notes</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {/* Placeholder for current version */}
          <TableRow>
            <TableCell>v{document.version}</TableCell>
            <TableCell>{document.uploadedBy}</TableCell> {/* Replace with user name */}
            <TableCell>{format(new Date(document.uploadedAt), "PPp")}</TableCell>
            <TableCell className="capitalize">{document.status}</TableCell>
            <TableCell>Current version</TableCell>
          </TableRow>
          {/* Add rows for previous versions here */}
          {/* Example:
          <TableRow className="text-muted-foreground">
            <TableCell>v1</TableCell>
            <TableCell>user-1</TableCell>
            <TableCell>{format(new Date("2023-09-14T09:00:00Z"), "PPp")}</TableCell>
            <TableCell>superseded</TableCell>
            <TableCell>Initial upload</TableCell>
          </TableRow>
          */}
        </TableBody>
      </Table>
       {(!document.previousVersions || document.previousVersions.length === 0) && (
         <p className="text-sm text-muted-foreground text-center py-4">No previous versions found.</p>
       )}
    </div>
  );
} 
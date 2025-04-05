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
import { Card, CardContent } from "@/components/ui/card";
import { FileText, Calendar, User, AlertCircle } from "lucide-react";

interface DocumentVersionHistoryProps {
  document: Document;
}

export function DocumentVersionHistory({ document }: DocumentVersionHistoryProps) {
  // In a real app, you'd fetch previous versions based on document.previousVersions
  // For now, we'll just display the current version info as a placeholder

  // Mobile card view for version history
  const renderMobileCards = () => (
    <div className="space-y-3 md:hidden">
      {/* Current version card */}
      <Card>
        <CardContent className="p-4">
          <div className="flex items-center justify-between mb-2">
            <div className="font-medium">v{document.version}</div>
            <div className="text-xs bg-primary/10 text-primary px-2 py-1 rounded-full">Current</div>
          </div>
          
          <div className="space-y-2 text-sm">
            <div className="flex items-center text-muted-foreground">
              <User className="h-3.5 w-3.5 mr-2" />
              <span>{document.uploadedBy}</span>
            </div>
            <div className="flex items-center text-muted-foreground">
              <Calendar className="h-3.5 w-3.5 mr-2" />
              <span>{format(new Date(document.uploadedAt), "PPp")}</span>
            </div>
            <div className="flex items-center">
              <AlertCircle className="h-3.5 w-3.5 mr-2 text-muted-foreground" />
              <span className="capitalize">{document.status}</span>
            </div>
          </div>
        </CardContent>
      </Card>
      
      {/* Example of how previous versions would display */}
      {/* 
      <Card>
        <CardContent className="p-4">
          <div className="flex items-center justify-between mb-2">
            <div className="font-medium">v1</div>
            <div className="text-xs bg-muted text-muted-foreground px-2 py-1 rounded-full">Previous</div>
          </div>
          
          <div className="space-y-2 text-sm">
            <div className="flex items-center text-muted-foreground">
              <User className="h-3.5 w-3.5 mr-2" />
              <span>Jane Doe</span>
            </div>
            <div className="flex items-center text-muted-foreground">
              <Calendar className="h-3.5 w-3.5 mr-2" />
              <span>{format(new Date("2023-09-14"), "PPp")}</span>
            </div>
            <div className="flex items-center">
              <AlertCircle className="h-3.5 w-3.5 mr-2 text-muted-foreground" />
              <span className="capitalize">superseded</span>
            </div>
          </div>
        </CardContent>
      </Card>
      */}
    </div>
  );

  // Desktop table view
  const renderDesktopTable = () => (
    <div className="hidden md:block">
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
          {/* Current version */}
          <TableRow>
            <TableCell>v{document.version}</TableCell>
            <TableCell>{document.uploadedBy}</TableCell>
            <TableCell>{format(new Date(document.uploadedAt), "PPp")}</TableCell>
            <TableCell className="capitalize">{document.status}</TableCell>
            <TableCell>Current version</TableCell>
          </TableRow>
          {/* Add rows for previous versions here if needed */}
        </TableBody>
      </Table>
    </div>
  );

  return (
    <div className="space-y-4">
      <h3 className="text-lg font-medium">Version History</h3>
      
      {renderMobileCards()}
      {renderDesktopTable()}
      
      {(!document.previousVersions || document.previousVersions.length === 0) && (
        <p className="text-sm text-muted-foreground text-center py-4">No previous versions found.</p>
      )}
    </div>
  );
} 
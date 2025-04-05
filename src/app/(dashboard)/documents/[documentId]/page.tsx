"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useParams, useRouter } from "next/navigation";
import { useDocumentsStore, DocumentStatus } from "@/store/documentsStore";
import { useAuthStore } from "@/store/authStore";
import { useProjectsStore } from "@/store/projectsStore"; // Import projects store
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Separator } from "@/components/ui/separator";
import { Badge } from "@/components/ui/badge";
import { format } from "date-fns";
import {
  ChevronLeft,
  MessageCircle,
  ArrowUpDown,
  FileText,
  Cpu,
  FolderKanban,
  Edit,
} from "lucide-react";
import { DocumentViewer } from "../(components)/document-viewer";
import { DocumentComments } from "../(components)/document-comments";
import { DocumentVersionHistory } from "../(components)/document-version-history";
import { DocumentAIInsights } from "../(components)/document-ai-insights";
import { DocumentStatusBadge } from "../(components)/document-status-badge";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { cn } from "@/lib/utils";
export default function DocumentDetailPage() {
  const params = useParams();
  const router = useRouter();
  const documentId = params.documentId as string;
  // projectId is no longer in the URL params for this page
  const { user } = useAuthStore();
  const {
    currentDocument,
    fetchDocument,
    fetchComments,
    isLoading,
    error,
    comments,
    processDocumentWithAI,
    isProcessing,
    updateDocument,
  } = useDocumentsStore();
  const { projects, fetchProjects: fetchUserProjects } = useProjectsStore(); // Get projects for linking/display
  const [activeTab, setActiveTab] = useState("preview");

  useEffect(() => {
    if (documentId) {
      fetchDocument(documentId);
      fetchComments(documentId);
    }
    // Fetch projects if needed for display, ensure it runs only once or when necessary
    if (projects.length === 0) {
      fetchUserProjects();
    }
  }, [
    documentId,
    fetchDocument,
    fetchComments,
    fetchUserProjects,
    projects.length,
  ]);

  const handleRunAI = async () => {
    if (currentDocument && !currentDocument.aiProcessed) {
      await processDocumentWithAI(currentDocument.id);
      // Optionally re-fetch the document to get updated AI fields
      await fetchDocument(documentId);
    }
  };

  const handleStatusChange = async (newStatus: DocumentStatus) => {
    if (currentDocument) {
      // Optimistic update (optional, but good UX)
      // You might want to update the local state immediately
      // before the async call completes, or handle loading states.
      await updateDocument(currentDocument.id, { status: newStatus });
      // Optionally re-fetch to confirm, though updateDocument should handle state
      // await fetchDocument(documentId);
    }
  };

  // Update back button to go to the main documents page
  const handleBack = () => {
    router.push(`/documents`);
  };

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

  const getProjectName = (projectId: string): string => {
    return projects.find((p) => p.id === projectId)?.name || "Loading...";
  };

  if (isLoading && !currentDocument) {
    // Show loading only if document isn't already loaded
    return (
      <div className="flex justify-center py-12">
        <p>Loading document details...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-destructive/10 border border-destructive text-destructive px-4 py-3 rounded-md">
        {error} -{" "}
        <Button variant="link" onClick={handleBack}>
          Go back
        </Button>
      </div>
    );
  }

  if (!currentDocument) {
    // This might happen briefly while loading or if the doc truly doesn't exist
    return (
      <div className="flex justify-center py-12">
        <p>Document not found or still loading...</p>
      </div>
    );
  }

  const documentComments = comments[documentId] || [];

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between flex-wrap gap-4">
        <div className="flex items-center gap-2">
          <Button
            variant="outline"
            size="icon"
            onClick={handleBack}
            aria-label="Back to Documents"
          >
            <ChevronLeft className="h-4 w-4" />
          </Button>
          <div>
            <h1 className="text-2xl font-bold tracking-tight flex items-center gap-2">
              {currentDocument.name}
              <DocumentStatusBadge status={currentDocument.status} />
            </h1>
            {/* Link to Project */}
            <Link
              href={`/projects/${currentDocument.projectId}`}
              className="text-sm text-muted-foreground hover:underline flex items-center gap-1"
            >
              <FolderKanban className="h-3 w-3" />
              {getProjectName(currentDocument.projectId)}
            </Link>
          </div>
        </div>

        <div className="flex gap-2 flex-wrap">
          {!currentDocument.aiProcessed && (
            <Button
              variant="outline"
              onClick={handleRunAI}
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
                  onClick={() => handleStatusChange(status)}
                  className={cn(
                    "capitalize",
                    currentDocument.status === status &&
                      "bg-primary/40 text-foreground"
                  )}
                >
                  {status}
                </DropdownMenuItem>
              ))}
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 space-y-6">
          {/* Document Viewer/Tabs Card */}
          <Card>
            {/* Removed Header for cleaner look, title implied by context */}
            <CardContent className="p-4 md:p-6">
              <Tabs
                value={activeTab}
                onValueChange={setActiveTab}
                className="w-full"
              >
                <TabsList className="grid w-full grid-cols-3 mb-4">
                  <TabsTrigger value="preview">
                    <FileText className="mr-2 h-4 w-4" />
                    Preview
                  </TabsTrigger>
                  <TabsTrigger value="comments">
                    <MessageCircle className="mr-2 h-4 w-4" />
                    Comments ({documentComments.length})
                  </TabsTrigger>
                  <TabsTrigger value="versions">
                    <ArrowUpDown className="mr-2 h-4 w-4" />
                    Versions
                  </TabsTrigger>
                </TabsList>

                <TabsContent value="preview" className="mt-0">
                  <DocumentViewer document={currentDocument} />
                </TabsContent>

                <TabsContent value="comments" className="mt-0">
                  <DocumentComments
                    document={currentDocument}
                    comments={documentComments}
                  />
                </TabsContent>

                <TabsContent value="versions" className="mt-0">
                  <DocumentVersionHistory document={currentDocument} />
                </TabsContent>
              </Tabs>
            </CardContent>
          </Card>
        </div>

        <div className="space-y-6">
          {/* Details Card */}
          <Card>
            <CardHeader className="pb-3">
              <CardTitle>Document Details</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div>
                  <h3 className="text-sm font-medium text-muted-foreground mb-1">
                    Description
                  </h3>
                  <p className="text-sm">
                    {currentDocument.description || (
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
                      href={`/projects/${currentDocument.projectId}`}
                      className="hover:underline flex items-center gap-1"
                    >
                      <FolderKanban className="h-3 w-3" />
                      {getProjectName(currentDocument.projectId)}
                    </Link>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Type</span>
                    <Badge variant="outline" className="capitalize">
                      {currentDocument.type}
                    </Badge>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Version</span>
                    <span>v{currentDocument.version}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">File Size</span>
                    <span>{formatFileSize(currentDocument.fileSize)}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">File Type</span>
                    <span className="truncate max-w-[150px]">
                      {currentDocument.fileType}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Uploaded</span>
                    <span>{formatDate(currentDocument.uploadedAt)}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Uploaded By</span>
                    {/* In real app, fetch user name based on ID */}
                    <span>User: {currentDocument.uploadedBy}</span>
                  </div>
                  {currentDocument.approvedBy && (
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Approved By</span>
                      <span>User: {currentDocument.approvedBy}</span>
                    </div>
                  )}
                  {currentDocument.approvedAt && (
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">
                        Approved Date
                      </span>
                      <span>{formatDate(currentDocument.approvedAt)}</span>
                    </div>
                  )}
                </div>
              </div>
            </CardContent>
          </Card>

          {/* AI Insights Card */}
          {currentDocument.aiProcessed && (
            <DocumentAIInsights document={currentDocument} />
          )}
          {/* Placeholder for future components like related tasks, etc. */}
        </div>
      </div>
    </div>
  );
}

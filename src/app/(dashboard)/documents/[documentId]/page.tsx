"use client";

import { useEffect, useState, useCallback } from "react";
import { useParams, useRouter } from "next/navigation";
import { useDocumentsStore, DocumentStatus } from "@/store/documentsStore";
import { useAuthStore } from "@/store/authStore";
import { useProjectsStore } from "@/store/projectsStore";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ArrowUpDown, FileText, MessageCircle } from "lucide-react";
import { DocumentViewer } from "../(components)/document-viewer";
import { DocumentComments } from "../(components)/document-comments";
import { DocumentVersionHistory } from "../(components)/document-version-history";
import { DocumentAIInsights } from "../(components)/document-ai-insights";
import { DocumentDetailHeader } from "../(components)/document-detail-header";
import { DocumentDetailMetadata } from "../(components)/document-detail-metadata";

export default function DocumentDetailPage() {
  const params = useParams();
  const router = useRouter();
  const documentId = params.documentId as string;
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
  const { projects, fetchProjects: fetchUserProjects } = useProjectsStore();
  const [activeTab, setActiveTab] = useState("preview");

  useEffect(() => {
    if (documentId) {
      fetchDocument(documentId);
      fetchComments(documentId);
    }
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

  const handleRunAI = useCallback(async () => {
    if (currentDocument && !currentDocument.aiProcessed) {
      await processDocumentWithAI(currentDocument.id);
      await fetchDocument(documentId);
    }
  }, [currentDocument, processDocumentWithAI, fetchDocument, documentId]);

  const handleStatusChange = useCallback(async (newStatus: DocumentStatus) => {
    if (currentDocument) {
      await updateDocument(currentDocument.id, { status: newStatus });
    }
  }, [currentDocument, updateDocument]);

  const handleBack = useCallback(() => {
    router.push(`/documents`);
  }, [router]);

  const getProjectName = useCallback((projectId: string): string => {
    return projects.find((p) => p.id === projectId)?.name || "Loading...";
  }, [projects]);

  if (isLoading && !currentDocument) {
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
    return (
      <div className="flex justify-center py-12">
        <p>Document not found or still loading...</p>
      </div>
    );
  }

  const documentComments = comments[documentId] || [];
  const projectName = getProjectName(currentDocument.projectId);

  return (
    <div className="space-y-6">
      <DocumentDetailHeader
        document={currentDocument}
        projectName={projectName}
        isProcessing={isProcessing}
        onBack={handleBack}
        onRunAI={handleRunAI}
        onStatusChange={handleStatusChange}
      />

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 space-y-6">
          <Card>
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
          <Card>
            <CardHeader className="pb-3">
              <CardTitle>Document Details</CardTitle>
            </CardHeader>
            <CardContent>
              <DocumentDetailMetadata
                document={currentDocument}
                projectName={projectName}
              />
            </CardContent>
          </Card>

          {currentDocument.aiProcessed && (
            <DocumentAIInsights document={currentDocument} />
          )}
        </div>
      </div>
    </div>
  );
}

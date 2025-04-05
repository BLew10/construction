"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import {
  useDocumentsStore,
  DocumentType,
  DocumentStatus,
} from "@/store/documentsStore";
import { useAuthStore } from "../../../../../store/authStore";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import DocumentUploader from "@/app/(dashboard)/projects/[id]/documents/(components)/document-uploader";
import { DocumentHeader } from "@/app/(dashboard)/projects/[id]/documents/(components)/document-header";
import { DocumentFilters } from "@/app/(dashboard)/projects/[id]/documents/(components)/document-filters";
import { DocumentList } from "@/app/(dashboard)/projects/[id]/documents/(components)/document-list";

export default function DocumentsPage() {
  const params = useParams();
  const projectId = params.id as string;
  const { documents, fetchDocuments, isLoading, error } = useDocumentsStore();
  const { user } = useAuthStore();

  const [showUploader, setShowUploader] = useState(false);
  const [filters, setFilters] = useState({
    type: "all" as "all" | DocumentType,
    status: "all" as "all" | DocumentStatus,
    search: "",
  });

  useEffect(() => {
    fetchDocuments();
  }, [fetchDocuments, projectId]);

  const formatFileSize = (bytes: number): string => {
    if (bytes < 1024) return bytes + " B";
    if (bytes < 1048576) return (bytes / 1024).toFixed(1) + " KB";
    return (bytes / 1048576).toFixed(1) + " MB";
  };

  return (
    <div className="space-y-4 md:space-y-6">
      <DocumentHeader onUpload={() => setShowUploader(true)} />

      {error && (
        <div className="bg-destructive/10 border border-destructive text-destructive px-4 py-3 rounded-md">
          {error}
        </div>
      )}

      <Card className="overflow-hidden">
        <CardHeader className="pb-2 md:pb-3">
          <CardTitle>Document Library</CardTitle>
          <CardDescription>
            Manage and view all project documents in one place.
          </CardDescription>
        </CardHeader>
        <CardContent className="p-3 md:p-6">
          <DocumentFilters filters={filters} setFilters={setFilters} />

          {isLoading ? (
            <div className="flex justify-center py-6 md:py-8">
              <p>Loading documents...</p>
            </div>
          ) : (
            <DocumentList
              documents={documents}
              formatFileSize={formatFileSize}
            />
          )}
        </CardContent>
      </Card>

      {showUploader && (
        <DocumentUploader
          projectId={projectId}
          onClose={() => setShowUploader(false)}
          userId={user?.id || ""}
        />
      )}
    </div>
  );
}

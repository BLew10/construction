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
    fetchDocuments(projectId);
  }, [fetchDocuments, projectId]);

  // Apply filters
  const filteredDocuments = documents.filter((doc) => {
    return (
      doc.projectId === projectId &&
      (filters.type === "all" ? true : doc.type === filters.type) &&
      (filters.status === "all" ? true : doc.status === filters.status) &&
      (filters.search
        ? doc.name.toLowerCase().includes(filters.search.toLowerCase()) ||
          (doc.description
            ?.toLowerCase()
            .includes(filters.search.toLowerCase()) ??
            false)
        : true)
    );
  });

  const formatFileSize = (bytes: number): string => {
    if (bytes < 1024) return bytes + " B";
    if (bytes < 1048576) return (bytes / 1024).toFixed(1) + " KB";
    return (bytes / 1048576).toFixed(1) + " MB";
  };

  return (
    <div className="space-y-6">
      <DocumentHeader onUpload={() => setShowUploader(true)} />

      {error && (
        <div className="bg-destructive/10 border border-destructive text-destructive px-4 py-3 rounded-md">
          {error}
        </div>
      )}

      <Card>
        <CardHeader className="pb-3">
          <CardTitle>Document Library</CardTitle>
          <CardDescription>
            Manage and view all project documents in one place.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <DocumentFilters filters={filters} setFilters={setFilters} />

          {isLoading ? (
            <div className="flex justify-center py-8">
              <p>Loading documents...</p>
            </div>
          ) : (
            <DocumentList
              documents={filteredDocuments}
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

"use client";

import { useEffect, useState } from "react";
import { useDocumentsStore, DocumentType, DocumentStatus } from "@/store/documentsStore";
import { useProjectsStore } from "@/store/projectsStore"; // Import projects store
import { useAuthStore } from "@/store/authStore";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import DocumentUploader from "./(components)/document-uploader"; // Updated path
import { DocumentHeader } from "./(components)/document-header"; // Updated path
import { DocumentFilters } from "./(components)/document-filters"; // Updated path
import { DocumentList } from "./(components)/document-list"; // Updated path

// Define the extended Filters interface including projectId
interface Filters {
  projectId: "all" | string; // Add projectId filter
  type: "all" | DocumentType;
  status: "all" | DocumentStatus;
  search: string;
}

export default function DocumentsPage() {
  const { documents, fetchDocuments, isLoading, error } = useDocumentsStore();
  const { projects, fetchProjects: fetchUserProjects } = useProjectsStore(); // Get projects for filtering
  const { user } = useAuthStore();

  const [showUploader, setShowUploader] = useState(false);
  const [filters, setFilters] = useState<Filters>({ // Use the extended Filters type
    projectId: "all", // Default to all projects
    type: "all",
    status: "all",
    search: "",
  });

  useEffect(() => {
    // Fetch all documents for the user (store needs modification)
    fetchDocuments();
    // Fetch projects for the filter dropdown
    fetchUserProjects();
  }, [fetchDocuments, fetchUserProjects]);

  // Apply filters including the new project filter
  const filteredDocuments = documents.filter((doc) => {
    return (
      (filters.projectId === "all" ? true : doc.projectId === filters.projectId) && // Filter by project
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
    <div className="space-y-6 px-2 sm:px-4">
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
            View and manage all documents across your projects.
          </CardDescription>
        </CardHeader>
        <CardContent className="px-2 sm:px-6">
          <DocumentFilters
            filters={filters}
            setFilters={setFilters}
            projects={projects}
          />

          {isLoading ? (
            <div className="flex justify-center py-8">
              <p>Loading documents...</p>
            </div>
          ) : (
            <DocumentList
              documents={filteredDocuments}
              formatFileSize={formatFileSize}
              projects={projects}
            />
          )}
        </CardContent>
      </Card>

      {showUploader && (
        <DocumentUploader
          // Remove projectId prop, it will be selected inside the uploader
          onClose={() => setShowUploader(false)}
          userId={user?.id || ""}
          projects={projects} // Pass projects to select from
        />
      )}
    </div>
  );
} 
"use client";

import { useEffect, useState } from "react";
import { Document as DocumentType } from "@/store/documentsStore";
import { Skeleton } from "@/components/ui/skeleton";
import { FileText, Image as ImageIcon, AlertTriangle } from "lucide-react";

interface DocumentViewerProps {
  document: DocumentType;
}

export function DocumentViewer({ document }: DocumentViewerProps) {
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    // Simulate loading or actual fetching of preview data if needed
    setIsLoading(true);
    setError(null);
    const timer = setTimeout(() => {
      setIsLoading(false);
      // Add error handling based on file type or URL validity if necessary
      // e.g., if (!document.fileUrl) setError("File URL is missing.");
    }, 500); // Simulate loading delay

    return () => clearTimeout(timer);
  }, [document]);

  const renderDocumentPreview = () => {
    if (error) {
      return (
        <div className="flex flex-col items-center justify-center h-[600px] border rounded-md bg-muted/50 text-destructive">
          <AlertTriangle className="h-12 w-12 mb-4" />
          <p className="text-lg font-medium">Error Loading Preview</p>
          <p className="text-sm">{error}</p>
        </div>
      );
    }

    const fileType = document.fileType?.toLowerCase() || "";
    const fileUrl = document.fileUrl || ""; // Ensure you have a valid URL

    if (!fileUrl) {
      return (
        <div className="flex flex-col items-center justify-center h-[600px] border rounded-md bg-muted/50 text-muted-foreground">
          <FileText className="h-12 w-12 mb-4" />
          <p className="text-lg font-medium">No File Available</p>
          <p className="text-sm">Cannot display preview.</p>
        </div>
      );
    }

    if (fileType.includes("pdf")) {
      // Embed PDF viewer (requires a library like react-pdf or using an iframe)
      return (
        <iframe
          src={fileUrl}
          className="w-full h-[800px] border rounded-md"
          title={document.name}
        />
      );
    } else if (fileType.startsWith("image/")) {
      // Display image
      return (
        <div className="flex justify-center items-center border rounded-md p-4 bg-muted/10">
          <img
            src={fileUrl}
            alt={document.name}
            className="max-w-full max-h-[750px] object-contain rounded"
          />
        </div>
      );
    } else if (fileType.startsWith("text/")) {
      // Display text content (requires fetching content or using iframe)
      // Simple iframe approach:
      return (
        <iframe
          src={fileUrl}
          className="w-full h-[800px] border rounded-md bg-white"
          title={document.name}
        />
      );
    } else {
      // Fallback for unsupported types
      return (
        <div className="flex flex-col items-center justify-center h-[600px] border rounded-md bg-muted/50 text-muted-foreground">
          <FileText className="h-12 w-12 mb-4" />
          <p className="text-lg font-medium">Preview not available</p>
          <p className="text-sm">
            File type ({fileType || "unknown"}) is not supported for direct
            preview.
          </p>
          <a
            href={fileUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="mt-4 text-primary hover:underline text-sm"
          >
            Download Document
          </a>
        </div>
      );
    }
  };

  return (
    <div className="w-full">
      {isLoading ? (
        <div className="space-y-2">
          <Skeleton className="w-full h-[800px] rounded-md" />
        </div>
      ) : (
        renderDocumentPreview()
      )}
    </div>
  );
}

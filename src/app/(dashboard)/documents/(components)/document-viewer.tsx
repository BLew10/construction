"use client";

import { useEffect, useState } from "react";
import { Document as DocumentType } from "@/store/documentsStore";
import { Skeleton } from "@/components/ui/skeleton";
import { FileText, Image as ImageIcon, AlertTriangle, Download } from "lucide-react";
import { Button } from "@/components/ui/button";

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
        <div className="flex flex-col items-center justify-center h-[300px] sm:h-[400px] md:h-[600px] border rounded-md bg-muted/50 text-destructive px-4 text-center">
          <AlertTriangle className="h-10 w-10 mb-4" />
          <p className="text-base sm:text-lg font-medium">Error Loading Preview</p>
          <p className="text-sm">{error}</p>
        </div>
      );
    }

    const fileType = document.fileType?.toLowerCase() || "";
    const fileUrl = document.fileUrl || ""; // Ensure you have a valid URL

    if (!fileUrl) {
      return (
        <div className="flex flex-col items-center justify-center h-[300px] sm:h-[400px] md:h-[600px] border rounded-md bg-muted/50 text-muted-foreground px-4 text-center">
          <FileText className="h-10 w-10 mb-4" />
          <p className="text-base sm:text-lg font-medium">No File Available</p>
          <p className="text-sm">Cannot display preview.</p>
        </div>
      );
    }

    if (fileType.includes("pdf")) {
      return (
        <div className="w-full h-full flex flex-col">
          <iframe
            src={fileUrl}
            className="w-full h-[300px] sm:h-[400px] md:h-[700px] border rounded-md"
            title={document.name}
          />
          <div className="mt-2 flex justify-center">
            <Button
              variant="outline"
              size="sm"
              onClick={() => window.open(fileUrl, '_blank')}
              className="text-xs sm:text-sm"
            >
              <Download className="mr-1 h-3 w-3 sm:h-4 sm:w-4" />
              Open in Full Screen
            </Button>
          </div>
        </div>
      );
    } else if (fileType.startsWith("image/")) {
      return (
        <div className="flex flex-col items-center border rounded-md p-2 sm:p-4 bg-muted/10">
          <img
            src={fileUrl}
            alt={document.name}
            className="max-w-full max-h-[300px] sm:max-h-[400px] md:max-h-[600px] object-contain rounded"
          />
          <div className="mt-2">
            <Button
              variant="outline"
              size="sm"
              onClick={() => window.open(fileUrl, '_blank')}
              className="text-xs sm:text-sm"
            >
              <Download className="mr-1 h-3 w-3 sm:h-4 sm:w-4" />
              View Full Image
            </Button>
          </div>
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
        <div className="flex flex-col items-center justify-center h-[300px] sm:h-[400px] md:h-[600px] border rounded-md bg-muted/50 text-muted-foreground px-4 text-center">
          <FileText className="h-10 w-10 mb-4" />
          <p className="text-base sm:text-lg font-medium">Preview not available</p>
          <p className="text-sm mb-4">
            File type ({fileType || "unknown"}) is not supported for direct preview.
          </p>
          <Button
            variant="outline"
            size="sm"
            onClick={() => window.open(fileUrl, '_blank')}
            className="text-xs sm:text-sm"
          >
            <Download className="mr-1 h-3 w-3 sm:h-4 sm:w-4" />
            Download Document
          </Button>
        </div>
      );
    }
  };

  return (
    <div className="w-full">
      {isLoading ? (
        <div className="space-y-2">
          <Skeleton className="w-full h-[300px] sm:h-[400px] md:h-[600px] rounded-md" />
        </div>
      ) : (
        renderDocumentPreview()
      )}
    </div>
  );
}

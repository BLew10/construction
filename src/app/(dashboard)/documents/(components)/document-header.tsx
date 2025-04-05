import { Button } from "@/components/ui/button";
import { UploadIcon } from "lucide-react";

interface DocumentHeaderProps {
  onUpload: () => void;
  // Add other props if needed, e.g., project list for context
}

export function DocumentHeader({ onUpload }: DocumentHeaderProps) {
  return (
    <div className="flex flex-col md:flex-row items-center justify-between gap-4 mt-4">
      {/* Title can be dynamic based on context if needed */}
      <h1 className="text-xl font-bold tracking-tight sm:text-2xl">Document Library</h1>
      <Button onClick={onUpload}>
        <UploadIcon className="mr-2 h-4 w-4" /> Upload Document
      </Button>
    </div>
  );
} 
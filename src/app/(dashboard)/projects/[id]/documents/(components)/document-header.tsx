import { Button } from "@/components/ui/button";
import { UploadIcon } from "lucide-react";

interface DocumentHeaderProps {
  onUpload: () => void;
}

export function DocumentHeader({ onUpload }: DocumentHeaderProps) {
  return (
    <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
      <h1 className="text-2xl sm:text-3xl font-bold tracking-tight">
        Project Documents
      </h1>
      <Button onClick={onUpload}>
        <UploadIcon className="mr-2 h-4 w-4" /> Upload Document
      </Button>
    </div>
  );
}

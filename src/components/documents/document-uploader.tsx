"use client";

import { useState, useRef } from "react";
import {
  useDocumentsStore,
  DocumentType,
  DocumentStatus,
} from "@/store/documentsStore";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Label } from "@/components/ui/label";
import { UploadIcon, XIcon } from "lucide-react";

interface DocumentUploaderProps {
  projectId: string;
  userId: string;
  onClose: () => void;
}

export default function DocumentUploader({
  projectId,
  userId,
  onClose,
}: DocumentUploaderProps) {
  const { uploadDocument, isLoading } = useDocumentsStore();
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [type, setType] = useState<DocumentType>("plan");
  const [status, setStatus] = useState<DocumentStatus>("draft");
  const [file, setFile] = useState<File | null>(null);
  const [dragActive, setDragActive] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleDrag = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === "dragenter" || e.type === "dragover") {
      setDragActive(true);
    } else if (e.type === "dragleave") {
      setDragActive(false);
    }
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);

    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      setFile(e.dataTransfer.files[0]);
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      setFile(e.target.files[0]);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!file) return;

    try {
      await uploadDocument({
        projectId,
        name,
        description,
        type,
        status,
        uploadedBy: userId,
        fileUrl: URL.createObjectURL(file), // In a real app, this would be a server URL
        fileSize: file.size,
        fileType: file.type,
      });

      onClose();
    } catch (error) {
      console.error("Failed to upload document:", error);
    }
  };

  return (
    <Dialog open={true} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle>Upload Document</DialogTitle>
          <DialogDescription>
            Add a new document to this project.
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-6 py-4">
          <div className="space-y-4">
            <div className="grid grid-cols-1 gap-4">
              <div className="space-y-2">
                <Label htmlFor="name">Document Name</Label>
                <Input
                  id="name"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="Floor Plans"
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="description">Description (Optional)</Label>
                <Textarea
                  id="description"
                  value={description}
                  onChange={(e: React.ChangeEvent<HTMLTextAreaElement>) => setDescription(e.target.value)}
                  placeholder="Brief description of the document"
                  className="resize-none"
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="type">Document Type</Label>
                <Select
                  value={type}
                  onValueChange={(value: string) => setType(value as DocumentType)}
                >
                  <SelectTrigger id="type">
                    <SelectValue placeholder="Select type" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="plan">Plan</SelectItem>
                    <SelectItem value="submittal">Submittal</SelectItem>
                    <SelectItem value="contract">Contract</SelectItem>
                    <SelectItem value="permit">Permit</SelectItem>
                    <SelectItem value="rfi">RFI</SelectItem>
                    <SelectItem value="other">Other</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="status">Status</Label>
                <Select
                  value={status}
                  onValueChange={(value: string) => setStatus(value as DocumentStatus)}
                >
                  <SelectTrigger id="status">
                    <SelectValue placeholder="Select status" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="draft">Draft</SelectItem>
                    <SelectItem value="pending">Pending Approval</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div className="space-y-2">
              <Label>Upload File</Label>
              <div
                className={`border-2 border-dashed rounded-md p-6 ${
                  dragActive ? "border-primary" : "border-border"
                } ${file ? "bg-muted/50" : ""}`}
                onDragEnter={handleDrag}
                onDragLeave={handleDrag}
                onDragOver={handleDrag}
                onDrop={handleDrop}
              >
                <input
                  ref={fileInputRef}
                  type="file"
                  className="hidden"
                  onChange={handleFileChange}
                />

                {file ? (
                  <div className="flex items-center justify-between">
                    <div className="flex items-center">
                      <UploadIcon className="h-5 w-5 text-muted-foreground" />
                      <span className="ml-2">{file.name}</span>
                    </div>
                    <XIcon className="h-5 w-5 text-muted-foreground" />
                  </div>
                ) : (
                  <div className="flex items-center justify-center">
                    <UploadIcon className="h-5 w-5 text-muted-foreground" />
                  </div>
                )}
              </div>
            </div>
          </div>

          <div className="flex justify-end space-x-4">
            <Button variant="outline" type="button" onClick={onClose}>
              Cancel
            </Button>
            <Button type="submit" disabled={isLoading}>
              {isLoading ? "Uploading..." : "Upload Document"}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}

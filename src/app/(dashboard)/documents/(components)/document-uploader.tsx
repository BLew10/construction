"use client";

import { useState, useRef } from "react";
import {
  useDocumentsStore,
  DocumentType,
  DocumentStatus,
} from "@/store/documentsStore";
import { Project } from "@/types/project"; // Import Project type
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
import { UploadIcon, XIcon, FileText } from "lucide-react";

interface DocumentUploaderProps {
  // projectId is removed, will be selected here
  userId: string;
  onClose: () => void;
  projects: Project[]; // Receive projects list
}

export default function DocumentUploader({
  userId,
  onClose,
  projects, // Use projects prop
}: DocumentUploaderProps) {
  const { uploadDocument, isLoading } = useDocumentsStore();
  const [selectedProjectId, setSelectedProjectId] = useState<string>(""); // State for selected project
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [type, setType] = useState<DocumentType>("plan");
  const [status, setStatus] = useState<DocumentStatus>("draft");
  const [file, setFile] = useState<File | null>(null);
  const [dragActive, setDragActive] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Define available types and statuses (consider moving to constants)
  const documentTypes: DocumentType[] = ["plan", "submittal", "contract", "permit", "rfi", "specification", "drawing", "other"];
  const documentStatuses: DocumentStatus[] = ["draft", "pending", "approved", "rejected"];

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

    if (!file || !selectedProjectId) return; // Ensure project is selected

    try {
      await uploadDocument({
        projectId: selectedProjectId, // Use selected project ID
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
      // Add user feedback here (e.g., toast notification)
    }
  };

  return (
    <Dialog open={true} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle>Upload Document</DialogTitle>
          <DialogDescription>
            Add a new document to the selected project.
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-6 py-4">
          <div className="space-y-4">
            {/* Project Selection */}
            <div className="space-y-2">
              <Label htmlFor="project">Project</Label>
              <Select
                value={selectedProjectId}
                onValueChange={setSelectedProjectId}
                required
              >
                <SelectTrigger id="project">
                  <SelectValue placeholder="Select a project" />
                </SelectTrigger>
                <SelectContent>
                  {projects.length === 0 && <SelectItem value="" disabled>No projects available</SelectItem>}
                  {projects.map((project) => (
                    <SelectItem key={project.id} value={project.id}>
                      {project.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

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
                  onChange={(e: React.ChangeEvent<HTMLTextAreaElement>) =>
                    setDescription(e.target.value)
                  }
                  placeholder="Brief description of the document"
                  className="resize-none"
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="type">Type</Label>
                <Select
                  value={type}
                  onValueChange={(value) => setType(value as DocumentType)}
                >
                  <SelectTrigger id="type">
                    <SelectValue placeholder="Select type" />
                  </SelectTrigger>
                  <SelectContent>
                    {documentTypes.map((docType) => (
                      <SelectItem key={docType} value={docType} className="capitalize">
                        {docType}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="status">Status</Label>
                <Select
                  value={status}
                  onValueChange={(value) => setStatus(value as DocumentStatus)}
                >
                  <SelectTrigger id="status">
                    <SelectValue placeholder="Select status" />
                  </SelectTrigger>
                  <SelectContent>
                    {documentStatuses.map((docStatus) => (
                      <SelectItem key={docStatus} value={docStatus} className="capitalize">
                        {docStatus}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div className="space-y-2">
              <Label>Upload File</Label>
              <div
                className={`border-2 border-dashed rounded-md p-6 text-center cursor-pointer ${
                  dragActive ? "border-primary bg-primary/10" : "border-border hover:border-muted-foreground/50"
                } ${file ? "bg-muted/50" : ""}`}
                onClick={() => fileInputRef.current?.click()}
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
                  <div className="flex items-center justify-center text-sm">
                    <FileText className="h-4 w-4 mr-2 text-muted-foreground" />
                    <span>{file.name}</span>
                    <Button
                      variant="ghost"
                      size="icon"
                      className="ml-2 h-6 w-6"
                      onClick={(e) => {
                        e.stopPropagation(); // Prevent triggering file input click
                        setFile(null);
                        if (fileInputRef.current) fileInputRef.current.value = ""; // Reset file input
                      }}
                    >
                      <XIcon className="h-4 w-4" />
                    </Button>
                  </div>
                ) : (
                  <div className="flex flex-col items-center justify-center space-y-1 text-muted-foreground">
                    <UploadIcon className="h-8 w-8" />
                    <p className="text-sm">
                      <span className="font-semibold text-primary">Click to upload</span> or drag and drop
                    </p>
                    <p className="text-xs">PDF, PNG, JPG, DOCX, etc.</p>
                  </div>
                )}
              </div>
            </div>
          </div>

          <div className="flex justify-end space-x-4">
            <Button variant="outline" type="button" onClick={onClose}>
              Cancel
            </Button>
            <Button type="submit" disabled={isLoading || !file || !selectedProjectId}>
              {isLoading ? "Uploading..." : "Upload Document"}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
} 
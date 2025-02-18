import React from "react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Plus, FolderPlus, ListTodo, Upload } from "lucide-react";

interface FloatingActionButtonProps {
  onNewProject?: () => void;
  onNewTask?: () => void;
  onUpload?: () => void;
  isOpen?: boolean;
}

const FloatingActionButton = ({
  onNewProject = () => console.log("New Project"),
  onNewTask = () => console.log("New Task"),
  onUpload = () => console.log("Upload"),
  isOpen = true,
}: FloatingActionButtonProps) => {
  return (
    <Dialog open={isOpen}>
      <DialogTrigger asChild>
        <Button
          className="fixed bottom-6 right-6 h-14 w-14 rounded-full shadow-lg bg-primary hover:bg-primary/90"
          size="icon"
        >
          <Plus className="h-6 w-6" />
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Create New</DialogTitle>
        </DialogHeader>
        <div className="grid gap-4 py-4">
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button
                className="w-full flex justify-between items-center"
                variant="outline"
              >
                <FolderPlus className="mr-2 h-4 w-4" />
                New Project
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent className="w-56">
              <DropdownMenuItem onClick={onNewProject}>
                Create Project
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>

          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button
                className="w-full flex justify-between items-center"
                variant="outline"
              >
                <ListTodo className="mr-2 h-4 w-4" />
                New Task
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent className="w-56">
              <DropdownMenuItem onClick={onNewTask}>
                Create Task
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>

          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button
                className="w-full flex justify-between items-center"
                variant="outline"
              >
                <Upload className="mr-2 h-4 w-4" />
                Upload Document
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent className="w-56">
              <DropdownMenuItem onClick={onUpload}>
                Upload Document
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default FloatingActionButton;

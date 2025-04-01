import { Button } from "@/components/ui/button";
import { UserPlus } from "lucide-react";

interface TeamHeaderProps {
  onAddMember: () => void;
}

export function TeamHeader({ onAddMember }: TeamHeaderProps) {
  return (
    <div className="flex items-center justify-between">
      <h1 className="text-3xl font-bold tracking-tight">Project Team</h1>
      <Button onClick={onAddMember}>
        <UserPlus className="mr-2 h-4 w-4" /> Add Team Member
      </Button>
    </div>
  );
} 
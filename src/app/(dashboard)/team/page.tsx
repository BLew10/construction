"use client";

import { useEffect, useState } from "react";
import { useTeamStore } from "@/store/teamStore";
import { TeamMembersDataTable } from "./(components)/team-members-data-table";
import { TeamMemberForm } from "./(components)/team-member-form";
import { Loader2 } from "lucide-react";

export default function GlobalTeamPage() {
  const { members, fetchMembers, isLoading, error } = useTeamStore();
  const [isTeamMemberFormOpen, setIsTeamMemberFormOpen] = useState(false);

  useEffect(() => {
    fetchMembers();
  }, [fetchMembers]);

  const handleCreateNewMember = () => {
    setIsTeamMemberFormOpen(true);
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between flex-wrap gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Team Management</h1>
          <p className="text-muted-foreground mt-2">
            Manage your team members and their roles.
          </p>
        </div>
      </div>

      {error && (
        <div className="text-red-600">Error loading team members: {error}</div>
      )}

      {isLoading && members.length === 0 ? (
        <div className="flex justify-center items-center h-64">
          <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
          <span className="ml-2">Loading team members...</span>
        </div>
      ) : (
        <TeamMembersDataTable
          data={members}
          isLoading={isLoading}
          onCreateNew={handleCreateNewMember}
        />
      )}

      <TeamMemberForm
        isOpen={isTeamMemberFormOpen}
        onClose={() => setIsTeamMemberFormOpen(false)}
      />
    </div>
  );
}

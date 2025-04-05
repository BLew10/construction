"use client";

import { useEffect, useState } from "react";
import { useProjectsStore } from "@/store/projectsStore";
import { Card, CardContent } from "@/components/ui/card";
import { ProjectsHeader } from "./(components)/projects-header";
import { ProjectsList } from "./(components)/projects-list";
import { Loader2 } from "lucide-react";

export default function ProjectsPage() {
  const { projects, fetchProjects, deleteProject, isLoading, error } =
    useProjectsStore();
  const [searchQuery, setSearchQuery] = useState("");

  useEffect(() => {
    fetchProjects();
  }, [fetchProjects]);

  const filteredProjects = projects.filter(
    (project) =>
      project.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      project.address.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="space-y-4 sm:space-y-6">
      <ProjectsHeader
        searchQuery={searchQuery}
        onSearchChange={setSearchQuery}
      />

      {error && (
        <div className="text-red-600 p-3 bg-red-50 rounded-md text-sm">
          Error loading projects: {error}
        </div>
      )}

      {isLoading && projects.length === 0 ? (
        <div className="flex justify-center items-center h-48">
          <Loader2 className="h-6 w-6 animate-spin text-muted-foreground" />
          <span className="ml-2 text-sm">Loading projects...</span>
        </div>
      ) : (
        <Card>
          <CardContent className="p-0 sm:p-1">
            <ProjectsList projects={filteredProjects} onDelete={deleteProject} />
          </CardContent>
        </Card>
      )}
    </div>
  );
}

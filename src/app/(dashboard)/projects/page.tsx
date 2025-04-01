"use client";

import { useEffect, useState } from "react";
import { useProjectsStore } from "@/store/projectsStore";
import { Card, CardContent } from "@/components/ui/card";
import { ProjectsHeader } from "./(components)/projects-header";
import { ProjectsList } from "./(components)/projects-list";

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

  if (isLoading) {
    return <div>Loading...</div>;
  }

  if (error) {
    return <div>Error: {error}</div>;
  }

  return (
    <div className="space-y-6">
      <ProjectsHeader
        searchQuery={searchQuery}
        onSearchChange={setSearchQuery}
      />

      <Card>
        <CardContent className="p-0">
          <ProjectsList projects={filteredProjects} onDelete={deleteProject} />
        </CardContent>
      </Card>
    </div>
  );
}

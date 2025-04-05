"use client";

import { useEffect } from "react";
import { useParams } from "next/navigation";
import { useProjectsStore } from "@/store/projectsStore";
import { format } from "date-fns";
import {
  CalendarIcon,
  DollarSignIcon,
  MapPinIcon,
  UsersIcon,
} from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

export default function ProjectPage() {
  const params = useParams();
  const projectId = params.id as string;
  const { currentProject, setCurrentProject, fetchProjects, isLoading, error } =
    useProjectsStore();

  useEffect(() => {
    // First fetch all projects if they're not loaded
    if (!currentProject) {
      fetchProjects().then(() => {
        setCurrentProject(projectId);
      });
    } else if (currentProject.id !== projectId) {
      setCurrentProject(projectId);
    }
  }, [currentProject, projectId, setCurrentProject, fetchProjects]);

  if (isLoading) {
    return <div className="flex justify-center py-8">Loading project...</div>;
  }

  if (error || !currentProject) {
    return (
      <div className="bg-destructive/10 border border-destructive text-destructive px-4 py-3 rounded-md">
        {error || "Project not found"}
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold tracking-tight">
            {currentProject.name}
          </h1>
          <div className="flex items-center mt-2 text-muted-foreground">
            <MapPinIcon className="mr-1 h-4 w-4 flex-shrink-0" />
            <span className="truncate">{currentProject.address}</span>
          </div>
        </div>
      </div>

      <div className="grid gap-4 sm:gap-6 grid-cols-1 sm:grid-cols-2 lg:grid-cols-4">
        <Card className="h-full">
          <CardHeader className="flex flex-row items-center justify-between py-3 sm:py-4">
            <CardTitle className="text-sm font-medium">Status</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-xl sm:text-2xl font-bold mb-1">
              <Badge
                className="text-sm"
                variant={
                  currentProject.status === "active"
                    ? "default"
                    : currentProject.status === "completed"
                    ? "secondary"
                    : currentProject.status === "onHold"
                    ? "destructive"
                    : "outline"
                }
              >
                {currentProject.status === "onHold"
                  ? "On Hold"
                  : currentProject.status.charAt(0).toUpperCase() +
                    currentProject.status.slice(1)}
              </Badge>
            </div>
          </CardContent>
        </Card>

        <Card className="h-full">
          <CardHeader className="flex flex-row items-center justify-between py-3 sm:py-4">
            <CardTitle className="text-sm font-medium">Timeline</CardTitle>
            <CalendarIcon className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-xl sm:text-2xl font-bold">
              {Math.ceil(
                (new Date(currentProject.endDate).getTime() -
                  new Date(currentProject.startDate).getTime()) /
                  (1000 * 60 * 60 * 24 * 7)
              )}{" "}
              weeks
            </div>
            <p className="text-xs text-muted-foreground">
              {format(new Date(currentProject.startDate), "MMM d, yyyy")} -{" "}
              {format(new Date(currentProject.endDate), "MMM d, yyyy")}
            </p>
          </CardContent>
        </Card>

        <Card className="h-full">
          <CardHeader className="flex flex-row items-center justify-between py-3 sm:py-4">
            <CardTitle className="text-sm font-medium">Budget</CardTitle>
            <DollarSignIcon className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-xl sm:text-2xl font-bold">
              ${currentProject.budget.toLocaleString()}
            </div>
            <p className="text-xs text-muted-foreground">
              Project total budget
            </p>
          </CardContent>
        </Card>

        <Card className="h-full">
          <CardHeader className="flex flex-row items-center justify-between py-3 sm:py-4">
            <CardTitle className="text-sm font-medium">Team</CardTitle>
            <UsersIcon className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-xl sm:text-2xl font-bold">12</div>
            <p className="text-xs text-muted-foreground">Team members</p>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

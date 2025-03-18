"use client";

import { useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import { useProjectsStore } from "@/store/projectsStore";
import { format } from "date-fns";
import {
  CalendarIcon,
  ClipboardListIcon,
  DollarSignIcon,
  FileTextIcon,
  MapPinIcon,
  UsersIcon,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";

export default function ProjectPage() {
  const params = useParams();
  const router = useRouter();
  const projectId = params.id as string;
  const { currentProject, setCurrentProject, isLoading, error } =
    useProjectsStore();

  useEffect(() => {
    if (!currentProject || currentProject.id !== projectId) {
      setCurrentProject(projectId);
    }
  }, [currentProject, projectId, setCurrentProject]);

  if (isLoading) {
    return <div className="flex justify-center py-8">Loading project...</div>;
  }

  if (error || !currentProject) {
    return (
      <div className="text-red-500">
        Error loading project: {error || "Project not found"}
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">
            {currentProject.name}
          </h1>
          <div className="flex items-center mt-2 text-muted-foreground">
            <MapPinIcon className="mr-1 h-4 w-4" />
            {currentProject.address}
          </div>
        </div>
        <div className="flex items-center space-x-2">
          <Button
            variant="outline"
            onClick={() => router.push(`/projects/${projectId}/edit`)}
          >
            Edit Project
          </Button>
        </div>
      </div>

      <div className="grid gap-6 grid-cols-1 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between py-4">
            <CardTitle className="text-sm font-medium">Status</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold mb-1">
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

        <Card>
          <CardHeader className="flex flex-row items-center justify-between py-4">
            <CardTitle className="text-sm font-medium">Timeline</CardTitle>
            <CalendarIcon className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {Math.ceil(
                (new Date(currentProject.endDate).getTime() -
                  new Date(currentProject.startDate).getTime()) /
                  (1000 * 60 * 60 * 24 * 7)
              )}{" "}
              weeks
            </div>
            <p className="text-xs text-muted-foreground">
              {format(new Date(currentProject.startDate), "MMM d, yyyy")} -
              {format(new Date(currentProject.endDate), "MMM d, yyyy")}
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between py-4">
            <CardTitle className="text-sm font-medium">Budget</CardTitle>
            <DollarSignIcon className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              ${currentProject.budget.toLocaleString()}
            </div>
            <p className="text-xs text-muted-foreground">
              Project total budget
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between py-4">
            <CardTitle className="text-sm font-medium">Team</CardTitle>
            <UsersIcon className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">12</div>
            <p className="text-xs text-muted-foreground">Team members</p>
          </CardContent>
        </Card>
      </div>

      <Tabs defaultValue="overview" className="mt-6">
        <TabsList className="grid w-full grid-cols-4 lg:w-auto">
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger
            value="schedule"
            onClick={() => router.push(`/projects/${projectId}/schedule`)}
          >
            Schedule
          </TabsTrigger>
          <TabsTrigger
            value="documents"
            onClick={() => router.push(`/projects/${projectId}/documents`)}
          >
            Documents
          </TabsTrigger>
          <TabsTrigger value="team">Team</TabsTrigger>
        </TabsList>
        <TabsContent value="overview" className="mt-6">
          <Card>
            <CardHeader>
              <CardTitle>Project Description</CardTitle>
            </CardHeader>
            <CardContent>
              <p>{currentProject.description || "No description available."}</p>
            </CardContent>
          </Card>

          <div className="grid gap-6 grid-cols-1 md:grid-cols-2 mt-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <ClipboardListIcon className="mr-2 h-5 w-5" />
                  Recent Activity
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-muted-foreground text-center py-8">
                  No recent activity to display
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <FileTextIcon className="mr-2 h-5 w-5" />
                  Recent Documents
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-muted-foreground text-center py-8">
                  No recent documents to display
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="schedule" className="mt-6">
          {/* Content will load from schedule page */}
        </TabsContent>

        <TabsContent value="documents" className="mt-6">
          {/* Content will load from documents page */}
        </TabsContent>

        <TabsContent value="team" className="mt-6">
          <Card>
            <CardHeader>
              <CardTitle>Project Team</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-muted-foreground text-center py-8">
                Team management features coming soon
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}

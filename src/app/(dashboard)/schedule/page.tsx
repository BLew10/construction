"use client";

import { useState, useEffect } from "react";
import { useProjectsStore } from "@/store/projectsStore";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Calendar, List, BarChart3, Users, Plus } from "lucide-react";
// Assuming you have these components or will create them:
import { TimelineOverview } from "./(components)/timeline-overview";
import { ProjectsScheduleList } from "./(components)/projects-schedule-list";
import { ScheduleMetrics } from "./(components)/schedule-metrics";
import { ResourceAllocation } from "./(components)/resource-allocation";
import { ProjectFilter } from "./(components)/project-filter";
import { ScheduleMetricsCards } from "./(components)/schedule-metrics-cards";
import { useTasksStore } from "@/store/tasksStore"; // Import task store

export default function SchedulePage() {
  const {
    projects,
    fetchProjects,
    isLoading: projectsLoading,
    fetchProjectsWithTasks,
  } = useProjectsStore();
  // You'll likely need tasks across all projects for the overview
  const { tasks, fetchAllTasks, isLoading: tasksLoading } = useTasksStore();
  const [view, setView] = useState<"timeline" | "list">("timeline");
  const [selectedProjects, setSelectedProjects] = useState<string[]>([]);

  useEffect(() => {
    fetchProjects();
    // This now assumes fetchTasks() in the store fetches all tasks
    fetchAllTasks();
  }, [fetchProjects, fetchAllTasks]);


  // Filter projects based on selection
  const displayProjects =
    selectedProjects.length > 0
      ? projects.filter((p) => selectedProjects.includes(p.id))
      : projects;

  if (projectsLoading || tasksLoading) {
    return <div>Loading schedule data...</div>;
  }

  return (
    <div className="space-y-6 p-6">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Schedule</h1>
          <p className="text-muted-foreground">
            Manage and track project timelines across the organization
          </p>
        </div>
      </div>
      {/* Wrap the Card with the Tabs component */}
      <Tabs
        value={view}
        onValueChange={(v) => setView(v as any)}
        className="flex flex-col"
      >
        <Card>
          <CardHeader className="pb-3">
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
              <CardTitle>Projects Timeline</CardTitle>
              {/* TabsList is now a direct child of the main Tabs component */}
              <TabsList>
                <TabsTrigger value="timeline">
                  <Calendar className="mr-2 h-4 w-4" />
                  Timeline
                </TabsTrigger>
                <TabsTrigger value="list">
                  <List className="mr-2 h-4 w-4" />
                  List
                </TabsTrigger>
              </TabsList>
            </div>

            <div className="mt-4">
              <ProjectFilter
                projects={projects} // Pass all projects for filtering
                selectedProjects={selectedProjects}
                onChange={setSelectedProjects}
              />
            </div>
          </CardHeader>

          {/* CardContent containing TabsContent is now also a child of the main Tabs component */}
          <CardContent>
            <TabsContent value="timeline" className="mt-0">
              <TimelineOverview projects={displayProjects} />
            </TabsContent>

            <TabsContent value="list" className="mt-0">
              <ProjectsScheduleList projects={displayProjects} />
            </TabsContent>
          </CardContent>
        </Card>
      </Tabs>{" "}
      <ScheduleMetricsCards projects={displayProjects} />
    </div>
  );
}

import { Card } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { cn } from "@/lib/utils";
import { STATUS_COLORS } from "@/lib/constants";
import { Project } from "@/types/project";
import { Task } from "@/store/tasksStore";
import {
  differenceInMilliseconds,
  format,
  eachMonthOfInterval,
} from "date-fns";
import { useEffect, useRef, useState } from "react";

// Define a minimum width for each month column in pixels
const MIN_MONTH_WIDTH = 80; // Minimum width per month

interface TimelineOverviewProps {
  projects: Project[];
  dateRange?: { from: Date; to: Date };
}

// Helper to format month labels
const formatMonthLabel = (date: Date, index: number) => {
  const showYear = date.getMonth() === 0 || index === 0;
  return showYear ? format(date, "MMM yyyy") : format(date, "MMM");
};

// Debug helper to log dates in a consistent format
const debugDate = (date: Date | string, label: string) => {
  const dateObj = typeof date === "string" ? new Date(date) : date;
  console.log(`${label}: ${format(dateObj, "yyyy-MM-dd")}`);
};

// Helper function to get status colors from the constants
const getStatusClasses = (status?: string) => {
  if (!status) return STATUS_COLORS.default;

  const normalizedStatus = status.toLowerCase().trim();

  // Direct match with our status constants
  if (Object.keys(STATUS_COLORS).includes(normalizedStatus)) {
    return STATUS_COLORS[normalizedStatus as keyof typeof STATUS_COLORS];
  }

  // Handle various status formats with partial matching
  if (normalizedStatus.includes("complet")) {
    return STATUS_COLORS.completed;
  }
  if (
    normalizedStatus.includes("progress") ||
    normalizedStatus.includes("active")
  ) {
    return STATUS_COLORS["in progress"];
  }
  if (normalizedStatus.includes("risk")) {
    return STATUS_COLORS["at risk"];
  }
  if (normalizedStatus.includes("delay") || normalizedStatus.includes("late")) {
    return STATUS_COLORS.delayed;
  }
  if (normalizedStatus.includes("cancel")) {
    return STATUS_COLORS.cancelled;
  }
  if (
    normalizedStatus.includes("plan") ||
    normalizedStatus.includes("not start")
  ) {
    return STATUS_COLORS["not started"];
  }

  // Default fallback
  return STATUS_COLORS.default;
};

export function TimelineOverview({
  projects,
  dateRange,
}: TimelineOverviewProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const [containerWidth, setContainerWidth] = useState(0);

  console.log(projects);

  // Calculate date range directly from project dates instead of tasks
  let viewStartDate;
  let viewEndDate;

  // Use dateRange if explicitly provided
  if (dateRange?.from && dateRange?.to) {
    viewStartDate = dateRange.from;
    viewEndDate = dateRange.to;
  } else if (projects.length > 0) {
    // Find the earliest start date and latest end date from all projects
    // Ensure proper date parsing - handles both Date objects and ISO strings
    const projectDates = projects.map((project) => ({
      start: new Date(project.startDate),
      end: new Date(project.endDate),
    }));

    viewStartDate = new Date(
      Math.min(...projectDates.map((dates) => dates.start.getTime()))
    );
    viewEndDate = new Date(
      Math.max(...projectDates.map((dates) => dates.end.getTime()))
    );

    // Add a bit of padding (1 month) to the end date for better visualization
    viewEndDate = new Date(viewEndDate);
    viewEndDate.setMonth(viewEndDate.getMonth() + 1);
  } else {
    // Fallback to default range if no projects
    viewStartDate = new Date();
    viewEndDate = new Date();
    viewEndDate.setMonth(viewEndDate.getMonth() + 3);
  }

  // Log calculated date range
  useEffect(() => {
    if (viewStartDate && viewEndDate) {
      debugDate(viewStartDate, "Timeline start date");
      debugDate(viewEndDate, "Timeline end date");
    }
  }, [viewStartDate, viewEndDate]);

  if (viewStartDate >= viewEndDate) {
    return (
      <div className="text-muted-foreground p-4">
        Please select a valid date range.
      </div>
    );
  }

  // Adjust view dates to encompass full months
  const timelineStart = new Date(
    viewStartDate.getFullYear(),
    viewStartDate.getMonth(),
    1
  );
  const timelineEnd = new Date(
    viewEndDate.getFullYear(),
    viewEndDate.getMonth() + 1,
    0
  );

  const totalDurationMs = differenceInMilliseconds(timelineEnd, timelineStart);

  // Generate array of all months in the adjusted date range
  const monthsInRange = eachMonthOfInterval({
    start: timelineStart,
    end: timelineEnd,
  });
  const totalMonths = monthsInRange.length;

  // Get container width and update on resize
  useEffect(() => {
    if (!containerRef.current) return;

    const updateWidth = () => {
      if (containerRef.current) {
        setContainerWidth(containerRef.current.offsetWidth);
      }
    };

    // Initial measurement
    updateWidth();

    // Update on resize
    const resizeObserver = new ResizeObserver(updateWidth);
    resizeObserver.observe(containerRef.current);

    return () => {
      if (containerRef.current) {
        resizeObserver.unobserve(containerRef.current);
      }
    };
  }, []);

  // Calculate month width based on available space, with a minimum
  const monthWidth = Math.max(
    containerWidth > 0 ? containerWidth / totalMonths : MIN_MONTH_WIDTH,
    MIN_MONTH_WIDTH
  );

  // Calculate the total timeline width
  const totalTimelineWidth = monthWidth * totalMonths;

  // Helper function to calculate position and width in PIXELS
  const getTaskStyle = (task: Task) => {
    if (!totalDurationMs || totalDurationMs <= 0)
      return { left: "0px", width: "0px" };

    const taskStartMs = new Date(task.startDate).getTime();
    const taskEndMs = new Date(task.endDate).getTime();

    // Clamp task times to the view range
    const clampedStartMs = Math.max(taskStartMs, timelineStart.getTime());
    const clampedEndMs = Math.min(taskEndMs, timelineEnd.getTime());

    // Calculate pixel positions
    const pixelsPerMillisecond = totalTimelineWidth / totalDurationMs;
    const leftPx =
      (clampedStartMs - timelineStart.getTime()) * pixelsPerMillisecond;
    const widthPx = (clampedEndMs - clampedStartMs) * pixelsPerMillisecond;

    return {
      left: `${leftPx}px`,
      width: `${Math.max(widthPx, 2)}px`, // Ensure minimum pixel width
    };
  };

  // Helper function to calculate position and width for projects
  const getProjectStyle = (project: Project) => {
    if (!totalDurationMs || totalDurationMs <= 0)
      return { left: "0px", width: "0px" };

    // Ensure consistent date handling by explicitly creating Date objects
    const projectStartMs = new Date(project.startDate).getTime();
    const projectEndMs = new Date(project.endDate).getTime();

    // Clamp project times to the view range
    const clampedStartMs = Math.max(projectStartMs, timelineStart.getTime());
    const clampedEndMs = Math.min(projectEndMs, timelineEnd.getTime());

    // Calculate pixel positions
    const pixelsPerMillisecond = totalTimelineWidth / totalDurationMs;
    const leftPx =
      (clampedStartMs - timelineStart.getTime()) * pixelsPerMillisecond;
    const widthPx = (clampedEndMs - clampedStartMs) * pixelsPerMillisecond;

    return {
      left: `${leftPx}px`,
      width: `${Math.max(widthPx, 5)}px`, // Slightly larger minimum width for projects
    };
  };

  return (
    <div className="overflow-x-auto relative" ref={containerRef}>
      <div
        className="relative"
        style={{ width: `${totalTimelineWidth}px`, minHeight: "200px" }}
      >
        {/* Timeline header */}
        <div className="sticky top-0 z-20 bg-background h-10 mb-4 border-b">
          {monthsInRange.map((date, index) => {
            const leftPosition = index * monthWidth;
            return (
              <div
                key={`header-${index}`}
                className="absolute top-0 text-xs h-full flex items-center border-r"
                style={{
                  left: `${leftPosition}px`,
                  width: `${monthWidth}px`,
                }}
              >
                <div className="text-muted-foreground px-2 font-medium">
                  {formatMonthLabel(date, index)}
                </div>
              </div>
            );
          })}
        </div>

        {/* Vertical Grid Lines */}
        <div className="absolute inset-0 top-10 bottom-0 z-0">
          {monthsInRange.map((date, index) => {
            const leftPosition = index * monthWidth;
            return (
              <div
                key={`grid-${index}`}
                className="absolute top-0 bottom-0 w-px bg-border/50"
                style={{ left: `${leftPosition}px` }}
              />
            );
          })}
        </div>

        {/* Projects and Tasks */}
        <div className="relative space-y-6 pt-2 px-2 min-h-[500px] z-10">
          {projects.map((project, index) => {
            // Get status-specific styling
            const statusClasses = getStatusClasses(project.status);

            return (
              <div key={project.id} className="space-y-1">
                {/* Project name - outside the timeline track */}
                <h3 className="font-medium text-sm sticky left-0 bg-background z-20 py-1 px-2 w-fit rounded-sm">
                  {project.name}
                </h3>

                {/* Project timeline track */}
                <div className="relative h-20 bg-muted/10 rounded-sm">
                  {/* Project timeline bar - now with status-dependent styling */}
                  <div
                    className={cn(
                      "absolute h-9 top-1/4 -translate-y-1/2 rounded-md border flex items-center",
                      statusClasses.background,
                      statusClasses.border,
                      statusClasses.text
                    )}
                    style={getProjectStyle(project)}
                    title={`${project.name} (${format(
                      new Date(project.startDate),
                      "MMM d, yyyy"
                    )} - ${format(new Date(project.endDate), "MMM d, yyyy")})`}
                  >
                    {/* Only show content if the bar is wide enough */}
                    <div className="px-2 py-1 truncate flex flex-col h-full w-full justify-center">
                      <div className="flex items-center justify-between gap-1 flex-1">
                        <span className="font-medium text-xs truncate">
                          {project.name}
                        </span>
                        <span className="text-[10px] bg-background/20 px-1.5 py-0.5 rounded-full whitespace-nowrap">
                          {project.status}
                        </span>
                      </div>

                      <div className="flex items-center justify-between text-[9px] mt-0.5 flex-1">
                        <span className="whitespace-nowrap">
                          {format(new Date(project.startDate), "MM/dd/yy")} -{" "}
                          {format(new Date(project.endDate), "MM/dd/yy")}
                        </span>
                        {project.budget && (
                          <span className="ml-1 whitespace-nowrap">
                            ${project.budget}
                          </span>
                        )}
                      </div>
                    </div>
                  </div>

                  {/* Stacked tasks container - positioned below project */}
                  <div className="absolute top-[60%] left-0 right-0 bottom-0">
                    {project.tasks?.map((task: Task, taskIndex: number) => {
                      // Get task-specific styling based on status
                      const taskStatus = task.status || "default";
                      const isCompleted =
                        taskStatus.toLowerCase() === "completed";
                      const isCritical = task.criticalPath;

                      // Get task position styling
                      const taskStyle = getTaskStyle(task);

                      return (
                        <div
                          key={task.id}
                          title={`${task.name} (${format(
                            new Date(task.startDate),
                            "MMM d, yyyy"
                          )} - ${format(
                            new Date(task.endDate),
                            "MMM d, yyyy"
                          )})`}
                          className={cn(
                            "absolute h-4 rounded-sm px-1 flex items-center overflow-hidden whitespace-nowrap border border-slate-300/30",
                            isCompleted
                              ? "bg-green-500/70 text-green-50"
                              : isCritical
                              ? "bg-destructive/70 text-destructive-foreground"
                              : "bg-secondary/70 text-secondary-foreground",
                            "hover:opacity-80 cursor-pointer z-10"
                          )}
                          style={{
                            ...taskStyle,
                            top: `${taskIndex * 5}px`, // Stack tasks vertically with 5px spacing
                          }}
                        >
                          <span className="truncate text-[10px]">
                            {task.name}
                          </span>
                        </div>
                      );
                    })}
                  </div>
                </div>
              </div>
            );
          })}
          {projects.length === 0 && (
            <div className="text-center text-muted-foreground py-8">
              No projects match the current filter.
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

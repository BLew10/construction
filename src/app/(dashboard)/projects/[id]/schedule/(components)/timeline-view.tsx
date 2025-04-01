"use client";

import { Card, CardContent } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { cn } from "@/lib/utils";
import {
  format,
  eachMonthOfInterval,
  differenceInMilliseconds,
} from "date-fns";
import { Task, TaskStatus } from "@/store/tasksStore";

interface TimelineViewProps {
  tasks: Task[]; // Use the local TimelineTask interface
  startDate: Date;
  endDate: Date;
  onEditTask?: (task: Task) => void; // Add this prop
}

// Helper to format month labels
const formatMonthLabel = (date: Date, index: number) => {
  const showYear = date.getMonth() === 0 || index === 0;
  return showYear ? format(date, "MMM yyyy") : format(date, "MMM");
};

// Define a minimum width for each month column in pixels
const MONTH_COLUMN_WIDTH = 80; // Adjust as needed for desired spacing

export function TimelineView({ tasks, startDate, endDate, onEditTask }: TimelineViewProps) {
  // Ensure start date is the beginning of the month and end date is the end of the month for accurate range
  const viewStartDate = new Date(
    startDate.getFullYear(),
    startDate.getMonth(),
    1
  );
  const viewEndDate = new Date(
    endDate.getFullYear(),
    endDate.getMonth() + 1,
    0
  ); // Day 0 gets the last day of the previous month

  const projectDurationMs = differenceInMilliseconds(
    viewEndDate,
    viewStartDate
  );

  // Generate array of all months in the adjusted date range
  const monthsInRange = eachMonthOfInterval({
    start: viewStartDate,
    end: viewEndDate,
  });
  const totalMonths = monthsInRange.length;

  // Calculate the total width needed for the timeline content
  const totalTimelineWidth = totalMonths * MONTH_COLUMN_WIDTH;

  // Helper function to calculate position and width in PIXELS
  const getTaskStyle = (task: Task) => {
    const taskStartMs = new Date(task.startDate).getTime();
    const taskEndMs = new Date(task.endDate).getTime();

    // Clamp task times to the view range
    const clampedStartMs = Math.max(taskStartMs, viewStartDate.getTime());
    const clampedEndMs = Math.min(taskEndMs, viewEndDate.getTime());

    // Calculate pixel positions
    const pixelsPerMillisecond = totalTimelineWidth / projectDurationMs;
    const leftPx =
      (clampedStartMs - viewStartDate.getTime()) * pixelsPerMillisecond;
    const widthPx = (clampedEndMs - clampedStartMs) * pixelsPerMillisecond;

    return {
      left: `${leftPx}px`,
      width: `${Math.max(widthPx, 2)}px`, // Ensure minimum pixel width
    };
  };

  // Find if we should add year dividers
  const hasMultipleYears =
    totalMonths > 0 &&
    monthsInRange[0].getFullYear() !==
      monthsInRange[totalMonths - 1].getFullYear();

  return (
    <Card>
      {/* Make CardContent scrollable horizontally */}
      <CardContent className="p-6 overflow-x-auto">
        {/* Wrapper div to establish the total width for scrolling */}
        <div className="relative" style={{ width: `${totalTimelineWidth}px` }}>
          {/* Timeline header */}
          <div className="relative h-10 mb-4 border-b z-10">
            {" "}
            {/* Added z-10 */}
            {monthsInRange.map((date, index) => {
              const leftPosition = index * MONTH_COLUMN_WIDTH;

              return (
                <div
                  key={`header-${index}`}
                  className="absolute top-0 text-sm h-full flex items-center" // Use flex to center vertically
                  style={{
                    left: `${leftPosition}px`,
                    width: `${MONTH_COLUMN_WIDTH}px`,
                  }}
                >
                  {/* Month label */}
                  <div className="text-muted-foreground px-2">
                    {" "}
                    {/* Add padding */}
                    {formatMonthLabel(date, index)}
                  </div>
                </div>
              );
            })}
          </div>

          {/* Vertical Grid Lines (Month and Year) - Rendered behind tasks */}
          <div className="absolute inset-0 top-0 bottom-0">
            {" "}
            {/* Changed: Lines container */}
            {monthsInRange.map((date, index) => {
              const isYearStart = date.getMonth() === 0;
              const leftPosition = index * MONTH_COLUMN_WIDTH;

              return (
                <div
                  key={`lines-${index}`}
                  className="absolute top-0 bottom-0"
                  style={{ left: `${leftPosition}px` }}
                >
                  {/* Month grid line (start of the month) */}
                  <div
                    className="absolute top-0 bottom-0 left-0 w-px border-l border-dashed border-border/30" // Changed: top-0, bottom-0
                    style={{ zIndex: 0 }} // Ensure lines are behind tasks
                  />

                  {/* Year divider */}
                  {isYearStart && hasMultipleYears && index > 0 && (
                    <div
                      className="absolute top-0 bottom-0 left-0 w-px bg-foreground/30" // Changed: top-0, bottom-0, bg-foreground/30 for distinction
                      style={{ zIndex: 1 }} // Ensure year line is above month line but behind tasks
                    />
                  )}
                </div>
              );
            })}
          </div>

          {/* Tasks */}
          <div className="relative space-y-4 mt-8">
            {" "}
            {/* Removed h-full, ensure tasks are above lines */}
            {tasks.map((task) => (
              <div key={task.id} className="relative h-12">
                <div
                  className={cn(
                    "absolute h-8 rounded-md px-2 py-1 text-sm flex items-center overflow-hidden z-20",
                    task.criticalPath ? "bg-destructive/10" : "bg-secondary",
                    task.status === "completed" && "bg-green-500/20",
                    onEditTask && "cursor-pointer hover:brightness-95" // Add cursor and hover effect if editable
                  )}
                  style={getTaskStyle(task)}
                  onClick={() => onEditTask && onEditTask(task)} // Add click handler
                >
                  <div className="w-full">
                    <div className="font-medium truncate">{task.name}</div>
                    <Progress value={task.progress} className="h-1 mt-1" />
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </CardContent>
    </Card>
  );
}

// Helper function to get color based on status (ensure status matches TaskStatus)
const getStatusColor = (status: string) => {
  // ... existing code ...
};

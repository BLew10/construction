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
import { useState, useEffect } from "react";

interface TimelineViewProps {
  tasks: Task[]; 
  startDate: Date;
  endDate: Date;
  onEditTask?: (task: Task) => void;
}

const formatMonthLabel = (date: Date, index: number) => {
  const showYear = date.getMonth() === 0 || index === 0;
  return showYear ? format(date, "MMM yyyy") : format(date, "MMM");
};

// Responsive column width based on screen size
const useMonthColumnWidth = () => {
  const [columnWidth, setColumnWidth] = useState(80);
  
  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth < 640) {
        setColumnWidth(60); // Smaller width on small screens
      } else {
        setColumnWidth(80); // Default width on larger screens
      }
    };
    
    // Set initial value
    handleResize();
    
    // Listen for window resize
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);
  
  return columnWidth;
};

export function TimelineView({ tasks, startDate, endDate, onEditTask }: TimelineViewProps) {
  const MONTH_COLUMN_WIDTH = useMonthColumnWidth();
  
  // Ensure start date is the beginning of the month and end date is the end of the month
  const viewStartDate = new Date(
    startDate.getFullYear(),
    startDate.getMonth(),
    1
  );
  const viewEndDate = new Date(
    endDate.getFullYear(),
    endDate.getMonth() + 1,
    0
  );

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
      <CardContent className="p-2 sm:p-4 md:p-6 overflow-x-auto">
        <div className="relative" style={{ width: `${totalTimelineWidth}px`, minWidth: "100%" }}>
          {/* Timeline header */}
          <div className="relative h-8 sm:h-10 mb-2 sm:mb-4 border-b z-10">
            {monthsInRange.map((date, index) => {
              const leftPosition = index * MONTH_COLUMN_WIDTH;

              return (
                <div
                  key={`header-${index}`}
                  className="absolute top-0 text-xs sm:text-sm h-full flex items-center"
                  style={{
                    left: `${leftPosition}px`,
                    width: `${MONTH_COLUMN_WIDTH}px`,
                  }}
                >
                  <div className="text-muted-foreground px-1 sm:px-2 truncate">
                    {formatMonthLabel(date, index)}
                  </div>
                </div>
              );
            })}
          </div>

          {/* Vertical Grid Lines (Month and Year) - Rendered behind tasks */}
          <div className="absolute inset-0 top-0 bottom-0">
            {monthsInRange.map((date, index) => {
              const isYearStart = date.getMonth() === 0;
              const leftPosition = index * MONTH_COLUMN_WIDTH;

              return (
                <div
                  key={`lines-${index}`}
                  className="absolute top-0 bottom-0"
                  style={{ left: `${leftPosition}px` }}
                >
                  {/* Month grid line */}
                  <div
                    className="absolute top-0 bottom-0 left-0 w-px border-l border-dashed border-border/30"
                    style={{ zIndex: 0 }}
                  />

                  {/* Year divider */}
                  {isYearStart && hasMultipleYears && index > 0 && (
                    <div
                      className="absolute top-0 bottom-0 left-0 w-px bg-foreground/30"
                      style={{ zIndex: 1 }}
                    />
                  )}
                </div>
              );
            })}
          </div>

          {/* Tasks */}
          <div className="relative space-y-2 sm:space-y-4 mt-4 sm:mt-8">
            {tasks.map((task) => (
              <div key={task.id} className="relative h-8 sm:h-12">
                <div
                  className={cn(
                    "absolute h-6 sm:h-8 rounded-md px-1 sm:px-2 py-1 text-xs sm:text-sm flex items-center overflow-hidden z-20",
                    task.criticalPath ? "bg-destructive/10" : "bg-secondary",
                    task.status === "completed" && "bg-green-500/20",
                    onEditTask && "cursor-pointer hover:brightness-95 active:brightness-90"
                  )}
                  style={getTaskStyle(task)}
                  onClick={() => onEditTask && onEditTask(task)}
                >
                  <div className="w-full">
                    <div className="font-medium truncate text-xs sm:text-sm">{task.name}</div>
                    <Progress value={task.progress} className="h-1 mt-1" />
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Touch-friendly hint for small screens */}
          <div className="sm:hidden text-xs text-center text-muted-foreground mt-2 italic">
            Swipe horizontally to see more
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

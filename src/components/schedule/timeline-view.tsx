"use client";

import { Card, CardContent } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { cn } from "@/lib/utils";

interface TimelineTask {
  id: string;
  name: string;
  startDate: string;
  endDate: string;
  progress: number;
  status: string;
  phase: string;
  dependencies: string[];
  assignedTo: string[];
  criticalPath: boolean;
}

interface TimelineViewProps {
  tasks: TimelineTask[];
  startDate: Date;
  endDate: Date;
}

export function TimelineView({ tasks, startDate, endDate }: TimelineViewProps) {
  const projectDuration = endDate.getTime() - startDate.getTime();
  
  // Helper function to calculate position and width
  const getTaskStyle = (task: TimelineTask) => {
    const taskStart = new Date(task.startDate).getTime();
    const taskEnd = new Date(task.endDate).getTime();
    
    const left = ((taskStart - startDate.getTime()) / projectDuration) * 100;
    const width = ((taskEnd - taskStart) / projectDuration) * 100;
    
    return {
      left: `${left}%`,
      width: `${width}%`,
    };
  };

  return (
    <Card>
      <CardContent className="p-6">
        {/* Timeline header with months */}
        <div className="relative h-8 mb-4 border-b">
          {Array.from({ length: 12 }).map((_, index) => {
            const date = new Date(startDate);
            date.setMonth(date.getMonth() + index);
            return (
              <div
                key={index}
                className="absolute text-sm text-muted-foreground"
                style={{ left: `${(index / 12) * 100}%` }}
              >
                {date.toLocaleDateString(undefined, { month: 'short' })}
              </div>
            );
          })}
        </div>

        {/* Tasks */}
        <div className="relative space-y-4">
          {tasks.map((task) => (
            <div key={task.id} className="relative h-12">
              <div
                className={cn(
                  "absolute h-8 rounded-md px-2 py-1 text-sm flex items-center",
                  task.criticalPath ? "bg-destructive/10" : "bg-secondary",
                  task.status === "completed" && "bg-primary/20"
                )}
                style={getTaskStyle(task)}
              >
                <div className="w-full">
                  <div className="font-medium truncate">{task.name}</div>
                  <Progress 
                    value={task.progress} 
                    className="h-1 mt-1"
                  />
                </div>
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
} 
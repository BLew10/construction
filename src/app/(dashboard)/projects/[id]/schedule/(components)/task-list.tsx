import { AlertCircle } from "lucide-react";
import { TaskStatusBadge } from "./status-badge";
import { Progress } from "@/components/ui/progress";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { TaskStatus } from "@/store/tasksStore";

interface Task {
  id: string;
  name: string;
  phase: string;
  startDate: string;
  endDate: string;
  progress: number;
  status: string;
  assignedTo: string[];
  criticalPath: boolean;
}

interface TaskListProps {
  tasks: Task[];
}

export function TaskList({ tasks }: TaskListProps) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Task List</CardTitle>
      </CardHeader>
      <CardContent>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Task Name</TableHead>
              <TableHead>Phase</TableHead>
              <TableHead>Start Date</TableHead>
              <TableHead>End Date</TableHead>
              <TableHead>Progress</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>Assigned To</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {tasks.map((task) => (
              <TableRow key={task.id}>
                <TableCell className="font-medium">
                  <div className="flex items-center gap-2">
                    {task.criticalPath && (
                      <AlertCircle className="h-4 w-4 text-destructive" />
                    )}
                    {task.name}
                  </div>
                </TableCell>
                <TableCell>{task.phase}</TableCell>
                <TableCell>
                  {new Date(task.startDate).toLocaleDateString()}
                </TableCell>
                <TableCell>
                  {new Date(task.endDate).toLocaleDateString()}
                </TableCell>
                <TableCell>
                  <div className="flex items-center gap-2">
                    <Progress value={task.progress} className="w-[60px]" />
                    <span className="text-sm text-muted-foreground">
                      {task.progress}%
                    </span>
                  </div>
                </TableCell>
                <TableCell>
                  <TaskStatusBadge status={task.status as TaskStatus} />
                </TableCell>
                <TableCell>{task.assignedTo.join(", ")}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  );
}

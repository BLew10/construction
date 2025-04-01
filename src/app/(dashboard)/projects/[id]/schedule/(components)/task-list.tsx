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
import { Task, TaskStatus } from "@/store/tasksStore";
import { MoreHorizontal, Pencil } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

interface TaskListProps {
  tasks: Task[];
  onEditTask: (task: Task) => void;
}

export function TaskList({ tasks, onEditTask }: TaskListProps) {
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
              <TableHead>Dependencies</TableHead>
              <TableHead className="w-[50px]"></TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {tasks.map((task) => (
              <TableRow 
                key={task.id} 
                className="cursor-pointer hover:bg-muted/50"
                onClick={() => onEditTask(task)}
              >
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
                <TableCell>{task.assignedTo?.join(", ") ?? "N/A"}</TableCell>
                <TableCell>
                  {task.dependsOn?.length 
                    ? task.dependsOn.map(id => 
                        tasks.find(t => t.id === id)?.name || id
                      ).join(", ")
                    : "None"
                  }
                </TableCell>
                <TableCell onClick={(e) => e.stopPropagation()}>
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button variant="ghost" className="h-8 w-8 p-0">
                        <span className="sr-only">Open menu</span>
                        <MoreHorizontal className="h-4 w-4" />
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                      <DropdownMenuItem onClick={() => onEditTask(task)}>
                        <Pencil className="mr-2 h-4 w-4" />
                        Edit
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  );
}

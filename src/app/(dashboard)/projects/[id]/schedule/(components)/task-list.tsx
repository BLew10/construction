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
  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString();
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Task List</CardTitle>
      </CardHeader>
      <CardContent>
        {/* Desktop view - table */}
        <div className="hidden md:block overflow-x-auto">
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
                  <TableCell>{formatDate(task.startDate)}</TableCell>
                  <TableCell>{formatDate(task.endDate)}</TableCell>
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
        </div>

        {/* Mobile view - cards */}
        <div className="md:hidden space-y-4">
          {tasks.map((task) => (
            <Card 
              key={task.id} 
              className="cursor-pointer hover:bg-muted/50"
              onClick={() => onEditTask(task)}
            >
              <CardContent className="p-4">
                <div className="flex justify-between items-start mb-2">
                  <div className="flex-1">
                    <div className="flex items-center gap-2 font-medium">
                      {task.criticalPath && (
                        <AlertCircle className="h-4 w-4 text-destructive" />
                      )}
                      {task.name}
                    </div>
                    <div className="text-sm text-muted-foreground mt-1">
                      {task.phase || "No phase"}
                    </div>
                  </div>
                  <TaskStatusBadge status={task.status as TaskStatus} />
                </div>
                
                <div className="grid grid-cols-2 gap-2 text-sm mt-3">
                  <div>
                    <div className="text-muted-foreground">Start Date</div>
                    <div>{formatDate(task.startDate)}</div>
                  </div>
                  <div>
                    <div className="text-muted-foreground">End Date</div>
                    <div>{formatDate(task.endDate)}</div>
                  </div>
                  <div className="col-span-2 mt-2">
                    <div className="flex justify-between items-center mb-1">
                      <span className="text-muted-foreground">Progress</span>
                      <span className="text-sm">{task.progress}%</span>
                    </div>
                    <Progress value={task.progress} />
                  </div>
                </div>
                
                <div className="flex justify-end mt-3">
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild onClick={(e) => e.stopPropagation()}>
                      <Button variant="ghost" size="sm" className="h-8 px-2">
                        <MoreHorizontal className="h-4 w-4" />
                        <span className="ml-2">Options</span>
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                      <DropdownMenuItem onClick={(e) => {
                        e.stopPropagation();
                        onEditTask(task);
                      }}>
                        <Pencil className="mr-2 h-4 w-4" />
                        Edit
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}

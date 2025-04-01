import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";

interface Task {
  id: string;
  status: string;
  progress: number;
  criticalPath: boolean;
}

interface MetricsCardsProps {
  tasks: Task[];
}

export function MetricsCards({ tasks }: MetricsCardsProps) {
  return (
    <div className="grid gap-6 grid-cols-1 md:grid-cols-4">
      <Card>
        <CardHeader className="flex flex-row items-center justify-between py-4">
          <CardTitle className="text-sm font-medium">Total Tasks</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{tasks.length}</div>
          <p className="text-xs text-muted-foreground">
            {tasks.filter((t) => t.status === "completed").length} completed
          </p>
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="flex flex-row items-center justify-between py-4">
          <CardTitle className="text-sm font-medium">Progress</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">
            {Math.round(
              (tasks.reduce((acc, task) => acc + task.progress, 0) /
                (tasks.length * 100)) *
                100
            )}
            %
          </div>
          <Progress
            value={
              (tasks.reduce((acc, task) => acc + task.progress, 0) /
                (tasks.length * 100)) *
              100
            }
            className="mt-2"
          />
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="flex flex-row items-center justify-between py-4">
          <CardTitle className="text-sm font-medium">Critical Tasks</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">
            {tasks.filter((t) => t.criticalPath).length}
          </div>
          <p className="text-xs text-muted-foreground">On critical path</p>
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="flex flex-row items-center justify-between py-4">
          <CardTitle className="text-sm font-medium">Delayed Tasks</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold text-destructive">
            {tasks.filter((t) => t.status === "delayed").length}
          </div>
          <p className="text-xs text-muted-foreground">Require attention</p>
        </CardContent>
      </Card>
    </div>
  );
} 
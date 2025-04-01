import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

export function RecentProjects() {
  return (
    <Card className="col-span-2">
      <CardHeader>
        <CardTitle>Recent Projects</CardTitle>
        <CardDescription>Your latest active projects</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="text-center py-8 text-muted-foreground">
          Projects will appear here once created
        </div>
      </CardContent>
    </Card>
  );
} 
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

export function RecentProjects() {
  return (
    <Card className="h-full">
      <CardHeader className="px-4 sm:px-6 py-4 sm:py-5">
        <CardTitle className="text-lg sm:text-xl">Recent Projects</CardTitle>
        <CardDescription>Your latest active projects</CardDescription>
      </CardHeader>
      <CardContent className="px-4 sm:px-6">
        <div className="text-center py-6 sm:py-8 text-muted-foreground">
          Projects will appear here once created
        </div>
      </CardContent>
    </Card>
  );
} 
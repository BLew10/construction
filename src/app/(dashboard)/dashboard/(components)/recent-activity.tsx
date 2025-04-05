import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

export function RecentActivity() {
  return (
    <Card className="h-full">
      <CardHeader className="px-4 sm:px-6 py-4 sm:py-5">
        <CardTitle className="text-lg sm:text-xl">Recent Activity</CardTitle>
        <CardDescription>
          Latest updates across your projects
        </CardDescription>
      </CardHeader>
      <CardContent className="px-4 sm:px-6">
        <div className="text-center py-6 sm:py-8 text-muted-foreground">
          Activity will appear here as you work on projects
        </div>
      </CardContent>
    </Card>
  );
} 
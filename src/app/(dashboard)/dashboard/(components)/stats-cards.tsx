import { DashboardCard } from "./dashboard-card";
import { CircleDollarSign, AlertCircle, FileText, CalendarDays } from "lucide-react";

export function StatsCards() {
  return (
    <div className="grid gap-3 sm:gap-4 grid-cols-1 md:grid-cols-2 lg:grid-cols-4">
      <DashboardCard
        title="Active Projects"
        value="5"
        description="+2 since last month"
        icon={<FileText className="h-3 w-3 sm:h-4 sm:w-4 text-muted-foreground" />}
      />
      <DashboardCard
        title="Pending Approvals"
        value="12"
        description="+4 since yesterday"
        icon={<AlertCircle className="h-3 w-3 sm:h-4 sm:w-4 text-muted-foreground" />}
      />
      <DashboardCard
        title="Upcoming Deadlines"
        value="8"
        description="This week"
        icon={<CalendarDays className="h-3 w-3 sm:h-4 sm:w-4 text-muted-foreground" />}
      />
      <DashboardCard
        title="Budget Status"
        value="$1.2M"
        description="$45k under budget"
        icon={<CircleDollarSign className="h-3 w-3 sm:h-4 sm:w-4 text-muted-foreground" />}
      />
    </div>
  );
} 
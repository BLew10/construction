"use client";

import { useAuthStore } from "@/store/authStore";
import { WelcomeHeader } from "@/app/(dashboard)/dashboard/(components)/welcome-header";
import { StatsCards } from "@/app/(dashboard)/dashboard/(components)/stats-cards";
import { RecentProjects } from "@/app/(dashboard)/dashboard/(components)/recent-projects";
import { RecentActivity } from "@/app/(dashboard)/dashboard/(components)/recent-activity";

export default function DashboardPage() {
  const { user } = useAuthStore();

  return (
    <div className="space-y-6">
      <WelcomeHeader userName={user?.name} />
      <StatsCards />

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        <RecentProjects />
        <RecentActivity />
      </div>
    </div>
  );
}

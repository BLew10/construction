"use client";

import { useAuthStore } from "@/store/authStore";
import { WelcomeHeader } from "@/app/(dashboard)/dashboard/(components)/welcome-header";
import { StatsCards } from "@/app/(dashboard)/dashboard/(components)/stats-cards";
import { RecentProjects } from "@/app/(dashboard)/dashboard/(components)/recent-projects";
import { RecentActivity } from "@/app/(dashboard)/dashboard/(components)/recent-activity";

export default function DashboardPage() {
  const { user } = useAuthStore();

  return (
    <div className="container px-4 sm:px-6 mx-auto space-y-4 sm:space-y-6">
      <WelcomeHeader userName={user?.name} />
      <StatsCards />

      <div className="grid gap-4 md:grid-cols-2">
        <div className="md:col-span-2 lg:col-span-1 lg:row-span-1">
          <RecentProjects />
        </div>
        <div className="md:col-span-2 lg:col-span-1 lg:row-span-1">
          <RecentActivity />
        </div>
      </div>
    </div>
  );
}

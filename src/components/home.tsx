import React, { useState } from "react";
import Sidebar from "./layout/Sidebar";
import Header from "./layout/Header";
import ProjectGrid from "./dashboard/ProjectGrid";
import ActivityFeed from "./dashboard/ActivityFeed";
import FloatingActionButton from "./dashboard/FloatingActionButton";

interface HomeProps {
  sidebarCollapsed?: boolean;
  onSidebarToggle?: () => void;
}

const Home = ({
  sidebarCollapsed = false,
  onSidebarToggle = () => {},
}: HomeProps) => {
  const [isCollapsed, setIsCollapsed] = useState(sidebarCollapsed);

  const handleSidebarToggle = () => {
    setIsCollapsed(!isCollapsed);
    onSidebarToggle();
  };

  return (
    <div className="flex h-screen bg-gray-100">
      <Sidebar collapsed={isCollapsed} onToggle={handleSidebarToggle} />

      <div className="flex-1 flex flex-col overflow-hidden">
        <Header />

        <main className="flex-1 overflow-y-auto p-6 space-y-6">
          <div className="grid grid-cols-1 gap-6">
            <section>
              <div className="flex items-center justify-between mb-4">
                <h1 className="text-2xl font-semibold text-gray-900">
                  Project Overview
                </h1>
                <div className="flex items-center space-x-2">
                  <div className="flex items-center space-x-1 text-sm text-gray-600">
                    <span className="h-2 w-2 rounded-full bg-green-500"></span>
                    <span>On Track</span>
                  </div>
                  <div className="flex items-center space-x-1 text-sm text-gray-600">
                    <span className="h-2 w-2 rounded-full bg-yellow-500"></span>
                    <span>At Risk</span>
                  </div>
                  <div className="flex items-center space-x-1 text-sm text-gray-600">
                    <span className="h-2 w-2 rounded-full bg-red-500"></span>
                    <span>Delayed</span>
                  </div>
                </div>
              </div>
              <ProjectGrid />
            </section>

            <section className="h-[400px]">
              <ActivityFeed />
            </section>
          </div>
        </main>

        <FloatingActionButton />
      </div>
    </div>
  );
};

export default Home;

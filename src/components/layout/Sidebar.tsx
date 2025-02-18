import React from "react";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Button } from "@/components/ui/button";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import {
  Building2,
  Users,
  FileText,
  Settings,
  ChevronLeft,
  ChevronRight,
  FolderKanban,
} from "lucide-react";

interface SidebarProps {
  collapsed?: boolean;
  onToggle?: () => void;
  projects?: Array<{ id: string; name: string }>;
  team?: Array<{ id: string; name: string; avatar: string }>;
}

const Sidebar = ({
  collapsed = false,
  onToggle = () => {},
  projects = [
    { id: "1", name: "Office Tower Construction" },
    { id: "2", name: "Shopping Mall Renovation" },
    { id: "3", name: "Residential Complex" },
  ],
  team = [
    {
      id: "1",
      name: "John Doe",
      avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=John",
    },
    {
      id: "2",
      name: "Jane Smith",
      avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=Jane",
    },
    {
      id: "3",
      name: "Mike Johnson",
      avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=Mike",
    },
  ],
}: SidebarProps) => {
  return (
    <div
      className={`h-screen bg-white border-r border-gray-200 transition-all duration-300 flex flex-col ${
        collapsed ? "w-20" : "w-[280px]"
      }`}
    >
      {/* Logo and Toggle */}
      <div className="p-4 border-b border-gray-200 flex items-center justify-between">
        <div className="flex items-center gap-2">
          {!collapsed && (
            <span className="font-semibold text-xl">BuildPro</span>
          )}
          <FolderKanban className="w-6 h-6 text-blue-600" />
        </div>
        <Button
          variant="ghost"
          size="icon"
          onClick={onToggle}
          className="hover:bg-gray-100"
        >
          {collapsed ? (
            <ChevronRight className="h-4 w-4" />
          ) : (
            <ChevronLeft className="h-4 w-4" />
          )}
        </Button>
      </div>

      {/* Navigation */}
      <ScrollArea className="flex-1 py-4">
        <nav className="space-y-6 px-4">
          {/* Projects Section */}
          <div>
            <div className="flex items-center mb-2">
              <Building2 className="w-5 h-5 text-gray-500 mr-2" />
              {!collapsed && (
                <span className="text-sm font-medium text-gray-500">
                  Projects
                </span>
              )}
            </div>
            <div className="space-y-1">
              {projects.map((project) => (
                <TooltipProvider key={project.id}>
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <Button
                        variant="ghost"
                        className={`w-full justify-start ${
                          collapsed ? "px-2" : "px-4"
                        }`}
                      >
                        <div className="flex items-center">
                          <div
                            className="w-2 h-2 rounded-full bg-blue-500 mr-2"
                            aria-hidden="true"
                          />
                          {!collapsed && (
                            <span className="truncate">{project.name}</span>
                          )}
                        </div>
                      </Button>
                    </TooltipTrigger>
                    {collapsed && (
                      <TooltipContent side="right">
                        <p>{project.name}</p>
                      </TooltipContent>
                    )}
                  </Tooltip>
                </TooltipProvider>
              ))}
            </div>
          </div>

          {/* Team Section */}
          <div>
            <div className="flex items-center mb-2">
              <Users className="w-5 h-5 text-gray-500 mr-2" />
              {!collapsed && (
                <span className="text-sm font-medium text-gray-500">Team</span>
              )}
            </div>
            <div className="space-y-1">
              {team.map((member) => (
                <TooltipProvider key={member.id}>
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <Button
                        variant="ghost"
                        className={`w-full justify-start ${
                          collapsed ? "px-2" : "px-4"
                        }`}
                      >
                        <div className="flex items-center gap-2">
                          <img
                            src={member.avatar}
                            alt={member.name}
                            className="w-6 h-6 rounded-full"
                          />
                          {!collapsed && (
                            <span className="truncate">{member.name}</span>
                          )}
                        </div>
                      </Button>
                    </TooltipTrigger>
                    {collapsed && (
                      <TooltipContent side="right">
                        <p>{member.name}</p>
                      </TooltipContent>
                    )}
                  </Tooltip>
                </TooltipProvider>
              ))}
            </div>
          </div>

          {/* Documents Section */}
          <div>
            <div className="flex items-center mb-2">
              <FileText className="w-5 h-5 text-gray-500 mr-2" />
              {!collapsed && (
                <span className="text-sm font-medium text-gray-500">
                  Documents
                </span>
              )}
            </div>
            {/* Add document items here */}
          </div>
        </nav>
      </ScrollArea>

      {/* Settings */}
      <div className="p-4 border-t border-gray-200">
        <TooltipProvider>
          <Tooltip>
            <TooltipTrigger asChild>
              <Button
                variant="ghost"
                className={`w-full justify-start ${collapsed ? "px-2" : "px-4"}`}
              >
                <div className="flex items-center gap-2">
                  <Settings className="w-5 h-5 text-gray-500" />
                  {!collapsed && <span>Settings</span>}
                </div>
              </Button>
            </TooltipTrigger>
            {collapsed && (
              <TooltipContent side="right">
                <p>Settings</p>
              </TooltipContent>
            )}
          </Tooltip>
        </TooltipProvider>
      </div>
    </div>
  );
};

export default Sidebar;

import React from "react";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
} from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import { CalendarDays, DollarSign, Users } from "lucide-react";

interface ProjectCardProps {
  title?: string;
  progress?: number;
  budget?: {
    current: number;
    total: number;
  };
  deadline?: string;
  teamSize?: number;
  status?: "on-track" | "at-risk" | "delayed";
}

const ProjectCard = ({
  title = "Sample Project",
  progress = 65,
  budget = { current: 25000, total: 50000 },
  deadline = "2024-06-30",
  teamSize = 8,
  status = "on-track",
}: ProjectCardProps) => {
  const statusColors = {
    "on-track": "bg-green-100 text-green-800",
    "at-risk": "bg-yellow-100 text-yellow-800",
    delayed: "bg-red-100 text-red-800",
  };

  return (
    <Card className="w-[380px] h-[220px] bg-white hover:shadow-lg transition-shadow duration-200">
      <CardHeader className="pb-2">
        <div className="flex justify-between items-start">
          <h3 className="font-semibold text-lg text-gray-900">{title}</h3>
          <Badge className={statusColors[status]} variant="secondary">
            {status.replace("-", " ").toUpperCase()}
          </Badge>
        </div>
      </CardHeader>
      <CardContent className="pb-2">
        <div className="space-y-4">
          <div>
            <div className="flex justify-between text-sm text-gray-600 mb-1">
              <span>Progress</span>
              <span>{progress}%</span>
            </div>
            <Progress value={progress} className="h-2" />
          </div>

          <div className="flex justify-between items-center text-sm">
            <div className="flex items-center gap-2 text-gray-600">
              <DollarSign className="w-4 h-4" />
              <span>
                ${budget.current.toLocaleString()} / $
                {budget.total.toLocaleString()}
              </span>
            </div>
            <div className="flex items-center gap-2 text-gray-600">
              <Users className="w-4 h-4" />
              <span>{teamSize} members</span>
            </div>
          </div>
        </div>
      </CardContent>
      <CardFooter>
        <div className="flex items-center gap-2 text-sm text-gray-600">
          <CalendarDays className="w-4 h-4" />
          <span>Due {new Date(deadline).toLocaleDateString()}</span>
        </div>
      </CardFooter>
    </Card>
  );
};

export default ProjectCard;

import React from "react";
import ProjectCard from "./ProjectCard";

interface Project {
  id: string;
  title: string;
  progress: number;
  budget: {
    current: number;
    total: number;
  };
  deadline: string;
  teamSize: number;
  status: "on-track" | "at-risk" | "delayed";
}

interface ProjectGridProps {
  projects?: Project[];
}

const ProjectGrid = ({ projects }: ProjectGridProps) => {
  const defaultProjects: Project[] = [
    {
      id: "1",
      title: "Office Tower Construction",
      progress: 75,
      budget: { current: 850000, total: 1200000 },
      deadline: "2024-08-15",
      teamSize: 12,
      status: "on-track",
    },
    {
      id: "2",
      title: "Shopping Mall Renovation",
      progress: 45,
      budget: { current: 300000, total: 500000 },
      deadline: "2024-07-30",
      teamSize: 8,
      status: "at-risk",
    },
    {
      id: "3",
      title: "Residential Complex",
      progress: 90,
      budget: { current: 950000, total: 1000000 },
      deadline: "2024-06-20",
      teamSize: 15,
      status: "delayed",
    },
  ];

  const displayProjects = projects || defaultProjects;

  return (
    <div className="w-full h-full bg-gray-50 p-6">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 auto-rows-max">
        {displayProjects.map((project) => (
          <ProjectCard
            key={project.id}
            title={project.title}
            progress={project.progress}
            budget={project.budget}
            deadline={project.deadline}
            teamSize={project.teamSize}
            status={project.status}
          />
        ))}
      </div>
    </div>
  );
};

export default ProjectGrid;

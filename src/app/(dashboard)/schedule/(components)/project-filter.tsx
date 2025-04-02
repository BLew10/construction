"use client";

import { useState } from "react";
import { Check, ChevronsUpDown } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
	Command,
	CommandEmpty,
	CommandGroup,
	CommandInput,
	CommandItem,
	CommandList,
} from "@/components/ui/command";
import {
	Popover,
	PopoverContent,
	PopoverTrigger,
} from "@/components/ui/popover";
import { cn } from "@/lib/utils";
import { Badge } from "@/components/ui/badge";
import { Project } from "@/types/project";

interface ProjectFilterProps {
	projects: Project[];
	selectedProjects: string[];
	onChange: (value: string[]) => void;
}

export function ProjectFilter({ projects, selectedProjects, onChange }: ProjectFilterProps) {
	const [open, setOpen] = useState(false);

	const toggleProject = (projectId: string) => {
		const newSelection = selectedProjects.includes(projectId)
			? selectedProjects.filter((id) => id !== projectId)
			: [...selectedProjects, projectId];
		onChange(newSelection);
	};

	return (
		<div className="flex items-center space-x-4">
			<span className="text-sm font-medium text-muted-foreground">Filter projects:</span>
			<Popover open={open} onOpenChange={setOpen}>
				<PopoverTrigger asChild>
					<Button
						variant="outline"
						role="combobox"
						aria-expanded={open}
						className="w-[250px] justify-between"
					>
						{selectedProjects.length === 0
							? "Select projects..."
							: selectedProjects.length === 1
							? projects.find(p => p.id === selectedProjects[0])?.name ?? "1 selected"
							: `${selectedProjects.length} selected`}
						<ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
					</Button>
				</PopoverTrigger>
				<PopoverContent className="w-[300px] p-0">
					<Command>
						<CommandInput placeholder="Search projects..." />
						<CommandList>
							<CommandEmpty>No projects found.</CommandEmpty>
							<CommandGroup>
								{projects.map((project) => (
									<CommandItem
										key={project.id}
										value={project.name}
										onSelect={() => {
											toggleProject(project.id);
										}}
									>
										<Check
											className={cn(
												"mr-2 h-4 w-4",
												selectedProjects.includes(project.id)
													? "opacity-100"
													: "opacity-0",
											)}
										/>
										<span className="flex-1 truncate">{project.name}</span>
										<Badge variant="outline" className="ml-2 capitalize">
											{project.status}
										</Badge>
									</CommandItem>
								))}
							</CommandGroup>
						</CommandList>
					</Command>
				</PopoverContent>
			</Popover>
		</div>
	);
} 
import { Project } from "@/types/project";

interface ResourceAllocationProps {
	projects: Project[];
}

export function ResourceAllocation({ projects }: ResourceAllocationProps) {
	// Placeholder for resource allocation view
	return (
		<div className="p-4 border rounded-md min-h-[200px] flex items-center justify-center">
			<p className="text-muted-foreground">Resource Allocation View - Coming Soon</p>
			{/* Add views for team workload, availability etc. */}
		</div>
	);
} 
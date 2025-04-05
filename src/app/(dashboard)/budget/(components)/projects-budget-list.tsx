import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { useRouter } from "next/navigation";
import { cn } from "@/lib/utils";
import { Project } from "@/types/project"; // Assuming base Project type is sufficient for props if details are calculated within

// Use the augmented type defined in the page for clarity
interface ProjectWithBudgetDetails extends Project {
	actualSpent: number;
	approvedChanges: number;
	revisedBudget: number;
	remainingBudget: number;
}

interface ProjectsBudgetListProps {
	projects: ProjectWithBudgetDetails[];
}

const formatCurrency = (amount: number) => {
	if (!isFinite(amount)) return '$--';
	// Using compact notation for the overview table might be nice
	return amount.toLocaleString('en-US', {
		style: 'currency',
		currency: 'USD',
		notation: 'compact', // e.g., $1.2M
		maximumFractionDigits: 1
	});
};

export function ProjectsBudgetList({ projects }: ProjectsBudgetListProps) {
	const router = useRouter();

	const handleRowClick = (projectId: string) => {
		router.push(`/projects/${projectId}/budget`);
	};

	return (
		<Table>
			<TableHeader>
				<TableRow>
					<TableHead>Project Name</TableHead>
					<TableHead>Status</TableHead>
					<TableHead className="text-right">Original Budget</TableHead>
					<TableHead className="text-right">Revised Budget</TableHead>
					<TableHead className="text-right">Actual Spent</TableHead>
					<TableHead className="text-right">Remaining</TableHead>
					<TableHead className="text-right">Variance</TableHead>
				</TableRow>
			</TableHeader>
			<TableBody>
				{projects.length === 0 && (
					<TableRow>
						<TableCell colSpan={7} className="h-24 text-center">
							No projects found.
						</TableCell>
					</TableRow>
				)}
				{projects.map((p) => {
					const variance = p.revisedBudget - p.actualSpent; // Same as remainingBudget here
					return (
						<TableRow
							key={p.id}
							className="cursor-pointer hover:bg-muted/50"
							onClick={() => handleRowClick(p.id)}
						>
							<TableCell className="font-medium">{p.name}</TableCell>
							<TableCell className="capitalize">{p.status}</TableCell>
							<TableCell className="text-right">{formatCurrency(p.budget)}</TableCell>
							<TableCell className="text-right">{formatCurrency(p.revisedBudget)}</TableCell>
							<TableCell className="text-right">{formatCurrency(p.actualSpent)}</TableCell>
							<TableCell className={cn(
								"text-right font-medium",
								p.remainingBudget >= 0 ? "text-green-600" : "text-red-600"
							)}>
								{formatCurrency(p.remainingBudget)}
							</TableCell>
							 <TableCell className={cn(
								"text-right text-xs", // Smaller variance text
								variance >= 0 ? "text-green-600" : "text-red-600"
							)}>
								{variance >= 0 ? '+' : ''}{formatCurrency(variance)}
							</TableCell>
						</TableRow>
					);
				})}
			</TableBody>
		</Table>
	);
} 
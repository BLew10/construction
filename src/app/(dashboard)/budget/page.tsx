"use client";

import { useEffect, useState } from "react";
import { useProjectsStore } from "@/store/projectsStore";
import { Project } from "@/types/project";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { BudgetOverviewSummaryCards } from "./(components)/budget-overview-summary-cards";
import { ProjectsBudgetList } from "./(components)/projects-budget-list";
import { CircleDollarSign } from "lucide-react";

// --- Mock Data Augmentation (Simulate missing data) ---
// In a real app, this data would come from backend/store aggregation
interface ProjectWithBudgetDetails extends Project {
	actualSpent: number;
	approvedChanges: number;
	revisedBudget: number;
	remainingBudget: number;
}

const augmentProjectData = (projects: Project[]): ProjectWithBudgetDetails[] => {
	return projects.map((p, index) => {
		// Simulate some spending and changes for demo purposes
		const mockActualSpent = p.budget * (0.3 + index * 0.1); // Simulate 30%, 40%, etc. spent
		const mockApprovedChanges = index % 2 === 0 ? p.budget * 0.05 : p.budget * -0.02; // Simulate +5% or -2% change
		const revisedBudget = p.budget + mockApprovedChanges;
		const remainingBudget = revisedBudget - mockActualSpent;

		return {
			...p,
			actualSpent: mockActualSpent,
			approvedChanges: mockApprovedChanges,
			revisedBudget: revisedBudget,
			remainingBudget: remainingBudget,
		};
	});
};
// --- End Mock Data Augmentation ---

export default function BudgetOverviewPage() {
	const { projects, fetchProjects, isLoading } = useProjectsStore();
	const [detailedProjects, setDetailedProjects] = useState<ProjectWithBudgetDetails[]>([]);

	useEffect(() => {
		if (projects.length === 0) {
			fetchProjects();
		}
	}, [fetchProjects, projects.length]);

	useEffect(() => {
		if (projects.length > 0) {
			// Simulate fetching/calculating detailed budget data for each project
			setDetailedProjects(augmentProjectData(projects));
		}
	}, [projects]);


	if (isLoading && detailedProjects.length === 0) {
		return <div>Loading budget overview...</div>;
	}

	// Calculate aggregate metrics
	const totalOriginalBudget = detailedProjects.reduce((sum, p) => sum + p.budget, 0);
	const totalContingency = detailedProjects.reduce((sum, p) => sum + (p.contingencyBudget || 0), 0);
	const totalApprovedChanges = detailedProjects.reduce((sum, p) => sum + p.approvedChanges, 0);
	const totalRevisedBudget = detailedProjects.reduce((sum, p) => sum + p.revisedBudget, 0);
	const totalActualSpent = detailedProjects.reduce((sum, p) => sum + p.actualSpent, 0);
	const totalRemainingBudget = detailedProjects.reduce((sum, p) => sum + p.remainingBudget, 0);

	return (
		<div className="container px-4 sm:px-6 lg:px-8 py-4 sm:py-6 mx-auto space-y-4 sm:space-y-6">
			<div>
				<h1 className="text-2xl sm:text-3xl font-bold tracking-tight">Budget Overview</h1>
				<p className="text-sm sm:text-base text-muted-foreground mt-1 sm:mt-2">
					Summary of budget performance across all projects.
				</p>
			</div>

			{/* Aggregate Summary Cards */}
			<BudgetOverviewSummaryCards
				totalOriginalBudget={totalOriginalBudget}
				totalContingency={totalContingency}
				totalApprovedChanges={totalApprovedChanges}
				totalRevisedBudget={totalRevisedBudget}
				totalActualSpent={totalActualSpent}
				totalRemainingBudget={totalRemainingBudget}
				projectCount={detailedProjects.length}
			/>

			{/* Projects Budget List */}
			<Card className="overflow-hidden">
				<CardHeader className="px-4 sm:px-6">
					<CardTitle className="flex items-center gap-2 text-lg sm:text-xl">
						<CircleDollarSign className="h-4 w-4 sm:h-5 sm:w-5" />
						Projects Budget Summary
					</CardTitle>
				</CardHeader>
				<CardContent className="px-2 sm:px-6">
					<ProjectsBudgetList projects={detailedProjects} />
				</CardContent>
			</Card>
		</div>
	);
} 
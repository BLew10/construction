"use client";

import { useEffect, useState } from "react";
import { useIssuesStore } from "@/store/issuesStore";
import { IssuesDataTable } from "./(components)/issues-data-table";
import { IssueForm } from "./(components)/issue-form"; // Import the form
import { Loader2 } from "lucide-react";

export default function GlobalIssuesPage() {
	const { issues, fetchIssues, isLoading, error } = useIssuesStore();
    const [isIssueFormOpen, setIsIssueFormOpen] = useState(false);

	useEffect(() => {
		fetchIssues();
	}, [fetchIssues]);

	const handleCreateNewIssue = () => {
        setIsIssueFormOpen(true);
    };

	return (
		<div className="space-y-6">
			<div className="flex items-center justify-between flex-wrap gap-4">
				<div>
					<h1 className="text-3xl font-bold tracking-tight">All Issues</h1>
					<p className="text-muted-foreground mt-2">
						View, filter, and manage issues across all your projects.
					</p>
				</div>
				{/* Button moved to DataTable component */}
			</div>

			{error && <div className="text-red-600">Error loading issues: {error}</div>}

            {/* Render DataTable or Loading state */}
            {isLoading && issues.length === 0 ? (
                 <div className="flex justify-center items-center h-64">
                    <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
                    <span className="ml-2">Loading issues...</span>
                </div>
            ) : (
                <IssuesDataTable
                    data={issues}
                    isLoading={isLoading}
                    onCreateNew={handleCreateNewIssue} // Pass handler
                />
            )}


            {/* Issue Form Dialog */}
            <IssueForm
                isOpen={isIssueFormOpen}
                onClose={() => setIsIssueFormOpen(false)}
            />
		</div>
	);
} 
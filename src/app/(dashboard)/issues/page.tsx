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
		<div className="space-y-4 md:space-y-6">
			<div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 sm:gap-4">
				<div>
					<h1 className="text-2xl sm:text-3xl font-bold tracking-tight">All Issues</h1>
					<p className="text-sm sm:text-base text-muted-foreground mt-1 sm:mt-2">
						View, filter, and manage issues across all your projects.
					</p>
				</div>
			</div>

			{error && <div className="text-red-600 p-3 bg-red-50 rounded-md text-sm sm:text-base">Error loading issues: {error}</div>}

            {/* Render DataTable or Loading state */}
            {isLoading && issues.length === 0 ? (
                 <div className="flex justify-center items-center h-48 sm:h-64">
                    <Loader2 className="h-6 w-6 sm:h-8 sm:w-8 animate-spin text-muted-foreground" />
                    <span className="ml-2 text-sm sm:text-base">Loading issues...</span>
                </div>
            ) : (
                <IssuesDataTable
                    data={issues}
                    isLoading={isLoading}
                    onCreateNew={handleCreateNewIssue}
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
"use client";

import { useParams } from "next/navigation";
import { useProjectsStore } from "@/store/projectsStore";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { TeamHeader } from "./(components)/team-header";
import { TeamList } from "./(components)/team-list";

// Mock team data - replace with actual data from your store
const teamMembers = [
	{
		id: "1",
		name: "John Doe",
		role: "Project Manager",
		email: "john@example.com",
		company: "Main Construction Co.",
	},
	{
		id: "2",
		name: "Jane Smith",
		role: "Site Supervisor",
		email: "jane@example.com",
		company: "Main Construction Co.",
	},
	// Add more mock data as needed
];

export default function TeamPage() {
	const params = useParams();
	const projectId = params.id as string;
	const { currentProject } = useProjectsStore();

	if (!currentProject) {
		return <div>Loading...</div>;
	}

	return (
		<div className="space-y-6">
			<TeamHeader onAddMember={() => {}} />
			<Card>
				<CardHeader>
					<CardTitle>Team Members</CardTitle>
				</CardHeader>
				<CardContent>
					<TeamList members={teamMembers} />
				</CardContent>
			</Card>
		</div>
	);
}

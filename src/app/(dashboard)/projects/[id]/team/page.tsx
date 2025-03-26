"use client";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { useProjectsStore } from "@/store/projectsStore";
import { UserPlus } from "lucide-react";
import { useParams } from "next/navigation";

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
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold tracking-tight">Project Team</h1>
        <Button>
          <UserPlus className="mr-2 h-4 w-4" /> Add Team Member
        </Button>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Team Members</CardTitle>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Name</TableHead>
                <TableHead>Role</TableHead>
                <TableHead>Email</TableHead>
                <TableHead>Company</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {teamMembers.map((member) => (
                <TableRow key={member.id}>
                  <TableCell className="font-medium">{member.name}</TableCell>
                  <TableCell>{member.role}</TableCell>
                  <TableCell>{member.email}</TableCell>
                  <TableCell>{member.company}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
} 
"use client";

import { useRouter } from "next/navigation";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { useProjectsStore } from "@/store/projectsStore";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Form } from "@/components/ui/form";
import { useEffect } from "react";
import { useParams } from "next/navigation";

import { ProjectFormHeader } from "./(components)/project-form-header";
import { ProjectFormFields } from "./(components)/project-form-fields";
import { ProjectFormDates } from "./(components)/project-form-dates";
import { ProjectFormStatus } from "./(components)/project-form-status";

// Form Schema
export const formSchema = z.object({
	name: z.string().min(2, { message: "Project name must be at least 2 characters" }),
	address: z.string().min(5, { message: "Address must be at least 5 characters" }),
	description: z.string().optional(),
	status: z.enum(["planning", "active", "completed", "onHold"]),
	startDate: z.date(),
	endDate: z.date(),
	budget: z.string().refine((val) => !isNaN(Number(val)) && Number(val) > 0, {
		message: "Budget must be a positive number",
	}),
	clientId: z.string().min(1, { message: "Please select a client" }),
	projectType: z.enum(["commercial", "residential", "industrial", "infrastructure", "other"]).optional(),
	phase: z.enum(["initiation", "planning", "execution", "monitoring", "closing"]).optional(),
	projectManagerId: z.string().optional(),
	contingencyBudget: z.string().optional().refine((val) => !val || (!isNaN(Number(val)) && Number(val) >= 0), {
		message: "Contingency budget must be a positive number",
	}),
});

export default function EditProjectPage() {
	const params = useParams();
	const projectId = params.id as string;
	const router = useRouter();
	const { currentProject, updateProject, isLoading, fetchProjects } = useProjectsStore();

	const form = useForm<z.infer<typeof formSchema>>({
		resolver: zodResolver(formSchema),
		defaultValues: {
			name: "",
			address: "",
			description: "",
			status: "planning",
			startDate: new Date(),
			endDate: new Date(),
			budget: "",
			clientId: "",
			projectType: undefined,
			phase: undefined,
			contingencyBudget: "",
		},
	});

	// Load project data
	useEffect(() => {
		if (!currentProject) {
			fetchProjects().then(() => {
				const project = useProjectsStore.getState().currentProject;
				if (project) {
					form.reset({
						name: project.name,
						address: project.address,
						description: project.description || "",
						status: project.status,
						startDate: new Date(project.startDate),
						endDate: new Date(project.endDate),
						budget: project.budget.toString(),
						clientId: project.clientId,
						projectType: project.projectType,
						phase: project.phase,
						contingencyBudget: project.contingencyBudget?.toString() || "",
					});
				}
			});
		} else {
			form.reset({
				name: currentProject.name,
				address: currentProject.address,
				description: currentProject.description || "",
				status: currentProject.status,
				startDate: new Date(currentProject.startDate),
				endDate: new Date(currentProject.endDate),
				budget: currentProject.budget.toString(),
				clientId: currentProject.clientId,
				projectType: currentProject.projectType,
				phase: currentProject.phase,
				contingencyBudget: currentProject.contingencyBudget?.toString() || "",
			});
		}
	}, [currentProject, form, fetchProjects]);

	const onSubmit = async (data: z.infer<typeof formSchema>) => {
		try {
			await updateProject(projectId, {
				name: data.name,
				address: data.address,
				description: data.description,
				status: data.status,
				startDate: data.startDate.toISOString(),
				endDate: data.endDate.toISOString(),
				budget: Number(data.budget),
				clientId: data.clientId,
				projectType: data.projectType,
				phase: data.phase,
				contingencyBudget: data.contingencyBudget ? Number(data.contingencyBudget) : undefined,
			});

			router.push(`/projects/${projectId}`);
		} catch (error) {
			console.error("Failed to update project:", error);
		}
	};

	if (!currentProject) {
		return <div>Loading...</div>;
	}

	return (
		<div className="max-w-4xl mx-auto py-8">
			<Card>
				<ProjectFormHeader />
				<CardContent>
					<Form {...form}>
						<form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
							<ProjectFormFields form={form} />
							<ProjectFormDates form={form} />
							<ProjectFormStatus form={form} />

							<div className="flex justify-end space-x-4">
								<Button
									variant="outline"
									type="button"
									onClick={() => router.push(`/projects/${projectId}`)}
								>
									Cancel
								</Button>
								<Button type="submit" disabled={isLoading}>
									{isLoading ? "Saving..." : "Save Changes"}
								</Button>
							</div>
						</form>
					</Form>
				</CardContent>
			</Card>
		</div>
	);
}

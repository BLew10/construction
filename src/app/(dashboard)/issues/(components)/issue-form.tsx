import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { Button } from "@/components/ui/button";
import {
	Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter, DialogClose
} from "@/components/ui/dialog";
import {
	Form, FormControl, FormField, FormItem, FormLabel, FormMessage
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
	Select, SelectContent, SelectItem, SelectTrigger, SelectValue
} from "@/components/ui/select";
import { IssueFormData, issueFormSchema, issuePrioritySchema, issueStatusSchema } from "@/types/issue";
import { useIssuesStore } from "@/store/issuesStore";
import { useProjectsStore } from "@/store/projectsStore"; // To get project list
import { useEffect, useState } from "react";
import { Loader2 } from "lucide-react";

interface IssueFormProps {
	isOpen: boolean;
	onClose: () => void;
	// initialData?: Issue; // Add later for editing
}

// Mock users for assignee selection (replace with actual user fetch)
const mockUsers = [
    { id: 'user-1', name: 'Alice Johnson' },
    { id: 'user-2', name: 'Bob Williams' },
    { id: 'user-3', name: 'Charlie Brown' },
];

export function IssueForm({ isOpen, onClose }: IssueFormProps) {
	const { createIssue } = useIssuesStore();
    const { projects, fetchProjects, isLoading: projectsLoading } = useProjectsStore();
	const [isSubmitting, setIsSubmitting] = useState(false);

	const form = useForm<IssueFormData>({
		resolver: zodResolver(issueFormSchema),
		defaultValues: {
			projectId: "",
			title: "",
			description: "",
			status: "Open",
			priority: "Medium",
			assigneeId: undefined,
		},
	});

    // Fetch projects if not already loaded
    useEffect(() => {
        if (isOpen && projects.length === 0) {
            fetchProjects();
        }
    }, [isOpen, projects.length, fetchProjects]);

	const onSubmit = async (data: IssueFormData) => {
		setIsSubmitting(true);
		try {
            // Assume reporterId is the current logged-in user (needs implementation)
            const reporterId = 'user-1'; // Placeholder
			await createIssue({ ...data, reporterId });
			onClose();
			form.reset();
		} catch (error) {
			console.error("Failed to save issue:", error);
			// TODO: Show error toast to user
		} finally {
			setIsSubmitting(false);
		}
	};

    // Reset form when dialog closes
    useEffect(() => {
        if (!isOpen) {
            form.reset();
        }
    }, [isOpen, form]);

	return (
		<Dialog open={isOpen} onOpenChange={onClose}>
			<DialogContent className="sm:max-w-[600px] w-[calc(100%-2rem)] max-h-[90vh] overflow-y-auto">
				<DialogHeader>
					<DialogTitle className="text-xl">Create New Issue</DialogTitle>
				</DialogHeader>
				<Form {...form}>
					<form onSubmit={form.handleSubmit(onSubmit)} className="space-y-3 py-2 sm:space-y-4 sm:py-4">
                        <FormField
							control={form.control}
							name="projectId"
							render={({ field }) => (
								<FormItem>
									<FormLabel className="text-sm sm:text-base">Project *</FormLabel>
									<Select onValueChange={field.onChange} defaultValue={field.value} disabled={projectsLoading}>
										<FormControl>
											<SelectTrigger className="h-9 sm:h-10">
												<SelectValue placeholder={projectsLoading ? "Loading projects..." : "Select project"} />
											</SelectTrigger>
										</FormControl>
										<SelectContent>
											{projects.map((project) => (
												<SelectItem key={project.id} value={project.id}>
													{project.name}
												</SelectItem>
											))}
										</SelectContent>
									</Select>
									<FormMessage className="text-xs" />
								</FormItem>
							)}
						/>
						<FormField
							control={form.control}
							name="title"
							render={({ field }) => (
								<FormItem>
									<FormLabel className="text-sm sm:text-base">Title *</FormLabel>
									<FormControl>
										<Input 
                                            placeholder="Briefly describe the issue" 
                                            {...field} 
                                            className="h-9 sm:h-10" 
                                        />
									</FormControl>
									<FormMessage className="text-xs" />
								</FormItem>
							)}
						/>
                        <FormField
							control={form.control}
							name="description"
							render={({ field }) => (
								<FormItem>
									<FormLabel className="text-sm sm:text-base">Description</FormLabel>
									<FormControl>
										<Textarea 
                                            placeholder="Provide more details (optional)" 
                                            {...field} 
                                            className="min-h-[80px] sm:min-h-[120px]" 
                                        />
									</FormControl>
									<FormMessage className="text-xs" />
								</FormItem>
							)}
						/>
                        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 sm:gap-4">
                            <FormField
                                control={form.control}
                                name="status"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel className="text-sm sm:text-base">Status</FormLabel>
                                        <Select onValueChange={field.onChange} defaultValue={field.value}>
                                            <FormControl>
                                                <SelectTrigger className="h-9 sm:h-10">
                                                    <SelectValue placeholder="Select status" />
                                                </SelectTrigger>
                                            </FormControl>
                                            <SelectContent>
                                                {issueStatusSchema.options.map((status) => (
                                                    <SelectItem key={status} value={status}>{status}</SelectItem>
                                                ))}
                                            </SelectContent>
                                        </Select>
                                        <FormMessage className="text-xs" />
                                    </FormItem>
                                )}
                            />
                            <FormField
                                control={form.control}
                                name="priority"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel className="text-sm sm:text-base">Priority</FormLabel>
                                        <Select onValueChange={field.onChange} defaultValue={field.value}>
                                            <FormControl>
                                                <SelectTrigger className="h-9 sm:h-10">
                                                    <SelectValue placeholder="Select priority" />
                                                </SelectTrigger>
                                            </FormControl>
                                            <SelectContent>
                                                {issuePrioritySchema.options.map((priority) => (
                                                    <SelectItem key={priority} value={priority}>{priority}</SelectItem>
                                                ))}
                                            </SelectContent>
                                        </Select>
                                        <FormMessage className="text-xs" />
                                    </FormItem>
                                )}
                            />
                            <FormField
                                control={form.control}
                                name="assigneeId"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel className="text-sm sm:text-base">Assignee</FormLabel>
                                        <Select onValueChange={field.onChange} defaultValue={field.value}>
                                            <FormControl>
                                                <SelectTrigger className="h-9 sm:h-10">
                                                    <SelectValue placeholder="Assign to user (optional)" />
                                                </SelectTrigger>
                                            </FormControl>
                                            <SelectContent>
                                                <SelectItem value="unassigned">Unassigned</SelectItem>
                                                {mockUsers.map((user) => (
                                                    <SelectItem key={user.id} value={user.id}>{user.name}</SelectItem>
                                                ))}
                                            </SelectContent>
                                        </Select>
                                        <FormMessage className="text-xs" />
                                    </FormItem>
                                )}
                            />
                        </div>
						<DialogFooter className="pt-2 sm:pt-4 gap-2">
							<DialogClose asChild>
								<Button type="button" variant="outline" size="sm" className="h-9 sm:h-10">Cancel</Button>
							</DialogClose>
							<Button type="submit" disabled={isSubmitting} size="sm" className="h-9 sm:h-10">
                                {isSubmitting && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
								{isSubmitting ? "Creating..." : "Create Issue"}
							</Button>
						</DialogFooter>
					</form>
				</Form>
			</DialogContent>
		</Dialog>
	);
} 
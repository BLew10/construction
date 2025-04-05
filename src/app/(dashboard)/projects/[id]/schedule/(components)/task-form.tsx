"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { format, parseISO } from "date-fns";
import { CalendarIcon } from "lucide-react";
import { Task, useTasksStore } from "@/store/tasksStore";
import {
	Dialog,
	DialogContent,
	DialogDescription,
	DialogFooter,
	DialogHeader,
	DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import {
	Form,
	FormControl,
	FormDescription,
	FormField,
	FormItem,
	FormLabel,
	FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
	Select,
	SelectContent,
	SelectItem,
	SelectTrigger,
	SelectValue,
} from "@/components/ui/select";
import {
	Popover,
	PopoverContent,
	PopoverTrigger,
} from "@/components/ui/popover";
import { Calendar } from "@/components/ui/calendar";
import { cn } from "@/lib/utils";
import { MultiSelect } from "@/components/ui/multi-select";
import { useEffect } from "react";

interface TaskFormProps {
	projectId: string;
	onClose: () => void;
	existingTasks: Task[];
	initialData?: Task | null;
}

// Form Schema
const formSchema = z
	.object({
		name: z
			.string()
			.min(2, { message: "Task name must be at least 2 characters" }),
		description: z.string().optional(),
		startDate: z.date({ required_error: "Start date is required" }),
		endDate: z.date({ required_error: "End date is required" }),
		status: z.enum(["notStarted", "inProgress", "completed", "delayed"]),
		progress: z.coerce
			.number({ invalid_type_error: "Progress must be a number" })
			.min(0, { message: "Progress cannot be less than 0" })
			.max(100, { message: "Progress cannot be more than 100" }),
		assignedTo: z.array(z.string()).optional().default([]),
		dependsOn: z.array(z.string()).optional().default([]),
		trade: z.string().optional(),
		phase: z.string().optional(),
	})
	.refine((data) => data.endDate >= data.startDate, {
		message: "End date cannot be before start date",
		path: ["endDate"],
	});

export default function TaskForm({
	projectId,
	onClose,
	existingTasks,
	initialData,
}: TaskFormProps) {
	const { createTask, isLoading } = useTasksStore();
	const isEditing = !!initialData;

	// Get unique trades and phases from existing tasks for dropdown options
	const uniqueTrades = [
		...new Set([...existingTasks.map((task) => task.trade).filter(Boolean), "Excavation", "Concrete", "Framing", "Electrical", "Plumbing", "HVAC", "Drywall", "Painting", "Flooring"]),
	];
	const uniquePhases = [
		...new Set([...existingTasks.map((task) => task.phase).filter(Boolean), "Preparation", "Foundation", "Superstructure", "MEP", "Interior", "Exterior", "Finishing"]),
	];

	const form = useForm<z.infer<typeof formSchema>>({
		resolver: zodResolver(formSchema),
		defaultValues: initialData
			? {
					...initialData,
					startDate: parseISO(initialData.startDate),
					endDate: parseISO(initialData.endDate),
					assignedTo: initialData.assignedTo || [],
					dependsOn: initialData.dependsOn || [],
			  }
			: {
					name: "",
					description: "",
					startDate: new Date(),
					endDate: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
					status: "notStarted",
					progress: 0,
					assignedTo: [],
					dependsOn: [],
					trade: "",
					phase: "",
			  },
	});

	useEffect(() => {
		if (initialData) {
			form.reset({
				...initialData,
				startDate: parseISO(initialData.startDate),
				endDate: parseISO(initialData.endDate),
				assignedTo: initialData.assignedTo || [],
				dependsOn: initialData.dependsOn || [],
			});
		} else {
			form.reset({
				name: "",
				description: "",
				startDate: new Date(),
				endDate: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
				status: "notStarted",
				progress: 0,
				assignedTo: [],
				dependsOn: [],
				trade: "",
				phase: "",
			});
		}
	}, [initialData, form]);

	const handleSubmit = async (values: z.infer<typeof formSchema>) => {
		const taskPayload = {
			projectId,
			name: values.name,
			description: values.description,
			startDate: format(values.startDate, "yyyy-MM-dd"),
			endDate: format(values.endDate, "yyyy-MM-dd"),
			status: values.status,
			progress: values.progress,
			assignedTo: values.assignedTo || [],
			dependsOn: values.dependsOn || [],
			trade: values.trade,
			phase: values.phase,
			isBaseline: initialData?.isBaseline ?? false,
		};

		try {
			if (isEditing && initialData) {
				console.warn("updateTask not implemented yet");
			} else {
				await createTask(taskPayload);
			}
			onClose();
		} catch (error) {
			console.error("Failed to save task:", error);
		}
	};

	const dependencyOptions = existingTasks
		.filter((task) => task.id !== initialData?.id)
		.map((task) => ({
			value: task.id,
			label: task.name,
		}));

	return (
		<Dialog open onOpenChange={onClose}>
			<DialogContent className="w-[95vw] max-w-2xl p-4 sm:p-6">
				<DialogHeader>
					<DialogTitle>{isEditing ? "Edit Task" : "Add New Task"}</DialogTitle>
					<DialogDescription>
						{isEditing
							? "Update the details for this task."
							: "Create a new task for the project schedule."}
					</DialogDescription>
				</DialogHeader>

				<Form {...form}>
					<div className="max-h-[70vh] overflow-y-auto pr-2 sm:pr-6 pl-1">
						<form
							onSubmit={form.handleSubmit(handleSubmit)}
							className="space-y-4"
						>
							<FormField
								control={form.control}
								name="name"
								render={({ field }) => (
									<FormItem>
										<FormLabel>Task Name</FormLabel>
										<FormControl>
											<Input placeholder="Enter task name" {...field} />
										</FormControl>
										<FormMessage />
									</FormItem>
								)}
							/>

							<FormField
								control={form.control}
								name="description"
								render={({ field }) => (
									<FormItem>
										<FormLabel>Description</FormLabel>
										<FormControl>
											<Textarea
												placeholder="Enter task description (optional)"
												className="resize-none"
												{...field}
											/>
										</FormControl>
										<FormMessage />
									</FormItem>
								)}
							/>

							<div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
								<FormField
									control={form.control}
									name="startDate"
									render={({ field }) => (
										<FormItem className="flex flex-col">
											<FormLabel>Start Date</FormLabel>
											<Popover>
												<PopoverTrigger asChild>
													<FormControl>
														<Button
															variant="outline"
															className="w-full pl-3 text-left font-normal"
														>
															{field.value ? (
																format(field.value, "PPP")
															) : (
																<span>Pick a date</span>
															)}
															<CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
														</Button>
													</FormControl>
												</PopoverTrigger>
												<PopoverContent className="w-auto p-0" align="start">
													<Calendar
														mode="single"
														selected={field.value}
														onSelect={field.onChange}
														initialFocus
													/>
												</PopoverContent>
											</Popover>
											<FormMessage />
										</FormItem>
									)}
								/>
								<FormField
									control={form.control}
									name="endDate"
									render={({ field }) => (
										<FormItem className="flex flex-col">
											<FormLabel>End Date</FormLabel>
											<Popover>
												<PopoverTrigger asChild>
													<FormControl>
														<Button
															variant="outline"
															className="w-full pl-3 text-left font-normal"
														>
															{field.value ? (
																format(field.value, "PPP")
															) : (
																<span>Pick a date</span>
															)}
															<CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
														</Button>
													</FormControl>
												</PopoverTrigger>
												<PopoverContent className="w-auto p-0" align="start">
													<Calendar
														mode="single"
														selected={field.value}
														onSelect={field.onChange}
														disabled={(date) =>
															date < (form.getValues("startDate") || new Date(0))
														}
														initialFocus
													/>
												</PopoverContent>
											</Popover>
											<FormMessage />
										</FormItem>
									)}
								/>
							</div>

							<div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
								<FormField
									control={form.control}
									name="status"
									render={({ field }) => (
										<FormItem>
											<FormLabel>Status</FormLabel>
											<Select
												onValueChange={field.onChange}
												defaultValue={field.value}
											>
												<FormControl>
													<SelectTrigger>
														<SelectValue placeholder="Select status" />
													</SelectTrigger>
												</FormControl>
												<SelectContent>
													<SelectItem value="notStarted">Not Started</SelectItem>
													<SelectItem value="inProgress">In Progress</SelectItem>
													<SelectItem value="completed">Completed</SelectItem>
													<SelectItem value="delayed">Delayed</SelectItem>
												</SelectContent>
											</Select>
											<FormMessage />
										</FormItem>
									)}
								/>
								<FormField
									control={form.control}
									name="progress"
									render={({ field }) => (
										<FormItem>
											<FormLabel>Progress (%)</FormLabel>
											<FormControl>
												<Input
													type="number"
													min={0}
													max={100}
													placeholder="0"
													{...field}
													onChange={(e) => {
														const value = e.target.value;
														field.onChange(value === "" ? undefined : Number(value));
													}}
													value={field.value ?? ""}
												/>
											</FormControl>
											<FormMessage />
										</FormItem>
									)}
								/>
							</div>

							<div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
								<FormField
									control={form.control}
									name="trade"
									render={({ field }) => (
										<FormItem>
											<FormLabel>Trade</FormLabel>
											<Select
												onValueChange={field.onChange}
												defaultValue={field.value}
											>
												<FormControl>
													<SelectTrigger>
														<SelectValue placeholder="Select trade (optional)" />
													</SelectTrigger>
												</FormControl>
												<SelectContent>
													<SelectItem value=" ">None</SelectItem>
													{uniqueTrades.map((trade) => (
														<SelectItem key={trade} value={trade as string}>
															{trade}
														</SelectItem>
													))}
												</SelectContent>
											</Select>
											<FormMessage />
										</FormItem>
									)}
								/>
								<FormField
									control={form.control}
									name="phase"
									render={({ field }) => (
										<FormItem>
											<FormLabel>Phase</FormLabel>
											<Select
												onValueChange={field.onChange}
												defaultValue={field.value}
											>
												<FormControl>
													<SelectTrigger>
														<SelectValue placeholder="Select phase (optional)" />
													</SelectTrigger>
												</FormControl>
												<SelectContent>
													<SelectItem value=" ">None</SelectItem>
													{uniquePhases.map((phase) => (
														<SelectItem key={phase} value={phase as string}>
															{phase}
														</SelectItem>
													))}
												</SelectContent>
											</Select>
											<FormMessage />
										</FormItem>
									)}
								/>
							</div>

							<FormField
								control={form.control}
								name="dependsOn"
								render={({ field }) => (
									<FormItem>
										<FormLabel>Dependencies</FormLabel>
										<FormControl>
											<MultiSelect
												selected={field.value || []}
												items={dependencyOptions}
												onChange={field.onChange}
												placeholder="Select task dependencies..."
												className="w-full"
											/>
										</FormControl>
										<FormDescription>
											Tasks that must be completed before this task can start.
										</FormDescription>
										<FormMessage />
									</FormItem>
								)}
							/>

							<DialogFooter className="flex flex-col-reverse sm:flex-row sm:justify-end gap-2 sm:gap-0 pt-2">
								<Button type="button" variant="outline" onClick={onClose} className="w-full sm:w-auto">
									Cancel
								</Button>
								<Button type="submit" disabled={isLoading} className="w-full sm:w-auto">
									{isLoading
										? isEditing
											? "Saving..."
											: "Creating..."
										: isEditing
										? "Save Changes"
										: "Create Task"}
								</Button>
							</DialogFooter>
						</form>
					</div>
				</Form>
			</DialogContent>
		</Dialog>
	);
}

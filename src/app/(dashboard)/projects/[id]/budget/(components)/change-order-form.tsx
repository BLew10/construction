import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { Button } from "@/components/ui/button";
import {
	Dialog,
	DialogContent,
	DialogHeader,
	DialogTitle,
	DialogFooter,
	DialogClose,
} from "@/components/ui/dialog";
import {
	Form,
	FormControl,
	FormField,
	FormItem,
	FormLabel,
	FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Calendar } from "@/components/ui/calendar";
import { CalendarIcon } from "lucide-react";
import { cn } from "@/lib/utils";
import { format } from "date-fns";
import { useBudgetStore } from "@/store/budgetStore";
import { ChangeOrder, changeOrderSchema } from "@/types/budget";
import { useEffect } from "react";

interface ChangeOrderFormProps {
	projectId: string;
	isOpen: boolean;
	onClose: () => void;
	initialData?: ChangeOrder | null; // Pass data for editing
}

// Refine schema for form
const formSchema = changeOrderSchema.omit({ projectId: true });
type ChangeOrderFormData = z.infer<typeof formSchema>;

export function ChangeOrderForm({ projectId, isOpen, onClose, initialData }: ChangeOrderFormProps) {
	const { createChangeOrder, updateChangeOrder, isLoading } = useBudgetStore();

	const form = useForm<ChangeOrderFormData>({
		resolver: zodResolver(formSchema),
		defaultValues: {
			name: "",
			description: "",
			status: "Pending",
			costImpact: 0,
			dateSubmitted: new Date(),
			dateApproved: undefined,
			...initialData, // Spread initial data if editing
			// Ensure dates are Date objects if provided
		},
	});

	// Reset form when initialData changes
	useEffect(() => {
		if (initialData) {
			form.reset({
				name: initialData.name || "",
				description: initialData.description || "",
				status: initialData.status || "Pending",
				costImpact: initialData.costImpact || 0,
				dateSubmitted: initialData.dateSubmitted ? new Date(initialData.dateSubmitted) : new Date(),
				dateApproved: initialData.dateApproved ? new Date(initialData.dateApproved) : undefined,
				id: initialData.id,
			});
		} else {
			form.reset({
				name: "",
				description: "",
				status: "Pending",
				costImpact: 0,
				dateSubmitted: new Date(),
				dateApproved: undefined,
				id: undefined,
			});
		}
	}, [initialData, form]);

	const onSubmit = async (data: ChangeOrderFormData) => {
		try {
			// Convert dates back to ISO strings or keep as Date depending on API expectation
			const payload = {
				...data,
				projectId,
				// dateSubmitted: data.dateSubmitted?.toISOString(), // Example if API expects string
				// dateApproved: data.dateApproved?.toISOString(),
			};

			if (initialData?.id) {
				await updateChangeOrder(initialData.id, payload);
			} else {
				await createChangeOrder(payload);
			}
			onClose();
			form.reset();
		} catch (error) {
			console.error("Failed to save change order:", error);
		}
	};

	return (
		<Dialog open={isOpen} onOpenChange={onClose}>
			<DialogContent className="w-[95vw] max-w-md mx-auto p-4 sm:p-6">
				<DialogHeader>
					<DialogTitle>{initialData ? "Edit Change Order" : "Add Change Order"}</DialogTitle>
				</DialogHeader>
				<Form {...form}>
					<form onSubmit={form.handleSubmit(onSubmit)} className="space-y-5 py-4">
						<FormField
							control={form.control}
							name="name"
							render={({ field }) => (
								<FormItem>
									<FormLabel>Name / Title</FormLabel>
									<FormControl>
										<Input placeholder="e.g., Client requested upgraded fixtures" {...field} />
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
									<FormLabel>Description (Optional)</FormLabel>
									<FormControl>
										<Textarea placeholder="Details about the change..." {...field} />
									</FormControl>
									<FormMessage />
								</FormItem>
							)}
						/>
						<div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
							<FormField
								control={form.control}
								name="status"
								render={({ field }) => (
									<FormItem>
										<FormLabel>Status</FormLabel>
										<Select onValueChange={field.onChange} defaultValue={field.value}>
											<FormControl>
												<SelectTrigger>
													<SelectValue placeholder="Select status" />
												</SelectTrigger>
											</FormControl>
											<SelectContent>
												<SelectItem value="Pending">Pending</SelectItem>
												<SelectItem value="Approved">Approved</SelectItem>
												<SelectItem value="Rejected">Rejected</SelectItem>
											</SelectContent>
										</Select>
										<FormMessage />
									</FormItem>
								)}
							/>
							<FormField
								control={form.control}
								name="costImpact"
								render={({ field }) => (
									<FormItem>
										<FormLabel>Cost Impact ($)</FormLabel>
										<FormControl>
											<Input
												type="number"
												step="0.01"
												placeholder="5000 or -1000"
												{...field}
												onChange={e => field.onChange(parseFloat(e.target.value) || 0)}
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
								name="dateSubmitted"
								render={({ field }) => (
									<FormItem className="flex flex-col">
										<FormLabel>Date Submitted</FormLabel>
										<Popover>
											<PopoverTrigger asChild>
												<FormControl>
													<Button
														variant={"outline"}
														className={cn(
															"w-full pl-3 text-left font-normal",
															!field.value && "text-muted-foreground"
														)}
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
								name="dateApproved"
								render={({ field }) => (
									<FormItem className="flex flex-col">
										<FormLabel>Date Approved (Optional)</FormLabel>
										<Popover>
											<PopoverTrigger asChild>
												<FormControl>
													<Button
														variant={"outline"}
														className={cn(
															"w-full pl-3 text-left font-normal",
															!field.value && "text-muted-foreground"
														)}
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
												/>
											</PopoverContent>
										</Popover>
										<FormMessage />
									</FormItem>
								)}
							/>
						</div>
						<DialogFooter className="flex flex-col-reverse sm:flex-row gap-2 sm:gap-0 pt-2">
							<DialogClose asChild>
								<Button type="button" variant="outline" className="w-full sm:w-auto">Cancel</Button>
							</DialogClose>
							<Button type="submit" disabled={isLoading} className="w-full sm:w-auto">
								{isLoading ? "Saving..." : "Save Change Order"}
							</Button>
						</DialogFooter>
					</form>
				</Form>
			</DialogContent>
		</Dialog>
	);
} 
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
import { useBudgetStore } from "@/store/budgetStore";
import { CostItem, costItemSchema } from "@/types/budget";
import { useEffect } from "react";

interface CostItemFormProps {
	projectId: string;
	isOpen: boolean;
	onClose: () => void;
	initialData?: CostItem | null; // Pass data for editing
}

// Refine schema for form (make projectId optional as it's passed separately)
const formSchema = costItemSchema.omit({ projectId: true });
type CostItemFormData = z.infer<typeof formSchema>;

export function CostItemForm({ projectId, isOpen, onClose, initialData }: CostItemFormProps) {
	const { createCostItem, updateCostItem, isLoading } = useBudgetStore();

	const form = useForm<CostItemFormData>({
		resolver: zodResolver(formSchema),
		defaultValues: {
			category: "",
			description: "",
			budgeted: 0,
			actual: 0,
			...initialData, // Spread initial data if editing
		},
	});

	// Reset form when initialData changes (e.g., opening edit modal)
	useEffect(() => {
		if (initialData) {
			form.reset({
				category: initialData.category || "",
				description: initialData.description || "",
				budgeted: initialData.budgeted || 0,
				actual: initialData.actual || 0,
				id: initialData.id,
			});
		} else {
			form.reset({
				category: "",
				description: "",
				budgeted: 0, // Or a sensible default
				actual: 0,
				id: undefined,
			});
		}
	}, [initialData, form]);


	const onSubmit = async (data: CostItemFormData) => {
		try {
			if (initialData?.id) {
				// Update existing item
				await updateCostItem(initialData.id, { ...data }); // Ensure projectId is included if needed by API
			} else {
				// Create new item
				await createCostItem({ ...data, projectId });
			}
			onClose(); // Close dialog on success
			form.reset(); // Reset form fields
		} catch (error) {
			console.error("Failed to save cost item:", error);
			// Optionally show an error message to the user
		}
	};

	return (
		<Dialog open={isOpen} onOpenChange={onClose}>
			<DialogContent className="w-[95vw] max-w-md mx-auto p-4 sm:p-6">
				<DialogHeader>
					<DialogTitle>{initialData ? "Edit Cost Item" : "Add Cost Item"}</DialogTitle>
				</DialogHeader>
				<Form {...form}>
					<form onSubmit={form.handleSubmit(onSubmit)} className="space-y-5 py-4">
						<FormField
							control={form.control}
							name="category"
							render={({ field }) => (
								<FormItem>
									<FormLabel>Category</FormLabel>
									<FormControl>
										<Input placeholder="e.g., Materials, Labor" {...field} />
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
										<Input placeholder="e.g., Lumber Package, Framing Crew" {...field} />
									</FormControl>
									<FormMessage />
								</FormItem>
							)}
						/>
						<div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
							<FormField
								control={form.control}
								name="budgeted"
								render={({ field }) => (
									<FormItem>
										<FormLabel>Budgeted ($)</FormLabel>
										<FormControl>
											<Input
												type="number"
												step="0.01"
												placeholder="50000"
												{...field}
												onChange={e => field.onChange(parseFloat(e.target.value) || 0)}
											/>
										</FormControl>
										<FormMessage />
									</FormItem>
								)}
							/>
							<FormField
								control={form.control}
								name="actual"
								render={({ field }) => (
									<FormItem>
										<FormLabel>Actual ($)</FormLabel>
										<FormControl>
											<Input
												type="number"
												step="0.01"
												placeholder="0"
												{...field}
												onChange={e => field.onChange(parseFloat(e.target.value) || 0)}
											/>
										</FormControl>
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
								{isLoading ? "Saving..." : "Save Cost Item"}
							</Button>
						</DialogFooter>
					</form>
				</Form>
			</DialogContent>
		</Dialog>
	);
} 
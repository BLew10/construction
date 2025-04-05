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
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { TeamMemberFormData, teamMemberFormSchema } from "@/types/team";
import { useTeamStore } from "@/store/teamStore";
import { useEffect, useState } from "react";
import { Loader2 } from "lucide-react";

interface TeamMemberFormProps {
	isOpen: boolean;
	onClose: () => void;
}

// Define available roles
const roles = [
	"Project Manager",
	"Engineer",
	"Architect",
	"Designer",
	"Contractor",
	"Admin",
];

export function TeamMemberForm({ isOpen, onClose }: TeamMemberFormProps) {
	const { createMember } = useTeamStore();
	const [isSubmitting, setIsSubmitting] = useState(false);

	const form = useForm<TeamMemberFormData>({
		resolver: zodResolver(teamMemberFormSchema),
		defaultValues: {
			name: "",
			email: "",
			role: "",
		},
	});

	const onSubmit = async (data: TeamMemberFormData) => {
		setIsSubmitting(true);
		try {
			await createMember(data);
			onClose();
			form.reset();
		} catch (error) {
			console.error("Failed to save team member:", error);
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
			<DialogContent className="sm:max-w-[600px]">
				<DialogHeader>
					<DialogTitle>Add New Team Member</DialogTitle>
				</DialogHeader>
				<Form {...form}>
					<form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4 py-4">
						<FormField
							control={form.control}
							name="name"
							render={({ field }) => (
								<FormItem>
									<FormLabel>Name *</FormLabel>
									<FormControl>
										<Input placeholder="Enter team member's name" {...field} />
									</FormControl>
									<FormMessage />
								</FormItem>
							)}
						/>
						<FormField
							control={form.control}
							name="email"
							render={({ field }) => (
								<FormItem>
									<FormLabel>Email *</FormLabel>
									<FormControl>
										<Input placeholder="Enter team member's email" {...field} />
									</FormControl>
									<FormMessage />
								</FormItem>
							)}
						/>
						<FormField
							control={form.control}
							name="role"
							render={({ field }) => (
								<FormItem>
									<FormLabel>Role *</FormLabel>
									<FormControl>
										<Select onValueChange={field.onChange} defaultValue={field.value}>
											<SelectTrigger>
												<SelectValue placeholder="Select role" />
											</SelectTrigger>
											<SelectContent>
												{roles.map((role) => (
													<SelectItem key={role} value={role}>{role}</SelectItem>
												))}
											</SelectContent>
										</Select>
									</FormControl>
									<FormMessage />
								</FormItem>
							)}
						/>
						<DialogFooter>
							<DialogClose asChild>
								<Button type="button" variant="outline">Cancel</Button>
							</DialogClose>
							<Button type="submit" disabled={isSubmitting}>
								{isSubmitting && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
								{isSubmitting ? "Creating..." : "Add Member"}
							</Button>
						</DialogFooter>
					</form>
				</Form>
			</DialogContent>
		</Dialog>
	);
} 
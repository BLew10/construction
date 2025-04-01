import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { useRouter } from "next/navigation";
import { useProjectsStore } from "@/store/projectsStore";
import { Button } from "@/components/ui/button";
import { Form } from "@/components/ui/form";
import { ProjectFormFields } from "../../[id]/edit/(components)/project-form-fields";
import { ProjectFormDates } from "../../[id]/edit/(components)/project-form-dates";
import { ProjectFormStatus } from "../../[id]/edit/(components)/project-form-status";

// Reuse the form schema from edit page
import { formSchema } from "../../[id]/edit/page";

export function NewProjectForm() {
  const router = useRouter();
  const { createProject, isLoading } = useProjectsStore();

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

  const onSubmit = async (data: z.infer<typeof formSchema>) => {
    try {
      await createProject({
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

      router.push("/projects");
    } catch (error) {
      console.error("Failed to create project:", error);
    }
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
        <ProjectFormFields form={form} />
        <ProjectFormDates form={form} />
        <ProjectFormStatus form={form} />

        <div className="flex justify-end space-x-4">
          <Button
            variant="outline"
            type="button"
            onClick={() => router.push("/projects")}
          >
            Cancel
          </Button>
          <Button type="submit" disabled={isLoading}>
            {isLoading ? "Creating..." : "Create Project"}
          </Button>
        </div>
      </form>
    </Form>
  );
} 
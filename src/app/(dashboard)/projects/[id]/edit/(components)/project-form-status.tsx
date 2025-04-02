import { FormField, FormItem, FormLabel, FormControl, FormMessage } from "@/components/ui/form";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { UseFormReturn } from "react-hook-form";
import { z } from "zod";
import { projectFormSchema } from "@/types/project";

interface ProjectFormStatusProps {
  form: UseFormReturn<z.infer<typeof projectFormSchema>>;
}

export function ProjectFormStatus({ form }: ProjectFormStatusProps) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
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
                <SelectItem value="planning">Planning</SelectItem>
                <SelectItem value="active">Active</SelectItem>
                <SelectItem value="completed">Completed</SelectItem>
                <SelectItem value="onHold">On Hold</SelectItem>
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
            <Select onValueChange={field.onChange} defaultValue={field.value}>
              <FormControl>
                <SelectTrigger>
                  <SelectValue placeholder="Select phase" />
                </SelectTrigger>
              </FormControl>
              <SelectContent>
                <SelectItem value="initiation">Initiation</SelectItem>
                <SelectItem value="planning">Planning</SelectItem>
                <SelectItem value="execution">Execution</SelectItem>
                <SelectItem value="monitoring">Monitoring</SelectItem>
                <SelectItem value="closing">Closing</SelectItem>
              </SelectContent>
            </Select>
            <FormMessage />
          </FormItem>
        )}
      />
    </div>
  );
} 
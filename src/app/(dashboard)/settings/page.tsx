"use client";

import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
  DialogClose,
} from "@/components/ui/dialog";
import { useForm } from "react-hook-form";

const notificationOptions = [
  { value: "email", label: "Email Notifications" },
  { value: "sms", label: "SMS Notifications" },
  { value: "none", label: "No Notifications" },
];

export default function UserSettingsForm() {
  const [isLoading, setIsLoading] = useState(true);
  const [isDialogOpen, setIsDialogOpen] = useState(false);

  const form = useForm<{
    username: string;
    email: string;
    notificationPreference: string;
    password: string;
    confirmPassword: string;
  }>({
    defaultValues: {
      username: "",
      email: "",
      notificationPreference: "email",
      password: "",
      confirmPassword: "",
    },
  });

  const { control, handleSubmit, setValue } = form;

  useEffect(() => {
    setTimeout(() => {
      setValue("username", "john_doe");
      setValue("email", "john@example.com");
      setValue("notificationPreference", "email");
      setIsLoading(false);
    }, 1000);
  }, [setValue]);

  const handleSaveSettings = () => {
    console.log("Settings saved");
    setIsDialogOpen(false);
  };

  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-bold tracking-tight">Application Settings</h1>
      <p className="text-muted-foreground">
        Configure your profile, notifications, and other application settings.
      </p>
      <div className="p-6 border rounded-md shadow-md">
        <Form {...form}>
          <div className="flex flex-col gap-4">
            <FormField
              control={control}
              name="username"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Username</FormLabel>
                  <FormControl>
                    <Input placeholder="Enter your username" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={control}
              name="email"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Email</FormLabel>
                  <FormControl>
                    <Input
                      type="email"
                      placeholder="Enter your email"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={control}
              name="notificationPreference"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Notification Preference</FormLabel>
                  <FormControl>
                    <Select
                      onValueChange={(value) =>
                        setValue("notificationPreference", value)
                      }
                      defaultValue={field.value}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Select notification preference" />
                      </SelectTrigger>
                      <SelectContent>
                        {notificationOptions.map((option) => (
                          <SelectItem key={option.value} value={option.value}>
                            {option.label}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={control}
              name="password"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Password</FormLabel>
                  <FormControl>
                    <Input type="password" placeholder="Enter new password" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={control}
              name="confirmPassword"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Confirm Password</FormLabel>
                  <FormControl>
                    <Input type="password" placeholder="Confirm your password" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>
          <div className="flex justify-end mt-6">
            <Button onClick={() => setIsDialogOpen(true)}>Save Settings</Button>
          </div>
        </Form>
      </div>

      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Confirm Save</DialogTitle>
          </DialogHeader>
          <p>Are you sure you want to save these settings?</p>
          <DialogFooter>
            <DialogClose asChild>
              <Button variant="outline">Cancel</Button>
            </DialogClose>
            <Button onClick={handleSaveSettings}>Save</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}

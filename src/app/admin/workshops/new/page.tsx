
"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { collection, addDoc, serverTimestamp } from "firebase/firestore";
import { db } from "@/lib/firebase";

import { Button } from "@/components/ui/button";
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
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { useToast } from "@/hooks/use-toast";
import { Loader2 } from "lucide-react";

const formSchema = z.object({
  title: z.string().min(5, "Title must be at least 5 characters."),
  description: z.string().min(20, "Description must be at least 20 characters."),
  instructor: z.string().min(2, "Instructor name is required."),
  date: z.string().min(1, "Date is required."),
  duration: z.string().min(1, "Duration is required."),
  venue: z.string().min(1, "Venue is required."),
  address: z.string().min(1, "Address is required."),
  time: z.string().min(1, "Time is required."),
  topics: z.string().min(5, "Topics must be at least 5 characters."),
  imageUrl: z.string().url("Please enter a valid image URL.").optional().or(z.literal('')),
});

type FormValues = z.infer<typeof formSchema>;

export default function NewWorkshopPage() {
  const router = useRouter();
  const { toast } = useToast();
  const [isSubmitting, setIsSubmitting] = useState(false);

  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      title: "",
      description: "",
      instructor: "",
      date: "",
      duration: "",
      venue: "",
      address: "",
      time: "",
      topics: "",
      imageUrl: "",
    },
  });

  async function onSubmit(values: FormValues) {
    setIsSubmitting(true);
    try {
      await addDoc(collection(db, "workshops"), {
        ...values,
        createdAt: serverTimestamp(),
      });
      toast({
        title: "Workshop Created!",
        description: `${values.title} has been successfully added.`,
      });
      router.push("/admin/workshops");
    } catch (error) {
      console.error("Error creating workshop: ", error);
      toast({
        title: "Error",
        description: "Failed to create workshop. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <Card>
        <CardHeader>
            <CardTitle>Create New Workshop</CardTitle>
            <CardDescription>Fill out the details below to add a new workshop.</CardDescription>
        </CardHeader>
        <CardContent>
            <Form {...form}>
                <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                    <FormField
                        control={form.control}
                        name="title"
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel>Workshop Title</FormLabel>
                                <FormControl><Input placeholder="e.g., Introduction to Robotics" {...field} /></FormControl>
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
                                <FormControl><Textarea placeholder="Describe the workshop..." {...field} /></FormControl>
                                <FormMessage />
                            </FormItem>
                        )}
                    />
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <FormField control={form.control} name="instructor" render={({ field }) => ( <FormItem> <FormLabel>Instructor</FormLabel> <FormControl><Input placeholder="e.g., Dr. Eva Rostova" {...field} /></FormControl> <FormMessage /> </FormItem> )} />
                        <FormField control={form.control} name="date" render={({ field }) => ( <FormItem> <FormLabel>Date</FormLabel> <FormControl><Input placeholder="e.g., October 12, 2024" {...field} /></FormControl> <FormMessage /> </FormItem> )} />
                        <FormField control={form.control} name="duration" render={({ field }) => ( <FormItem> <FormLabel>Duration</FormLabel> <FormControl><Input placeholder="e.g., 3 Hours" {...field} /></FormControl> <FormMessage /> </FormItem> )} />
                        <FormField control={form.control} name="time" render={({ field }) => ( <FormItem> <FormLabel>Time</FormLabel> <FormControl><Input placeholder="e.g., 10:00 AM - 1:00 PM" {...field} /></FormControl> <FormMessage /> </FormItem> )} />
                        <FormField control={form.control} name="venue" render={({ field }) => ( <FormItem> <FormLabel>Venue</FormLabel> <FormControl><Input placeholder="e.g., Main Auditorium" {...field} /></FormControl> <FormMessage /> </FormItem> )} />
                        <FormField control={form.control} name="address" render={({ field }) => ( <FormItem> <FormLabel>Address</FormLabel> <FormControl><Input placeholder="e.g., 123 Innovation Drive, Tech City" {...field} /></FormControl> <FormMessage /> </FormItem> )} />
                    </div>
                    <FormField
                        control={form.control}
                        name="topics"
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel>Topics (comma-separated)</FormLabel>
                                <FormControl><Textarea placeholder="e.g., Basic electronics, Simple programming, Robot assembly" {...field} /></FormControl>
                                <FormMessage />
                            </FormItem>
                        )}
                    />
                    <FormField
                        control={form.control}
                        name="imageUrl"
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel>Image URL (Optional)</FormLabel>
                                <FormControl><Input placeholder="https://example.com/image.jpg" {...field} /></FormControl>
                                <FormMessage />
                            </FormItem>
                        )}
                    />
                    <div className="flex justify-end gap-4">
                        <Button type="button" variant="outline" onClick={() => router.back()}>Cancel</Button>
                        <Button type="submit" disabled={isSubmitting}>
                            {isSubmitting && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                            Create Workshop
                        </Button>
                    </div>
                </form>
            </Form>
        </CardContent>
    </Card>
  );
}

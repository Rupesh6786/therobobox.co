
"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import Image from "next/image";
import { useRouter } from "next/navigation";

import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { useToast } from "@/hooks/use-toast";
import { useState } from "react";
import { CheckCircle, Loader2 } from "lucide-react";
import { PlaceHolderImages } from "@/lib/placeholder-images";
import { useAuth } from "@/context/auth-context";

const formSchema = z.object({
  schoolName: z.string().min(2, {
    message: "School name must be at least 2 characters.",
  }),
  contactName: z.string().min(2, "Contact name must be at least 2 characters."),
  email: z.string().email("Please enter a valid email address."),
  phone: z.string().min(10, "Please enter a valid mobile number."),
});

export type FormValues = z.infer<typeof formSchema>;

const benefits = [
    "STEM-AI Innovation Lab",
    "Bagless Activities and Lifestyle",
    "Competitions and Visibility",
    "Expert Instructors",
    "Syllabus on NEP Guidelines"
];

export default function SchoolRegistration() {
  const { toast } = useToast();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const registrationImage = PlaceHolderImages.find(img => img.id === 'info-1');
  const { user } = useAuth();
  const router = useRouter();

  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      schoolName: "",
      contactName: "",
      email: "",
      phone: "",
    },
  });

  async function onSubmit(values: FormValues) {
    setIsSubmitting(true);
    
    // Store data in session storage to pass to the confirmation page
    sessionStorage.setItem('consultationData', JSON.stringify(values));

    if (user) {
      router.push('/confirm-consultation');
    } else {
      router.push('/login?redirect=/confirm-consultation');
    }

    setIsSubmitting(false);
  }

  return (
    <section id="register" className="bg-secondary/30">
      <div className="container mx-auto">
        <div className="grid md:grid-cols-2 gap-12 items-center">
            <div className="space-y-6">
                 <h2 className="text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl font-headline text-primary">
                    Empower Your School with Robobox
                </h2>
                <p className="text-muted-foreground text-lg">
                    Join 50+ colleges and 20+ schools along with 20k+ students in revolutionizing education through cutting-edge robotics and technology curriculum.
                </p>
                <ul className="space-y-3">
                    {benefits.map((benefit, index) => (
                        <li key={index} className="flex items-center gap-3">
                            <CheckCircle className="text-green-500 w-6 h-6"/>
                            <span className="text-muted-foreground font-medium">{benefit}</span>
                        </li>
                    ))}
                </ul>
                 <Form {...form}>
                    <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4 pt-4">
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        <FormField
                            control={form.control}
                            name="schoolName"
                            render={({ field }) => (
                            <FormItem>
                                <FormControl>
                                <Input placeholder="School Name" {...field} />
                                </FormControl>
                                <FormMessage />
                            </FormItem>
                            )}
                        />
                        <FormField
                            control={form.control}
                            name="contactName"
                            render={({ field }) => (
                            <FormItem>
                                <FormControl>
                                <Input placeholder="Your Name" {...field} />
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
                                <FormControl>
                                <Input placeholder="Email Address" {...field} />
                                </FormControl>
                                <FormMessage />
                            </FormItem>
                            )}
                        />
                         <FormField
                            control={form.control}
                            name="phone"
                            render={({ field }) => (
                            <FormItem>
                                <FormControl>
                                <Input placeholder="Enter your mobile number" type="tel" {...field} />
                                </FormControl>
                                <FormMessage />
                            </FormItem>
                            )}
                        />
                        </div>
                        <Button type="submit" size="lg" className="w-full" disabled={isSubmitting}>
                        {isSubmitting && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                        {isSubmitting ? "Processing..." : "Get Your Free Consultation"}
                        </Button>
                    </form>
                </Form>
            </div>
             {registrationImage && (
                <div className="relative h-[600px] w-full hidden md:block">
                    <Image
                        src={registrationImage.imageUrl}
                        alt={registrationImage.description}
                        fill
                        className="object-cover rounded-lg shadow-xl"
                        data-ai-hint={registrationImage.imageHint}
                    />
                </div>
            )}
        </div>
      </div>
    </section>
  );
}


"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm, useFieldArray } from "react-hook-form";
import { z } from "zod";
import { useRouter } from "next/navigation";
import { useState } from "react";
import Image from "next/image";

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
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Loader2, Trash2, PlusCircle, Image as ImageIcon } from "lucide-react";
import type { Product } from "@/app/admin/products/page";

const formSchema = z.object({
  name: z.string().min(2, "Name must be at least 2 characters."),
  description: z.string().min(10, "Description must be at least 10 characters."),
  price: z.coerce.number().min(0, "Price must be a positive number."),
  discountPercentage: z.coerce.number().min(0).max(99).optional(),
  imageUrls: z.array(z.object({ value: z.string().url("Please enter a valid URL.") })),
  features: z.array(z.object({ value: z.string().min(2, "Feature must be at least 2 characters.") })),
});

export type ProductFormValues = z.infer<typeof formSchema>;

interface ProductFormProps {
  formType: "Create" | "Edit";
  initialData?: Product | null;
  onFormSubmit: (data: ProductFormValues) => Promise<void>;
}

export default function ProductForm({ formType, initialData, onFormSubmit }: ProductFormProps) {
  const router = useRouter();
  const [isSubmitting, setIsSubmitting] = useState(false);

  const defaultValues = {
      name: initialData?.name || "",
      description: (initialData as any)?.description || "",
      price: initialData?.price || 0,
      discountPercentage: initialData?.discountPercentage || 0,
      imageUrls: (initialData as any)?.imageUrls?.map((url: string) => ({ value: url })) || [{ value: "" }],
      features: (initialData as any)?.features?.map((feature: string) => ({ value: feature })) || [{ value: "" }],
  }

  const form = useForm<ProductFormValues>({
    resolver: zodResolver(formSchema),
    defaultValues,
  });

  const { fields: imageUrls, append: appendImageUrl, remove: removeImageUrl } = useFieldArray({
    name: "imageUrls",
    control: form.control,
  });
  
  const { fields: features, append: appendFeature, remove: removeFeature } = useFieldArray({
    name: "features",
    control: form.control,
  });

  async function onSubmit(values: ProductFormValues) {
    setIsSubmitting(true);
    await onFormSubmit(values);
    setIsSubmitting(false);
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>{formType} Product</CardTitle>
        <CardDescription>Fill out the details below to {formType.toLowerCase()} a product.</CardDescription>
      </CardHeader>
      <CardContent>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
            <FormField control={form.control} name="name" render={({ field }) => ( <FormItem> <FormLabel>Product Name</FormLabel> <FormControl><Input placeholder="e.g., Micro Drone Kit" {...field} /></FormControl> <FormMessage /> </FormItem> )} />
            <FormField control={form.control} name="description" render={({ field }) => ( <FormItem> <FormLabel>Description</FormLabel> <FormControl><Textarea placeholder="Describe the product..." {...field} rows={5} /></FormControl> <FormMessage /> </FormItem> )} />
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <FormField control={form.control} name="price" render={({ field }) => ( <FormItem> <FormLabel>Price (INR)</FormLabel> <FormControl><Input type="number" placeholder="e.g., 4999" {...field} /></FormControl> <FormMessage /> </FormItem> )} />
                <FormField control={form.control} name="discountPercentage" render={({ field }) => ( <FormItem> <FormLabel>Discount (%)</FormLabel> <FormControl><Input type="number" placeholder="e.g., 10" {...field} /></FormControl> <FormMessage /> </FormItem> )} />
            </div>

            <div>
              <FormLabel>Image URLs</FormLabel>
              <FormDescription>Add one or more URLs for product images.</FormDescription>
              <div className="space-y-4 mt-2">
              {imageUrls.map((field, index) => (
                <FormField
                  key={field.id}
                  control={form.control}
                  name={`imageUrls.${index}.value`}
                  render={({ field }) => (
                    <FormItem>
                      <div className="flex items-center gap-2">
                        <FormControl>
                          <Input placeholder="https://example.com/image.png" {...field} />
                        </FormControl>
                        <Button type="button" variant="destructive" size="icon" onClick={() => removeImageUrl(index)} disabled={imageUrls.length <= 1}>
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                      <FormMessage />
                      {field.value && form.getValues(`imageUrls.${index}.value`) && (
                        <div className="flex flex-wrap gap-2 mt-2">
                            <div className="relative h-24 w-24 rounded-md overflow-hidden border">
                                <Image src={field.value} alt="Image Preview" layout="fill" objectFit="cover" onError={(e) => e.currentTarget.style.display = 'none'} />
                                <div className="absolute inset-0 flex items-center justify-center bg-black/50 opacity-0 hover:opacity-100 transition-opacity">
                                    <ImageIcon className="text-white"/>
                                </div>
                            </div>
                        </div>
                      )}
                    </FormItem>
                  )}
                />
              ))}
              </div>
              <Button type="button" variant="outline" size="sm" className="mt-2" onClick={() => appendImageUrl({ value: "" })}>
                <PlusCircle className="mr-2 h-4 w-4" /> Add Image URL
              </Button>
            </div>
            
            <div>
              <FormLabel>Features</FormLabel>
              <FormDescription>List the key features of the product.</FormDescription>
              <div className="space-y-4 mt-2">
              {features.map((field, index) => (
                <FormField
                  key={field.id}
                  control={form.control}
                  name={`features.${index}.value`}
                  render={({ field }) => (
                    <FormItem>
                      <div className="flex items-center gap-2">
                        <FormControl>
                          <Input placeholder="e.g., 4K camera module" {...field} />
                        </FormControl>
                        <Button type="button" variant="destructive" size="icon" onClick={() => removeFeature(index)} disabled={features.length <= 1}>
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              ))}
              </div>
              <Button type="button" variant="outline" size="sm" className="mt-2" onClick={() => appendFeature({ value: "" })}>
                <PlusCircle className="mr-2 h-4 w-4" /> Add Feature
              </Button>
            </div>

            <div className="flex justify-end gap-4">
              <Button type="button" variant="outline" onClick={() => router.back()}>Cancel</Button>
              <Button type="submit" disabled={isSubmitting}>
                {isSubmitting && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                {formType} Product
              </Button>
            </div>
          </form>
        </Form>
      </CardContent>
    </Card>
  );
}

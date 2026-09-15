
"use client";

import { useRouter } from "next/navigation";
import { collection, addDoc, serverTimestamp } from "firebase/firestore";
import { db } from "@/lib/firebase";

import ProductForm from "@/components/admin/product-form";
import { type ProductFormValues } from "@/components/admin/product-form";
import { useToast } from "@/hooks/use-toast";

export default function NewProductPage() {
  const router = useRouter();
  const { toast } = useToast();

  const handleCreateProduct = async (data: ProductFormValues) => {
    try {
      await addDoc(collection(db, "products"), {
        ...data,
        price: Number(data.price),
        discountPercentage: Number(data.discountPercentage) || 0,
        createdAt: serverTimestamp(),
      });
      toast({
        title: "Product Created!",
        description: `${data.name} has been successfully added.`,
      });
      router.push("/admin/products");
    } catch (error) {
      console.error("Error creating product: ", error);
      toast({
        title: "Error",
        description: "Failed to create product. Please try again.",
        variant: "destructive",
      });
    }
  };

  return (
    <ProductForm 
      formType="Create"
      onFormSubmit={handleCreateProduct}
    />
  );
}

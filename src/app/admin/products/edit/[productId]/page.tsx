
"use client";

import { useRouter, notFound } from "next/navigation";
import { doc, getDoc, updateDoc } from "firebase/firestore";
import { db } from "@/lib/firebase";
import { useEffect, useState } from "react";
import { Loader2 } from "lucide-react";

import ProductForm from "@/components/admin/product-form";
import type { ProductFormValues } from "@/components/admin/product-form";
import type { Product } from "../../page";
import { useToast } from "@/hooks/use-toast";

export default function EditProductPage({ params }: { params: { productId: string } }) {
  const router = useRouter();
  const { toast } = useToast();
  const [product, setProduct] = useState<Product | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchProduct = async () => {
      const docRef = doc(db, "products", params.productId);
      const docSnap = await getDoc(docRef);
      if (docSnap.exists()) {
        setProduct({ id: docSnap.id, ...docSnap.data() } as Product);
      } else {
        notFound();
      }
      setLoading(false);
    };

    fetchProduct();
  }, [params.productId]);

  const handleUpdateProduct = async (data: ProductFormValues) => {
    try {
      const docRef = doc(db, "products", params.productId);
      await updateDoc(docRef, {
        ...data,
        price: Number(data.price),
        discountPercentage: Number(data.discountPercentage) || 0,
      });
      toast({
        title: "Product Updated!",
        description: `${data.name} has been successfully updated.`,
      });
      router.push("/admin/products");
    } catch (error) {
      console.error("Error updating product: ", error);
      toast({
        title: "Error",
        description: "Failed to update product. Please try again.",
        variant: "destructive",
      });
    }
  };
  
  if (loading) {
    return (
      <div className="flex h-64 items-center justify-center bg-background">
        <Loader2 className="w-16 h-16 animate-spin text-primary" />
      </div>
    );
  }
  
  if (!product) {
      return notFound();
  }

  return (
    <ProductForm
      formType="Edit"
      initialData={product}
      onFormSubmit={handleUpdateProduct}
    />
  );
}

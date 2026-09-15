
"use client";

import { useEffect, useState } from "react";
import { collection, onSnapshot, query, orderBy, Timestamp, deleteDoc, doc } from "firebase/firestore";
import { db } from "@/lib/firebase";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Loader2, PlusCircle, Edit, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { useToast } from "@/hooks/use-toast";

export interface Product {
    id: string;
    name: string;
    price: number;
    discountPercentage?: number;
    createdAt: Timestamp;
}

export default function ProductsPage() {
    const [products, setProducts] = useState<Product[]>([]);
    const [loading, setLoading] = useState(true);
    const { toast } = useToast();

    useEffect(() => {
        const q = query(collection(db, "products"), orderBy("createdAt", "desc"));
        const unsubscribe = onSnapshot(q, (querySnapshot) => {
            const productsData: Product[] = [];
            querySnapshot.forEach((doc) => {
                productsData.push({ id: doc.id, ...doc.data() } as Product);
            });
            setProducts(productsData);
            setLoading(false);
        }, (error) => {
            console.error("Error fetching products:", error);
            toast({
                title: "Error fetching data",
                description: "Could not retrieve product list. Please check permissions.",
                variant: "destructive",
            });
            setLoading(false);
        });

        return () => unsubscribe();
    }, [toast]);

    const handleDelete = async (productId: string) => {
        try {
            await deleteDoc(doc(db, "products", productId));
            toast({
                title: "Product Deleted",
                description: "The product has been successfully removed.",
            });
        } catch (error) {
            console.error("Error deleting product: ", error);
            toast({
                title: "Error",
                description: "Failed to delete product. Please try again.",
                variant: "destructive",
            });
        }
    };

    const formatCurrency = (amount: number) => {
        return new Intl.NumberFormat('en-IN', { style: 'currency', currency: 'INR' }).format(amount);
    }
    
    const formatDate = (timestamp: Timestamp | undefined) => {
        if (!timestamp) return 'N/A';
        return timestamp.toDate().toLocaleDateString();
    }

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between">
        <div>
            <CardTitle>Products</CardTitle>
            <CardDescription>Create, view, and manage all products.</CardDescription>
        </div>
        <Button asChild>
            <Link href="/admin/products/new">
                <PlusCircle className="mr-2 h-4 w-4"/>
                Create Product
            </Link>
        </Button>
      </CardHeader>
      <CardContent>
        {loading ? (
             <div className="flex justify-center items-center h-64">
                <Loader2 className="w-8 h-8 animate-spin text-primary" />
            </div>
        ) : (
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Created</TableHead>
              <TableHead>Name</TableHead>
              <TableHead>Price</TableHead>
              <TableHead>Discount</TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {products.map((product) => (
              <TableRow key={product.id}>
                <TableCell className="font-medium">{formatDate(product.createdAt)}</TableCell>
                <TableCell>{product.name}</TableCell>
                <TableCell>{formatCurrency(product.price)}</TableCell>
                <TableCell>{product.discountPercentage || 0}%</TableCell>
                <TableCell className="text-right space-x-2">
                    <Button asChild variant="outline" size="icon">
                        <Link href={`/admin/products/edit/${product.id}`}><Edit className="h-4 w-4" /></Link>
                    </Button>
                    <AlertDialog>
                        <AlertDialogTrigger asChild>
                            <Button variant="destructive" size="icon"><Trash2 className="h-4 w-4" /></Button>
                        </AlertDialogTrigger>
                        <AlertDialogContent>
                            <AlertDialogHeader>
                                <AlertDialogTitle>Are you sure?</AlertDialogTitle>
                                <AlertDialogDescription>
                                    This action cannot be undone. This will permanently delete the product.
                                </AlertDialogDescription>
                            </AlertDialogHeader>
                            <AlertDialogFooter>
                                <AlertDialogCancel>Cancel</AlertDialogCancel>
                                <AlertDialogAction onClick={() => handleDelete(product.id)}>Delete</AlertDialogAction>
                            </AlertDialogFooter>
                        </AlertDialogContent>
                    </AlertDialog>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
        )}
      </CardContent>
    </Card>
  );
}

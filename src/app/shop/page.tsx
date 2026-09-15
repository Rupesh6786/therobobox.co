
"use client";

import { useEffect, useState } from "react";
import { collection, onSnapshot, query, orderBy, Timestamp } from "firebase/firestore";
import { db } from "@/lib/firebase";
import Image from "next/image";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { ArrowRight, ShoppingCart, Loader2 } from "lucide-react";
import Header from "@/components/layout/header";
import Footer from "@/components/layout/footer";
import { Badge } from "@/components/ui/badge";

export interface Product {
    id: string;
    name: string;
    description: string;
    price: number;
    discountPercentage?: number;
    imageUrls: string[];
    createdAt: Timestamp;
}

export default function ShopPage() {
    const [products, setProducts] = useState<Product[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const q = query(collection(db, "products"), orderBy("createdAt", "desc"));
        const unsubscribe = onSnapshot(q, (querySnapshot) => {
            const productsData: Product[] = [];
            querySnapshot.forEach((doc) => {
                productsData.push({ id: doc.id, ...doc.data() } as Product);
            });
            setProducts(productsData);
            setLoading(false);
        });

        return () => unsubscribe();
    }, []);
    
    const formatCurrency = (amount: number) => {
        return new Intl.NumberFormat('en-IN', { style: 'currency', currency: 'INR' }).format(amount);
    }
    
    const calculateDiscountedPrice = (price: number, discount: number) => {
        return price - (price * discount / 100);
    }

  return (
    <div className="flex flex-col min-h-dvh">
        <Header />
        <main className="flex-1">
            <section id="shop" className="bg-background">
            <div className="container mx-auto pt-12 pb-24">
                <div className="mb-12 text-center">
                <h2 className="text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl font-headline">
                    Our Store
                </h2>
                <p className="mx-auto mt-4 max-w-[700px] text-muted-foreground md:text-xl">
                    Build, code, and innovate with our collection of robotics kits.
                </p>
                </div>
                
                {loading ? (
                    <div className="flex justify-center items-center h-64">
                        <Loader2 className="w-12 h-12 animate-spin text-primary" />
                    </div>
                ) : (
                    <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
                    {products.map((product) => (
                        <Card key={product.id} className="flex flex-col overflow-hidden transition-transform duration-300 hover:scale-105 hover:shadow-xl">
                        <div className="relative h-56 w-full">
                            <Link href={`/kits/${product.id}`}>
                                <Image
                                    src={product.imageUrls[0] || "https://picsum.photos/seed/1/600/400"}
                                    alt={product.name}
                                    fill
                                    className="object-cover"
                                />
                            </Link>
                            {product.discountPercentage && product.discountPercentage > 0 && (
                                <Badge variant="destructive" className="absolute top-2 right-2">{product.discountPercentage}% OFF</Badge>
                            )}
                        </div>
                        <CardHeader>
                            <CardTitle className="font-headline">{product.name}</CardTitle>
                            <CardDescription>{product.description}</CardDescription>
                        </CardHeader>
                        <CardContent className="flex-grow">
                             <div className="flex items-baseline gap-2">
                                {product.discountPercentage && product.discountPercentage > 0 ? (
                                    <>
                                        <p className="text-2xl font-bold text-primary">{formatCurrency(calculateDiscountedPrice(product.price, product.discountPercentage))}</p>
                                        <p className="text-lg font-medium text-muted-foreground line-through">{formatCurrency(product.price)}</p>
                                    </>
                                ) : (
                                    <p className="text-2xl font-bold text-primary">{formatCurrency(product.price)}</p>
                                )}
                            </div>
                        </CardContent>
                        <CardFooter className="flex gap-2">
                            <Button asChild variant="secondary" className="w-full">
                            <Link href={`/kits/${product.id}`}>
                                Details <ArrowRight className="ml-2" />
                            </Link>
                            </Button>
                            <Button className="w-full">
                                Add to Cart <ShoppingCart className="ml-2" />
                            </Button>
                        </CardFooter>
                        </Card>
                    ))}
                    </div>
                )}
            </div>
            </section>
        </main>
        <Footer />
    </div>
  );
}

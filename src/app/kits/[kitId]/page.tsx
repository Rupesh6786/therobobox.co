
"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import Header from "@/components/layout/header";
import Footer from "@/components/layout/footer";
import { notFound } from "next/navigation";
import { CheckCircle, ShoppingCart, Loader2 } from "lucide-react";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel";
import { db } from "@/lib/firebase";
import { doc, getDoc } from "firebase/firestore";
import type { Product } from "@/app/shop/page";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";

export default function KitDetailPage({ params }: { params: { kitId: string } }) {
    const [product, setProduct] = useState<Product | null>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchProduct = async () => {
            const docRef = doc(db, "products", params.kitId);
            const docSnap = await getDoc(docRef);
            if (docSnap.exists()) {
                setProduct({ id: docSnap.id, ...docSnap.data() } as Product);
            } else {
                notFound();
            }
            setLoading(false);
        };
        fetchProduct();
    }, [params.kitId]);

    const formatCurrency = (amount: number) => {
        return new Intl.NumberFormat('en-IN', { style: 'currency', currency: 'INR' }).format(amount);
    }
    
    const calculateDiscountedPrice = (price: number, discount: number) => {
        return price - (price * discount / 100);
    }
    
    if (loading) {
        return (
            <div className="flex h-screen items-center justify-center bg-background">
                <Loader2 className="w-16 h-16 animate-spin text-primary" />
            </div>
        );
    }

    if (!product) {
        return notFound();
    }

    const features = (product as any).features?.map((f: any) => f.value).filter(Boolean) || [];

    return (
        <div className="flex flex-col min-h-dvh bg-background">
            <Header />
            <main className="flex-1 py-12 md:py-24">
                <div className="container mx-auto">
                    <div className="grid md:grid-cols-2 gap-12 items-start">
                        <Carousel className="w-full">
                            <CarouselContent>
                                {product.imageUrls.length > 0 ? product.imageUrls.map((url, index) => (
                                    <CarouselItem key={index}>
                                        <div className="relative aspect-square rounded-lg overflow-hidden shadow-2xl">
                                            <Image
                                                src={url}
                                                alt={`${product.name} image ${index + 1}`}
                                                fill
                                                className="object-cover"
                                            />
                                        </div>
                                    </CarouselItem>
                                )) : (
                                     <CarouselItem>
                                        <div className="relative aspect-square rounded-lg overflow-hidden shadow-2xl bg-secondary flex items-center justify-center">
                                            <ShoppingCart className="w-24 h-24 text-muted-foreground" />
                                        </div>
                                    </CarouselItem>
                                )}
                            </CarouselContent>
                            <CarouselPrevious className="absolute left-4 top-1/2 -translate-y-1/2" />
                            <CarouselNext className="absolute right-4 top-1/2 -translate-y-1/2" />
                        </Carousel>

                        <div className="space-y-6">
                            <h1 className="text-4xl md:text-5xl font-bold font-headline">{product.name}</h1>
                            
                            <div className="flex items-baseline gap-4">
                               {product.discountPercentage && product.discountPercentage > 0 ? (
                                    <>
                                        <p className="text-4xl font-bold text-primary">{formatCurrency(calculateDiscountedPrice(product.price, product.discountPercentage))}</p>
                                        <p className="text-2xl font-medium text-muted-foreground line-through">{formatCurrency(product.price)}</p>
                                        <Badge variant="destructive">{product.discountPercentage}% OFF</Badge>
                                    </>
                                ) : (
                                    <p className="text-4xl font-bold text-primary">{formatCurrency(product.price)}</p>
                                )}
                            </div>

                            <p className="text-lg text-muted-foreground">{product.description}</p>
                            
                            <Separator />

                            {features.length > 0 && (
                                <div>
                                    <h2 className="text-2xl font-bold font-headline mb-4">Features</h2>
                                    <ul className="space-y-3">
                                        {features.map((feature: string, index: number) => (
                                            <li key={index} className="flex items-center gap-3">
                                                <CheckCircle className="text-primary w-6 h-6"/>
                                                <span className="text-muted-foreground">{feature}</span>
                                            </li>
                                        ))}
                                    </ul>
                                </div>
                            )}

                            <Button size="lg" className="w-full md:w-auto text-lg">
                                Add to Cart <ShoppingCart className="ml-2"/>
                            </Button>
                        </div>
                    </div>
                </div>
            </main>
            <Footer />
        </div>
    );
}

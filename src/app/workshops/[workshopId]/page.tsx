
"use client";

import { Bot, Calendar, Clock, User } from "lucide-react";
import { Button } from "@/components/ui/button";
import Header from "@/components/layout/header";
import Footer from "@/components/layout/footer";
import { notFound, useRouter } from "next/navigation";
import Image from "next/image";
import { PlaceHolderImages } from "@/lib/placeholder-images";
import { useAuth } from "@/context/auth-context";
import Link from "next/link";
import { useEffect, useState } from "react";
import { doc, getDoc } from "firebase/firestore";
import { db } from "@/lib/firebase";
import type { Workshop } from "@/app/admin/workshops/page";
import { Skeleton } from "@/components/ui/skeleton";


export default function WorkshopDetailPage({ params }: { params: { workshopId: string } }) {
    const { workshopId } = params;
    const router = useRouter();
    const { user, loading: authLoading } = useAuth();
    const [workshop, setWorkshop] = useState<Workshop | null>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchWorkshop = async () => {
            const docRef = doc(db, "workshops", workshopId);
            const docSnap = await getDoc(docRef);

            if (docSnap.exists()) {
                setWorkshop({ id: docSnap.id, ...docSnap.data() } as Workshop);
            } else {
                notFound();
            }
            setLoading(false);
        };

        fetchWorkshop();
    }, [workshopId]);

    const handleRegister = () => {
        const destination = `/workshops/${workshopId}/register`;
        if (user) {
            router.push(destination);
        } else {
            router.push(`/login?redirect=${destination}`);
        }
    };
    
    if (loading || authLoading) {
      return (
        <div className="flex flex-col min-h-dvh bg-background">
          <Header />
          <main className="flex-1">
            <Skeleton className="h-[40vh] w-full" />
            <section className="py-12 md:py-24">
              <div className="container mx-auto">
                <div className="grid md:grid-cols-3 gap-8 max-w-4xl mx-auto bg-card p-8 rounded-lg shadow-lg -mt-32 relative z-20">
                  <Skeleton className="h-12 w-full" />
                  <Skeleton className="h-12 w-full" />
                  <Skeleton className="h-12 w-full" />
                </div>
                <div className="max-w-4xl mx-auto mt-12 text-center">
                  <Skeleton className="h-12 w-48 mx-auto" />
                </div>
              </div>
            </section>
          </main>
          <Footer />
        </div>
      );
    }

    if (!workshop) {
        notFound();
    }

    return (
        <div className="flex flex-col min-h-dvh bg-background">
            <Header />
            <main className="flex-1">
                 <section className="relative py-24 md:py-32 lg:py-40 bg-secondary/30">
                    {workshop.imageUrl && (
                        <Image 
                            src={workshop.imageUrl}
                            alt={workshop.title}
                            fill
                            className="object-cover z-0 opacity-20"
                        />
                    )}
                    <div className="container mx-auto text-center relative z-10">
                        <Bot className="mx-auto h-16 w-16 text-primary animate-pulse" />
                        <h1 className="mt-4 text-4xl font-bold tracking-tighter sm:text-5xl md:text-6xl font-headline">
                        {workshop.title}
                        </h1>
                        <p className="mx-auto mt-4 max-w-3xl text-muted-foreground md:text-xl">
                        {workshop.description}
                        </p>
                    </div>
                </section>
                <section className="py-12 md:py-24">
                    <div className="container mx-auto">
                        <div className="grid md:grid-cols-3 gap-8 max-w-4xl mx-auto bg-card p-8 rounded-lg shadow-lg -mt-32 relative z-20">
                            <div className="flex items-center gap-4">
                                <Calendar className="h-8 w-8 text-primary"/>
                                <div>
                                    <h3 className="font-bold">Date</h3>
                                    <p className="text-muted-foreground">{workshop.date}</p>
                                </div>
                            </div>
                             <div className="flex items-center gap-4">
                                <Clock className="h-8 w-8 text-primary"/>
                                <div>
                                    <h3 className="font-bold">Duration</h3>
                                    <p className="text-muted-foreground">{workshop.duration}</p>
                                </div>
                            </div>
                             <div className="flex items-center gap-4">
                                <User className="h-8 w-8 text-primary"/>
                                <div>
                                    <h3 className="font-bold">Instructor</h3>
                                    <p className="text-muted-foreground">{workshop.instructor}</p>
                                </div>
                            </div>
                        </div>
                        <div className="max-w-4xl mx-auto mt-12 text-center">
                            <Button size="lg" onClick={handleRegister}>Register for Workshop</Button>
                        </div>
                    </div>
                </section>
            </main>
            <Footer />
        </div>
    );
}

// This function can be removed if you are fetching workshops dynamically.
// If you want to keep it for performance, you'd fetch from Firestore at build time.
// export async function generateStaticParams() {
//   // Fetch all workshop IDs from Firestore here to generate static pages.
//   // For now, returning an empty array to indicate dynamic rendering.
//   return [];
// }

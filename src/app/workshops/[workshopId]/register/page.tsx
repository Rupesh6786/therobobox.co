
"use client";

import { useEffect, useState } from "react";
import { useRouter, notFound, useParams } from "next/navigation";
import { useAuth } from "@/context/auth-context";
import { db } from "@/lib/firebase";
import { doc, getDoc, addDoc, collection, serverTimestamp, query, where, getDocs } from "firebase/firestore";
import Header from "@/components/layout/header";
import Footer from "@/components/layout/footer";
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Loader2, CheckCircle, ArrowLeft, Calendar, Clock, User as UserIcon } from "lucide-react";
import Image from "next/image";
import type { Workshop } from "@/app/admin/workshops/page";
import { useToast } from "@/hooks/use-toast";

export default function RegisterWorkshopPage() {
  const { user, loading: authLoading } = useAuth();
  const router = useRouter();
  const params = useParams();
  const { workshopId } = params;
  const { toast } = useToast();

  const [workshop, setWorkshop] = useState<Workshop | null>(null);
  const [loading, setLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isAlreadyRegistered, setIsAlreadyRegistered] = useState(false);

  useEffect(() => {
    if (!authLoading && !user) {
      router.push(`/login?redirect=/workshops/${workshopId}/register`);
    }
  }, [user, authLoading, router, workshopId]);
  
  useEffect(() => {
    if (!workshopId || !user) return;

    const fetchWorkshopAndCheckRegistration = async () => {
        setLoading(true);
        try {
            // Fetch workshop details
            const workshopRef = doc(db, "workshops", workshopId as string);
            const workshopSnap = await getDoc(workshopRef);
            if (workshopSnap.exists()) {
                setWorkshop({ id: workshopSnap.id, ...workshopSnap.data() } as Workshop);
            } else {
                notFound();
                return;
            }

            // Check if user is already registered
            const registrationsRef = collection(db, `workshops/${workshopId}/registrations`);
            const q = query(registrationsRef, where("userId", "==", user.uid));
            const querySnapshot = await getDocs(q);
            if (!querySnapshot.empty) {
                setIsAlreadyRegistered(true);
            }
        } catch (error) {
            console.error("Error fetching data: ", error);
            toast({ title: "Error", description: "Could not load workshop details.", variant: "destructive"});
        } finally {
            setLoading(false);
        }
    };

    fetchWorkshopAndCheckRegistration();
  }, [workshopId, user, toast]);

  const handleConfirm = async () => {
    if (!workshop || !user) return;

    setIsSubmitting(true);
    try {
      await addDoc(collection(db, `workshops/${workshop.id}/registrations`), {
        workshopId: workshop.id,
        userId: user.uid,
        userName: user.displayName || user.email,
        userEmail: user.email,
        registeredAt: serverTimestamp(),
      });
      setIsAlreadyRegistered(true); // Set as registered after successful submission
      toast({
        title: "Registration Successful!",
        description: `You are now registered for ${workshop.title}.`,
      });
    } catch (error) {
      console.error("Error registering for workshop: ", error);
      toast({
        title: "Registration Failed",
        description: "Could not complete your registration. Please try again.",
        variant: "destructive"
      })
    } finally {
        setIsSubmitting(false);
    }
  };

  if (loading || authLoading || !user) {
    return (
      <div className="flex h-screen items-center justify-center bg-background">
        <Image src="/img/logofavicon.ico" alt="Loading..." width={64} height={64} className="animate-spin" />
      </div>
    );
  }

  if (!workshop) {
      return notFound();
  }
  
  if (isAlreadyRegistered) {
      return (
          <div className="flex flex-col min-h-dvh bg-secondary/30">
              <Header />
              <main className="flex-1 flex items-center justify-center py-12 md:py-24">
                  <Card className="max-w-2xl mx-auto shadow-lg text-center p-8">
                    <CardHeader>
                        <CheckCircle className="h-20 w-20 text-green-500 mx-auto animate-pulse" />
                        <CardTitle className="text-3xl font-bold font-headline mt-4">You're All Set!</CardTitle>
                        <CardDescription className="text-lg mt-2">
                           You are already registered for <strong>{workshop.title}</strong>. We look forward to seeing you there!
                        </CardDescription>
                    </CardHeader>
                    <CardFooter className="justify-center gap-4">
                        <Button onClick={() => router.push('/workshops')}>
                            Explore Other Workshops
                        </Button>
                         <Button variant="outline" onClick={() => router.push('/')}>
                            Back to Home
                        </Button>
                    </CardFooter>
                  </Card>
              </main>
              <Footer />
          </div>
      )
  }

  return (
    <div className="flex flex-col min-h-dvh bg-secondary/30">
      <Header />
      <main className="flex-1 py-12 md:py-24">
        <div className="container mx-auto">
          <Card className="max-w-2xl mx-auto shadow-lg">
            <CardHeader>
              <CardTitle className="text-3xl font-bold font-headline">Confirm Your Registration</CardTitle>
              <CardDescription>Review the details below to register for this workshop.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
                <div>
                    <p className="text-sm text-muted-foreground">Workshop</p>
                    <p className="font-semibold text-lg">{workshop.title}</p>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                    <div className="flex items-center gap-4">
                        <Calendar className="w-6 h-6 text-primary"/>
                        <div>
                            <p className="text-sm text-muted-foreground">Date</p>
                            <p className="font-semibold">{workshop.date}</p>
                        </div>
                    </div>
                    <div className="flex items-center gap-4">
                        <Clock className="w-6 h-6 text-primary"/>
                        <div>
                            <p className="text-sm text-muted-foreground">Time</p>
                            <p className="font-semibold">{workshop.time}</p>
                        </div>
                    </div>
                </div>
                <div className="flex items-center gap-4">
                    <UserIcon className="w-6 h-6 text-primary"/>
                    <div>
                        <p className="text-sm text-muted-foreground">Registering as</p>
                        <p className="font-semibold">{user.displayName || user.email}</p>
                    </div>
                </div>
            </CardContent>
            <CardFooter className="flex flex-col sm:flex-row gap-4">
                 <Button variant="outline" onClick={() => router.back()} disabled={isSubmitting}>
                     <ArrowLeft className="mr-2"/> Back
                 </Button>
                <Button onClick={handleConfirm} disabled={isSubmitting} className="w-full sm:w-auto">
                    {isSubmitting ? (
                        <>
                            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                            Registering...
                        </>
                    ) : (
                       "Confirm Registration"
                    )}
                </Button>
            </CardFooter>
          </Card>
        </div>
      </main>
      <Footer />
    </div>
  );
}

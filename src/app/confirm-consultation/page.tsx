
"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/context/auth-context";
import { handleSubmitAction, type FormValues } from "@/app/actions/school-registration";
import Header from "@/components/layout/header";
import Footer from "@/components/layout/footer";
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Loader2, CheckCircle, School, User, Mail, Phone, ArrowLeft } from "lucide-react";
import Image from "next/image";

type StoredData = Omit<FormValues, 'userId'>;

export default function ConfirmConsultationPage() {
  const { user, loading } = useAuth();
  const router = useRouter();
  const [consultationData, setConsultationData] = useState<StoredData | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);

  useEffect(() => {
    if (!loading && !user) {
      router.push("/login?redirect=/confirm-consultation");
    }
  }, [user, loading, router]);
  
  useEffect(() => {
      const data = sessionStorage.getItem('consultationData');
      if (data) {
          setConsultationData(JSON.parse(data));
      } else {
          // If no data, maybe redirect to home or registration form
          router.push('/#register');
      }
  }, [router]);

  const handleConfirm = async () => {
    if (!consultationData || !user) return;

    setIsSubmitting(true);
    const dataToSubmit = { ...consultationData, userId: user.uid };
    const result = await handleSubmitAction(dataToSubmit);
    setIsSubmitting(false);
    
    if (result.success) {
      setIsSubmitted(true);
      sessionStorage.removeItem('consultationData');
    } else {
      // Handle error, maybe with a toast
      console.error("Submission failed:", result.error);
    }
  };

  if (loading || !user || !consultationData) {
    return (
      <div className="flex h-screen items-center justify-center bg-background">
        <Image src="/img/logofavicon.ico" alt="Loading..." width={64} height={64} className="animate-spin" />
      </div>
    );
  }
  
  if (isSubmitted) {
      return (
          <div className="flex flex-col min-h-dvh bg-secondary/30">
              <Header />
              <main className="flex-1 flex items-center justify-center py-12 md:py-24">
                  <Card className="max-w-2xl mx-auto shadow-lg text-center p-8">
                    <CardHeader>
                        <CheckCircle className="h-20 w-20 text-green-500 mx-auto animate-pulse" />
                        <CardTitle className="text-3xl font-bold font-headline mt-4">Appointment Booked!</CardTitle>
                        <CardDescription className="text-lg mt-2">
                           Thank you, {consultationData.contactName}. Your consultation request for {consultationData.schoolName} has been received. Our team will contact you shortly.
                        </CardDescription>
                    </CardHeader>
                    <CardContent>
                        <p className="text-muted-foreground">You can now close this page or explore more of our site.</p>
                    </CardContent>
                    <CardFooter className="justify-center">
                        <Button onClick={() => router.push('/')}>
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
              <CardTitle className="text-3xl font-bold font-headline">Confirm Your Consultation</CardTitle>
              <CardDescription>Please review your details below before confirming your free consultation.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
                <div className="flex items-center gap-4">
                    <School className="w-6 h-6 text-primary"/>
                    <div>
                        <p className="text-sm text-muted-foreground">School Name</p>
                        <p className="font-semibold">{consultationData.schoolName}</p>
                    </div>
                </div>
                <div className="flex items-center gap-4">
                    <User className="w-6 h-6 text-primary"/>
                    <div>
                        <p className="text-sm text-muted-foreground">Your Name</p>
                        <p className="font-semibold">{consultationData.contactName}</p>
                    </div>
                </div>
                <div className="flex items-center gap-4">
                    <Mail className="w-6 h-6 text-primary"/>
                    <div>
                        <p className="text-sm text-muted-foreground">Email Address</p>
                        <p className="font-semibold">{consultationData.email}</p>
                    </div>
                </div>
                <div className="flex items-center gap-4">
                    <Phone className="w-6 h-6 text-primary"/>
                    <div>
                        <p className="text-sm text-muted-foreground">Mobile Number</p>
                        <p className="font-semibold">{consultationData.phone}</p>
                    </div>
                </div>
            </CardContent>
            <CardFooter className="flex flex-col sm:flex-row gap-4">
                 <Button variant="outline" onClick={() => router.back()} disabled={isSubmitting}>
                     <ArrowLeft className="mr-2"/> Go Back
                 </Button>
                <Button onClick={handleConfirm} disabled={isSubmitting} className="w-full sm:w-auto">
                    {isSubmitting ? (
                        <>
                            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                            Booking...
                        </>
                    ) : (
                       "Book My Appointment"
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

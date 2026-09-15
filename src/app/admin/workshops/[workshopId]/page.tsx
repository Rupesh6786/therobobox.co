
"use client";

import { useEffect, useState } from "react";
import { doc, getDoc, collection, query, onSnapshot, orderBy, Timestamp } from "firebase/firestore";
import { db } from "@/lib/firebase";
import { notFound, useRouter } from "next/navigation";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Loader2, ArrowLeft, Calendar, Clock, User, MapPin, Tag, BookOpen } from "lucide-react";
import { Separator } from "@/components/ui/separator";
import type { Workshop } from "../page";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";

interface Registration {
    id: string;
    userName: string;
    userEmail: string;
    registeredAt: Timestamp;
}

export default function WorkshopDetailsPage({ params }: { params: { workshopId: string }}) {
  const [workshop, setWorkshop] = useState<Workshop | null>(null);
  const [registrations, setRegistrations] = useState<Registration[]>([]);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    const fetchWorkshop = async () => {
      const docRef = doc(db, "workshops", params.workshopId);
      const docSnap = await getDoc(docRef);
      if (docSnap.exists()) {
        setWorkshop({ id: docSnap.id, ...docSnap.data() } as Workshop);
      } else {
        notFound();
      }
      setLoading(false);
    };

    fetchWorkshop();
  }, [params.workshopId]);

  useEffect(() => {
    if (!params.workshopId) return;

    const q = query(collection(db, `workshops/${params.workshopId}/registrations`), orderBy("registeredAt", "desc"));
    const unsubscribe = onSnapshot(q, (querySnapshot) => {
        const registrationsData: Registration[] = [];
        querySnapshot.forEach((doc) => {
            registrationsData.push({ id: doc.id, ...doc.data() } as Registration);
        });
        setRegistrations(registrationsData);
    });

    return () => unsubscribe();
  }, [params.workshopId]);

  const formatDate = (timestamp: Timestamp | undefined) => {
    if (!timestamp) return "N/A";
    return timestamp.toDate().toLocaleString();
  };

  if (loading) {
    return (
      <div className="flex h-screen items-center justify-center bg-background">
        <Loader2 className="w-16 h-16 animate-spin text-primary" />
      </div>
    );
  }
  
  if (!workshop) {
      return notFound();
  }

  return (
    <div className="space-y-6">
        <Button variant="outline" onClick={() => router.back()}>
            <ArrowLeft className="mr-2 h-4 w-4"/>
            Back to Workshops
        </Button>

        <Card>
            <CardHeader>
                <CardTitle className="text-2xl font-bold">{workshop.title}</CardTitle>
                <CardDescription>{workshop.description}</CardDescription>
            </CardHeader>
            <CardContent>
                <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 text-sm">
                    <div className="flex items-center gap-3"> <Calendar className="w-5 h-5 text-muted-foreground"/> <div><strong>Date:</strong> {workshop.date}</div> </div>
                    <div className="flex items-center gap-3"> <Clock className="w-5 h-5 text-muted-foreground"/> <div><strong>Time:</strong> {workshop.time}</div> </div>
                    <div className="flex items-center gap-3"> <Clock className="w-5 h-5 text-muted-foreground"/> <div><strong>Duration:</strong> {workshop.duration}</div> </div>
                    <div className="flex items-center gap-3"> <User className="w-5 h-5 text-muted-foreground"/> <div><strong>Instructor:</strong> {workshop.instructor}</div> </div>
                    <div className="flex items-center gap-3"> <MapPin className="w-5 h-5 text-muted-foreground"/> <div><strong>Venue:</strong> {workshop.venue}</div> </div>
                    <div className="flex items-center gap-3"> <Tag className="w-5 h-5 text-muted-foreground"/> <div><strong>Address:</strong> {workshop.address}</div> </div>
                </div>
                <Separator className="my-6" />
                <div className="space-y-2">
                    <h4 className="font-semibold flex items-center gap-2"><BookOpen className="w-5 h-5 text-muted-foreground"/> Topics</h4>
                    <p className="text-muted-foreground">{workshop.topics}</p>
                </div>
            </CardContent>
        </Card>

        <Card>
            <CardHeader>
                <CardTitle>Registered Users ({registrations.length})</CardTitle>
                <CardDescription>Users who have registered for this workshop.</CardDescription>
            </CardHeader>
            <CardContent>
                 <Table>
                    <TableHeader>
                        <TableRow>
                        <TableHead>Registration Date</TableHead>
                        <TableHead>Name</TableHead>
                        <TableHead>Email</TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {registrations.length > 0 ? registrations.map((reg) => (
                        <TableRow key={reg.id}>
                            <TableCell className="font-medium">{formatDate(reg.registeredAt)}</TableCell>
                            <TableCell>{reg.userName}</TableCell>
                            <TableCell>{reg.userEmail}</TableCell>
                        </TableRow>
                        )) : (
                            <TableRow>
                                <TableCell colSpan={3} className="text-center h-24">No users have registered yet.</TableCell>
                            </TableRow>
                        )}
                    </TableBody>
                </Table>
            </CardContent>
        </Card>
    </div>
  );
}



"use client";

import { useEffect, useState } from "react";
import { collection, onSnapshot, query, orderBy, Timestamp } from "firebase/firestore";
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
import { Loader2, PlusCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import Link from "next/link";

export interface Workshop {
    id: string;
    title: string;
    description: string;
    instructor: string;
    date: string;
    duration: string;
    imageUrl?: string;
    venue: string;
    address: string;
    time: string;
    topics: string;
    createdAt: Timestamp;
}

export default function WorkshopsPage() {
    const [workshops, setWorkshops] = useState<Workshop[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const q = query(collection(db, "workshops"), orderBy("createdAt", "desc"));
        const unsubscribe = onSnapshot(q, (querySnapshot) => {
            const workshopsData: Workshop[] = [];
            querySnapshot.forEach((doc) => {
                workshopsData.push({ id: doc.id, ...doc.data() } as Workshop);
            });
            setWorkshops(workshopsData);
            setLoading(false);
        });

        return () => unsubscribe();
    }, []);

    const formatDate = (timestamp: Timestamp | undefined) => {
        if (!timestamp) return 'N/A';
        return timestamp.toDate().toLocaleDateString();
    }

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between">
        <div>
            <CardTitle>Workshops</CardTitle>
            <CardDescription>Create, view, and manage all workshops.</CardDescription>
        </div>
        <Button asChild>
            <Link href="/admin/workshops/new">
                <PlusCircle className="mr-2 h-4 w-4"/>
                Create Workshop
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
              <TableHead>Title</TableHead>
              <TableHead>Instructor</TableHead>
              <TableHead>Date</TableHead>
              <TableHead>Venue</TableHead>
              <TableHead>Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {workshops.map((workshop) => (
              <TableRow key={workshop.id}>
                <TableCell className="font-medium">{formatDate(workshop.createdAt)}</TableCell>
                <TableCell>{workshop.title}</TableCell>
                <TableCell>{workshop.instructor}</TableCell>
                <TableCell>{workshop.date}</TableCell>
                <TableCell>{workshop.venue}</TableCell>
                <TableCell>
                    <Button asChild variant="outline" size="sm">
                        <Link href={`/admin/workshops/${workshop.id}`}>View Details</Link>
                    </Button>
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

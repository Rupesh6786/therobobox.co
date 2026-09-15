
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
import { Badge } from "@/components/ui/badge";
import { Loader2 } from "lucide-react";

interface Enquiry {
    id: string;
    schoolName: string;
    contactName: string;
    email: string;
    phone: string;
    status: "Pending" | "Contacted" | "Resolved";
    createdAt: Timestamp;
}

export default function EnquiriesPage() {
    const [enquiries, setEnquiries] = useState<Enquiry[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const q = query(collection(db, "enquiries"), orderBy("createdAt", "desc"));
        const unsubscribe = onSnapshot(q, (querySnapshot) => {
            const enquiriesData: Enquiry[] = [];
            querySnapshot.forEach((doc) => {
                enquiriesData.push({ id: doc.id, ...doc.data() } as Enquiry);
            });
            setEnquiries(enquiriesData);
            setLoading(false);
        });

        return () => unsubscribe();
    }, []);

    const formatDate = (timestamp: Timestamp | undefined) => {
        if (!timestamp) return 'N/A';
        return timestamp.toDate().toLocaleString();
    }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Consultation Enquiries</CardTitle>
        <CardDescription>View and manage all free consultation requests.</CardDescription>
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
              <TableHead>Date</TableHead>
              <TableHead>School Name</TableHead>
              <TableHead>Contact Name</TableHead>
              <TableHead>Email</TableHead>
              <TableHead>Phone</TableHead>
              <TableHead>Status</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {enquiries.map((enquiry) => (
              <TableRow key={enquiry.id}>
                <TableCell className="font-medium">{formatDate(enquiry.createdAt)}</TableCell>
                <TableCell>{enquiry.schoolName}</TableCell>
                <TableCell>{enquiry.contactName}</TableCell>
                <TableCell>{enquiry.email}</TableCell>
                <TableCell>{enquiry.phone}</TableCell>
                <TableCell>
                  <Badge variant={enquiry.status === 'Pending' ? 'destructive' : 'default'}>
                    {enquiry.status}
                  </Badge>
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

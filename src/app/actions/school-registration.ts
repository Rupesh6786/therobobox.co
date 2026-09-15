
"use server";

import { z } from "zod";
import { collection, addDoc, serverTimestamp } from "firebase/firestore";
import { db } from "@/lib/firebase";

const formSchema = z.object({
  schoolName: z.string().min(2, {
    message: "School name must be at least 2 characters.",
  }),
  contactName: z.string().min(2, "Contact name must be at least 2 characters."),
  email: z.string().email("Please enter a valid email address."),
  phone: z.string().min(10, "Please enter a valid mobile number."),
  userId: z.string(),
});

export type FormValues = z.infer<typeof formSchema>;

export async function handleSubmitAction(data: FormValues) {
  try {
    await addDoc(collection(db, "enquiries"), {
      ...data,
      createdAt: serverTimestamp(),
      status: "Pending",
    });
    return { success: true, schoolName: data.schoolName };
  } catch (error) {
    console.error("Error adding document: ", error);
    return { success: false, error: "Failed to submit consultation request." };
  }
}

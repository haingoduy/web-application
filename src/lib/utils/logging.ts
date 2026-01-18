import { addDoc, collection, serverTimestamp } from "firebase/firestore";
import { db } from "@/lib/firebase/config";

export type LogRole = 'admin' | 'shipper' | 'user';

export async function logActivity(userId: string, email: string, role: LogRole, event: string, details?: string) {
  try {
    await addDoc(collection(db, "logs"), {
      userId,
      userEmail: email,
      role,
      event,
      details: details || "",
      timestamp: serverTimestamp(),
      status: "SUCCESS"
    });
  } catch (error) {
    console.error("Critical: Failed to record protocol log:", error);
  }
}

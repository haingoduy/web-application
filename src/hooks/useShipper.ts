"use client";

import { useEffect, useState } from "react";
import { doc, onSnapshot } from "firebase/firestore";
import { db } from "@/lib/firebase/config";
import { User } from "@/types";

export function useShipper(id: string) {
  const [shipper, setShipper] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!id) {
        setLoading(false);
        return;
    }

    // Assuming users are stored with their UID as document ID
    const unsubscribe = onSnapshot(doc(db, "users", id), (doc) => {
      if (doc.exists()) {
        setShipper(doc.data() as User);
      } else {
        setShipper(null);
      }
      setLoading(false);
    });

    return () => unsubscribe();
  }, [id]);

  return { shipper, loading };
}

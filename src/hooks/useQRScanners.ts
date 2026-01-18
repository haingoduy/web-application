"use client";

import { useEffect, useState } from "react";
import { collection, onSnapshot, query } from "firebase/firestore";
import { db } from "@/lib/firebase/config";
import { QRScanner } from "@/types";

export function useQRScanners() {
  const [scanners, setScanners] = useState<QRScanner[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const q = query(collection(db, "QRScanner"));
    const unsubscribe = onSnapshot(q, (snapshot) => {
      const results = snapshot.docs.map((doc) => ({
         ...doc.data(),
         id: doc.id
      })) as QRScanner[];
      setScanners(results);
      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  return { scanners, loading };
}

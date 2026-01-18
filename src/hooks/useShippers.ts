"use client";

import { useEffect, useState } from "react";
import { collection, onSnapshot, query, where } from "firebase/firestore";
import { db } from "@/lib/firebase/config";
import { User } from "@/types";

export function useShippers() {
  const [shippers, setShippers] = useState<User[]>([]);
  const [shipperMap, setShipperMap] = useState<Record<string, string>>({});
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Determine which query to use. If we want ALL shippers to resolve names for history, 
    // we should just query role=shipper.
    // The previous implementation was: query(collection(db, "users"), where("role", "==", "shipper"));
    // This is already correct for "All Shippers". 
    // However, if we want to filter for "Available" we might need a separate state, 
    // but the 'shippers' state here is likely used for the Management Table. 
    // We will keep 'shippers' as is, but explicitely build 'shipperMap'.

    const q = query(collection(db, "users"), where("role", "==", "shipper"));
    const unsubscribe = onSnapshot(q, (snapshot) => {
      const results = snapshot.docs.map((doc) => doc.data() as User);
      setShippers(results);
      
      const map: Record<string, string> = {};
      results.forEach(s => {
        if (s.uid && s.name) {
            map[s.uid] = s.name;
        }
      });
      setShipperMap(map);
      
      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  return { shippers, shipperMap, loading };
}

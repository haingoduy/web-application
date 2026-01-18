"use client";

import { useEffect, useState } from "react";
import { collection, onSnapshot, query, orderBy } from "firebase/firestore";
import { db } from "@/lib/firebase/config";
import { Order } from "@/types";

export function useOrders() {
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Basic query: ALL orders, sorted by timestamp desc
    // For large datasets, you would limit and paginate via cursors, but for now we fetch all.
    const q = query(collection(db, "orders"), orderBy("timestamp", "desc"));

    const unsubscribe = onSnapshot(q, (snapshot) => {
      const results = snapshot.docs.map((doc) => ({
        ...doc.data(),
        orderId: doc.id,
      })) as Order[];
      setOrders(results);
      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  return { orders, loading };
}

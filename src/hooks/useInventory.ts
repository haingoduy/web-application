"use client";

import { useEffect, useState } from "react";
import { collection, onSnapshot, query, orderBy } from "firebase/firestore";
import { db } from "@/lib/firebase/config";
import { InventoryItem } from "@/types";

export function useInventory() {
  const [items, setItems] = useState<InventoryItem[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const q = query(
        collection(db, "inventory"), 
        orderBy("sku", "asc")
    );

    const unsubscribe = onSnapshot(q, (snapshot) => {
      const inventoryData = snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      })) as InventoryItem[];
      setItems(inventoryData);
      setLoading(false);
    }, (error) => {
      console.error("Inventory Sync Error:", error);
      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  return { items, loading };
}

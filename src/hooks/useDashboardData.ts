"use client";

import { useEffect, useState } from "react";
import { collection, onSnapshot, query, where } from "firebase/firestore";
import { db } from "@/lib/firebase/config";
import { Order, User, OrderStatus } from "@/types";

export interface DashboardStats {
  totalOrders: number;
  pendingOrders: number;
  processingOrders: number;
  completedOrders: number;
  freeShippers: number;
  busyShippers: number;
  ordersByStatus: { name: string; value: number; color: string }[];
  ordersByWarehouse: { name: string; value: number }[];
  recentOrders: Order[];
  allOrders: Order[];
}

export function useDashboardData() {
  const [stats, setStats] = useState<DashboardStats>({
    totalOrders: 0,
    pendingOrders: 0,
    processingOrders: 0,
    completedOrders: 0,
    freeShippers: 0,
    busyShippers: 0,
    ordersByStatus: [],
    ordersByWarehouse: [],
    recentOrders: [],
    allOrders: [],
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Listen to orders
    const ordersQuery = query(collection(db, "orders"));
    const unsubscribeOrders = onSnapshot(ordersQuery, (snapshot) => {
      const orders = snapshot.docs.map((doc) => ({
        ...doc.data(),
        orderId: doc.id,
      })) as Order[];

      const totalOrders = orders.length;
      const pendingOrders = orders.filter((o) => o.status === "PENDING").length;
      const processingOrders = orders.filter(
        (o) => o.status === "PROCESSING"
      ).length;
      const completedOrders = orders.filter(
        (o) => o.status === "COMPLETED"
      ).length;

      // Group by warehouse
      const warehouseCounts: Record<string, number> = {};
      orders.forEach((o) => {
        if (o.fromWarehouse) {
            warehouseCounts[o.fromWarehouse] = (warehouseCounts[o.fromWarehouse] || 0) + 1;
        }
      });
      const ordersByWarehouse = Object.entries(warehouseCounts).map(
        ([name, value]) => ({ name, value })
      );

      // Data for Pie Chart
      const ordersByStatus = [
        { name: "Pending", value: pendingOrders, color: "#FFA500" }, // Orange
        { name: "Processing", value: processingOrders, color: "#3b82f6" }, // Blue
        { name: "Completed", value: completedOrders, color: "#22c55e" }, // Green
      ];

       // Recent orders (last 5)
       // Note: In a real app, you'd sort by timestamp. Assuming standard sort here or doing it in JS.
       const recentOrders = [...orders]
        .sort((a, b) => (b.timestamp?.seconds || 0) - (a.timestamp?.seconds || 0))
        .slice(0, 5);


      setStats((prev) => ({
        ...prev,
        totalOrders,
        pendingOrders,
        processingOrders,
        completedOrders,
        ordersByStatus,
        ordersByWarehouse,
        recentOrders,
        allOrders: orders,
      }));
    });

    // Listen to shippers
    const shippersQuery = query(
      collection(db, "users"),
      where("role", "==", "shipper")
    );
    
    // We need to keep tracks of orders to accurately calculate "on mission"
    // Since we are in the same useEffect, let's just use the local orders variable from the first listener
    // Actually, it's better to store orders in a state or ref if we want to cross-reference.
    // Let's refine the entire listener logic to fetch both and then process.
    
    const unsubscribeShippers = onSnapshot(shippersQuery, (snapshot) => {
      const shippers = snapshot.docs.map((doc) => doc.data() as User);
      
      // We will perform the "busy" calculation in the setStats to have access to orders accurately
      // or we can just rely on the user.status being updated by the system when they take an order.
      // The user requested: "nếu có shipper ddag giao thì tính vào onMission"
      // Let's check 'currentOrder' field or if they are assigned to any non-completed order.
      
      setStats((prev) => {
        const busyShippers = shippers.filter((s) => {
            if (s.status === "busy") return true;
            if (s.currentOrder) return true;
            return false;
        }).length;

        const freeShippers = shippers.length - busyShippers;

        return {
          ...prev,
          freeShippers,
          busyShippers,
        };
      });
      setLoading(false);
    });

    return () => {
      unsubscribeOrders();
      unsubscribeShippers();
    };
  }, []);

  return { stats, loading };
}

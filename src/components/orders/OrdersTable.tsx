"use client";

import { Order } from "@/types";
import { motion } from "framer-motion";
import clsx from "clsx";
import { Eye, ChevronRight } from "lucide-react";
import { useRouter } from "next/navigation";

interface OrdersTableProps {
  orders: Order[];
  loading: boolean;
  shipperMap?: Record<string, string>;
}

const container = {
  hidden: { opacity: 0 },
  show: {
    opacity: 1,
    transition: {
      staggerChildren: 0.05,
    },
  },
};

const item = {
  hidden: { x: -10, opacity: 0 },
  show: { x: 0, opacity: 1 },
};

export default function OrdersTable({ orders, loading, shipperMap = {} }: OrdersTableProps) {
  const router = useRouter();

  if (loading) {
    return (
      <div className="p-12 text-center text-gray-500 animate-pulse">
        <div className="text-sm font-bold uppercase tracking-widest text-primary">Syncing with Fleet...</div>
      </div>
    );
  }

  if (orders.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center p-16 text-center">
        <div className="h-20 w-20 rounded-3xl bg-green-50 dark:bg-primary/20 flex items-center justify-center mb-6 shadow-inset">
          <Eye className="h-10 w-10 text-primary/50" />
        </div>
        <h3 className="text-xl font-black text-gray-900 dark:text-white uppercase italic">Zero Orders Sync'd</h3>
        <p className="text-gray-500 font-medium mt-2 max-w-[240px]">The database is currently clear of logistics requests.</p>
      </div>
    );
  }

  return (
    <div className="overflow-x-auto custom-scrollbar">
      <table className="min-w-full border-separate border-spacing-y-1.5 px-8">
        <thead>
          <tr>
            <th className="px-5 py-4 text-left text-[10px] font-bold uppercase tracking-wider text-gray-400">ID</th>
            <th className="px-5 py-4 text-left text-[10px] font-bold uppercase tracking-wider text-gray-400">Customer</th>
            <th className="px-5 py-4 text-left text-[10px] font-bold uppercase tracking-wider text-gray-400">Logistics Item</th>
            <th className="px-5 py-4 text-left text-[10px] font-bold uppercase tracking-wider text-gray-400">Assigned Shipper</th>
            <th className="px-5 py-4 text-left text-[10px] font-bold uppercase tracking-wider text-gray-400">Current Status</th>
            <th className="px-5 py-4 text-left text-[10px] font-bold uppercase tracking-wider text-gray-400 font-medium text-gray-400 tabular-nums text-[11px]">Timestamp</th>
          </tr>
        </thead>
        <motion.tbody
            variants={container}
            initial="hidden"
            animate="show"
        >
          {orders.map((order) => (
            <motion.tr 
              key={order.orderId} 
              variants={item}
              onClick={() => router.push(`/orders/${order.orderId}`)}
              className="group cursor-pointer transition-all duration-200"
            >
              <td className="whitespace-nowrap px-5 py-4 first:rounded-l-xl bg-white dark:bg-black border-y border-l border-gray-100 dark:border-white/10 transition-all group-hover:bg-gray-50 dark:group-hover:bg-white/5">
                <span className="text-xs font-bold text-primary tabular-nums">#{order.orderId.slice(0, 8)}</span>
              </td>
              
              <td className="whitespace-nowrap px-5 py-4 bg-white dark:bg-black border-y border-gray-100 dark:border-white/10 transition-all group-hover:bg-gray-50 dark:group-hover:bg-white/5">
                <div className="flex items-center gap-2.5">
                  <div className="h-8 w-8 bg-gray-100 dark:bg-white/5 rounded-lg flex items-center justify-center text-[10px] font-bold text-gray-600 dark:text-gray-400 uppercase">
                      {order.customerName.charAt(0)}
                  </div>
                  <span className="text-sm font-medium text-gray-900 dark:text-white">{order.customerName}</span>
                </div>
              </td>
              
              <td className="whitespace-nowrap px-5 py-4 bg-white dark:bg-black border-y border-gray-100 dark:border-white/10 transition-all group-hover:bg-gray-50 dark:group-hover:bg-white/5">
                <div className="flex flex-col">
                    <span className="text-sm font-medium text-gray-700 dark:text-gray-300">{order.productName}</span>
                    <span className="text-[10px] text-gray-400 font-bold uppercase tracking-tight">Qty: {order.quantity}</span>
                </div>
              </td>
              
              <td className="whitespace-nowrap px-5 py-4 bg-white dark:bg-black border-y border-gray-100 dark:border-white/10 transition-all group-hover:bg-gray-50 dark:group-hover:bg-white/5">
                {order.assignedShipperId ? (
                   <div className="flex items-center gap-1.5">
                     <span className="h-1 w-1 rounded-full bg-primary"></span>
                     <span className="text-xs text-gray-500 font-medium">{shipperMap[order.assignedShipperId] || "Fleet " + order.assignedShipperId.slice(0,4).toUpperCase()}</span>
                   </div>
                ) : (
                  <span className="text-[10px] font-bold text-gray-300 uppercase tracking-wider">Empty Slot</span>
                )}
              </td>
              
              <td className="whitespace-nowrap px-5 py-4 bg-white dark:bg-black border-y border-gray-100 dark:border-white/10 transition-all group-hover:bg-gray-50 dark:group-hover:bg-white/5">
                <span
                  className={clsx(
                    "inline-flex items-center rounded-lg px-2.5 py-1 text-[9px] font-bold uppercase tracking-wider border",
                    {
                      "bg-amber-50 text-amber-600 border-amber-100 dark:bg-amber-950/20 dark:border-amber-900/30": order.status === "PENDING",
                      "bg-blue-50 text-blue-600 border-blue-100 dark:bg-blue-950/20 dark:border-blue-900/30": order.status === "PROCESSING",
                      "bg-emerald-50 text-emerald-600 border-emerald-100 dark:bg-emerald-950/20 dark:border-emerald-900/30": order.status === "COMPLETED",
                    }
                  )}
                >
                  {order.status}
                </span>
              </td>
              
              <td className="whitespace-nowrap px-5 py-4 last:rounded-r-xl bg-white dark:bg-black border-y border-r border-gray-100 dark:border-white/10 transition-all group-hover:bg-gray-50 dark:group-hover:bg-white/5 font-medium text-gray-400 tabular-nums text-[11px]">
                {(() => {
                  const ts = order.timestamp;
                  if (!ts) return "N/A";
                  const date = new Date(ts.seconds ? ts.seconds * 1000 : ts);
                  return isNaN(date.getTime()) ? "N/A" : date.toLocaleDateString(undefined, {
                      month: 'short',
                      day: '2-digit',
                      year: '2-digit'
                  });
                })()}
              </td>
              
            </motion.tr>
          ))}
        </motion.tbody>
      </table>
    </div>
  );
}

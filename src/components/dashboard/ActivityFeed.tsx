"use client";

import { Order } from "@/types";
import { motion } from "framer-motion";
import { Clock, RefreshCcw, CheckCircle2, Package, Search } from "lucide-react";
import clsx from "clsx";

interface ActivityFeedProps {
  orders: Order[];
}

export default function ActivityFeed({ orders }: ActivityFeedProps) {
  return (
    <div className="minimal-card p-6 h-full flex flex-col">
      <div className="flex items-center justify-between mb-6">
        <h3 className="text-xs font-bold text-gray-400 dark:text-gray-500 uppercase tracking-wider flex items-center gap-2">
            <Clock className="h-3.5 w-3.5" />
            Live Activity
        </h3>
        <span className="flex h-2 w-2 rounded-full bg-emerald-500 animate-pulse" />
      </div>

      <div className="space-y-6 flex-1 overflow-y-auto pr-2 custom-scrollbar">
        {orders.length === 0 ? (
          <div className="flex flex-col items-center justify-center h-full py-8 opacity-40">
             <Search className="h-8 w-8 text-gray-300 mb-2" />
             <p className="text-[10px] font-bold uppercase tracking-widest text-gray-400">No events found</p>
          </div>
        ) : (
          orders.slice(0, 6).map((order, idx) => (
          <motion.div
            key={order.orderId}
            initial={{ opacity: 0, x: -10 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: idx * 0.1 }}
            className="relative pl-7 pb-1 border-l border-gray-100 dark:border-white/5 last:pb-0"
          >
            <div className={clsx(
              "absolute -left-1.5 top-0.5 h-3 w-3 rounded-full border-2 border-white dark:border-gray-950 flex items-center justify-center",
              order.status === 'COMPLETED' ? "bg-emerald-500" : order.status === 'PROCESSING' ? "bg-blue-500" : "bg-amber-500"
            )}>
              {order.status === 'COMPLETED' ? (
                <CheckCircle2 className="h-1.5 w-1.5 text-white" />
              ) : order.status === 'PROCESSING' ? (
                <RefreshCcw className="h-1.5 w-1.5 text-white animate-spin-slow" />
              ) : (
                <Package className="h-1.5 w-1.5 text-white" />
              )}
            </div>
            
            <div className="flex flex-col gap-1">
              <div className="flex items-center justify-between">
                <p className="text-[11px] font-bold text-gray-900 dark:text-white leading-none">
                    {order.productName} <span className="text-gray-400 font-medium">#{order.orderId.slice(-4).toUpperCase()}</span>
                </p>
                <span className="text-[9px] font-bold text-gray-400 tabular-nums">
                    {order.timestamp?.seconds ? new Date(order.timestamp.seconds * 1000).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) : 'Now'}
                </span>
              </div>
              <p className="text-[10px] text-gray-500 dark:text-gray-400 font-medium leading-relaxed">
                {order.status === 'COMPLETED' ? 'Operational verify complete' : order.status === 'PROCESSING' ? 'In transit to destination' : 'Deployment standby'} via <span className="text-primary dark:text-primary font-bold">{order.fromWarehouse}</span>
              </p>
            </div>
          </motion.div>
        ))
      )}
      </div>
    </div>
  );
}

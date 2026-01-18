"use client";

import { DashboardStats } from "@/hooks/useDashboardData";
import { Package, Truck, Clock, CheckCircle } from "lucide-react";
import { motion } from "framer-motion";
import clsx from "clsx";

interface StatsCardsProps {
  stats: DashboardStats;
}

const container = {
  hidden: { opacity: 0 },
  show: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1,
    },
  },
};

const item = {
  hidden: { y: 20, opacity: 0 },
  show: { y: 0, opacity: 1 },
};

export default function StatsCards({ stats }: StatsCardsProps) {
  const cards = [
    {
      name: "Total Orders",
      value: stats.totalOrders,
      icon: Package,
      color: "text-primary",
      bg: "bg-green-50 dark:bg-green-950/30",
    },
    {
      name: "Pending Orders",
      value: stats.pendingOrders,
      icon: Clock,
      color: "text-amber-500",
      bg: "bg-amber-50 dark:bg-amber-950/30",
    },
    {
      name: "Processing",
      value: stats.processingOrders,
      icon: Truck,
      color: "text-blue-500",
      bg: "bg-blue-50 dark:bg-blue-950/30",
    },
    {
      name: "Completed",
      value: stats.completedOrders,
      icon: CheckCircle,
      color: "text-emerald-500",
      bg: "bg-emerald-50 dark:bg-emerald-950/30",
    },
  ];

  return (
    <motion.div 
      variants={container}
      initial="hidden"
      animate="show"
      className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4"
    >
      {cards.map((card) => (
        <motion.div
          key={card.name}
          variants={item}
          className="minimal-card p-5 relative overflow-hidden group hover-lift border-gray-100/50 dark:border-white/5 shadow-md hover:shadow-xl"
        >
            <div className="flex items-center gap-4">
                <div className={clsx("rounded-xl p-3 flex items-center justify-center transition-colors", card.bg)}>
                    <card.icon className={clsx("h-5 w-5", card.color)} />
                </div>
                <div>
                   <p className="text-[11px] font-bold text-gray-400 uppercase tracking-tight mb-0.5">{card.name}</p>
                   <p className="text-2xl font-bold text-gray-900 dark:text-white tabular-nums tracking-tight">{card.value}</p>
                </div>
            </div>
        </motion.div>
      ))}
    </motion.div>
  );
}

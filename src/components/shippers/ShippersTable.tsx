"use client";

import { User, Order } from "@/types";
import { motion } from "framer-motion";
import clsx from "clsx";
import { TrendingUp, Award, Clock, ChevronRight, User as UserIcon } from "lucide-react";
import { useRouter } from "next/navigation";

interface ShippersTableProps {
  shippers: User[];
  orders: Order[];
  loading: boolean;
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

export default function ShippersTable({ shippers, orders, loading }: ShippersTableProps) {
  const router = useRouter();

  if (loading) {
    return (
        <div className="p-12 text-center text-gray-500 animate-pulse">
            <div className="text-sm font-black uppercase tracking-widest text-primary">Syncing Fleet Nodes...</div>
        </div>
    );
  }

  if (shippers.length === 0) {
    return (
        <div className="flex flex-col items-center justify-center p-16 text-center">
            <div className="h-20 w-20 rounded-3xl bg-green-50 dark:bg-primary/20 flex items-center justify-center mb-6">
                <UserIcon className="h-10 w-10 text-primary/50" />
            </div>
            <h3 className="text-xl font-black text-gray-900 dark:text-white uppercase italic">Zero Agents Online</h3>
            <p className="text-gray-500 font-medium mt-2 max-w-[240px]">No shipper agents are currently registered in the fleet database.</p>
        </div>
    );
  }

  const getCompletedCount = (shipperId: string) => {
    return orders.filter(
      (o) => o.assignedShipperId === shipperId && o.status === "COMPLETED"
    ).length;
  };

  return (
    <div className="overflow-x-auto custom-scrollbar">
      <table className="min-w-full border-separate border-spacing-y-1.5 px-8">
        <thead>
          <tr>
            <th className="px-5 py-4 text-left text-[10px] font-bold uppercase tracking-wider text-gray-400">Agent Entity</th>
            <th className="px-5 py-4 text-left text-[10px] font-bold uppercase tracking-wider text-gray-400">Mission Status</th>
            <th className="px-5 py-4 text-left text-[10px] font-bold uppercase tracking-wider text-gray-400">Efficiency Index</th>
            <th className="px-5 py-4 text-left text-[10px] font-bold uppercase tracking-wider text-gray-400">Equity & Bonus</th>
            <th className="px-5 py-4 text-left text-[10px] font-bold uppercase tracking-wider text-gray-400 pr-10">Active Node</th>
          </tr>
        </thead>
        <motion.tbody
          variants={container}
          initial="hidden"
          animate="show"
        >
          {shippers.map((shipper) => {
            const completedCount = getCompletedCount(shipper.uid);
            const performance = Math.min(completedCount * 10, 100);
            
            return (
              <motion.tr 
                key={shipper.uid} 
                variants={item}
                onClick={() => router.push(`/shippers/${shipper.uid}`)}
                className="group cursor-pointer transition-all duration-200"
              >
                <td className="whitespace-nowrap px-5 py-4 first:rounded-l-xl bg-white dark:bg-black border-y border-l border-gray-100 dark:border-white/10 transition-all group-hover:bg-gray-50 dark:group-hover:bg-white/5">
                  <div className="flex items-center gap-3">
                    <div className="h-9 w-9 bg-gray-100 dark:bg-white/5 rounded-lg flex items-center justify-center text-gray-600 dark:text-gray-400 font-bold text-xs uppercase">
                        {shipper.name.charAt(0)}
                    </div>
                    <div className="flex flex-col">
                        <span className="text-sm font-semibold text-gray-900 dark:text-white">{shipper.name}</span>
                        <span className="text-[10px] text-gray-400 font-medium uppercase tracking-tight">ID: {shipper.uid.slice(0, 8)}</span>
                    </div>
                  </div>
                </td>

                <td className="whitespace-nowrap px-5 py-4 bg-white dark:bg-black border-y border-gray-100 dark:border-white/10 transition-all group-hover:bg-gray-50 dark:group-hover:bg-white/5">
                  <span
                    className={clsx(
                      "inline-flex items-center rounded-lg px-2.5 py-1 text-[9px] font-bold uppercase tracking-wider border",
                      {
                        "bg-emerald-50 text-emerald-600 border-emerald-100 dark:bg-emerald-950/20 dark:border-emerald-900/30": shipper.status === "free",
                        "bg-rose-50 text-rose-600 border-rose-100 dark:bg-rose-950/20 dark:border-rose-900/30": shipper.status === "busy",
                      }
                    )}
                  >
                    <span className={clsx("h-1 w-1 rounded-full mr-1.5", shipper.status === 'free' ? 'bg-emerald-500' : 'bg-rose-500')}></span>
                    {shipper.status?.toUpperCase() || "OFFLINE"}
                  </span>
                </td>

                <td className="whitespace-nowrap px-5 py-4 bg-white dark:bg-black border-y border-gray-100 dark:border-white/10 transition-all group-hover:bg-gray-50 dark:group-hover:bg-white/5">
                  <div className="flex flex-col gap-1.5 w-28">
                       <div className="flex items-center justify-between">
                            <span className="text-[9px] font-bold text-gray-400 uppercase tracking-tight flex items-center gap-1">
                                <TrendingUp className="h-2.5 w-2.5" /> Output
                            </span>
                            <span className="text-[10px] font-bold text-gray-600 dark:text-gray-400">{completedCount}</span>
                       </div>
                       <div className="h-1 w-full bg-gray-100 dark:bg-white/5 rounded-full overflow-hidden">
                           <motion.div 
                                initial={{ width: 0 }}
                                animate={{ width: `${performance}%` }}
                                transition={{ duration: 0.8, delay: 0.2 }}
                                className="h-full bg-primary rounded-full" 
                           />
                       </div>
                  </div>
                </td>

                <td className="whitespace-nowrap px-5 py-4 bg-white dark:bg-black border-y border-gray-100 dark:border-white/10 transition-all group-hover:bg-gray-50 dark:group-hover:bg-white/5 font-bold text-emerald-600 dark:text-emerald-500 tabular-nums text-xs">
                  <div className="flex items-center gap-1.5">
                       <Award className="h-3.5 w-3.5 text-amber-500/80" />
                       {shipper.bonus ? `VND ${shipper.bonus.toLocaleString()}` : "0"}
                  </div>
                </td>

                <td className="whitespace-nowrap px-5 py-4 last:rounded-r-xl bg-white dark:bg-black border-y border-r border-gray-100 dark:border-white/10 transition-all group-hover:bg-gray-50 dark:group-hover:bg-white/5 pr-10">
                  {shipper.currentOrder ? (
                      <div className="flex items-center gap-1.5">
                        <Clock className="h-3 w-3 text-primary/70" />
                        <span className="text-[9px] font-bold text-primary dark:text-primary uppercase tracking-tight">
                            #{shipper.currentOrder.slice(0,8)}
                        </span>
                      </div>
                  ) : (
                    <span className="text-[10px] font-bold text-gray-300 uppercase tracking-tight">Standby</span>
                  )}
                </td>
              </motion.tr>
            );
          })}
        </motion.tbody>
      </table>
    </div>
  );
}

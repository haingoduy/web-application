"use client";

import { User } from "@/types";
import { motion } from "framer-motion";
import { Star, TrendingUp, Search } from "lucide-react";
import clsx from "clsx";

interface FleetPerformanceProps {
  shippers: User[];
  loading: boolean;
}

export default function FleetPerformance({ shippers, loading }: FleetPerformanceProps) {
  // Sort shippers by status (busy first)
  const processedShippers = [...shippers]
    .sort((a, b) => {
        const aBusy = a.status === 'busy' || a.currentOrder;
        const bBusy = b.status === 'busy' || b.currentOrder;
        return (aBusy ? -1 : 1);
    })
    .slice(0, 5);

  return (
    <div className="minimal-card p-6 h-full flex flex-col">
      <div className="flex items-center justify-between mb-6">
        <h3 className="text-xs font-bold text-gray-900 dark:text-white uppercase tracking-wider flex items-center gap-2">
            <TrendingUp className="h-3.5 w-3.5 text-primary" />
            Fleet Performance
        </h3>
        <button className="text-[10px] font-bold text-primary hover:text-primary-dark transition-colors uppercase tracking-tight">View Full Fleet</button>
      </div>

      {loading ? (
        <div className="flex-1 flex items-center justify-center py-12">
            <div className="h-8 w-8 rounded-full border-2 border-green-50 border-t-primary animate-spin" />
        </div>
      ) : (
        <div className="space-y-4 flex-1">
          {processedShippers.map((shipper, idx) => {
            const isOnMission = shipper.status === 'busy' || shipper.currentOrder;
            
            return (
              <motion.div
                key={shipper.uid}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: idx * 0.05 }}
                className="group flex items-center justify-between p-3 rounded-xl hover:bg-gray-50 dark:hover:bg-gray-800/40 transition-all border border-transparent hover:border-gray-100 dark:hover:border-white/5"
              >
                <div className="flex items-center gap-3">
                  <div className="relative">
                      <div className="h-9 w-9 rounded-lg bg-gray-100 dark:bg-gray-800 flex items-center justify-center font-bold text-gray-400 text-xs overflow-hidden shadow-sm border border-gray-100/50 dark:border-white/5">
                          {shipper.name?.charAt(0) || 'A'}
                      </div>
                      <span className={clsx(
                          "absolute -bottom-0.5 -right-0.5 h-2.5 w-2.5 rounded-full border-2 border-white dark:border-gray-900",
                          isOnMission ? "bg-primary" : "bg-emerald-500"
                      )} />
                  </div>
                  <div>
                      <p className="text-[11px] font-bold text-gray-900 dark:text-white leading-none mb-1 group-hover:text-primary transition-colors">
                          {shipper.name || 'Anonymous Agent'}
                      </p>
                      <div className="flex items-center gap-2">
                           <span className="text-[9px] font-bold text-gray-400 uppercase tracking-tight">T-{shipper.type || '1'}</span>
                           <div className="flex items-center gap-0.5">
                              {[1, 2, 3, 4].map(i => (
                                  <Star key={i} className="h-1.5 w-1.5 text-amber-400 fill-amber-400" />
                              ))}
                              <Star className="h-1.5 w-1.5 text-gray-200 dark:text-gray-700 fill-gray-200 dark:fill-gray-700" />
                           </div>
                      </div>
                  </div>
                </div>
                
                <div className="text-right">
                  <div className="flex items-center justify-end gap-1 text-[11px] font-bold text-gray-900 dark:text-white tabular-nums">
                      {isOnMission ? '92' : '88'}<span className="text-[9px] font-medium text-gray-400">%</span>
                  </div>
                  <p className="text-[9px] font-semibold text-gray-400 uppercase tracking-tight">Efficiency</p>
                </div>
              </motion.div>
            );
          })}
        </div>
      )}

      {!loading && processedShippers.length === 0 && (
        <div className="flex-1 flex flex-col items-center justify-center text-center p-4 opacity-40">
            <Search className="h-8 w-8 text-gray-300 mb-2" />
            <p className="text-[10px] font-bold uppercase tracking-widest text-gray-400">Fleet unit not found</p>
        </div>
      )}
    </div>
  );
}

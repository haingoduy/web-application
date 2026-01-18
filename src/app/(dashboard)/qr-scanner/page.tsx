"use client";

import { useQRScanners } from "@/hooks/useQRScanners";
import { QrCode, Signal, WifiOff, MapPin, Activity, Zap } from "lucide-react";
import clsx from "clsx";
import { motion } from "framer-motion";

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

export default function QRScannerPage() {
  const { scanners, loading } = useQRScanners();

  if (loading) {
    return (
        <div className="p-12 text-center text-gray-500 animate-pulse">
            <div className="text-sm font-black uppercase tracking-widest text-primary">Syncing Scanner Nodes...</div>
        </div>
    );
  }

  return (
    <motion.div 
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="space-y-10 pb-12"
    >
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
        <div className="flex items-center gap-4">
            <div className="h-12 w-12 bg-primary rounded-xl flex items-center justify-center text-white shadow-sm shrink-0">
                <QrCode className="h-6 w-6" />
            </div>
            <div>
                <h1 className="text-3xl font-bold text-gray-900 dark:text-white tracking-tight">
                    QR <span className="text-primary font-medium">Monitoring</span>
                </h1>
                <p className="text-[11px] text-gray-400 font-medium uppercase tracking-wider mt-1">
                    Hub Status: <span className="text-primary font-bold">Operational</span>
                </p>
            </div>
        </div>

        <div className="minimal-card px-5 py-3 flex items-center gap-6">
            <div className="flex flex-col">
                <span className="text-[9px] font-bold text-gray-400 uppercase tracking-wider">Active</span>
                <span className="text-lg font-bold text-emerald-500 tabular-nums">
                    {scanners.filter(s => s.status === 'active').length}
                </span>
            </div>
            <div className="h-6 w-px bg-gray-100 dark:bg-white/10"></div>
            <div className="flex flex-col">
                <span className="text-[9px] font-bold text-gray-400 uppercase tracking-wider">Latency</span>
                <span className="text-lg font-bold text-gray-900 dark:text-white tabular-nums">4ms</span>
            </div>
        </div>
      </div>

      {scanners.length === 0 ? (
        <div className="flex flex-col items-center justify-center p-20 text-center minimal-card">
           <div className="h-16 w-16 rounded-2xl bg-gray-50 dark:bg-gray-800 flex items-center justify-center mb-6">
                <QrCode className="h-8 w-8 text-gray-300" />
            </div>
           <h3 className="text-lg font-bold text-gray-900 dark:text-white uppercase tracking-tight">System Idle</h3>
           <p className="text-gray-400 text-sm font-medium mt-2 max-w-[280px]">Scanning hardware is not yet initialized in the logistics field.</p>
        </div>
      ) : (
        <motion.div 
            variants={container}
            initial="hidden"
            animate="show"
            className="grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-3"
        >
          {scanners.map((scanner) => (
            <motion.div
              key={scanner.id}
              variants={item}
              className="minimal-card overflow-hidden group shadow-lg hover:shadow-2xl border-none"
            >
              <div className="p-6">
                <div className="flex items-start justify-between">
                  <div className="flex items-center gap-3">
                    <div className={clsx(
                        "h-12 w-12 rounded-xl flex items-center justify-center transition-all shadow-sm border border-gray-100 dark:border-white/5 group-hover:scale-110",
                        scanner.status === 'active' ? "bg-primary text-white" : "bg-gray-100 dark:bg-gray-800 text-gray-400"
                    )}>
                       <QrCode className="h-6 w-6" />
                    </div>
                    <div>
                        <h3 className="text-base font-bold text-gray-900 dark:text-white tracking-tight">Hub {scanner.id.slice(0, 8).toUpperCase()}</h3>
                        <div className="flex items-center gap-1.5 mt-0.5">
                            <MapPin className="h-3 w-3 text-primary" />
                            <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest">{scanner.zone || "HQ"}</p>
                        </div>
                    </div>
                  </div>
                  <div className="flex flex-col items-end">
                       {scanner.status === 'active' ? (
                           <div className="flex items-center gap-1.5 bg-green-50 dark:bg-primary/20 px-3 py-1 rounded-full border border-green-100 dark:border-primary/30 shadow-sm">
                               <span className="h-1.5 w-1.5 rounded-full bg-primary animate-pulse"></span>
                               <span className="text-[10px] font-black text-primary uppercase tracking-widest">Live</span>
                           </div>
                       ) : (
                           <div className="flex items-center gap-1.5 bg-gray-50 dark:bg-gray-800/40 px-3 py-1 rounded-full border border-gray-100 dark:border-white/5 shadow-sm">
                               <span className="h-1.5 w-1.5 rounded-full bg-gray-400"></span>
                               <span className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Down</span>
                           </div>
                       )}
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4 mt-8">
                    <div className="bg-gray-50 dark:bg-white/[0.02] p-4 rounded-xl flex flex-col gap-1 border border-gray-100/50 dark:border-white/5 shadow-inner">
                        <span className="text-[8px] font-black uppercase tracking-widest text-gray-400">Flow Rate</span>
                        <span className="text-xl font-black text-gray-900 dark:text-white tabular-nums">482 <span className="text-[10px] text-gray-400 font-bold">/HR</span></span>
                    </div>
                    <div className="bg-gray-50 dark:bg-white/[0.02] p-4 rounded-xl flex flex-col gap-1 border border-gray-100/50 dark:border-white/5 shadow-inner">
                        <span className="text-[8px] font-black uppercase tracking-widest text-gray-400">Uptime</span>
                        <span className="text-xl font-black text-gray-900 dark:text-white tabular-nums">99.8 <span className="text-[10px] text-gray-400 font-bold">%</span></span>
                    </div>
                </div>
              </div>
              
              <div className={clsx(
                  "px-6 py-3 text-[10px] font-black uppercase tracking-widest border-t border-gray-100 dark:border-white/5 transition-colors",
                  scanner.status === 'active' ? "bg-green-50/20 text-primary dark:text-primary" : "bg-gray-50/50 text-gray-400"
              )}>
                 <span className="opacity-60">Cluster Identity:</span> ALPHA-0{scanner.id.slice(-1)}
              </div>
            </motion.div>
          ))}
        </motion.div>
      )}
    </motion.div>
  );
}

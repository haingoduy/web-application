"use client";

import { useAuth } from "@/context/AuthContext";
import { motion, Variants } from "framer-motion";
import { User, Shield, Moon, Sun, Monitor, Palette, UserCircle, History as HistoryIcon, Settings } from "lucide-react";
import clsx from "clsx";

const container: Variants = {
  hidden: { opacity: 0 },
  show: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1
    }
  }
};

const item: Variants = {
  hidden: { opacity: 0, y: 10 },
  show: { opacity: 1, y: 0, transition: { duration: 0.3, ease: [0.4, 0, 0.2, 1] } }
};

export default function SettingsPage() {
  const { user } = useAuth();

  return (
    <motion.div 
      variants={container}
      initial="hidden"
      animate="show"
      className="space-y-8 pb-12"
    >
      <motion.div variants={item} className="flex items-center gap-4">
        <div className="h-12 w-12 bg-primary rounded-xl flex items-center justify-center text-white shadow-sm shrink-0">
          <Settings className="h-6 w-6" />
        </div>
        <div>
          <h1 className="text-3xl font-bold text-gray-900 tracking-tight">
            System <span className="text-gray-400 font-medium">Settings</span>
          </h1>
          <p className="text-[11px] text-gray-400 font-medium uppercase tracking-wider mt-1">
            Cluster: <span className="text-emerald-500 font-bold">Production Node A</span>
          </p>
        </div>
      </motion.div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Account Info Section */}
        <motion.div variants={item} className="minimal-card p-8 space-y-8 shadow-lg">
            <div className="flex items-center gap-2 text-xs font-bold text-gray-400 uppercase tracking-widest border-b border-gray-100 dark:border-white/5 pb-4">
                <UserCircle className="h-4 w-4" />
                Account Intelligence
            </div>
            
            <div className="flex items-start gap-6">
                <div className="h-20 w-20 rounded-2xl bg-gray-50 dark:bg-white/5 flex items-center justify-center border border-gray-100 dark:border-white/10 shrink-0 shadow-sm">
                    <span className="text-2xl font-black text-gray-900 dark:text-white">
                        {user?.name?.charAt(0) || "A"}
                    </span>
                </div>
                <div className="space-y-4 flex-1">
                    <div>
                        <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-1">Identity</p>
                        <p className="text-lg font-bold text-gray-900 dark:text-white">{user?.name || "Anonymous User"}</p>
                    </div>
                    <div>
                        <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-1">Authorization</p>
                        <div className="flex items-center gap-2">
                             <span className="px-2 py-0.5 bg-green-50 dark:bg-primary/20 text-primary text-[9px] font-black uppercase tracking-tighter rounded border border-green-100 dark:border-primary/30">
                                {user?.role || "Standard"}
                             </span>
                             <span className="text-[10px] font-medium text-gray-400">#UID-{user?.uid?.slice(-6).toUpperCase()}</span>
                        </div>
                    </div>
                </div>
            </div>

            <div className="p-4 bg-gray-50 dark:bg-white/[0.02] rounded-xl border border-gray-100 dark:border-white/5 flex items-center justify-between hover:bg-gray-100 dark:hover:bg-white/5 transition-all cursor-pointer group shadow-sm hover:shadow-md">
                <div className="flex items-center gap-3">
                    <Shield className="h-5 w-5 text-gray-400 group-hover:text-primary transition-colors" />
                    <div>
                        <p className="text-xs font-bold text-gray-900 dark:text-white leading-none mb-1">Security Protocol</p>
                        <p className="text-[10px] text-gray-500">Multifactor active</p>
                    </div>
                </div>
                <button className="text-[10px] font-black text-primary uppercase tracking-widest hover:underline decoration-2 underline-offset-4">Configure</button>
            </div>
        </motion.div>

        {/* System Info Section */}
        <motion.div variants={item} className="minimal-card p-8 space-y-8 shadow-lg">
            <div className="flex items-center gap-2 text-xs font-bold text-gray-400 uppercase tracking-widest border-b border-gray-100 dark:border-white/5 pb-4">
                <Monitor className="h-4 w-4" />
                Performance Matrix
            </div>

            <div className="space-y-6">
                <div className="grid grid-cols-2 gap-4">
                    <div className="p-4 bg-gray-50 dark:bg-white/[0.02] rounded-xl border border-gray-100 dark:border-white/5 shadow-sm">
                        <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-2">Latency</p>
                        <div className="flex items-baseline gap-1">
                            <span className="text-xl font-bold text-gray-900 dark:text-white">14</span>
                            <span className="text-[10px] font-bold text-emerald-500">MS</span>
                        </div>
                    </div>
                    <div className="p-4 bg-gray-50 dark:bg-white/[0.02] rounded-xl border border-gray-100 dark:border-white/5 shadow-sm">
                        <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-2">Uptime</p>
                        <div className="flex items-baseline gap-1">
                            <span className="text-xl font-bold text-gray-900 dark:text-white">99.9</span>
                            <span className="text-[10px] font-bold text-emerald-500">%</span>
                        </div>
                    </div>
                </div>

                <div className="space-y-3">
                    <div className="flex justify-between items-center text-[10px] font-bold uppercase tracking-widest">
                        <span className="text-gray-400">Cache Utilization</span>
                        <span className="text-gray-900 dark:text-white">42%</span>
                    </div>
                    <div className="w-full bg-gray-100 dark:bg-gray-800 h-1.5 rounded-full overflow-hidden shadow-inner">
                        <motion.div 
                            initial={{ width: 0 }}
                            animate={{ width: "42%" }}
                            transition={{ duration: 1, ease: "easeOut" }}
                            className="bg-primary h-full rounded-full shadow-[0_0_8px_rgba(76,175,80,0.3)]" 
                        />
                    </div>
                </div>

                <div className="flex items-center justify-between p-4 bg-gray-50 dark:bg-white/[0.02] rounded-xl border border-gray-100 dark:border-white/5 group hover:bg-gray-100 dark:hover:bg-white/5 transition-all cursor-default shadow-sm hover:shadow-md">
                    <div className="flex items-center gap-3">
                        <HistoryIcon className="h-5 w-5 text-gray-400 group-hover:text-primary transition-colors" />
                        <span className="text-xs font-bold text-gray-900 dark:text-white uppercase tracking-widest">Event Audit Logs</span>
                    </div>
                    <span className="text-[9px] font-black text-gray-400 group-hover:text-primary transition-colors uppercase">View Detail</span>
                </div>
            </div>
        </motion.div>
      </div>
    </motion.div>
  );
}

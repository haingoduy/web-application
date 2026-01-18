"use client";

import DashboardCharts from "@/components/dashboard/DashboardCharts";
import StatsCards from "@/components/dashboard/StatsCards";
import { useDashboardData } from "@/hooks/useDashboardData";
import GlobalSearch from "@/components/search/GlobalSearch";
import ActivityFeed from "@/components/dashboard/ActivityFeed";
import FleetPerformance from "@/components/dashboard/FleetPerformance";
import WarehouseStatus from "@/components/dashboard/WarehouseStatus";
import QuickActions from "@/components/dashboard/QuickActions";
import { useShippers } from "@/hooks/useShippers";
import { Loader2 } from "lucide-react";
import { motion, Variants } from "framer-motion";

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

export default function DashboardPage() {
  const { stats, loading: statsLoading } = useDashboardData();
  const { shippers, loading: shippersLoading } = useShippers();

  const loading = statsLoading || shippersLoading;

  if (loading) {
    return (
      <div className="flex h-96 w-full items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-black" />
      </div>
    );
  }

  return (
    <motion.div 
      variants={container}
      initial="hidden"
      animate="show"
      className="space-y-6 pb-12"
    >
      <motion.div variants={item} className="flex flex-col md:flex-row md:items-end justify-between gap-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white tracking-tight">
            Dashboard <span className="text-primary font-medium">Overview</span>
          </h1>
          <p className="text-sm text-gray-500 mt-1 font-medium italic">Operational Intelligence: <span className="text-primary font-bold">ACTIVE-NODE-01</span></p>
        </div>
        <div className="flex flex-col sm:flex-row items-center gap-4">
          <GlobalSearch variant="dashboard" />
          <div className="flex items-center gap-2 bg-white dark:bg-black px-4 py-2 text-[10px] font-bold text-gray-400 uppercase tracking-wider rounded-xl shadow-md border border-gray-100 dark:border-white/5 h-11 shrink-0">
              <span className="h-1.5 w-1.5 rounded-full bg-primary animate-pulse" />
              Synced: <span className="text-gray-900 dark:text-gray-100 tabular-nums">{new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</span>
          </div>
        </div>
      </motion.div>

      <motion.div variants={item}>
        <StatsCards stats={stats} />
      </motion.div>
      
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        {/* Main Content Area - Left Column */}
        <div className="lg:col-span-8 space-y-6">
            <motion.div variants={item}>
                <DashboardCharts stats={stats} />
            </motion.div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <motion.div variants={item}>
                    <ActivityFeed orders={stats.recentOrders} />
                </motion.div>
                <motion.div variants={item}>
                    <FleetPerformance shippers={shippers} loading={loading} />
                </motion.div>
            </div>
        </div>

        {/* Sidebar Area - Right Column */}
        <div className="lg:col-span-4 space-y-6">
            <motion.div variants={item}>
                <WarehouseStatus data={stats.ordersByWarehouse} />
            </motion.div>
            <motion.div variants={item}>
                <QuickActions />
            </motion.div>
            
            {/* System Health Card */}
            <motion.div variants={item} className="minimal-card p-6 flex flex-col gap-4">
                 <div className="flex items-center justify-between">
                    <h3 className="text-[10px] font-bold text-gray-400 uppercase tracking-widest flex items-center gap-2">
                        <span className="h-1 w-1 rounded-full bg-primary" />
                        Network Integrity
                    </h3>
                    <div className="h-2 w-2 rounded-full bg-emerald-500 animate-pulse" />
                 </div>
                 <div className="flex items-end gap-3">
                    <span className="text-3xl font-black text-gray-900 dark:text-white tabular-nums tracking-tighter">99.98%</span>
                    <span className="text-[10px] font-black text-primary uppercase mb-1.5 tracking-widest">OPTIMAL</span>
                 </div>
                 <div className="space-y-3">
                    <div className="w-full bg-gray-100 dark:bg-gray-800 h-1.5 rounded-full overflow-hidden shadow-inner">
                        <motion.div 
                            initial={{ width: 0 }}
                            animate={{ width: '99.98%' }}
                            transition={{ duration: 1.5, ease: "easeOut" }}
                            className="bg-primary h-full shadow-[0_0_8px_rgba(76,175,80,0.4)]" 
                        />
                    </div>
                    <p className="text-[10px] text-gray-500 dark:text-gray-400 font-medium leading-relaxed italic">Global logistics backbone operating within target latency parameters.</p>
                 </div>
            </motion.div>
        </div>
      </div>
    </motion.div>
  );
}

"use client";

import { useSearchParams } from "next/navigation";
import { useDashboardData } from "@/hooks/useDashboardData";
import { useShippers } from "@/hooks/useShippers";
import { useMemo } from "react";
import { motion } from "framer-motion";
import { Search, Package, Users, ArrowLeft, Clock, MapPin } from "lucide-react";
import Link from "next/link";
import clsx from "clsx";

export default function SearchPage() {
  const searchParams = useSearchParams();
  const query = searchParams.get("q") || "";
  const { stats, loading: statsLoading } = useDashboardData();
  const { shippers, loading: shippersLoading } = useShippers();
  
  const loading = statsLoading || shippersLoading;

  const results = useMemo(() => {
    if (!query.trim()) return { orders: [], shippers: [] };
    const q = query.toLowerCase();

    const filteredOrders = stats.allOrders.filter(order => 
      order.productName.toLowerCase().includes(q) ||
      order.orderId.toLowerCase().includes(q) ||
      order.customerName?.toLowerCase().includes(q) ||
      order.fromWarehouse.toLowerCase().includes(q)
    );

    const filteredShippers = shippers.filter(shipper => 
      shipper.name?.toLowerCase().includes(q) ||
      shipper.uid.toLowerCase().includes(q)
    );

    return { orders: filteredOrders, shippers: filteredShippers };
  }, [query, stats.recentOrders, shippers]);

  const totalResults = results.orders.length + results.shippers.length;

  if (loading) {
    return (
      <div className="flex h-[60vh] items-center justify-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary" />
      </div>
    );
  }

  return (
    <div className="max-w-5xl mx-auto space-y-8 pb-20 mt-4">
      <div className="flex items-center justify-between">
        <div>
           <Link href="/" className="inline-flex items-center gap-2 text-xs font-bold text-gray-400 hover:text-primary transition-colors uppercase tracking-widest mb-4 group">
              <ArrowLeft className="h-4 w-4 transition-transform group-hover:-translate-x-1" />
              Back to Dashboard
           </Link>
           <h1 className="text-3xl font-black text-gray-900 dark:text-white tracking-tight">
             Search <span className="text-primary">Results</span>
           </h1>
           <p className="text-sm text-gray-500 mt-1 font-medium italic">
             Found <span className="text-primary font-bold">{totalResults}</span> matches for <span className="text-gray-900 dark:text-white font-bold not-italic">&quot;{query}&quot;</span>
           </p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        {/* Orders Column */}
        <section className="space-y-4">
          <div className="flex items-center gap-2 mb-6">
            <Package className="h-5 w-5 text-primary" />
            <h2 className="text-lg font-bold text-gray-900 dark:text-white">Deployment Units <span className="text-gray-400 text-sm font-medium ml-2">({results.orders.length})</span></h2>
          </div>
          
          <div className="space-y-4">
            {results.orders.length > 0 ? (
              results.orders.map((order, idx) => (
                <motion.div
                  key={order.orderId}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: idx * 0.05 }}
                  className="minimal-card p-5 group hover:border-primary/30 transition-all cursor-pointer relative overflow-hidden"
                >
                  <div className="flex justify-between items-start mb-3">
                    <div>
                      <p className="text-sm font-black text-gray-900 dark:text-white group-hover:text-primary transition-colors">
                        {order.productName}
                      </p>
                      <p className="text-[10px] font-mono font-bold text-gray-400 uppercase tracking-tighter">
                        ID: {order.orderId.toUpperCase()}
                      </p>
                    </div>
                    <span className={clsx(
                      "text-[9px] font-black px-2 py-0.5 rounded-full uppercase tracking-widest border",
                      order.status === 'COMPLETED' ? "bg-emerald-50 text-emerald-600 border-emerald-100" : 
                      order.status === 'PROCESSING' ? "bg-blue-50 text-blue-600 border-blue-100" :
                      "bg-amber-50 text-amber-600 border-amber-100"
                    )}>
                      {order.status}
                    </span>
                  </div>
                  
                  <div className="flex items-center gap-4 mt-4 pt-4 border-t border-gray-50 dark:border-white/5">
                    <div className="flex items-center gap-1.5">
                       <MapPin className="h-3 w-3 text-gray-400" />
                       <span className="text-[10px] font-bold text-gray-500 uppercase">{order.fromWarehouse}</span>
                    </div>
                    <div className="flex items-center gap-1.5">
                       <Clock className="h-3 w-3 text-gray-400" />
                       <span className="text-[10px] font-bold text-gray-500 tabular-nums">
                         {order.timestamp?.seconds ? new Date(order.timestamp.seconds * 1000).toLocaleDateString() : 'Recent'}
                       </span>
                    </div>
                  </div>

                  <Link href={`/orders/${order.orderId}`} className="absolute inset-0 z-10" />
                </motion.div>
              ))
            ) : (
              <div className="flex flex-col items-center justify-center p-12 bg-gray-50/50 dark:bg-zinc-900/50 rounded-3xl border border-dashed border-gray-200 dark:border-white/5">
                <Package className="h-10 w-10 text-gray-200 mb-2" />
                <p className="text-xs font-bold text-gray-400 uppercase tracking-widest">No matching units</p>
              </div>
            )}
          </div>
        </section>

        {/* Shippers Column */}
        <section className="space-y-4">
          <div className="flex items-center gap-2 mb-6">
            <Users className="h-5 w-5 text-primary" />
            <h2 className="text-lg font-bold text-gray-900 dark:text-white">Active Agents <span className="text-gray-400 text-sm font-medium ml-2">({results.shippers.length})</span></h2>
          </div>

          <div className="space-y-4">
            {results.shippers.length > 0 ? (
              results.shippers.map((shipper, idx) => (
                <motion.div
                  key={shipper.uid}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: idx * 0.05 }}
                  className="minimal-card p-5 group hover:border-primary/30 transition-all cursor-pointer relative overflow-hidden"
                >
                  <div className="flex items-center gap-4">
                    <div className="h-12 w-12 rounded-2xl bg-gray-100 dark:bg-zinc-800 flex items-center justify-center text-lg font-black text-gray-400 group-hover:bg-primary/10 group-hover:text-primary transition-all">
                      {shipper.name?.charAt(0) || 'A'}
                    </div>
                    <div className="flex-1">
                      <div className="flex justify-between items-center mb-1">
                        <p className="text-sm font-black text-gray-900 dark:text-white group-hover:text-primary transition-colors">
                          {shipper.name || 'Anonymous Agent'}
                        </p>
                        <span className={clsx(
                          "h-2 w-2 rounded-full",
                          (shipper.status === 'busy' || shipper.currentOrder) ? "bg-primary" : "bg-emerald-500"
                        )} />
                      </div>
                      <div className="flex items-center gap-3">
                         <span className="text-[10px] font-black text-gray-400 uppercase tracking-widest">TYPE: T-{shipper.type || '1'}</span>
                         <span className="text-[10px] font-black text-primary uppercase tracking-widest">Status: {(shipper.status === 'busy' || shipper.currentOrder) ? 'On Mission' : 'Standby'}</span>
                      </div>
                    </div>
                  </div>
                  <Link href={`/shippers/${shipper.uid}`} className="absolute inset-0 z-10" />
                </motion.div>
              ))
            ) : (
              <div className="flex flex-col items-center justify-center p-12 bg-gray-50/50 dark:bg-zinc-900/50 rounded-3xl border border-dashed border-gray-200 dark:border-white/5">
                <Users className="h-10 w-10 text-gray-200 mb-2" />
                <p className="text-xs font-bold text-gray-400 uppercase tracking-widest">No matching agents</p>
              </div>
            )}
          </div>
        </section>
      </div>

      {totalResults === 0 && (
         <div className="flex flex-col items-center justify-center py-20 text-center">
            <div className="h-20 w-20 bg-gray-50 dark:bg-zinc-900 rounded-full flex items-center justify-center mb-6 border border-gray-100 dark:border-white/5">
               <Search className="h-10 w-10 text-gray-200" />
            </div>
            <h2 className="text-2xl font-black text-gray-900 dark:text-white mb-2 tracking-tight">Zero Alignment Found</h2>
            <p className="text-sm text-gray-500 italic max-w-xs mx-auto">The system could not locate any active nodes or units matching your unique signature.</p>
         </div>
      )}
    </div>
  );
}

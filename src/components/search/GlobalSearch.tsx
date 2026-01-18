"use client";

import { useState, useMemo, useRef, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Search, X, Package, ArrowRight, Loader2 } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { useDashboardData } from "@/hooks/useDashboardData";
import { useShippers } from "@/hooks/useShippers";
import clsx from "clsx";

interface GlobalSearchProps {
  variant?: "dashboard" | "sidebar";
  placeholder?: string;
}

export default function GlobalSearch({ variant = "dashboard", placeholder = "Search orders or fleet..." }: GlobalSearchProps) {
  const [searchQuery, setSearchQuery] = useState("");
  const [showRecommendations, setShowRecommendations] = useState(false);
  const router = useRouter();
  const { stats, loading: statsLoading } = useDashboardData();
  const { shippers, loading: shippersLoading } = useShippers();
  const containerRef = useRef<HTMLDivElement>(null);

  const loading = statsLoading || shippersLoading;

  const recommendations = useMemo(() => {
    if (!searchQuery.trim() || loading) return { orders: [], shippers: [] };
    const q = searchQuery.toLowerCase();
    
    // Search in allOrders instead of recentOrders
    return {
      orders: stats.allOrders.filter(o => 
        o.productName.toLowerCase().includes(q) || 
        o.orderId.toLowerCase().includes(q) ||
        o.customerName?.toLowerCase().includes(q)
      ).slice(0, 4),
      shippers: shippers.filter(s => 
        s.name?.toLowerCase().includes(q) || 
        s.uid.toLowerCase().includes(q)
      ).slice(0, 4)
    };
  }, [searchQuery, stats.allOrders, shippers, loading]);

  const handleSearchSubmit = (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    if (searchQuery.trim()) {
      setShowRecommendations(false);
      router.push(`/search?q=${encodeURIComponent(searchQuery.trim())}`);
    }
  };

  // Close recommendations when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(event.target as Node)) {
        setShowRecommendations(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const isSidebar = variant === "sidebar";

  return (
    <div ref={containerRef} className={clsx("relative group w-full", !isSidebar && "sm:w-80")}>
      <form onSubmit={handleSearchSubmit}>
        <div className="relative">
          <Search className={clsx(
            "absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 transition-colors",
            isSidebar ? "text-gray-400 group-focus-within:text-primary" : "text-gray-400 group-focus-within:text-primary"
          )} />
          <input 
            type="text" 
            value={searchQuery}
            onChange={(e) => {
              setSearchQuery(e.target.value);
              setShowRecommendations(true);
            }}
            onFocus={() => setShowRecommendations(true)}
            placeholder={placeholder} 
            className={clsx(
              "w-full rounded-xl pl-10 pr-10 text-xs font-semibold focus:ring-1 transition-all placeholder:text-gray-500 focus:outline-none",
              isSidebar 
                ? "h-10 bg-gray-50 dark:bg-zinc-900 border border-gray-100 dark:border-white/5 focus:ring-primary/20" 
                : "h-11 bg-white dark:bg-black shadow-sm border border-gray-100 dark:border-white/5 focus:ring-primary/40"
            )}
          />
          
          <AnimatePresence>
            {searchQuery && (
              <motion.button 
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.8 }}
                type="button"
                onClick={() => {
                  setSearchQuery("");
                  setShowRecommendations(false);
                }}
                className="absolute right-3 top-1/2 -translate-y-1/2 p-1 hover:bg-gray-100 dark:hover:bg-white/10 rounded-lg transition-all"
              >
                <X className="h-3.5 w-3.5 text-gray-400" />
              </motion.button>
            )}
          </AnimatePresence>
        </div>
      </form>

      {/* Recommendations Dropdown */}
      <AnimatePresence>
        {showRecommendations && searchQuery.trim() && (
          <motion.div 
            initial={{ opacity: 0, y: 10, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 10, scale: 0.95 }}
            className={clsx(
              "absolute left-0 right-0 z-[100] bg-white/95 dark:bg-zinc-900/95 backdrop-blur-xl rounded-2xl border border-gray-100 dark:border-white/5 shadow-2xl shadow-primary/10 p-2 overflow-hidden",
              isSidebar ? "top-11 -left-2 -right-2 w-[calc(100%+1rem)]" : "top-13"
            )}
          >
            {loading && (
              <div className="flex items-center justify-center py-4">
                <Loader2 className="h-4 w-4 animate-spin text-primary" />
              </div>
            )}

            {!loading && recommendations.orders.length === 0 && recommendations.shippers.length === 0 && (
               <div className="py-6 px-4 text-center">
                  <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">Zero Matches Found</p>
               </div>
            )}

            {!loading && recommendations.orders.length > 0 && (
              <div className="mb-2">
                <p className="text-[9px] font-black text-gray-400 uppercase tracking-widest px-3 py-2">Deployment Units</p>
                {recommendations.orders.map(o => (
                  <button 
                    key={o.orderId}
                    onClick={() => {
                      router.push(`/orders/${o.orderId}`);
                      setShowRecommendations(false);
                    }}
                    className="w-full flex items-center gap-3 p-2 hover:bg-primary/5 dark:hover:bg-primary/10 rounded-xl transition-all text-left group"
                  >
                    <div className="h-8 w-8 rounded-lg bg-primary/10 flex items-center justify-center text-primary shrink-0">
                       <Package className="h-4 w-4" />
                    </div>
                    <div className="min-w-0">
                       <p className="text-[11px] font-bold text-gray-900 dark:text-white group-hover:text-primary transition-colors truncate">{o.productName}</p>
                       <p className="text-[9px] font-medium text-gray-400 uppercase">ID: {o.orderId.slice(-6).toUpperCase()}</p>
                    </div>
                  </button>
                ))}
              </div>
            )}

            {!loading && recommendations.shippers.length > 0 && (
              <div className="mb-2">
                <p className="text-[9px] font-black text-gray-400 uppercase tracking-widest px-3 py-2">Active Agents</p>
                {recommendations.shippers.map(s => (
                  <button 
                    key={s.uid}
                    onClick={() => {
                      router.push(`/shippers/${s.uid}`);
                      setShowRecommendations(false);
                    }}
                    className="w-full flex items-center gap-3 p-2 hover:bg-primary/5 dark:hover:bg-primary/10 rounded-xl transition-all text-left group"
                  >
                    <div className="h-8 w-8 rounded-lg bg-gray-100 dark:bg-zinc-800 flex items-center justify-center text-gray-400 group-hover:text-primary transition-colors font-black text-[10px] shrink-0">
                       {s.name?.charAt(0) || 'A'}
                    </div>
                    <div className="min-w-0">
                       <p className="text-[11px] font-bold text-gray-900 dark:text-white group-hover:text-primary transition-colors truncate">{s.name || 'Anonymous'}</p>
                       <p className="text-[9px] font-medium text-gray-400 uppercase">T-{s.type || '1'}</p>
                    </div>
                  </button>
                ))}
              </div>
            )}

            {!loading && (recommendations.orders.length > 0 || recommendations.shippers.length > 0) && (
              <div className="border-t border-gray-50 dark:border-white/5 pt-2 mt-2">
                 <button 
                    onClick={() => handleSearchSubmit()}
                    className="w-full flex items-center justify-center gap-2 py-2 text-[10px] font-black text-primary uppercase tracking-widest hover:bg-primary/5 rounded-xl transition-all"
                 >
                    View all results <ArrowRight className="h-3 w-3" />
                 </button>
              </div>
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

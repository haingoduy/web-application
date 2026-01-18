"use client";

import { motion } from "framer-motion";
import { Box, Search, Filter, History, Package, AlertTriangle, CheckCircle2, X } from "lucide-react";
import { useState, useMemo } from "react";
import { useInventory } from "@/hooks/useInventory";
import { useOrders } from "@/hooks/useOrders";
import clsx from "clsx";
import { AnimatePresence } from "framer-motion";
import { useRouter } from "next/navigation";

export default function InventoryPage() {
  const { items, loading } = useInventory();
  const { orders } = useOrders();
  const router = useRouter();
  const [searchQuery, setSearchQuery] = useState("");
  const [activeCategory, setActiveCategory] = useState<string>("ALL");
  const [selectedWarehouse, setSelectedWarehouse] = useState<string | null>(null);

  const categories = useMemo(() => {
    const cats = new Set(items.map(item => item.category.toUpperCase()));
    return ["ALL", ...Array.from(cats)].sort();
  }, [items]);

  const filteredItems = useMemo(() => {
    return items.filter(item => {
      const matchesSearch = 
        item.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        item.sku.toLowerCase().includes(searchQuery.toLowerCase());
      
      const matchesCategory = activeCategory === "ALL" || item.category.toUpperCase() === activeCategory;
      
      return matchesSearch && matchesCategory;
    });
  }, [items, searchQuery, activeCategory]);

  return (
    <motion.div 
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="space-y-8 pb-12"
    >
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
        <div className="flex items-center gap-4">
          <div className="h-12 w-12 bg-primary rounded-xl flex items-center justify-center text-white shadow-sm shrink-0">
            <Box className="h-6 w-6" />
          </div>
          <div>
            <h1 className="text-3xl font-bold text-gray-900 dark:text-white tracking-tight flex items-center gap-3">
              <Box className="h-8 w-8 text-primary" />
              <span>Warehouse <span className="text-primary font-medium">Inventory</span></span>
            </h1>
            <p className="text-[11px] text-gray-400 font-medium uppercase tracking-wider mt-1">
              Terminal: <span className="text-primary font-bold">SKU Control Grid</span>
            </p>
          </div>
        </div>

        <div className="flex items-center gap-3 minimal-card border-none shadow-md p-1.5">
            <div className="relative group">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-gray-400 group-focus-within:text-primary transition-colors" />
                <input 
                    type="text" 
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    placeholder="Search SKU or Name..." 
                    className="h-10 w-64 bg-white dark:bg-black rounded-xl pl-9 pr-8 text-xs font-semibold focus:ring-1 focus:ring-primary/40 focus:outline-none transition-all placeholder:text-gray-500"
                />
                {searchQuery && (
                    <button 
                        onClick={() => setSearchQuery("")}
                        className="absolute right-2.5 top-1/2 -translate-y-1/2 p-0.5 hover:bg-gray-100 dark:hover:bg-white/10 rounded-md transition-all"
                    >
                        <X className="h-3 w-3 text-gray-400" />
                    </button>
                )}
            </div>
            <div className="h-10 px-3 bg-gray-50 dark:bg-white/5 border border-gray-100/50 dark:border-white/10 rounded-xl flex items-center gap-2 focus-within:border-primary/30 transition-all">
                <Filter className="h-3.5 w-3.5 text-gray-400" />
                <select 
                    value={activeCategory}
                    onChange={(e) => setActiveCategory(e.target.value)}
                    className="bg-transparent border-none text-[10px] font-black uppercase tracking-wider appearance-none focus:outline-none focus:ring-0 cursor-pointer pr-4"
                >
                    {categories.map(cat => (
                        <option key={cat} value={cat}>{cat}</option>
                    ))}
                </select>
            </div>
        </div>
      </div>

      <div className="minimal-card overflow-hidden">
        <div className="p-4 border-b border-gray-100 dark:border-white/10 bg-gray-50/50 dark:bg-black flex items-center justify-between">
            <div className="flex items-center gap-2">
                <History className="h-4 w-4 text-primary" />
                <span className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Global Stock Levels</span>
            </div>
            <span className="text-[9px] font-bold text-gray-400 tabular-nums uppercase tracking-tight">INDEXED: {filteredItems.length} SKUs</span>
        </div>
        
        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead>
              <tr className="border-b border-gray-100 dark:border-white/5 bg-gray-50/30 dark:bg-transparent">
                <th className="px-6 py-4 text-[10px] font-black text-gray-400 uppercase tracking-widest">Product</th>
                <th className="px-6 py-4 text-[10px] font-black text-gray-400 uppercase tracking-widest">Quantity</th>
                <th className="px-6 py-4 text-[10px] font-black text-gray-400 uppercase tracking-widest">Location</th>
                <th className="px-6 py-4 text-[10px] font-black text-gray-400 uppercase tracking-widest text-right">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100 dark:divide-white/5">
              {loading ? (
                <tr>
                  <td colSpan={4} className="px-6 py-20 text-center">
                    <div className="flex flex-col items-center gap-3">
                        <div className="h-8 w-8 rounded-full border-2 border-green-100 border-t-primary animate-spin" />
                        <span className="text-xs font-bold text-gray-400 uppercase tracking-tighter">Syncing SKU database...</span>
                    </div>
                  </td>
                </tr>
              ) : filteredItems.length === 0 ? (
                <tr>
                  <td colSpan={4} className="px-6 py-20 text-center">
                    <div className="flex flex-col items-center gap-3 opacity-50">
                        <Package className="h-10 w-10 text-gray-200" />
                        <span className="text-xs font-bold text-gray-400 uppercase tracking-tighter">No items found matching your filter</span>
                    </div>
                  </td>
                </tr>
              ) : (
                filteredItems.map((item, idx) => {
                  const isLowStock = item.quantity <= item.minQuantity;
                  const isOut = item.quantity === 0;

                  return (
                    <motion.tr 
                      key={item.id}
                      initial={{ opacity: 0, x: -10 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: idx * 0.02 }}
                      className="hover:bg-gray-50/50 dark:hover:bg-white/[0.02] transition-colors group cursor-pointer"
                      onClick={() => setSelectedWarehouse(item.warehouse)}
                    >
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-3">
                          <div className="h-10 w-10 rounded-xl bg-gray-50 dark:bg-black flex items-center justify-center border border-gray-100 dark:border-white/10 group-hover:scale-105 transition-transform">
                            <span className="text-xs font-black text-gray-400">{item.name.charAt(0)}</span>
                          </div>
                          <div>
                            <p className="text-xs font-bold text-gray-900 dark:text-white mb-0.5">{item.name}</p>
                            <p className="text-[9px] font-medium text-primary uppercase tracking-tighter">{item.sku}</p>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex flex-col">
                          <span className={clsx(
                            "text-sm font-black tabular-nums",
                            isOut ? "text-red-500" : isLowStock ? "text-amber-500" : "text-gray-900 dark:text-white"
                          )}>
                            {item.quantity} {item.unit}
                          </span>
                          <span className="text-[9px] font-medium text-gray-400">Min: {item.minQuantity}</span>
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex flex-col">
                          <span className="text-[10px] font-bold text-gray-700 dark:text-gray-300 uppercase tracking-tight">{item.warehouse}</span>
                          <span className="text-[9px] font-medium text-gray-400 uppercase tracking-widest">Zone: {item.zone}</span>
                        </div>
                      </td>
                      <td className="px-6 py-4 text-right">
                        {isOut ? (
                            <span className="inline-flex items-center gap-1.5 px-2 py-0.5 bg-red-50 dark:bg-red-950/40 text-red-600 dark:text-red-400 text-[9px] font-black uppercase tracking-tighter rounded border border-red-100 dark:border-red-900/50">
                                <AlertTriangle className="h-2.5 w-2.5" /> CRITICAL
                            </span>
                        ) : isLowStock ? (
                            <span className="inline-flex items-center gap-1.5 px-2 py-0.5 bg-amber-50 dark:bg-amber-950/40 text-amber-600 dark:text-amber-400 text-[9px] font-black uppercase tracking-tighter rounded border border-amber-100 dark:border-amber-900/50">
                                <AlertTriangle className="h-2.5 w-2.5" /> LOW STOCK
                            </span>
                        ) : (
                            <span className="inline-flex items-center gap-1.5 px-2 py-0.5 bg-emerald-50 dark:bg-emerald-950/40 text-emerald-600 dark:text-emerald-400 text-[9px] font-black uppercase tracking-tighter rounded border border-emerald-100 dark:border-emerald-900/50">
                                <CheckCircle2 className="h-2.5 w-2.5" /> NOMINAL
                            </span>
                        )}
                      </td>
                    </motion.tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      </div>
      <AnimatePresence>
        {selectedWarehouse && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setSelectedWarehouse(null)}
              className="absolute inset-0 bg-black/80 backdrop-blur-sm"
            />
            <motion.div
              initial={{ scale: 0.95, opacity: 0, y: 20 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              exit={{ scale: 0.95, opacity: 0, y: 20 }}
              className="relative w-full max-w-4xl max-h-[80vh] minimal-card overflow-hidden flex flex-col"
            >
              <div className="p-6 border-b border-gray-100 dark:border-white/10 flex items-center justify-between bg-white dark:bg-black">
                <div>
                  <h2 className="text-xl font-black text-gray-900 dark:text-white uppercase tracking-tight flex items-center gap-2">
                    <History className="h-5 w-5 text-primary" />
                    {selectedWarehouse} Orders
                  </h2>
                  <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mt-1">Operational Ledger Fragment</p>
                </div>
                <button
                  onClick={() => setSelectedWarehouse(null)}
                  className="p-2 hover:bg-gray-100 dark:hover:bg-white/10 rounded-xl transition-colors"
                >
                  <X className="h-5 w-5 text-gray-400" />
                </button>
              </div>

              <div className="flex-1 overflow-y-auto p-2 custom-scrollbar bg-gray-50/30 dark:bg-transparent">
                <table className="w-full text-left border-separate border-spacing-y-1 px-4">
                  <thead>
                    <tr>
                      <th className="px-4 py-3 text-[9px] font-black text-gray-400 uppercase tracking-widest">Order ID</th>
                      <th className="px-4 py-3 text-[9px] font-black text-gray-400 uppercase tracking-widest">Customer</th>
                      <th className="px-4 py-3 text-[9px] font-black text-gray-400 uppercase tracking-widest">Item</th>
                      <th className="px-4 py-3 text-[9px] font-black text-gray-400 uppercase tracking-widest">Direction</th>
                      <th className="px-4 py-3 text-right text-[9px] font-black text-gray-400 uppercase tracking-widest">Status</th>
                    </tr>
                  </thead>
                  <tbody>
                    {orders.filter(o => o.fromWarehouse === selectedWarehouse || o.toWarehouse === selectedWarehouse).length === 0 ? (
                      <tr>
                        <td colSpan={5} className="py-20 text-center">
                          <div className="flex flex-col items-center gap-3 opacity-40">
                            <Box className="h-10 w-10 text-gray-300" />
                            <span className="text-[10px] font-black text-gray-400 uppercase tracking-widest italic">No active logistics logs for this terminal</span>
                          </div>
                        </td>
                      </tr>
                    ) : (
                      orders
                        .filter(o => o.fromWarehouse === selectedWarehouse || o.toWarehouse === selectedWarehouse)
                        .map((order) => {
                          const isFrom = order.fromWarehouse === selectedWarehouse;
                          return (
                            <motion.tr
                              key={order.orderId}
                              initial={{ opacity: 0, x: -5 }}
                              animate={{ opacity: 1, x: 0 }}
                              onClick={() => router.push(`/orders/${order.orderId}`)}
                              className="group cursor-pointer"
                            >
                              <td className="px-4 py-3 first:rounded-l-lg bg-white dark:bg-black border-y border-l border-gray-100 dark:border-white/10 transition-all group-hover:bg-gray-50 dark:group-hover:bg-white/5">
                                <span className="text-[10px] font-bold text-primary tabular-nums">#{order.orderId.slice(0, 8)}</span>
                              </td>
                              <td className="px-4 py-3 bg-white dark:bg-black border-y border-gray-100 dark:border-white/10 transition-all group-hover:bg-gray-50 dark:group-hover:bg-white/5">
                                <span className="text-[11px] font-bold text-gray-900 dark:text-white uppercase">{order.customerName}</span>
                              </td>
                              <td className="px-4 py-3 bg-white dark:bg-black border-y border-gray-100 dark:border-white/10 transition-all group-hover:bg-gray-50 dark:group-hover:bg-white/5">
                                <div className="flex flex-col">
                                  <span className="text-[11px] font-medium text-gray-700 dark:text-gray-300">{order.productName}</span>
                                  <span className="text-[9px] font-bold text-gray-400 uppercase tracking-tighter">Qty: {order.quantity}</span>
                                </div>
                              </td>
                              <td className="px-4 py-3 bg-white dark:bg-black border-y border-gray-100 dark:border-white/10 transition-all group-hover:bg-gray-50 dark:group-hover:bg-white/5">
                                {isFrom ? (
                                  <span className="inline-flex items-center gap-1.5 px-2 py-0.5 bg-amber-50/50 dark:bg-amber-950/20 text-amber-600 dark:text-amber-400 text-[8px] font-black uppercase tracking-widest rounded border border-amber-100 dark:border-amber-900/30">
                                    Outgoing
                                  </span>
                                ) : (
                                  <span className="inline-flex items-center gap-1.5 px-2 py-0.5 bg-emerald-50/50 dark:bg-emerald-950/20 text-emerald-600 dark:text-emerald-400 text-[8px] font-black uppercase tracking-widest rounded border border-emerald-100 dark:border-emerald-900/30">
                                    Incoming
                                  </span>
                                )}
                              </td>
                              <td className="px-4 py-3 last:rounded-r-lg bg-white dark:bg-black border-y border-r border-gray-100 dark:border-white/10 transition-all group-hover:bg-gray-50 dark:group-hover:bg-white/5 text-right">
                                <span className={clsx(
                                  "text-[8px] font-black uppercase tracking-widest",
                                  {
                                    "text-amber-500": order.status === "PENDING",
                                    "text-blue-500": order.status === "PROCESSING",
                                    "text-emerald-500": order.status === "COMPLETED",
                                  }
                                )}>
                                  {order.status}
                                </span>
                              </td>
                            </motion.tr>
                          );
                        })
                    )}
                  </tbody>
                </table>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </motion.div>
  );
}

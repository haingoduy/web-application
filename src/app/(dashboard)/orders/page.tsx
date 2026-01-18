"use client";

import { useState } from "react";
import { useDashboardData } from "@/hooks/useDashboardData"; // Reusing for now to get orders
import OrdersTable from "@/components/orders/OrdersTable";
import { OrderStatus } from "@/types";
import { Filter, Search, X, Package } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

export default function OrdersPage() {
  const { stats, loading } = useDashboardData(); // Fetches all orders in stats.recentOrders? No, useDashboardData aggregates. I need raw orders list.
  // Wait, useDashboardData only returns stats and recentOrders (top 5). 
  // I need a hook that returns ALL orders.
  // I will refactor or likely create useOrders.
  
  // Placeholder logic until useOrders is ready.
  // I'll update useDashboardData to return allOrders or create a new hook inside this file for simplicity or properly in hooks folder.
  // I'll assume I'll create `useOrders` hook next.
  
  return (
      <OrdersPageContent />
  );
}

// Breaking out to allow implementation of useOrders logic inline or imported
// I'll write the full component assuming useOrders exists/I'll implement it momentarily.
// Actually, let's just implement the hook inside the page file for now to save a file creation cycle 
// or I'll implement `hooks/useOrders.ts` in same turn.
// I will create `hooks/useOrders.ts` in the same turn.

import { useOrders } from "@/hooks/useOrders";
import { useShippers } from "@/hooks/useShippers";

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

function OrdersPageContent() {
  const { orders, loading } = useOrders();
  const { shipperMap } = useShippers();
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState<OrderStatus | "ALL">("ALL");
  const [dateFilter, setDateFilter] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;

  // Filter logic
  const filteredOrders = orders.filter((order) => {
    const matchesSearch = 
      order.orderId.toLowerCase().includes(searchQuery.toLowerCase()) ||
      order.customerName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      order.productName.toLowerCase().includes(searchQuery.toLowerCase());
    
    const matchesStatus = statusFilter === "ALL" || order.status === statusFilter;
    const orderDate = order.timestamp?.seconds
      ? new Date(order.timestamp.seconds * 1000).toISOString().split("T")[0]
      : "";
    const matchesDate = !dateFilter || orderDate === dateFilter;
    
    return matchesSearch && matchesStatus && matchesDate;
  });

  // Pagination logic
  const totalPages = Math.ceil(filteredOrders.length / itemsPerPage);
  const paginatedOrders = filteredOrders.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  return (
    <motion.div 
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="space-y-10 pb-12"
    >
      <div className="flex flex-col gap-6 lg:flex-row lg:items-end lg:justify-between">
        <motion.div initial={{ x: -20, opacity: 0 }} animate={{ x: 0, opacity: 1 }} transition={{ duration: 0.5 }}>
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white tracking-tight flex items-center gap-3">
            <Package className="h-8 w-8 text-primary" />
            <span>Order <span className="text-primary font-medium">Management</span></span>
          </h1>
          <p className="text-[13px] text-gray-500 font-medium mt-1">Track and filter logistics transactions in real-time.</p>
        </motion.div>
        
        <motion.div 
          initial={{ x: 20, opacity: 0 }} 
          animate={{ x: 0, opacity: 1 }} 
          transition={{ duration: 0.5 }}
          className="flex flex-col gap-3 sm:flex-row sm:items-center"
        >
            {/* Search Input */}
            <div className="relative group minimal-card border-none shadow-md">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400 group-focus-within:text-primary transition-colors" />
                <input 
                    type="text" 
                    value={searchQuery}
                    onChange={(e) => {
                        setSearchQuery(e.target.value);
                        setCurrentPage(1);
                    }}
                    placeholder="Search Order ID, Customer..." 
                    className="h-11 w-full sm:w-80 bg-white dark:bg-black rounded-xl pl-10 pr-10 text-xs font-semibold focus:ring-1 focus:ring-primary/40 focus:outline-none transition-all placeholder:text-gray-500"
                />
                {searchQuery && (
                    <button 
                        onClick={() => setSearchQuery("")}
                        className="absolute right-2.5 top-1/2 -translate-y-1/2 p-1 hover:bg-gray-100 dark:hover:bg-white/10 rounded-lg transition-colors"
                    >
                        <X className="h-3 w-3 text-gray-400" />
                    </button>
                )}
            </div>

            <div className="flex items-center gap-3 minimal-card p-2 self-start sm:self-auto shadow-md">
                {/* Status Filter */}
                <div className="relative group h-11 flex items-center bg-gray-50/50 dark:bg-white/5 px-3 rounded-lg border border-gray-100 dark:border-white/10 focus-within:border-primary/30 transition-all">
                    <Filter className="h-3.5 w-3.5 text-gray-400 group-focus-within:text-primary transition-colors" />
                    <select
                        className="block w-full border-none bg-transparent py-2 pl-3 pr-8 text-[11px] font-bold uppercase tracking-tight focus:ring-0 appearance-none cursor-pointer"
                        value={statusFilter}
                        onChange={(e) => {
                            setStatusFilter(e.target.value as OrderStatus | "ALL");
                            setCurrentPage(1);
                        }}
                    >
                        <option value="ALL">All Status</option>
                        <option value="PENDING">Pending</option>
                        <option value="PROCESSING">Processing</option>
                        <option value="COMPLETED">Completed</option>
                    </select>
                </div>

                {/* Date Filter */}
                <div className="relative group h-11 flex items-center bg-gray-50/50 dark:bg-white/5 px-3 rounded-lg border border-gray-100 dark:border-white/10 focus-within:border-primary/30 transition-all">
                    <input
                        type="date"
                        className="block w-full border-none bg-transparent py-2 px-1 text-[11px] font-bold uppercase tracking-tight focus:ring-0 cursor-pointer"
                        value={dateFilter}
                        onChange={(e) => {
                            setDateFilter(e.target.value);
                            setCurrentPage(1);
                        }}
                    />
                </div>
            </div>
        </motion.div>
      </div>

      <div className="minimal-card overflow-hidden">
        <div className="p-4 border-b border-gray-100 dark:border-white/10 bg-gray-50/50 dark:bg-black flex items-center justify-between">
            <span className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Global Order Ledger</span>
            <span className="text-[9px] font-bold text-gray-400 tabular-nums uppercase tracking-tight">INDEXED: {filteredOrders.length} MATCHES</span>
        </div>
        <OrdersTable orders={paginatedOrders} loading={loading} shipperMap={shipperMap} />
      </div>

      {/* Pagination Controls */}
      {!loading && filteredOrders.length > 0 && (
        <motion.div 
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.3 }}
          className="flex items-center justify-between minimal-card px-8 py-4"
        >
          <div className="flex flex-1 justify-between sm:hidden">
            <button
              onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
              disabled={currentPage === 1}
              className="relative inline-flex items-center rounded-lg minimal-card px-4 py-2 text-[10px] font-bold text-gray-400 hover:text-indigo-600 disabled:opacity-30"
            >
              Previous
            </button>
            <button
              onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
              disabled={currentPage === totalPages}
              className="relative ml-3 inline-flex items-center rounded-lg minimal-card px-4 py-2 text-[10px] font-bold text-gray-400 hover:text-indigo-600 disabled:opacity-30"
            >
              Next
            </button>
          </div>
          <div className="hidden sm:flex sm:flex-1 sm:items-center sm:justify-between">
            <div>
              <p className="text-[10px] font-bold text-gray-400 uppercase tracking-wider">
                Showing <span className="text-gray-900 dark:text-white tabular-nums">{(currentPage - 1) * itemsPerPage + 1}</span> - <span className="text-gray-900 dark:text-white tabular-nums">{Math.min(currentPage * itemsPerPage, filteredOrders.length)}</span> of <span className="text-gray-900 dark:text-white tabular-nums">{filteredOrders.length}</span> entries
              </p>
            </div>
            <div>
              <nav className="isolate inline-flex gap-2" aria-label="Pagination">
                <button
                   onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
                   disabled={currentPage === 1}
                   className="minimal-card px-3 py-1.5 text-[10px] font-bold uppercase text-gray-400 hover:text-primary transition-all disabled:opacity-30"
                >
                  Prev
                </button>
                <div className="minimal-card px-5 py-1.5 text-[11px] font-bold text-primary border-green-100 dark:border-green-900/30">
                    {currentPage} / {totalPages}
                </div>
                <button
                   onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
                   disabled={currentPage === totalPages}
                   className="minimal-card px-3 py-1.5 text-[10px] font-bold uppercase text-gray-400 hover:text-primary transition-all disabled:opacity-30"
                >
                  Next
                </button>
              </nav>
            </div>
          </div>
        </motion.div>
      )}
    </motion.div>
  );
}

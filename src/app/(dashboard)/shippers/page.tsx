"use client";

import ShippersTable from "@/components/shippers/ShippersTable";
import { useOrders } from "@/hooks/useOrders";
import { useShippers } from "@/hooks/useShippers";
import { motion } from "framer-motion";
import { Users, Search, X, Truck } from "lucide-react";
import { useState, useMemo } from "react";
import CreateShipperModal from "@/components/shippers/CreateShipperModal";
import { UserPlus } from "lucide-react";

export default function ShippersPage() {
  const { shippers, loading: shippersLoading } = useShippers();
  const { orders, loading: ordersLoading } = useOrders();
  const [searchQuery, setSearchQuery] = useState("");
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);

  const loading = shippersLoading || ordersLoading;

  const filteredShippers = useMemo(() => {
    return shippers.filter(s => 
      s.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      s.email?.toLowerCase().includes(searchQuery.toLowerCase())
    );
  }, [shippers, searchQuery]);

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
                <Users className="h-6 w-6" />
            </div>
            <div>
                <h1 className="text-3xl font-bold text-gray-900 dark:text-white tracking-tight flex items-center gap-3">
                    <Truck className="h-8 w-8 text-primary" />
                    <span>Shipper <span className="text-primary font-medium">Agents</span></span>
                </h1>
                <p className="text-[11px] text-gray-400 font-medium uppercase tracking-wider mt-1">
                    Fleet: <span className="text-primary font-bold">Resource Monitoring</span>
                </p>
            </div>
        </div>
        
        <div className="flex items-center gap-4">
            <div className="relative group minimal-card border-none shadow-md">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-gray-400 group-focus-within:text-primary transition-colors" />
                <input 
                    type="text" 
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    placeholder="Search agents..." 
                    className="h-10 w-64 bg-white dark:bg-black rounded-xl pl-9 pr-8 text-xs font-semibold focus:ring-1 focus:ring-primary/40 focus:outline-none transition-all placeholder:text-gray-500"
                />
                {searchQuery && (
                    <button 
                        onClick={() => setSearchQuery("")}
                        className="absolute right-2.5 top-1/2 -translate-y-1/2 p-0.5 hover:bg-gray-100 dark:hover:bg-white/10 rounded-md transition-colors"
                    >
                        <X className="h-3 w-3 text-gray-400" />
                    </button>
                )}
            </div>

            <div className="minimal-card px-6 py-3 flex items-center gap-6 shadow-md">
                <div className="flex flex-col">
                    <span className="text-[9px] font-bold text-gray-400 uppercase tracking-wider leading-none mb-1">Total Agents</span>
                    <span className="text-lg font-bold text-gray-900 dark:text-white tabular-nums leading-none">{shippers.length}</span>
                </div>
                <div className="h-6 w-px bg-gray-100 dark:bg-white/10"></div>
                <div className="flex flex-col">
                    <span className="text-[9px] font-bold text-gray-400 uppercase tracking-wider leading-none mb-1">On Mission</span>
                    <span className="text-lg font-bold text-primary dark:text-primary tabular-nums leading-none">
                        {shippers.filter(s => s.status === 'busy' || s.currentOrder).length}
                    </span>
                </div>
            </div>
            <button 
                onClick={() => setIsCreateModalOpen(true)}
                className="h-10 px-5 bg-primary hover:bg-primary-dark text-white rounded-xl text-xs font-bold shadow-lg shadow-primary/20 transition-all flex items-center gap-2 shrink-0 active:scale-95"
            >
                <UserPlus className="h-3.5 w-3.5" />
                <span>Create Agent</span>
            </button>
        </div>
      </div>

      <CreateShipperModal 
        isOpen={isCreateModalOpen} 
        onClose={() => setIsCreateModalOpen(false)} 
      />
      
      <div className="minimal-card overflow-hidden">
        <div className="p-4 border-b border-gray-100 dark:border-white/10 bg-gray-50/50 dark:bg-black flex items-center justify-between">
            <span className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Active Fleet Grid</span>
            <span className="text-[9px] font-bold text-gray-400 tabular-nums uppercase tracking-tight">INDEXED: {filteredShippers.length} MATCHES</span>
        </div>
        <ShippersTable shippers={filteredShippers} orders={orders} loading={loading} />
      </div>
    </motion.div>
  );
}

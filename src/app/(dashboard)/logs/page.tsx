"use client";

import { motion } from "framer-motion";
import { ClipboardList, Shield, Search, Filter, History, UserCheck, X, ChevronLeft, ChevronRight } from "lucide-react";
import { useEffect, useState } from "react";
import { collection, query, orderBy, onSnapshot, limit } from "firebase/firestore";
import { db } from "@/lib/firebase/config";
import clsx from "clsx";

interface LogEntry {
  id: string;
  userEmail: string;
  userId: string;
  role: string;
  event: string;
  details?: string;
  timestamp: any;
  status: string;
}

export default function LogsPage() {
  const [logs, setLogs] = useState<LogEntry[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<'admin' | 'client'>('admin');
  const [searchQuery, setSearchQuery] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;

  useEffect(() => {
    const q = query(
      collection(db, "logs"),
      orderBy("timestamp", "desc"),
      limit(200) // Increased limit for better searchable history
    );

    const unsubscribe = onSnapshot(q, (snapshot) => {
      const logData = snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      })) as LogEntry[];
      setLogs(logData);
      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  const filteredLogs = logs.filter(log => {
    const roleMatch = activeTab === 'admin' 
        ? log.role === 'admin' 
        : (log.role === 'shipper' || log.role === 'user');
    
    if (!roleMatch) return false;

    const searchTerm = searchQuery.toLowerCase();
    return (
        log.userEmail?.toLowerCase().includes(searchTerm) ||
        log.event?.toLowerCase().includes(searchTerm) ||
        log.details?.toLowerCase().includes(searchTerm)
    );
  });

  const totalPages = Math.ceil(filteredLogs.length / itemsPerPage);
  const paginatedLogs = filteredLogs.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  // Reset page when tab or search changes
  useEffect(() => {
    setCurrentPage(1);
  }, [activeTab, searchQuery]);

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
            <ClipboardList className="h-6 w-6" />
          </div>
          <div>
            <h1 className="text-3xl font-bold text-gray-900 dark:text-white tracking-tight">
              Security <span className="text-primary font-medium">Audit Logs</span>
            </h1>
            <p className="text-[11px] text-gray-400 font-medium uppercase tracking-wider mt-1">
              Terminal: <span className="text-primary font-bold">Protocol Transparency</span>
            </p>
          </div>
        </div>

        <div className="flex items-center gap-3 minimal-card border-none shadow-md">
            <div className="relative group">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-gray-400 group-focus-within:text-primary transition-colors" />
                <input 
                    type="text" 
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    placeholder="Search protocols..." 
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
        </div>
      </div>

      <div className="flex items-center gap-1 border-b border-gray-100 dark:border-white/5 pb-px">
        <button 
            onClick={() => setActiveTab('admin')}
            className={clsx(
                "px-6 py-3 text-[10px] font-black uppercase tracking-widest transition-all relative",
                activeTab === 'admin' ? "text-primary dark:text-primary" : "text-gray-400 hover:text-gray-600"
            )}
        >
            Admin Operations
            {activeTab === 'admin' && <motion.div layoutId="tab-active" className="absolute bottom-0 left-0 right-0 h-0.5 bg-primary dark:bg-primary" />}
        </button>
        <button 
            onClick={() => setActiveTab('client')}
            className={clsx(
                "px-6 py-3 text-[10px] font-black uppercase tracking-widest transition-all relative",
                activeTab === 'client' ? "text-primary dark:text-primary" : "text-gray-400 hover:text-gray-600"
            )}
        >
            Client & Fleet Activity
            {activeTab === 'client' && <motion.div layoutId="tab-active" className="absolute bottom-0 left-0 right-0 h-0.5 bg-primary" />}
        </button>
      </div>

      <div className="minimal-card overflow-hidden">
        <div className="p-4 border-b border-gray-100 dark:border-white/10 bg-gray-50/50 dark:bg-black flex items-center justify-between">
            <div className="flex items-center gap-2">
                <History className="h-4 w-4 text-primary" />
                <span className="text-[10px] font-black text-gray-400 uppercase tracking-widest">
                    {activeTab === 'admin' ? 'Administrative Protocols' : 'User-Side Transactions'}
                </span>
            </div>
            <div className="flex items-center gap-4">
                <span className="text-[9px] font-bold text-gray-400 tabular-nums uppercase">RESULT: {filteredLogs.length} MATCHES</span>
                {totalPages > 1 && (
                    <div className="flex items-center gap-2 border-l border-gray-100 dark:border-white/5 pl-4 ml-4">
                        <button 
                            disabled={currentPage === 1}
                            onClick={() => setCurrentPage(prev => Math.max(1, prev - 1))}
                            className="p-1 rounded bg-white dark:bg-black border border-gray-100 dark:border-white/10 disabled:opacity-30 disabled:cursor-not-allowed hover:border-primary/50 transition-all"
                        >
                            <ChevronLeft className="h-3 w-3" />
                        </button>
                        <span className="text-[9px] font-black text-gray-900 dark:text-white tabular-nums">
                            PAGE {currentPage} / {totalPages}
                        </span>
                        <button 
                            disabled={currentPage === totalPages}
                            onClick={() => setCurrentPage(prev => Math.min(totalPages, prev + 1))}
                            className="p-1 rounded bg-white dark:bg-black border border-gray-100 dark:border-white/10 disabled:opacity-30 disabled:cursor-not-allowed hover:border-primary/50 transition-all"
                        >
                            <ChevronRight className="h-3 w-3" />
                        </button>
                    </div>
                )}
            </div>
        </div>
        
        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead>
              <tr className="border-b border-gray-100 dark:border-white/10 bg-gray-50/30 dark:bg-black">
                <th className="px-6 py-4 text-[10px] font-black text-gray-400 uppercase tracking-widest">Subject</th>
                <th className="px-6 py-4 text-[10px] font-black text-gray-400 uppercase tracking-widest">Protocol Event</th>
                <th className="px-6 py-4 text-[10px] font-black text-gray-400 uppercase tracking-widest">Timestamp</th>
                <th className="px-6 py-4 text-[10px] font-black text-gray-400 uppercase tracking-widest text-right">Auth Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100 dark:divide-white/5">
              {loading ? (
                <tr>
                  <td colSpan={4} className="px-6 py-20 text-center">
                    <div className="flex flex-col items-center gap-3">
                        <div className="h-8 w-8 rounded-full border-2 border-green-100 border-t-primary animate-spin" />
                        <span className="text-xs font-bold text-gray-400 uppercase tracking-tighter">Syncing activity stream...</span>
                    </div>
                  </td>
                </tr>
              ) : paginatedLogs.length === 0 ? (
                <tr>
                  <td colSpan={4} className="px-6 py-20 text-center">
                    <div className="flex flex-col items-center gap-3 opacity-50">
                        <Shield className="h-10 w-10 text-gray-200" />
                        <span className="text-xs font-bold text-gray-400 uppercase tracking-tighter">{searchQuery ? 'No matches found for your criteria' : 'No events recognized in this category'}</span>
                    </div>
                  </td>
                </tr>
              ) : (
                paginatedLogs.map((log, idx) => (
                  <motion.tr 
                    key={log.id}
                    initial={{ opacity: 0, x: -10 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: idx * 0.02 }}
                    className="hover:bg-gray-50/50 dark:hover:bg-white/5 transition-colors group"
                  >
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-3">
                        <div className="h-8 w-8 rounded-lg bg-green-50 dark:bg-primary/20 flex items-center justify-center border border-green-100 dark:border-primary/30 group-hover:scale-105 transition-transform">
                          <UserCheck className="h-4 w-4 text-primary" />
                        </div>
                        <div>
                          <p className="text-xs font-bold text-gray-900 dark:text-white leading-none mb-1 text-ellipsis overflow-hidden max-w-[150px]">{log.userEmail}</p>
                          <p className="text-[9px] font-medium text-gray-400 tracking-tighter uppercase">ID: {log.userId?.slice(-12)}</p>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex flex-col min-w-[200px]">
                        <span className="text-[10px] font-black text-primary dark:text-primary uppercase tracking-tighter">{log.event}</span>
                        <span className="text-[9px] font-medium text-gray-400 uppercase tracking-widest leading-relaxed">{(log as any).details || 'Access Point'}</span>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex flex-col">
                        <span className="text-[10px] font-bold text-gray-900 dark:text-white whitespace-nowrap">
                          {log.timestamp 
                            ? new Intl.DateTimeFormat('en-US', { month: 'short', day: '2-digit', year: 'numeric' }).format(log.timestamp.toDate()) 
                            : "Pending..."}
                        </span>
                        <span className="text-[9px] font-medium text-gray-400 tabular-nums">
                          {log.timestamp 
                            ? new Intl.DateTimeFormat('en-US', { hour: '2-digit', minute: '2-digit', second: '2-digit', hour12: false }).format(log.timestamp.toDate()) 
                            : "--:--:--"}
                        </span>
                      </div>
                    </td>
                    <td className="px-6 py-4 text-right">
                      <span className="px-2 py-0.5 bg-emerald-50 dark:bg-emerald-950/40 text-emerald-600 dark:text-emerald-400 text-[9px] font-black uppercase tracking-tighter rounded border border-emerald-100 dark:border-emerald-800">
                        SUCCESS
                      </span>
                    </td>
                  </motion.tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </motion.div>
  );
}

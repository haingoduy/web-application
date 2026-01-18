"use client";

import { useShipper } from "@/hooks/useShipper";
import { ArrowLeft, UserCircle, Package, CheckCircle, Smartphone, Loader2, X, Phone, Mail, Shield } from "lucide-react";
import Link from "next/link";
import { use } from "react";
import { doc, deleteDoc, updateDoc } from "firebase/firestore";
import { db } from "@/lib/firebase/config";
import { motion } from "framer-motion";
import clsx from "clsx";

export default function ShipperDetailsPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params);
  const { shipper, loading } = useShipper(id);

  if (loading) {
     return (
       <div className="flex h-96 w-full items-center justify-center">
         <Loader2 className="h-8 w-8 animate-spin text-primary" />
       </div>
     );
  }

  if (!shipper) {
    return (
      <div className="p-16 text-center minimal-card max-w-lg mx-auto mt-20">
         <div className="h-20 w-20 rounded-3xl bg-red-50 dark:bg-red-950/20 flex items-center justify-center mx-auto mb-6">
            <UserCircle className="h-10 w-10 text-red-500" />
         </div>
         <h2 className="text-2xl font-black text-gray-900 dark:text-white uppercase italic">Agent Disconnected</h2>
         <p className="text-gray-500 font-medium mt-2">The requested fleet unit is no longer in the system.</p>
         <Link href="/shippers" className="mt-8 inline-flex items-center gap-2 premium-gradient px-8 py-3 rounded-2xl text-white font-bold hover-lift transition-all">
            <ArrowLeft className="h-5 w-5" /> Return to Fleet
         </Link>
      </div>
    );
  }

  return (
    <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="space-y-10 pb-16"
    >
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
            <div className="flex items-center gap-6">
                <Link href="/shippers" className="minimal-card p-3 hover:text-primary hover-lift transition-all">
                    <ArrowLeft className="h-5 w-5" />
                </Link>
                <div>
                    <h1 className="text-3xl font-bold text-gray-900 dark:text-white tracking-tight">
                        Unit <span className="text-primary font-medium">Profile</span>
                    </h1>
                    <p className="text-gray-400 font-medium text-[11px] mt-1 uppercase tracking-wider">
                        Operational Status: <span className={clsx("font-bold", shipper.status === 'free' ? "text-emerald-500" : "text-amber-500")}>
                            {shipper.status?.toUpperCase() || "OFFLINE"}
                        </span>
                    </p>
                </div>
            </div>
        </div>

        <div className="grid grid-cols-1 gap-8 lg:grid-cols-3">
             {/* Profile Card */}
             <div className="minimal-card p-8 flex flex-col items-center text-center">
                  <div className="relative mb-6">
                    <div className="h-28 w-28 rounded-3xl bg-primary/5 dark:bg-black flex items-center justify-center text-primary shadow-sm border border-primary/10 dark:border-primary/20">
                        <span className="text-4xl font-black italic">{shipper.name.charAt(0).toUpperCase()}</span>
                    </div>
                    {shipper.status === 'busy' && (
                        <span className="absolute -bottom-1 -right-1 flex h-6 w-6">
                            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-amber-400 opacity-75"></span>
                            <span className="relative inline-flex rounded-full h-6 w-6 bg-amber-500 border-4 border-white dark:border-black"></span>
                        </span>
                    )}
                  </div>
                  <h2 className="text-xl font-bold text-gray-900 dark:text-white tracking-tight mb-1">{shipper.name}</h2>
                  <p className="text-[11px] font-bold text-gray-400 dark:text-gray-500 uppercase tracking-widest mb-6">
                      {shipper.email || "No Identifier"}
                  </p>
                  
                  <div className="w-full space-y-3">
                      <div className="flex items-center justify-between p-3 rounded-xl bg-gray-50 dark:bg-black border border-gray-100 dark:border-white/10">
                          <span className="text-[10px] font-black text-gray-400 uppercase tracking-wider">Unit Type</span>
                          <span className="text-xs font-bold text-primary dark:text-primary/80 uppercase">T-{shipper.type || 1} Handler</span>
                      </div>
                      <div className="flex items-center justify-between p-3 rounded-xl bg-gray-50 dark:bg-black border border-gray-100 dark:border-white/10">
                          <span className="text-[10px] font-black text-gray-400 uppercase tracking-wider">Role</span>
                          <span className="text-xs font-bold text-primary uppercase">{shipper.role || 'SHIPPER'}</span>
                      </div>
                      <div className="flex items-center justify-between p-3 rounded-xl bg-gray-50 dark:bg-black border border-gray-100 dark:border-white/10">
                          <span className="text-[10px] font-black text-gray-400 uppercase tracking-wider">Auth Status</span>
                          <span className="text-xs font-bold text-emerald-500 uppercase">VERIFIED</span>
                      </div>
                  </div>
             </div>

             {/* Stats & Management Card */}
             <div className="lg:col-span-2 space-y-8">
                <div className="minimal-card p-6">
                    <h3 className="text-xs font-bold text-gray-400 dark:text-gray-500 mb-6 uppercase tracking-wider">Operational Metrics</h3>
                    <dl className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                        <div className="p-5 rounded-2xl bg-primary/5 dark:bg-black border border-primary/10 dark:border-primary/20">
                           <div className="flex items-center gap-3 mb-2">
                               <div className="p-2 bg-primary rounded-lg">
                                   <Package className="h-4 w-4 text-white" />
                               </div>
                               <dt className="text-[10px] font-black text-gray-400 uppercase tracking-tighter">Current Assignment</dt>
                           </div>
                           <dd className="text-2xl font-bold text-gray-900 dark:text-white tracking-tighter tabular-nums">
                               {shipper.currentOrder ? (
                                   <span className="text-primary">#{shipper.currentOrder.slice(-8).toUpperCase()}</span>
                               ) : "IDLE"}
                           </dd>
                        </div>

                        <div className="p-5 rounded-2xl bg-emerald-50/30 dark:bg-black border border-emerald-100 dark:border-emerald-900/40">
                           <div className="flex items-center gap-3 mb-2">
                               <div className="p-2 bg-emerald-500 rounded-lg">
                                   <CheckCircle className="h-4 w-4 text-white" />
                               </div>
                               <dt className="text-[10px] font-black text-gray-400 uppercase tracking-tighter">Performance Bonus</dt>
                           </div>
                           <dd className="text-2xl font-bold text-gray-900 dark:text-white tracking-tighter tabular-nums">
                               VND {shipper.bonus ? shipper.bonus.toLocaleString() : "0"}
                           </dd>
                        </div>
                        
                        <div className="p-5 rounded-2xl bg-gray-50 dark:bg-black border border-gray-100 dark:border-white/10">
                           <div className="flex items-center gap-3 mb-2">
                               <div className="p-2 bg-gray-500 rounded-lg">
                                   <Phone className="h-4 w-4 text-white" />
                               </div>
                               <dt className="text-[10px] font-black text-gray-400 uppercase tracking-tighter">Contact Number</dt>
                           </div>
                           <dd className="text-lg font-bold text-gray-900 dark:text-white tracking-tight">
                               {shipper.phone || "Not Registered"}
                           </dd>
                        </div>

                        <div className="p-5 rounded-2xl bg-gray-50 dark:bg-black border border-gray-100 dark:border-white/10">
                           <div className="flex items-center gap-3 mb-2">
                               <div className="p-2 bg-gray-500 rounded-lg">
                                   <Mail className="h-4 w-4 text-white" />
                               </div>
                               <dt className="text-[10px] font-black text-gray-400 uppercase tracking-tighter">Verified Email</dt>
                           </div>
                           <dd className="text-lg font-bold text-gray-900 dark:text-white tracking-tight truncate">
                               {shipper.email || "No Email"}
                           </dd>
                        </div>
                    </dl>
                </div>

                <div className="minimal-card p-6 border-red-100/50 dark:border-red-900/20">
                    <h3 className="text-xs font-bold text-gray-400 dark:text-gray-500 mb-6 uppercase tracking-wider">Terminal Control</h3>
                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                        <button 
                            onClick={() => alert("Admin Override Required: Manual password resets are restricted to the central security vault.")}
                            className="flex flex-col items-center justify-center p-4 rounded-xl border border-gray-100 dark:border-white/10 hover:bg-gray-50 dark:hover:bg-white/5 transition-all group"
                        >
                            <Smartphone className="h-5 w-5 text-gray-400 group-hover:text-primary mb-2" />
                            <span className="text-[10px] font-black uppercase tracking-widest text-gray-500 group-hover:text-gray-900 dark:group-hover:text-white">Reset Key</span>
                        </button>
                        
                        <button 
                             onClick={async () => {
                                 const action = shipper.locked ? "Unlock" : "Lock";
                                 if (confirm(`INITIATE PROTOCOL: ${action} this unit access?`)) {
                                     try {
                                         await updateDoc(doc(db, "users", shipper.uid), {
                                             locked: !shipper.locked
                                         });
                                     } catch (error) {
                                         alert("Protocol Error: Access override failed.");
                                     }
                                 }
                             }}
                            className={clsx(
                                "flex flex-col items-center justify-center p-4 rounded-xl border transition-all group",
                                shipper.locked 
                                    ? "border-emerald-100 bg-emerald-50/30 text-emerald-600 hover:bg-emerald-50" 
                                    : "border-amber-100 bg-amber-50/30 text-amber-600 hover:bg-amber-50 dark:border-amber-900/40 dark:bg-black"
                            )}
                        >
                            <div className="h-5 w-5 rounded-full border-2 border-current flex items-center justify-center mb-2">
                                <div className="h-1.5 w-1.5 bg-current rounded-full" />
                            </div>
                            <span className="text-[10px] font-black uppercase tracking-widest">
                                {shipper.locked ? "Restore Access" : "Restrict Unit"}
                            </span>
                        </button>

                        <button 
                            onClick={async () => {
                                if(confirm("CRITICAL WARNING: This will permanently purge the fleet unit from the operational grid. Proceed?")) {
                                    try {
                                        await deleteDoc(doc(db, "users", shipper.uid));
                                        window.location.href = "/shippers"; 
                                    } catch (error) {
                                        alert("Purge Failure: System records are protected.");
                                    }
                                }
                            }}
                            className="flex flex-col items-center justify-center p-4 rounded-xl bg-red-600 hover:bg-red-700 text-white transition-all shadow-lg shadow-red-500/10"
                        >
                            <X className="h-5 w-5 mb-2" />
                            <span className="text-[10px] font-black uppercase tracking-widest">Purge Unit</span>
                        </button>
                    </div>
                </div>
             </div>
        </div>
    </motion.div>
  );
}

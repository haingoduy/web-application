"use client";

import { useOrder } from "@/hooks/useOrder";
import { useShippers } from "@/hooks/useShippers";
import OrderTimeline from "@/components/orders/OrderTimeline";
import { Loader2, ArrowLeft, QrCode, Truck, Check, X, MapPin, Package, User, Hash, AlertCircle, Phone } from "lucide-react";
import { useState } from "react";
import { doc, updateDoc } from "firebase/firestore";
import { db } from "@/lib/firebase/config";
import Link from "next/link";
import clsx from "clsx";
import { use } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { logActivity } from "@/lib/utils/logging";
import { useAuth } from "@/context/AuthContext";

export default function OrderDetailsPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params);
  const { user } = useAuth();
  const { order, loading } = useOrder(id);
  const { shippers, shipperMap } = useShippers();
  const [assigning, setAssigning] = useState(false);
  const [selectedShipperId, setSelectedShipperId] = useState("");

  const getRequiredType = (stage: any) => {
      if (stage === 1 || stage === 'PICKUP') return 1;
      if (stage === 2 || stage === 'WAREHOUSE') return 2;
      if (stage === 3 || stage === 'SHIPPING') return 3;
      return 0;
  };

  const requiredType = getRequiredType(order?.currentStage);
  const availableShippers = shippers.filter(s => s.status === 'free');
  const preferredShippers = availableShippers.filter(s => s.type === requiredType);
  const otherShippers = availableShippers.filter(s => s.type !== requiredType);
  const showPreferredOnly = preferredShippers.length > 0;
  const displayShippers = showPreferredOnly ? preferredShippers : otherShippers;

  const handleAssign = async () => {
    if (!selectedShipperId || !order) return;
    setAssigning(true);
    try {
        const orderRef = doc(db, "orders", order.orderId);
        const shipperName = shipperMap[selectedShipperId] || "Unknown";
        const stageNum = getRequiredType(order.currentStage);
        
        const updates: any = {
            assignedShipperId: selectedShipperId,
            shipperId: selectedShipperId,
            shipperName: shipperName,
            status: 'PROCESSING'
        };

        if (stageNum === 1) {
            updates.shipperStage1 = selectedShipperId;
            updates.stage1ShipperId = selectedShipperId;
            updates.stage1Shipper = shipperName;
            updates.shipper1 = shipperName;
        } else if (stageNum === 2) {
             updates.shipperStage2 = selectedShipperId;
             updates.stage2ShipperId = selectedShipperId;
             updates.stage2Shipper = shipperName;
             updates.shipper2 = shipperName;
        } else if (stageNum === 3) {
             updates.shipperStage3 = selectedShipperId;
             updates.stage3ShipperId = selectedShipperId;
             updates.stage3Shipper = shipperName;
             updates.shipper3 = shipperName;
        }

        await updateDoc(orderRef, updates);
        const shipperRef = doc(db, "users", selectedShipperId);
        await updateDoc(shipperRef, { status: 'busy', currentOrder: order.orderId });
        
        // Audit Log
        if (user) {
            await logActivity(user.uid, user.email || "admin", "admin", "MISSION_ASSIGNED", `Order ${order.orderId} assigned to ${shipperName}`);
        }

        setSelectedShipperId("");
    } catch (e) {
        console.error("Error assigning", e);
        alert("Failed to assign shipper");
    } finally {
        setAssigning(false);
    }
  };

  const handleUnassign = async () => {
      if (!order || !order.assignedShipperId) return;
      if (!confirm("Are you sure you want to unassign the current shipper?")) return;
      
      setAssigning(true);
      try {
          const prevShipperId = order.assignedShipperId;
          const prevShipperName = shipperMap[prevShipperId] || "Fleet Agent";
          const orderRef = doc(db, "orders", order.orderId);
          const stageNum = getRequiredType(order.currentStage);
          const updates: any = {
              assignedShipperId: null,
              shipperId: null,
              shipperName: null,
              status: 'PENDING'
          };

          if (stageNum === 1) {
              updates.shipperStage1 = null;
              updates.stage1ShipperId = null;
              updates.stage1Shipper = null;
              updates.shipper1 = null;
          } else if (stageNum === 2) {
              updates.shipperStage2 = null;
              updates.stage2ShipperId = null;
              updates.stage2Shipper = null;
              updates.shipper2 = null;
          } else if (stageNum === 3) {
              updates.shipperStage3 = null;
              updates.stage3ShipperId = null;
              updates.stage3Shipper = null;
              updates.shipper3 = null;
          }

          await updateDoc(orderRef, updates);

          const shipperRef = doc(db, "users", prevShipperId);
          await updateDoc(shipperRef, { 
              status: 'free', 
              currentOrder: null 
          });

          // Audit Log
          if (user) {
            await logActivity(user.uid, user.email || "admin", "admin", "MISSION_REVOKED", `Removed ${prevShipperName} from Order ${order.orderId}`);
          }

      } catch (e) {
          console.error("Error unassigning", e);
          alert("Failed to unassign shipper");
      } finally {
          setAssigning(false);
      }
  };

  const getShipperName = (id?: string | null, storedName?: string | null) => {
      if (!id) return "Unassigned";
      return shipperMap[id] || storedName || "Unknown Shipper";
  };

  if (loading) {
    return (
      <div className="flex h-96 w-full items-center justify-center">
        <Loader2 className="h-10 w-10 animate-spin text-primary" />
      </div>
    );
  }

  if (!order) {
    return (
      <div className="p-16 text-center glass-card max-w-lg mx-auto mt-20">
         <div className="h-20 w-20 rounded-3xl bg-red-50 dark:bg-red-950/20 flex items-center justify-center mx-auto mb-6">
            <AlertCircle className="h-10 w-10 text-red-500" />
         </div>
         <h2 className="text-2xl font-black text-gray-900 dark:text-white uppercase italic">Order Not Found</h2>
         <p className="text-gray-500 font-medium mt-2">The requested order ID does not exist in our records.</p>
         <Link href="/orders" className="mt-8 inline-flex items-center gap-2 premium-gradient px-8 py-3 rounded-2xl text-white font-bold hover-lift transition-all">
            <ArrowLeft className="h-5 w-5" /> Return to Fleet
         </Link>
      </div>
    );
  }

  return (
    <motion.div 
        initial={{ opacity: 0, scale: 0.98 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.5 }}
        className="space-y-10 pb-16"
    >
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
        <div className="flex items-center gap-6">
            <Link href="/orders" className="minimal-card p-3 hover:text-primary hover-lift transition-all">
                <ArrowLeft className="h-5 w-5" />
            </Link>
            <div>
                 <div className="flex items-center gap-3">
                    <h1 className="text-3xl font-bold text-gray-900 dark:text-white tracking-tight">
                        Order <span className="text-primary font-medium">Details</span>
                    </h1>
                    <span
                        className={clsx(
                            "inline-flex items-center rounded-lg px-3 py-1 text-[9px] font-bold uppercase tracking-wider border",
                            {
                            "bg-amber-50 text-amber-600 border-amber-100 dark:bg-amber-950/20 dark:border-amber-900/30": order.status === "PENDING",
                            "bg-blue-50 text-blue-600 border-blue-100 dark:bg-blue-950/20 dark:border-blue-900/30": order.status === "PROCESSING",
                            "bg-emerald-50 text-emerald-600 border-emerald-100 dark:bg-emerald-950/20 dark:border-emerald-900/30": order.status === "COMPLETED",
                            }
                        )}
                        >
                        {order.status}
                    </span>
                 </div>
                 <p className="text-gray-400 font-medium text-[11px] mt-1 uppercase tracking-wider">Transaction: <span className="text-primary font-bold tabular-nums">#{order.orderId}</span></p>
            </div>
        </div>
      </div>

      <div className="grid grid-cols-1 gap-8 lg:grid-cols-3">
        <div className="space-y-8 lg:col-span-2">
            
            <AnimatePresence>
                {order.status !== 'COMPLETED' && (
                    <motion.div 
                        initial={{ y: 20, opacity: 0 }}
                        animate={{ y: 0, opacity: 1 }}
                        exit={{ scale: 0.9, opacity: 0 }}
                        className="minimal-card p-6 border-green-100 dark:border-primary/10"
                    >
                        <h3 className="text-[11px] font-bold text-primary uppercase tracking-wider mb-4 flex items-center gap-2">
                            <Truck className="h-4 w-4" /> 
                            Assignment Control
                        </h3>
                        
                        {order.assignedShipperId ? (
                            <div className="flex items-center justify-between bg-green-50/50 dark:bg-primary/5 px-5 py-6 rounded-2xl border border-green-100 dark:border-primary/20 shadow-inner">
                                <div className="flex items-center gap-3">
                                    <div className="h-10 w-10 rounded-lg bg-green-100 dark:bg-primary/20 flex items-center justify-center">
                                        <User className="h-5 w-5 text-primary" />
                                    </div>
                                    <div>
                                        <p className="text-[10px] font-bold uppercase tracking-tight text-gray-400">Active Handler</p>
                                        <p className="text-lg font-bold text-gray-900 dark:text-white tracking-tight">
                                            {getShipperName(order.assignedShipperId, null)}
                                        </p>
                                    </div>
                                </div>
                                <button
                                    onClick={handleUnassign}
                                    disabled={assigning}
                                    className="px-4 py-2 rounded-lg bg-white dark:bg-gray-800 text-gray-500 font-bold text-[10px] uppercase tracking-wider border border-gray-200 dark:border-gray-700 hover:text-red-500 hover:border-red-200 transition-all disabled:opacity-50"
                                >
                                    {assigning ? "Revoking..." : "Unassign Agent"}
                                </button>
                            </div>
                        ) : (
                            <div className="space-y-4">
                                {!showPreferredOnly && (
                                    <div className="flex items-center gap-2.5 text-[10px] font-bold uppercase text-amber-600 tracking-tight bg-amber-50 dark:bg-black px-3 py-2 rounded-lg border border-amber-100 dark:border-amber-900/30 m-4">
                                        <AlertCircle className="h-3.5 w-3.5" />
                                        Manual Override: Suitable fleet units not found (Target: Type {requiredType})
                                    </div>
                                )}
                                <div className="flex flex-col sm:flex-row gap-3">
                                    <div className="relative flex-1 group">
                                        <User className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400 group-focus-within:text-primary transition-colors" />
                                        <select
                                            value={selectedShipperId}
                                            onChange={(e) => setSelectedShipperId(e.target.value)}
                                            className="block w-full rounded-xl border border-gray-200 dark:border-white/10 bg-white dark:bg-black py-3 pl-10 pr-10 text-xs font-semibold focus:ring-1 focus:ring-primary focus:border-primary appearance-none cursor-pointer group-hover:bg-gray-50 dark:group-hover:bg-white/5 transition-all"
                                            disabled={assigning}
                                        >
                                            <option value="">Select Fleet Agent...</option>
                                            {displayShippers.map(s => (
                                                <option key={s.uid} value={s.uid}>
                                                    {s.name} (Unit T-{s.type || '?'})
                                                </option>
                                            ))}
                                        </select>
                                    </div>
                                    <button
                                        onClick={handleAssign}
                                        disabled={!selectedShipperId || assigning}
                                        className="inline-flex justify-center items-center gap-2 rounded-xl bg-primary py-3 px-8 text-xs font-bold text-white uppercase tracking-wider hover:bg-primary-dark transition-all disabled:opacity-30"
                                    >
                                        {assigning ? "Processing..." : "Assign Mission"}
                                    </button>
                                </div>
                            </div>
                        )}
                    </motion.div>
                )}
            </AnimatePresence>

            <motion.div 
                initial={{ y: 20, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ delay: 0.1 }}
                className="minimal-card p-6"
            >
                 <h3 className="text-xs font-bold text-gray-400 dark:text-gray-500 mb-6 uppercase tracking-wider">Intelligence Data</h3>
                 <dl className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                     <div className="p-4 rounded-xl border border-gray-100 dark:border-white/10 bg-gray-50/30 dark:bg-black">
                      <dt className="text-[10px] font-bold text-gray-400 uppercase tracking-tight mb-1">Customer</dt>
                      <dd className="text-base font-bold text-gray-900 dark:text-white flex flex-col gap-1">
                         <div className="flex items-center gap-2">
                             <User className="h-4 w-4 text-primary" />
                             {order.customerName}
                         </div>
                         {order.customerPhone && (
                              <div className="flex items-center gap-2 text-[10px] text-gray-400 font-medium bg-white dark:bg-white/5 px-2 py-0.5 rounded-lg border border-gray-100 dark:border-white/5 shadow-sm mt-1">
                                 <Phone className="h-3 w-3 text-primary/70" />
                                 {order.customerPhone}
                              </div>
                         )}
                      </dd>
                    </div>
                    <div className="p-4 rounded-xl border border-gray-100 dark:border-white/10 bg-gray-50/30 dark:bg-black shadow-sm">
                      <dt className="text-[10px] font-bold text-gray-400 uppercase tracking-tight mb-1">Payload</dt>
                      <dd className="text-base font-bold text-gray-900 dark:text-white flex items-center gap-2">
                         <Package className="h-4 w-4 text-primary" />
                         {order.productName} <span className="text-primary font-medium tabular-nums ml-1">x{order.quantity}</span>
                      </dd>
                    </div>
                    <div className="p-4 rounded-xl border border-gray-100 dark:border-white/10">
                      <dt className="text-[10px] font-bold text-gray-400 uppercase tracking-tight mb-1">Origin</dt>
                      <dd className="text-xs font-semibold text-gray-600 dark:text-gray-400 flex items-center gap-2">
                         <MapPin className="h-3.5 w-3.5 text-emerald-500/70" />
                         {order.fromWarehouse}
                      </dd>
                    </div>
                    <div className="p-4 rounded-xl border border-gray-100 dark:border-white/10">
                      <dt className="text-[10px] font-bold text-gray-400 uppercase tracking-tight mb-1">Destination</dt>
                      <dd className="text-xs font-semibold text-gray-600 dark:text-gray-400 flex items-center gap-2">
                         <MapPin className="h-3.5 w-3.5 text-rose-500/70" />
                         {order.toWarehouse}
                      </dd>
                    </div>
                    <div className="sm:col-span-2 p-4 rounded-xl bg-green-50/30 dark:bg-black border border-green-100 dark:border-primary/40 shadow-inner">
                      <dt className="text-[10px] font-bold text-primary dark:text-primary uppercase tracking-wider mb-2">Protocol Notes</dt>
                      <dd className="text-[11px] font-medium text-gray-600 dark:text-gray-400 italic leading-relaxed">
                          {order.note || "Standby for further operational parameters."}
                      </dd>
                    </div>
                 </dl>
            </motion.div>

            <motion.div 
                initial={{ y: 20, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ delay: 0.2 }}
                className="minimal-card p-6"
            >
                 <h3 className="text-xs font-bold text-gray-400 dark:text-gray-500 mb-8 uppercase tracking-wider">Mission Progress</h3>
                 <OrderTimeline order={order} />
            </motion.div>
             
            <motion.div 
                initial={{ y: 20, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ delay: 0.3 }}
                className="minimal-card p-6"
            >
                <h3 className="text-xs font-bold text-gray-400 dark:text-gray-500 mb-6 uppercase tracking-wider">Verification Steps</h3>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                    {[1, 2, 3].map((stageIdx) => {
                        const isConfirmed = order[`shipperStage${stageIdx}Confirmed` as keyof typeof order];
                        const shipperId = order[`shipperStage${stageIdx}` as keyof typeof order] || order[`stage${stageIdx}ShipperId` as keyof typeof order];
                        const shipperName = order[`stage${stageIdx}Shipper` as keyof typeof order] || order[`shipper${stageIdx}` as keyof typeof order];
                        
                        return (
                            <div key={stageIdx} className={clsx("p-4 rounded-xl border flex flex-col items-center text-center transition-all", 
                                isConfirmed ? "bg-emerald-50/40 border-emerald-100 dark:bg-emerald-950/10 dark:border-emerald-900/20" : "bg-gray-50/40 border-gray-100 dark:bg-gray-800/10 dark:border-white/5 opacity-60"
                            )}>
                                <div className={clsx("h-10 w-10 rounded-lg flex items-center justify-center mb-3",
                                    isConfirmed ? "bg-emerald-500 text-white shadow-sm" : "bg-gray-100 dark:bg-gray-800 text-gray-400"
                                )}>
                                    {isConfirmed ? <CheckIcon className="h-5 w-5" /> : <Hash className="h-5 w-5" />}
                                </div>
                                <span className="text-[9px] font-bold uppercase tracking-wider text-gray-400 mb-1.5">Phase {stageIdx}</span>
                                <span className="text-xs font-semibold text-gray-900 dark:text-white truncate w-full">
                                    {getShipperName(shipperId, shipperName)}
                                </span>
                            </div>
                        );
                    })}
                </div>
             </motion.div>
        </div>

        <motion.div 
            initial={{ x: 20, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            transition={{ delay: 0.2 }}
            className="space-y-8"
        >
             <div className="minimal-card p-6 flex flex-col items-center justify-center text-center">
                 <h3 className="text-[10px] font-bold text-gray-400 dark:text-gray-500 mb-6 w-full text-left uppercase tracking-wider">Validation Core</h3>
                 {(() => {
                    const qrData = order.qrCode || order.orderId;
                    return (
                     <div className="w-full">
                        <div className="bg-white p-3 rounded-2xl shadow-sm inline-block border border-gray-100 mb-6 outline outline-4 outline-green-50 dark:outline-primary/10">
                           <img 
                                src={`https://api.qrserver.com/v1/create-qr-code/?size=300x300&data=${encodeURIComponent(qrData)}&color=000000&bgcolor=ffffff&margin=1`}
                                alt="Order QR Code"
                                className="h-44 w-44 object-contain rounded-lg"
                           />
                        </div>
                        <div className="w-full space-y-3">
                             <div className="flex flex-col gap-1 items-start bg-gray-50 dark:bg-gray-800/40 p-4 rounded-2xl border border-gray-100 dark:border-white/5 shadow-inner">
                                <span className="text-[9px] font-black text-primary uppercase tracking-widest mb-1">Security Token</span>
                                <p className="text-[10px] font-mono font-bold text-gray-500 break-all tabular-nums text-left leading-snug">
                                    {qrData}
                                </p>
                            </div>
                            <div className="flex items-center justify-center gap-1.5 text-[9px] font-black uppercase tracking-widest text-primary py-1">
                                <QrCode className="h-3.5 w-3.5 text-primary/50" />
                                SCAN FOR SYSTEM AUTH
                            </div>
                        </div>
                     </div>
                    );
                 })()}
             </div>

             <div className="minimal-card p-6 overflow-hidden relative">
                <h3 className="text-[10px] font-bold text-gray-400 dark:text-gray-500 mb-5 uppercase tracking-wider">System State</h3>
                <div className="space-y-3.5">
                    <div className="flex items-center justify-between text-[10px] font-bold">
                        <span className="text-gray-400 uppercase tracking-tight">Security</span>
                        <span className="text-emerald-500">ACTIVE</span>
                    </div>
                    <div className="flex items-center justify-between text-[10px] font-bold">
                        <span className="text-gray-400 uppercase tracking-tight">Priority</span>
                        <span className="text-primary dark:text-primary">HIGH</span>
                    </div>
                    <div className="flex items-center justify-between text-[10px] font-bold">
                        <span className="text-gray-400 uppercase tracking-tight">Latency</span>
                        <span className="text-gray-900 dark:text-white tabular-nums">12ms</span>
                    </div>
                </div>
             </div>
        </motion.div>

      </div>
    </motion.div>
  );
}

function CheckIcon(props: any) {
    return (
        <svg {...props} xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="20 6 9 17 4 12"/></svg>
    )
}

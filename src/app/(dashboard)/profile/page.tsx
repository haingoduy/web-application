"use client";

import { useAuth } from "@/context/AuthContext";
import { Mail, Shield, User, Loader2, ArrowLeft, Key } from "lucide-react";
import Link from "next/link";
import { motion } from "framer-motion";

export default function ProfilePage() {
  const { user } = useAuth();

  if (!user) {
    return (
        <div className="flex h-96 w-full items-center justify-center">
          <Loader2 className="h-8 w-8 animate-spin text-primary" />
        </div>
      );
  }

  return (
    <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="space-y-10 pb-16"
    >
        <div className="flex items-center gap-6">
            <Link href="/" className="minimal-card p-3 hover:text-primary hover-lift transition-all">
                <ArrowLeft className="h-5 w-5" />
            </Link>
            <div>
                <h1 className="text-3xl font-bold text-gray-900 dark:text-white tracking-tight">
                    Identity <span className="text-primary font-medium">Vault</span>
                </h1>
                <p className="text-gray-400 font-medium text-[11px] mt-1 uppercase tracking-wider">
                    Administrative <span className="text-primary font-bold">Credentialing</span>
                </p>
            </div>
        </div>

        <div className="grid grid-cols-1 gap-8 lg:grid-cols-3">
            {/* Identity Card */}
            <div className="minimal-card p-8 flex flex-col items-center text-center">
                <div className="relative mb-6">
                    <div className="h-28 w-28 rounded-3xl bg-green-50 dark:bg-primary/20 flex items-center justify-center text-primary shadow-sm border border-green-100 dark:border-primary/30">
                        <span className="text-4xl font-black italic">{user.name.charAt(0).toUpperCase()}</span>
                    </div>
                    <div className="absolute -bottom-1 -right-1 h-8 w-8 rounded-xl bg-primary flex items-center justify-center border-4 border-white dark:border-gray-950">
                        <Shield className="h-4 w-4 text-white" />
                    </div>
                </div>
                <h2 className="text-xl font-bold text-gray-900 dark:text-white tracking-tight mb-1">{user.name}</h2>
                <p className="text-[11px] font-bold text-primary uppercase tracking-[0.2em] mb-6">
                    {user.role} Status
                </p>
                
                <div className="w-full space-y-3">
                    <div className="flex items-center justify-between p-4 rounded-xl bg-gray-50 dark:bg-white/[0.02] border border-gray-100 dark:border-white/5 shadow-sm">
                        <span className="text-[10px] font-black text-gray-400 uppercase tracking-wider">Clearance</span>
                        <span className="text-xs font-bold text-emerald-500 uppercase">LVL-4 ADMIN</span>
                    </div>
                    <div className="flex items-center justify-between p-4 rounded-xl bg-gray-50 dark:bg-white/[0.02] border border-gray-100 dark:border-white/5 shadow-sm">
                        <span className="text-[10px] font-black text-gray-400 uppercase tracking-wider">System State</span>
                        <span className="text-xs font-bold text-primary dark:text-primary uppercase">SYNCHRONIZED</span>
                    </div>
                </div>
            </div>

            <div className="lg:col-span-2 space-y-8">
                {/* Information Grid */}
                <div className="minimal-card p-6 shadow-lg">
                    <h3 className="text-xs font-bold text-gray-400 dark:text-gray-500 mb-6 uppercase tracking-wider">Operational Data</h3>
                    <dl className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                        <div className="p-4 rounded-xl border border-gray-100 dark:border-white/5 bg-gray-50 dark:bg-gray-800/20 shadow-sm">
                            <dt className="text-[10px] font-bold text-gray-400 uppercase tracking-tight mb-1">Assigned Name</dt>
                            <dd className="text-base font-bold text-gray-900 dark:text-white flex items-center gap-2">
                                <User className="h-4 w-4 text-primary" />
                                {user.name}
                            </dd>
                        </div>
                        <div className="p-4 rounded-xl border border-gray-100 dark:border-white/5 bg-gray-50 dark:bg-gray-800/20 shadow-sm">
                            <dt className="text-[10px] font-bold text-gray-400 uppercase tracking-tight mb-1">Communication Channel</dt>
                            <dd className="text-base font-bold text-gray-900 dark:text-white flex items-center gap-2">
                                <Mail className="h-4 w-4 text-primary" />
                                {user.email}
                            </dd>
                        </div>
                        <div className="sm:col-span-2 p-4 rounded-xl bg-green-50/50 dark:bg-primary/10 border border-green-100 dark:border-primary/40 shadow-inner">
                            <dt className="text-[10px] font-bold text-primary dark:text-primary uppercase tracking-wider mb-2">Unique Identifier (UID)</dt>
                            <dd className="text-[11px] font-mono text-gray-500 dark:text-gray-400 break-all leading-relaxed">
                                {user.uid}
                            </dd>
                        </div>
                    </dl>
                </div>

                {/* Internal Security */}
                <div className="minimal-card p-6">
                    <h3 className="text-xs font-bold text-gray-400 dark:text-gray-500 mb-6 uppercase tracking-wider">Encryption Protocol</h3>
                    <div className="flex flex-col sm:flex-row items-center gap-6">
                        <button 
                            onClick={() => alert("Central Command authorization required for credential rotation.")}
                            className="w-full sm:w-auto px-8 py-3 rounded-xl bg-primary hover:bg-primary-dark text-white text-[11px] font-black uppercase tracking-widest transition-all shadow-lg shadow-primary/20 flex items-center justify-center gap-2"
                        >
                            <Key className="h-3.5 w-3.5" />
                            Rotate Access Key
                        </button>
                        <p className="text-[10px] text-gray-500 font-medium text-center sm:text-left italic">
                            Operational session established: {new Date().toLocaleTimeString()}
                        </p>
                    </div>
                </div>
            </div>
        </div>
    </motion.div>
  );
}

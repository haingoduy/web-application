"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { Home, AlertCircle, ArrowLeft } from "lucide-react";

export default function NotFound() {
  return (
    <div className="min-h-screen bg-[#f8fafc] dark:bg-black flex items-center justify-center p-6 bg-[radial-gradient(circle_at_top_right,_var(--tw-gradient-stops))] from-primary/5 via-transparent to-transparent">
      <div className="max-w-md w-full text-center space-y-12 relative">
        {/* Animated Background Element */}
        <motion.div 
          animate={{ 
            scale: [1, 1.2, 1],
            rotate: [0, 90, 0],
            opacity: [0.3, 0.5, 0.3]
          }}
          transition={{ duration: 10, repeat: Infinity, ease: "linear" }}
          className="absolute -top-24 -left-20 w-64 h-64 bg-primary/10 rounded-full blur-3xl -z-10"
        />

        {/* 404 Illustration/Typography */}
        <div className="relative">
          <motion.h1 
            initial={{ opacity: 0, scale: 0.5 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ 
                type: "spring",
                stiffness: 260,
                damping: 20 
            }}
            className="text-[150px] font-black text-gray-900 dark:text-white leading-none tracking-tighter"
          >
            4<span className="text-primary italic">0</span>4
          </motion.h1>
          <motion.div 
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="absolute -bottom-4 left-1/2 -translate-x-1/2 px-4 py-1.5 bg-white dark:bg-black border border-gray-100 dark:border-white/10 rounded-full shadow-lg flex items-center gap-2"
          >
            <AlertCircle className="h-4 w-4 text-primary" />
            <span className="text-[10px] font-black uppercase tracking-widest text-gray-500">Route Not Found</span>
          </motion.div>
        </div>

        {/* Content */}
        <div className="space-y-4">
          <motion.h2 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
            className="text-2xl font-bold text-gray-900 dark:text-white"
          >
            Lost in the <span className="text-primary">Inviso</span> Grid?
          </motion.h2>
          <motion.p 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5 }}
            className="text-gray-500 text-sm font-medium leading-relaxed"
          >
            The coordinates you're looking for don't exist in our current fleet network. 
            The unit might have been purged or the link is broken.
          </motion.p>
        </div>

        {/* Action Button */}
        <motion.div
           initial={{ opacity: 0, y: 20 }}
           animate={{ opacity: 1, y: 0 }}
           transition={{ delay: 0.6 }}
           className="flex flex-col sm:flex-row items-center justify-center gap-4"
        >
          <Link 
            href="/"
            className="w-full sm:w-auto px-8 h-12 bg-primary hover:bg-primary-dark text-white rounded-2xl text-sm font-bold shadow-xl shadow-primary/20 transition-all flex items-center justify-center gap-3 active:scale-95 group"
          >
            <Home className="h-4 w-4 transform group-hover:-translate-y-0.5 transition-transform" />
            <span>Return Dashboard</span>
          </Link>
          
          <button 
            onClick={() => window.history.back()}
            className="w-full sm:w-auto px-8 h-12 bg-white dark:bg-white/5 hover:bg-gray-50 dark:hover:bg-white/10 text-gray-600 dark:text-gray-300 border border-gray-100 dark:border-white/5 rounded-2xl text-sm font-bold shadow-sm transition-all flex items-center justify-center gap-3 active:scale-95"
          >
            <ArrowLeft className="h-4 w-4" />
            <span>Go Back</span>
          </button>
        </motion.div>

        {/* Footer info */}
        <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 0.5 }}
            transition={{ delay: 1 }}
            className="text-[10px] text-gray-400 font-bold uppercase tracking-[0.2em] pt-8"
        >
            Inviso Fleet Management System v1.4.2
        </motion.div>
      </div>
    </div>
  );
}

"use client";

import { useState } from "react";
import { signInWithEmailAndPassword } from "firebase/auth";
import { auth } from "@/lib/firebase/config";
import { useRouter } from "next/navigation";
import { Loader2, Mail, Lock, ArrowRight } from "lucide-react";
import { motion } from "framer-motion";

export default function LoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      await signInWithEmailAndPassword(auth, email, password);
      router.push("/");
    } catch (err: any) {
      setError(err.message || "Invalid email or password.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex bg-white dark:bg-black selection:bg-primary selection:text-white">
      {/* Introduction Side - Visible on md+ */}
      <div className="hidden lg:flex w-1/2 flex-col justify-center p-20 bg-gray-50 dark:bg-zinc-950 border-r border-gray-200 dark:border-white/5 relative overflow-hidden">
        <div className="relative z-10 max-w-lg">
          <motion.div 
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6 }}
            className="flex items-center gap-3 mb-10"
          >
            <div className="h-10 w-10 bg-primary rounded-xl flex items-center justify-center text-white shadow-lg shadow-primary/20">
               <ArrowRight className="h-6 w-6 rotate-[-45deg]" />
            </div>
            <span className="text-xl font-black tracking-tighter text-gray-900 dark:text-white uppercase italic">Inviso <span className="text-primary font-medium">Admin</span></span>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2, duration: 0.8 }}
          >
            <h1 className="text-6xl font-black text-gray-900 dark:text-white leading-[1.05] tracking-tight mb-8">
              Powering the <span className="text-primary">future</span> of logistics.
            </h1>
            <p className="text-xl text-gray-500 dark:text-gray-400 font-medium leading-relaxed max-w-md">
              Step into the command center of Inviso. Monitor your fleet, manage global orders, and drive efficiency with real-time operational intelligence.
            </p>
          </motion.div>
        </div>

        {/* Decorative elements */}
        <div className="absolute top-0 right-0 -translate-y-1/2 translate-x-1/2 w-96 h-96 bg-primary/5 rounded-full blur-3xl" />
        <div className="absolute bottom-0 left-0 translate-y-1/2 -translate-x-1/2 w-64 h-64 bg-primary/10 rounded-full blur-3xl" />
      </div>

      {/* Login Side */}
      <div className="flex-1 flex items-center justify-center p-6 relative overflow-hidden">
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="w-full max-w-sm"
        >
          <div className="mb-10 lg:hidden text-center">
            <div className="h-12 w-12 bg-primary rounded-2xl flex items-center justify-center text-white mx-auto mb-4 shadow-xl shadow-primary/20">
               <ArrowRight className="h-7 w-7 rotate-[-45deg]" />
            </div>
            <h2 className="text-2xl font-black text-gray-900 dark:text-white uppercase italic tracking-tighter">Inviso</h2>
          </div>

          <div className="text-center lg:text-left mb-10">
            <h2 className="text-3xl font-black text-gray-900 dark:text-white tracking-tight">Welcome back</h2>
            <p className="text-sm font-medium text-gray-500 dark:text-gray-400 mt-2 italic">Please authorize your session to continue</p>
          </div>

          <form onSubmit={handleLogin} className="space-y-6">
            <div className="space-y-2">
              <label className="text-[10px] font-black text-gray-400 dark:text-gray-500 uppercase tracking-widest ml-1">Admin Identity</label>
              <div className="relative group">
                <Mail className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400 group-focus-within:text-primary transition-colors" />
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full h-12 pl-11 pr-4 bg-gray-50 dark:bg-zinc-900 border border-gray-100 dark:border-white/5 rounded-2xl text-sm font-semibold focus:outline-none focus:ring-1 focus:ring-primary/40 focus:bg-white dark:focus:bg-black transition-all"
                  placeholder="admin@inviso.com"
                />
              </div>
            </div>

            <div className="space-y-2">
              <div className="flex justify-between items-center ml-1">
                <label className="text-[10px] font-black text-gray-400 dark:text-gray-500 uppercase tracking-widest">Access Key</label>
                <button type="button" className="text-[9px] font-bold text-primary uppercase hover:underline">Revocation Help?</button>
              </div>
              <div className="relative group">
                <Lock className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400 group-focus-within:text-primary transition-colors" />
                <input
                  type="password"
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full h-12 pl-11 pr-4 bg-gray-50 dark:bg-zinc-900 border border-gray-100 dark:border-white/5 rounded-2xl text-sm font-semibold focus:outline-none focus:ring-1 focus:ring-primary/40 focus:bg-white dark:focus:bg-black transition-all"
                  placeholder="••••••••"
                />
              </div>
            </div>

            {error && (
              <motion.div 
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                className="p-4 text-[11px] text-center font-bold text-red-600 bg-red-50 dark:bg-red-950/20 border border-red-100 dark:border-red-900/30 rounded-xl"
              >
                {error}
              </motion.div>
            )}

            <button
              type="submit"
              disabled={loading}
              className="w-full h-12 bg-primary text-white text-xs font-black rounded-2xl hover:bg-primary-dark disabled:opacity-50 flex items-center justify-center uppercase tracking-widest transition-all shadow-lg shadow-primary/20 hover:shadow-primary/30 hover:scale-[1.02] active:scale-[0.98]"
            >
              {loading ? <Loader2 className="h-5 w-5 animate-spin" /> : (
                <span className="flex items-center gap-2">Initiate Session <ArrowRight className="h-4 w-4" /></span>
              )}
            </button>
          </form>
        </motion.div>

        {/* Decorative Grid - Right side */}
        <div className="absolute -z-10 inset-0 pointer-events-none opacity-[0.03] dark:opacity-[0.05]" 
             style={{ backgroundImage: 'radial-gradient(#4CAF50 0.5px, transparent 0.5px)', backgroundSize: '24px 24px' }} 
        />
      </div>
    </div>
  );
}

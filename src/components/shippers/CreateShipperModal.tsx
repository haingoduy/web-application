"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X, UserPlus, Shield, Smartphone, Mail, User, CheckCircle2, Loader2, Lock, Eye, EyeOff } from "lucide-react";
import { collection, addDoc, serverTimestamp, doc, updateDoc } from "firebase/firestore";
import { db } from "@/lib/firebase/config";

interface CreateShipperModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function CreateShipperModal({ isOpen, onClose }: CreateShipperModalProps) {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    phone: "",
    type: 1 as 1 | 2 | 3,
  });
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.name) return;

    setLoading(true);
    try {
      // Create the shipper document in Firestore
      const docRef = await addDoc(collection(db, "users"), {
        ...formData,
        role: "shipper",
        status: "free",
        bonus: 0,
        currentOrder: null,
        locked: false,
        timestamp: serverTimestamp(),
      });

      // Update with the generated UID
      await updateDoc(doc(db, "users", docRef.id), {
        uid: docRef.id
      });

      setSuccess(true);
      setTimeout(() => {
        setSuccess(false);
        setFormData({ name: "", email: "", password: "", phone: "", type: 1 });
        onClose();
      }, 2000);
    } catch (error) {
      console.error("Error creating shipper:", error);
      alert("Failed to create shipper account.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="absolute inset-0 bg-black/60 backdrop-blur-sm"
          />
          
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 20 }}
            className="relative w-full max-w-lg bg-white dark:bg-[#0A0A0A] rounded-3xl shadow-2xl overflow-hidden border border-gray-100 dark:border-white/5"
          >
            {/* Header */}
            <div className="px-8 py-6 border-b border-gray-100 dark:border-white/5 flex items-center justify-between bg-gray-50/50 dark:bg-white/5">
              <div className="flex items-center gap-4">
                <div className="h-12 w-12 bg-primary/10 rounded-2xl flex items-center justify-center text-primary">
                  <UserPlus className="h-6 w-6" />
                </div>
                <div>
                  <h3 className="text-xl font-bold text-gray-900 dark:text-white">Create Shipper</h3>
                  <p className="text-xs text-gray-500 font-medium">Register a new fleet agent</p>
                </div>
              </div>
              <button 
                onClick={onClose}
                className="p-2 hover:bg-gray-100 dark:hover:bg-white/10 rounded-xl transition-colors"
              >
                <X className="h-5 w-5 text-gray-400" />
              </button>
            </div>

            {/* Form */}
            <form onSubmit={handleSubmit} className="p-8 space-y-6">
              {success ? (
                <motion.div 
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  className="py-12 flex flex-col items-center justify-center text-center space-y-4"
                >
                  <div className="h-20 w-20 bg-green-500/10 rounded-full flex items-center justify-center text-green-500">
                    <CheckCircle2 className="h-10 w-10" />
                  </div>
                  <div>
                    <h4 className="text-lg font-bold text-gray-900 dark:text-white">Account Created!</h4>
                    <p className="text-sm text-gray-500">The new shipper has been added to the fleet.</p>
                  </div>
                </motion.div>
              ) : (
                <>
                  <div className="space-y-4">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <label className="text-[11px] font-bold text-gray-400 uppercase tracking-wider ml-1">Full Name</label>
                        <div className="relative group">
                          <User className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400 group-focus-within:text-primary transition-colors" />
                          <input
                            required
                            type="text"
                            placeholder="John Doe"
                            value={formData.name}
                            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                            className="w-full h-12 bg-gray-50 dark:bg-black border border-gray-100 dark:border-white/5 rounded-2xl pl-12 pr-4 text-sm font-semibold focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none transition-all placeholder:text-gray-400"
                          />
                        </div>
                      </div>

                      <div className="space-y-2">
                        <label className="text-[11px] font-bold text-gray-400 uppercase tracking-wider ml-1">Agent Type</label>
                        <div className="relative group">
                          <Shield className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400 group-focus-within:text-primary transition-colors" />
                          <select
                            value={formData.type}
                            onChange={(e) => setFormData({ ...formData, type: parseInt(e.target.value) as 1 | 2 | 3 })}
                            className="w-full h-12 bg-gray-50 dark:bg-black border border-gray-100 dark:border-white/5 rounded-2xl pl-12 pr-4 text-sm font-semibold focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none transition-all appearance-none cursor-pointer"
                          >
                            <option value={1}>Type 1</option>
                            <option value={2}>Type 2</option>
                            <option value={3}>Type 3</option>
                          </select>
                        </div>
                      </div>
                    </div>

                    <div className="space-y-2">
                      <label className="text-[11px] font-bold text-gray-400 uppercase tracking-wider ml-1">Email Address</label>
                      <div className="relative group">
                        <Mail className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400 group-focus-within:text-primary transition-colors" />
                        <input
                          type="email"
                          placeholder="shipper@inviso.com"
                          value={formData.email}
                          onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                          className="w-full h-12 bg-gray-50 dark:bg-black border border-gray-100 dark:border-white/5 rounded-2xl pl-12 pr-4 text-sm font-semibold focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none transition-all placeholder:text-gray-400"
                        />
                      </div>
                    </div>

                    <div className="space-y-2">
                      <label className="text-[11px] font-bold text-gray-400 uppercase tracking-wider ml-1">Account Password</label>
                      <div className="relative group">
                        <Lock className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400 group-focus-within:text-primary transition-colors" />
                        <input
                          required
                          type={showPassword ? "text" : "password"}
                          placeholder="••••••••"
                          value={formData.password}
                          onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                          className="w-full h-12 bg-gray-50 dark:bg-black border border-gray-100 dark:border-white/5 rounded-2xl pl-12 pr-12 text-sm font-semibold focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none transition-all placeholder:text-gray-400"
                        />
                        <button
                          type="button"
                          onClick={() => setShowPassword(!showPassword)}
                          className="absolute right-4 top-1/2 -translate-y-1/2 p-1 hover:bg-gray-100 dark:hover:bg-white/10 rounded-lg transition-colors"
                        >
                          {showPassword ? <EyeOff className="h-4 w-4 text-gray-400" /> : <Eye className="h-4 w-4 text-gray-400" />}
                        </button>
                      </div>
                    </div>

                    <div className="space-y-2">
                      <label className="text-[11px] font-bold text-gray-400 uppercase tracking-wider ml-1">Phone Number</label>
                      <div className="relative group">
                        <Smartphone className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400 group-focus-within:text-primary transition-colors" />
                        <input
                          type="tel"
                          placeholder="+84 123 456 789"
                          value={formData.phone}
                          onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                          className="w-full h-12 bg-gray-50 dark:bg-black border border-gray-100 dark:border-white/5 rounded-2xl pl-12 pr-4 text-sm font-semibold focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none transition-all placeholder:text-gray-400"
                        />
                      </div>
                    </div>
                  </div>

                  <div className="pt-4 flex gap-3">
                    <button
                      type="button"
                      onClick={onClose}
                      className="flex-1 h-12 rounded-2xl text-sm font-bold text-gray-500 hover:bg-gray-100 dark:hover:bg-white/5 transition-all outline-none"
                    >
                      Cancel
                    </button>
                    <button
                      disabled={loading || !formData.name || !formData.password}
                      type="submit"
                      className="flex-[2] h-12 bg-primary hover:bg-primary-dark disabled:opacity-50 text-white rounded-2xl text-sm font-bold shadow-lg shadow-primary/20 transition-all outline-none flex items-center justify-center gap-3"
                    >
                      {loading ? (
                        <Loader2 className="h-5 w-5 animate-spin" />
                      ) : (
                        <>
                          <UserPlus className="h-5 w-5" />
                          <span>Create Account</span>
                        </>
                      )}
                    </button>
                  </div>
                </>
              )}
            </form>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}

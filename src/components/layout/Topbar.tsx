"use client";

import { useAuth } from "@/context/AuthContext";
import { useSidebar } from "@/context/SidebarContext";
import { UserCircle, Menu, ChevronDown, User as UserIcon, Settings, LogOut } from "lucide-react";
import { useState, useRef, useEffect } from "react";
import Link from "next/link";
import clsx from "clsx";
import { motion, AnimatePresence } from "framer-motion";

export default function Topbar() {
  const { user, logout } = useAuth();
  const { toggle } = useSidebar();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);

  // Close menu when clicking outside
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        setIsMenuOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  return (
    <header className="flex h-20 items-center justify-between px-8 bg-white/80 dark:bg-black/80 backdrop-blur-md border-b border-gray-100 dark:border-white/5 relative z-30 shadow-sm">
      <div className="flex items-center gap-4">
        <div className="flex md:hidden">
          <button
            onClick={toggle}
            className="text-gray-400 hover:text-gray-600 focus:outline-none transition-colors"
          >
            <span className="sr-only">Open sidebar</span>
            <Menu className="h-6 w-6" />
          </button>
        </div>
        
        <div className="hidden md:block">
            <h2 className="text-sm font-bold text-gray-900 uppercase tracking-wider">Admin Console</h2>
            <div className="flex items-center gap-1.5 mt-0.5">
                <span className="h-1.5 w-1.5 rounded-full bg-primary"></span>
                <p className="text-[10px] text-gray-400 font-medium uppercase tracking-tight">System Node: Active</p>
            </div>
        </div>
      </div>

      <div className="ml-auto flex items-center gap-4">
        <div className="relative" ref={menuRef}>
            <button 
                onClick={() => setIsMenuOpen(!isMenuOpen)}
                className="flex items-center gap-3 focus:outline-none group px-3 py-1.5 rounded-lg hover:bg-gray-50 transition-colors"
            >
                <div className="text-right hidden sm:block">
                    <p className="text-xs font-bold text-gray-900 group-hover:text-black transition-colors uppercase tracking-tight">{user?.name || "Admin User"}</p>
                    <p className="text-[10px] text-gray-400 font-medium uppercase tracking-widest">{user?.role || "Administrator"}</p>
                </div>
                <div className="h-8 w-8 rounded-lg bg-gray-100 flex items-center justify-center text-gray-600 group-hover:bg-gray-200 transition-colors shadow-sm">
                    <UserIcon className="h-4 w-4" />
                </div>
                <ChevronDown className={`h-3 w-3 text-gray-400 transition-transform duration-200 ${isMenuOpen ? 'rotate-180' : ''}`} />
            </button>

            {/* Dropdown Menu */}
            <AnimatePresence>
            {isMenuOpen && (
                <motion.div 
                    initial={{ opacity: 0, y: 10, scale: 0.95 }}
                    animate={{ opacity: 1, y: 0, scale: 1 }}
                    exit={{ opacity: 0, y: 10, scale: 0.95 }}
                    transition={{ duration: 0.2, ease: "easeOut" }}
                    className="absolute right-0 mt-3 w-60 origin-top-right bg-white dark:bg-black border border-gray-100 dark:border-white/10 rounded-2xl shadow-2xl overflow-hidden z-50"
                >
                    <div className="p-1.5">
                        <div className="px-3 py-3 border-b border-gray-100 mb-1.5">
                            <p className="text-[9px] text-gray-400 uppercase tracking-widest font-bold mb-0.5">Session Account</p>
                            <p className="text-xs font-medium text-gray-900 truncate">{user?.email}</p>
                        </div>
                        
                        <Link href="/profile" className="flex items-center px-3 py-2 text-xs font-medium text-gray-600 rounded-lg hover:bg-gray-50 hover:text-black transition-all" onClick={() => setIsMenuOpen(false)}>
                            <UserIcon className="mr-2.5 h-4 w-4 opacity-70" />
                            Account Profile
                        </Link>
                        
                        <Link href="/settings" className="flex items-center px-3 py-2 text-xs font-medium text-gray-600 rounded-lg hover:bg-gray-50 hover:text-black transition-all" onClick={() => setIsMenuOpen(false)}>
                            <Settings className="mr-2.5 h-4 w-4 opacity-70" />
                            System Settings
                        </Link>
                        
                        <div className="border-t border-gray-100 my-1.5"></div>
                        
                        <button
                            onClick={() => {
                                setIsMenuOpen(false);
                                logout();
                            }}
                            className="flex w-full items-center px-3 py-2 text-xs font-bold text-red-500 rounded-lg hover:bg-red-50 transition-all font-inter"
                        >
                            <LogOut className="mr-2.5 h-4 w-4" />
                            End Session
                        </button>
                    </div>
                </motion.div>
            )}
            </AnimatePresence>
        </div>
      </div>
    </header>
  );
}

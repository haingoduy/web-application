"use client";

import { useState, useEffect } from "react";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { 
  LayoutDashboard, Package, Truck, QrCode, LogOut, X, 
  Box, ClipboardList, LineChart, Settings 
} from "lucide-react";
import clsx from "clsx";
import { motion, AnimatePresence } from "framer-motion";
import { useAuth } from "@/context/AuthContext";
import { useSidebar } from "@/context/SidebarContext";
import GlobalSearch from "@/components/search/GlobalSearch";

const sections = [
  {
    title: "Main",
    items: [
      { name: "Dashboard", href: "/", icon: LayoutDashboard },
      { name: "Monitoring", href: "/qr-scanner", icon: QrCode },
    ]
  },
  {
    title: "Logistics",
    items: [
      { name: "Order Matrix", href: "/orders", icon: Package },
      { name: "Fleet Units", href: "/shippers", icon: Truck },
      { name: "Warehouse", href: "/inventory", icon: Box },
    ]
  },
  {
    title: "Intelligence",
    items: [
      { name: "Audit Logs", href: "/logs", icon: ClipboardList },
      { name: "Performance", href: "/analytics", icon: LineChart },
      { name: "Settings", href: "/settings", icon: Settings },
    ]
  }
];

export default function Sidebar() {
  const pathname = usePathname();
  const { logout } = useAuth();
  const { isOpen, close } = useSidebar();
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const checkMobile = () => setIsMobile(window.innerWidth < 768);
    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  return (
    <>
      <AnimatePresence>
        {isMobile && isOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-40 bg-black/30 backdrop-blur-[2px] md:hidden"
            onClick={close}
            aria-hidden="true"
          />
        )}
      </AnimatePresence>

      <motion.div
        initial={false}
        animate={{ 
          x: isMobile ? (isOpen ? 0 : "-100%") : 0 
        }}
        transition={{ type: "spring", damping: 25, stiffness: 200 }}
        className={clsx(
          "fixed inset-y-0 left-0 z-50 flex w-64 flex-col bg-white border-r md:static md:translate-x-0"
        )}
      >
        <div className="flex h-full flex-col">
          <div className="flex h-20 items-center gap-3 px-6">
            <div className="h-9 w-9 bg-primary rounded-xl flex items-center justify-center shadow-lg shadow-primary/20">
              <span className="text-white font-black text-xl italic">I</span>
            </div>
            <h1 className="text-lg font-bold tracking-tight text-gray-900 uppercase">
              INVISO
            </h1>
            <button onClick={close} className="md:hidden ml-auto text-gray-400 hover:text-black transition-colors">
              <X className="h-5 w-5" />
            </button>
          </div>

          <div className="px-4 py-2 border-b border-gray-100">
             <GlobalSearch variant="sidebar" placeholder="Quick search..." />
          </div>

          <div className="flex-1 overflow-y-auto px-4 py-4">
            {sections.map((section, sIdx) => (
              <div key={section.title} className={clsx("mb-6", sIdx === 0 && "mt-0")}>
                <h3 className="px-3 text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-3">
                  {section.title}
                </h3>
                <nav className="space-y-1">
                  {section.items.map((item) => {
                    const isActive = pathname === item.href;
                    return (
                      <Link
                        key={item.href}
                        href={item.href}
                        onClick={close}
                        className={clsx(
                          "flex items-center rounded-xl px-3 py-2.5 text-xs font-bold transition-all duration-300 uppercase tracking-tighter group",
                          isActive
                            ? "bg-primary text-white shadow-lg shadow-primary/20"
                            : "text-gray-500 hover:bg-green-50 hover:text-primary"
                        )}
                      >
                        <item.icon
                          className={clsx(
                            "mr-3 h-4 w-4 transition-colors",
                            isActive ? "text-white" : "text-gray-400 group-hover:text-gray-900"
                          )}
                        />
                        {item.name}
                      </Link>
                    );
                  })}
                </nav>
              </div>
            ))}
          </div>

          <div className="mt-auto p-4 border-t border-gray-100 space-y-2">
            <button
               onClick={() => {
                close();
                logout();
              }}
              className="flex w-full items-center rounded-lg px-3 py-2 text-sm text-gray-500 hover:bg-red-50 hover:text-red-600 transition-all duration-200"
            >
              <LogOut className="mr-3 h-4 w-4" />
              Sign Out
            </button>
          </div>
        </div>
      </motion.div>
    </>
  );
}

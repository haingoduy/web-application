import Link from "next/link";
import { Plus, QrCode, Shield, Activity, Settings, Zap } from "lucide-react";
import { logActivity } from "@/lib/utils/logging";
import { useAuth } from "@/context/AuthContext";

export default function QuickActions() {
  const { user } = useAuth();
  
  const handleActionClick = async (actionName: string) => {
    if (user) {
        await logActivity(user.uid, user.email || "system", "admin", "DASHBOARD_ACTION", `Triggered: ${actionName}`);
    }
  };

  const actions = [
    { name: "Deploy Order", icon: Plus, href: "/orders", color: "text-primary bg-green-50 dark:bg-primary/20" },
    { name: "Node Monitor", icon: QrCode, href: "/qr-scanner", color: "text-blue-600 bg-blue-50 dark:bg-blue-900/20" },
    { name: "System Audit", icon: Activity, href: "/logs", color: "text-emerald-600 bg-emerald-50 dark:bg-emerald-950/20" },
    { name: "Security Run", icon: Shield, href: "/settings", color: "text-rose-600 bg-rose-50 dark:bg-rose-950/20" },
  ];

  return (
    <div className="minimal-card p-6 h-full flex flex-col">
      <div className="flex items-center justify-between mb-6">
        <h3 className="text-xs font-bold text-gray-400 dark:text-gray-500 uppercase tracking-wider flex items-center gap-2">
            <Zap className="h-3.5 w-3.5" />
            Command Center
        </h3>
        <button className="p-1 rounded-md hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors">
            <Settings className="h-3 w-3 text-gray-400" />
        </button>
      </div>

      <div className="grid grid-cols-2 gap-4 flex-1">
        {actions.map((action) => (
          <Link
            key={action.name}
            href={action.href}
            onClick={() => handleActionClick(action.name)}
            className="group flex flex-col items-start p-4 rounded-xl border border-gray-100 dark:border-white/5 hover:border-primary/20 hover:bg-white dark:hover:bg-gray-900 transition-all shadow-sm hover:shadow-md"
          >
            <div className={`p-2 rounded-lg ${action.color} group-hover:scale-110 transition-transform mb-3 shadow-[0_2px_4px_rgba(0,0,0,0.05)]`}>
                <action.icon className="h-4 w-4" />
            </div>
            <span className="text-[10px] font-bold text-gray-500 dark:text-gray-400 uppercase tracking-tight group-hover:text-primary transition-colors">
                {action.name}
            </span>
            <div className="h-0.5 w-0 bg-primary group-hover:w-full transition-all mt-2 rounded-full" />
          </Link>
        ))}
      </div>
    </div>
  );
}

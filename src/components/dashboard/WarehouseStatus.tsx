"use client";

import { motion } from "framer-motion";
import { Map, Server, Database } from "lucide-react";

interface WarehouseStatusProps {
  data: { name: string; value: number }[];
}

export default function WarehouseStatus({ data }: WarehouseStatusProps) {
  // Sort by value to show busiest nodes first
  const sortedData = [...data].sort((a, b) => b.value - a.value);
  const maxValue = Math.max(...sortedData.map(d => d.value), 1);

  return (
    <div className="minimal-card p-6 h-full flex flex-col">
      <div className="flex items-center justify-between mb-6">
        <h3 className="text-xs font-bold text-gray-400 dark:text-gray-500 uppercase tracking-wider flex items-center gap-2">
            <Server className="h-3.5 w-3.5" />
            Logistics Nodes
        </h3>
        <span className="text-[9px] font-bold text-gray-400 uppercase tracking-tight">Cap: 85% Avg</span>
      </div>

      <div className="space-y-5 flex-1 overflow-y-auto pr-2 custom-scrollbar">
        {sortedData.map((node, idx) => {
            const percentage = Math.round((node.value / (maxValue * 1.2)) * 100);
            return (
                <motion.div
                    key={node.name}
                    initial={{ opacity: 0, scale: 0.98 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ delay: idx * 0.05 }}
                    className="space-y-2"
                >
                    <div className="flex items-center justify-between text-[11px] font-bold">
                        <span className="text-gray-900 dark:text-white flex items-center gap-1.5 uppercase tracking-tight">
                            <Database className="h-3 w-3 text-primary" />
                            {node.name}
                        </span>
                        <span className="text-gray-500 tabular-nums">{percentage}% <span className="text-[9px] font-medium">LOAD</span></span>
                    </div>
                    <div className="h-1.5 w-full bg-gray-100 dark:bg-gray-800 rounded-full overflow-hidden">
                        <motion.div 
                            initial={{ width: 0 }}
                            animate={{ width: `${percentage}%` }}
                            transition={{ duration: 1, ease: "easeOut", delay: idx * 0.1 }}
                            className="h-full bg-primary rounded-full"
                        />
                    </div>
                </motion.div>
            );
        })}
        
        {sortedData.length === 0 && (
            <div className="h-full flex flex-col items-center justify-center text-center opacity-40 py-4">
                <Map className="h-8 w-8 text-gray-400 mb-2" />
                <p className="text-[10px] font-bold uppercase tracking-wider">No active nodes</p>
            </div>
        )}
      </div>
    </div>
  );
}

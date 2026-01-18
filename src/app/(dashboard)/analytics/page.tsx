"use client";

import { motion } from "framer-motion";
import { 
  LineChart, 
  Line, 
  BarChart, 
  Bar, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer, 
  AreaChart, 
  Area 
} from "recharts";
import { 
  Zap, 
  TrendingUp, 
  Clock, 
  CheckCircle2, 
  ArrowUpRight, 
  ArrowDownRight,
  Filter,
  Calendar
} from "lucide-react";
import { useState } from "react";
import clsx from "clsx";

// Mock Analytical Data for V2 Interface Demonstration
const throughputData = [
  { time: "08:00", volume: 45, efficiency: 92 },
  { time: "10:00", volume: 52, efficiency: 88 },
  { time: "12:00", volume: 48, efficiency: 94 },
  { time: "14:00", volume: 61, efficiency: 91 },
  { time: "16:00", volume: 55, efficiency: 95 },
  { time: "18:00", volume: 67, efficiency: 89 },
  { time: "20:00", volume: 42, efficiency: 93 },
];

const nodePerformance = [
  { name: "Node-Alpha", value: 850 },
  { name: "Node-Beta", value: 720 },
  { name: "Node-Gamma", value: 910 },
  { name: "Node-Delta", value: 640 },
];

export default function AnalyticsPage() {
  const [timeRange, setTimeRange] = useState("24H");

  return (
    <motion.div 
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="space-y-10 pb-16"
    >
      {/* Header Section */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
        <div className="flex items-center gap-4">
          <div className="h-12 w-12 bg-primary rounded-xl flex items-center justify-center text-white shadow-sm shrink-0">
            <TrendingUp className="h-6 w-6" />
          </div>
          <div>
            <h1 className="text-3xl font-bold text-gray-900 dark:text-white tracking-tight">
              Performance <span className="text-primary font-medium">Intelligence</span>
            </h1>
            <p className="text-[11px] text-gray-400 font-medium uppercase tracking-wider mt-1">
              Engine: <span className="text-primary font-bold">NEURAL-FLUX-V2</span>
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2 bg-white dark:bg-black p-1.5 rounded-xl border border-gray-100 dark:border-white/10 shadow-sm">
            {["24H", "7D", "30D", "MAX"].map((range) => (
              <button
                key={range}
                onClick={() => setTimeRange(range)}
                className={clsx(
                  "px-4 py-1.5 rounded-lg text-[10px] font-black tracking-widest transition-all",
                  timeRange === range 
                    ? "bg-primary text-white shadow-md scale-105" 
                    : "text-gray-400 hover:text-gray-600 dark:hover:text-gray-200"
                )}
              >
                {range}
              </button>
            ))}
        </div>
      </div>

      {/* Analytics Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* KPI Cards */}
        <div className="minimal-card p-5 border-l-4 border-l-primary shadow-lg hover:shadow-xl">
            <div className="flex items-start justify-between mb-2">
                <div className="p-2 bg-green-50 dark:bg-primary/20 rounded-lg text-primary">
                    <Zap className="h-4 w-4" />
                </div>
                <span className="flex items-center gap-1 text-[10px] font-bold text-emerald-500">
                    <ArrowUpRight className="h-3 w-3" /> +12.5%
                </span>
            </div>
            <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-1">Global Throughput</p>
            <h3 className="text-2xl font-black text-gray-900 dark:text-white tracking-tighter tabular-nums">4.2K <span className="text-xs font-medium text-gray-400">UNITS/HR</span></h3>
        </div>

        <div className="minimal-card p-5 border-l-4 border-l-green-400">
            <div className="flex items-start justify-between mb-2">
                <div className="p-2 bg-blue-50 dark:bg-blue-950/30 rounded-lg text-blue-500">
                    <Clock className="h-4 w-4" />
                </div>
                <span className="flex items-center gap-1 text-[10px] font-bold text-emerald-500">
                    <ArrowUpRight className="h-3 w-3" /> -2.4m
                </span>
            </div>
            <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-1">Avg Lead Time</p>
            <h3 className="text-2xl font-black text-gray-900 dark:text-white tracking-tighter tabular-nums">18.4 <span className="text-xs font-medium text-gray-400">MINUTES</span></h3>
        </div>

        <div className="minimal-card p-5 border-l-4 border-l-emerald-500">
            <div className="flex items-start justify-between mb-2">
                <div className="p-2 bg-emerald-50 dark:bg-emerald-950/30 rounded-lg text-emerald-500">
                    <CheckCircle2 className="h-4 w-4" />
                </div>
                <span className="flex items-center gap-1 text-[10px] font-bold text-amber-500">
                    <ArrowDownRight className="h-3 w-3" /> -0.2%
                </span>
            </div>
            <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-1">Fulfillment Rate</p>
            <h3 className="text-2xl font-black text-gray-900 dark:text-white tracking-tighter tabular-nums">98.2 <span className="text-xs font-medium text-gray-400">PERCENT</span></h3>
        </div>

        {/* Primary Chart Area */}
        <div className="md:col-span-2 minimal-card p-6 h-[400px]">
            <div className="flex items-center justify-between mb-8">
                <div>
                    <h3 className="text-sm font-bold text-gray-900 dark:text-white tracking-tight uppercase">Strategic Flow Analysis</h3>
                    <p className="text-[10px] text-gray-400 font-medium">Real-time volume vs operational efficiency</p>
                </div>
                <div className="flex items-center gap-4">
                    <div className="flex items-center gap-1.5">
                        <div className="h-2 w-2 rounded-full bg-primary" />
                        <span className="text-[9px] font-bold text-gray-500 uppercase">Volume</span>
                    </div>
                    <div className="flex items-center gap-1.5">
                        <div className="h-2 w-2 rounded-full bg-green-300 dark:bg-green-900" />
                        <span className="text-[9px] font-bold text-gray-500 uppercase">Efficiency</span>
                    </div>
                </div>
            </div>
            
            <div className="h-[280px] w-full">
                <ResponsiveContainer width="100%" height="100%">
                    <AreaChart data={throughputData}>
                        <defs>
                            <linearGradient id="colorVolume" x1="0" y1="0" x2="0" y2="1">
                                <stop offset="5%" stopColor="#4CAF50" stopOpacity={0.3}/>
                                <stop offset="95%" stopColor="#4CAF50" stopOpacity={0}/>
                            </linearGradient>
                        </defs>
                        <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f0f0f0" opacity={0.1} />
                        <XAxis 
                            dataKey="time" 
                            axisLine={false} 
                            tickLine={false} 
                            tick={{ fontSize: 9, fontWeight: 700, fill: '#9ca3af' }}
                            dy={10}
                        />
                        <YAxis 
                            axisLine={false} 
                            tickLine={false} 
                            tick={{ fontSize: 9, fontWeight: 700, fill: '#9ca3af' }}
                        />
                        <Tooltip 
                            contentStyle={{ 
                                backgroundColor: 'var(--color-card-bg)', 
                                borderColor: 'var(--color-card-border)',
                                borderRadius: '12px',
                                fontSize: '10px',
                                fontWeight: 800,
                                boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)'
                            }}
                        />
                        <Area 
                            type="monotone" 
                            dataKey="volume" 
                            stroke="#4CAF50" 
                            strokeWidth={3} 
                            fillOpacity={1} 
                            fill="url(#colorVolume)" 
                        />
                        <Area 
                            type="monotone" 
                            dataKey="efficiency" 
                            stroke="#81C784" 
                            strokeWidth={2} 
                            strokeDasharray="5 5" 
                            fill="transparent" 
                        />
                    </AreaChart>
                </ResponsiveContainer>
            </div>
        </div>

        {/* Node Performance Section */}
        <div className="minimal-card p-6 h-[400px]">
            <h3 className="text-sm font-bold text-gray-900 dark:text-white tracking-tight uppercase mb-8">Node Distribution</h3>
            <div className="h-[280px] w-full">
                <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={nodePerformance} layout="vertical">
                        <CartesianGrid strokeDasharray="3 3" horizontal={false} stroke="#f0f0f0" opacity={0.1} />
                        <XAxis type="number" hide />
                        <YAxis 
                            dataKey="name" 
                            type="category" 
                            axisLine={false} 
                            tickLine={false}
                            tick={{ fontSize: 9, fontWeight: 700, fill: '#9ca3af' }}
                            width={70}
                        />
                        <Tooltip 
                            cursor={{ fill: 'transparent' }}
                            contentStyle={{ 
                                backgroundColor: 'black', 
                                border: 'none',
                                borderRadius: '8px',
                                color: 'white',
                                fontSize: '10px'
                            }}
                        />
                        <Bar 
                            dataKey="value" 
                            fill="#4CAF50" 
                            radius={[0, 4, 4, 0]} 
                            barSize={16}
                        />
                    </BarChart>
                </ResponsiveContainer>
            </div>
            
            <div className="mt-4 pt-4 border-t border-gray-100 dark:border-white/10 flex items-center justify-between">
                <span className="text-[9px] font-bold text-gray-400 uppercase tracking-widest">Active Nodes: 04</span>
                <span className="text-[9px] font-black text-primary uppercase hover:underline cursor-pointer">Optimize Network</span>
            </div>
        </div>
      </div>
    </motion.div>
  );
}

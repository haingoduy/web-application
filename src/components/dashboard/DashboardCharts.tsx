"use client";

import { DashboardStats } from "@/hooks/useDashboardData";
import { motion } from "framer-motion";
import {
  PieChart,
  Pie,
  Cell,
  Tooltip,
  Legend,
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
} from "recharts";

interface DashboardChartsProps {
  stats: DashboardStats;
}

const container = {
  hidden: { opacity: 0 },
  show: {
    opacity: 1,
    transition: {
      staggerChildren: 0.2,
      delayChildren: 0.4
    },
  },
};

const item: any = {
  hidden: { y: 30, opacity: 0 },
  show: { y: 0, opacity: 1, transition: { duration: 0.5, ease: "easeOut" } },
};

export default function DashboardCharts({ stats }: DashboardChartsProps) {
  const shipperData = [
    { name: "Free", value: stats.freeShippers, color: "#10b981" },
    { name: "Busy", value: stats.busyShippers, color: "#f59e0b" },
  ];

  return (
    <motion.div 
      variants={container}
      initial="hidden"
      animate="show"
      className="grid grid-cols-1 gap-8 lg:grid-cols-2"
    >
      {/* Order Status - Pie Chart */}
      <motion.div variants={item} className="minimal-card p-6">
        <h3 className="text-xs font-bold text-gray-400 dark:text-gray-500 mb-6 uppercase tracking-wider">
          Order Distribution
        </h3>
        <div className="h-72 w-full">
          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <Pie
                data={stats.ordersByStatus}
                cx="50%"
                cy="50%"
                innerRadius={60}
                outerRadius={90}
                paddingAngle={4}
                dataKey="value"
                stroke="none"
              >
                {stats.ordersByStatus.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={entry.color} />
                ))}
              </Pie>
              <Tooltip 
                contentStyle={{ 
                    backgroundColor: '#fff', 
                    borderRadius: '8px', 
                    border: '1px solid #e2e8f0', 
                    boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.05)',
                    fontSize: '12px',
                    fontWeight: '600'
                }} 
              />
              <Legend verticalAlign="bottom" height={36} iconType="circle" wrapperStyle={{ fontSize: '11px', fontWeight: '600', textTransform: 'uppercase', letterSpacing: '0.05em', color: '#171717' }} />
            </PieChart>
          </ResponsiveContainer>
        </div>
      </motion.div>

      {/* Shipper Availability - Bar Chart */}
      <motion.div variants={item} className="minimal-card p-6">
        <h3 className="text-xs font-bold text-gray-400 dark:text-gray-500 mb-6 uppercase tracking-wider">
          Shipper Availability
        </h3>
        <div className="h-72 w-full">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={shipperData} layout="vertical" margin={{ left: -20, right: 20 }}>
              <CartesianGrid strokeDasharray="3 3" horizontal={false} stroke="#f1f5f9" />
              <XAxis type="number" hide />
              <YAxis 
                dataKey="name" 
                type="category" 
                axisLine={false} 
                tickLine={false}
                tick={{ fontWeight: 600, fill: '#64748b', fontSize: '11px' }}
              />
              <Tooltip 
                cursor={{ fill: 'transparent' }}
                contentStyle={{ 
                    backgroundColor: '#fff', 
                    borderRadius: '12px', 
                    border: '1px solid #e2e8f0',
                    fontSize: '11px',
                    fontWeight: '700',
                    boxShadow: '0 10px 15px -3px rgba(0, 0, 0, 0.1)',
                    textTransform: 'uppercase',
                    letterSpacing: '0.05em'
                }}
              />
              <Bar dataKey="value" name="Shippers" fill="#4CAF50" radius={[0, 6, 6, 0]} barSize={32}>
                 {shipperData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                 ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </div>
      </motion.div>
      
       {/* Warehouse Distribution - Bar Chart */}
       {stats.ordersByWarehouse.length > 0 && (
         <motion.div variants={item} className="minimal-card p-6 lg:col-span-2">
          <h3 className="text-xs font-bold text-gray-400 dark:text-gray-500 mb-6 uppercase tracking-wider">
             Logistics Performance by Warehouse
          </h3>
          <div className="h-72 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={stats.ordersByWarehouse}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                <XAxis 
                    dataKey="name" 
                    axisLine={false} 
                    tickLine={false} 
                    tick={{ fontWeight: 600, fill: '#64748b', fontSize: '10px' }}
                />
                <YAxis 
                    allowDecimals={false} 
                    axisLine={false} 
                    tickLine={false}
                    tick={{ fontWeight: 600, fill: '#64748b', fontSize: '10px' }}
                />
                <Tooltip 
                    cursor={{ fill: '#f1f5f9', opacity: 0.4 }}
                    contentStyle={{ 
                        borderRadius: '12px', 
                        border: '1px solid #e2e8f0',
                        backgroundColor: '#fff',
                        fontSize: '11px',
                        fontWeight: '700',
                        boxShadow: '0 10px 15px -3px rgba(0, 0, 0, 0.1)',
                        textTransform: 'uppercase'
                    }}
                />
                <Bar dataKey="value" fill="#4CAF50" name="Orders" radius={[6, 6, 0, 0]} barSize={48} />
              </BarChart>
            </ResponsiveContainer>
          </div>
         </motion.div>
       )}
    </motion.div>
  );
}

import React from 'react';
import { ArrowUpRight, ArrowDownRight, Users, Activity, DollarSign } from 'lucide-react';

const icons = {
  users: Users,
  activity: Activity,
  dollar: DollarSign,
};

export default function DashboardCard({ title, value, iconName, trend, trendValue, color = "blue" }) {
  const Icon = icons[iconName] || Activity;
  
  const colorClasses = {
    blue: "bg-blue-50 text-blue-600",
    green: "bg-green-50 text-green-600",
    purple: "bg-purple-50 text-purple-600",
    orange: "bg-orange-50 text-orange-600",
  };

  const isPositive = trend === 'up';

  return (
    <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100 hover:shadow-md transition-shadow duration-300">
      <div className="flex justify-between items-start mb-4">
        <div className={`p-3 rounded-lg ${colorClasses[color]}`}>
          <Icon size={24} />
        </div>
        {trend && (
          <div className={`flex items-center gap-1 text-sm font-medium ${isPositive ? 'text-green-600' : 'text-red-600'}`}>
            {isPositive ? <ArrowUpRight size={16} /> : <ArrowDownRight size={16} />}
            <span>{trendValue}</span>
          </div>
        )}
      </div>
      
      <div>
        <p className="text-gray-500 text-sm font-medium mb-1">{title}</p>
        <h3 className="text-2xl font-bold text-gray-900">{value}</h3>
      </div>
    </div>
  );
}

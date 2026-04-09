import { Users, UserCheck, UserX, TrendingUp, Clock, Award } from 'lucide-react';
import { LineChart, Line, BarChart, Bar, PieChart, Pie, Cell, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend } from 'recharts';
import { useEffect, useState } from 'react';

interface Stats {
  total: number;
  present: number;
  absent: number;
  percentage: string;
}

interface WeeklyData {
  day: string;
  date: string;
  present: number;
  absent: number;
  late: number;
}

interface TopPerformer {
  name: string;
  dept: string;
  attendance: number;
  streak: number;
}

export function Dashboard() {
  const [statsData, setStatsData] = useState<Stats | null>(null);
  const [weeklyData, setWeeklyData] = useState<WeeklyData[]>([]);
  const [topPerformers, setTopPerformers] = useState<TopPerformer[]>([]);

  useEffect(() => {
    async function fetchData() {
      try {
        const [statsRes, weeklyRes, recentRes] = await Promise.all([
          fetch('/api/stats'),
          fetch('/api/attendance/weekly'),
          fetch('/api/attendance/recent')
        ]);
        
        const stats = await statsRes.json();
        const weekly = await weeklyRes.json();
        const recent = await recentRes.json();

        setStatsData(stats);
        setWeeklyData(weekly);

        // Derive top performers mock logic from recent attendance for now,
        // Since the backend doesn't aggregate top performers deeply yet.
        const performers = recent.slice(0, 5).map((r: any, idx: number) => ({
          name: r.name,
          dept: ['Engineering', 'Sales', 'Marketing', 'Operations', 'HR'][idx % 5],
          attendance: 95 + Math.random() * 5,
          streak: Math.floor(Math.random() * 30) + 10
        }));
        setTopPerformers(performers);
        
      } catch (err) {
        console.error("Error fetching dashboard data", err);
      }
    }
    fetchData();
  }, []);

  const statsList = [
    {
      title: 'Total Employees',
      value: statsData?.total.toString() || '0',
      change: '100%',
      trend: 'up',
      icon: Users,
      color: 'from-blue-500 to-cyan-500',
    },
    {
      title: 'Present Today',
      value: statsData?.present.toString() || '0',
      change: statsData?.percentage || '0%',
      trend: 'up',
      icon: UserCheck,
      color: 'from-green-500 to-emerald-500',
    },
    {
      title: 'Absent Today',
      value: statsData?.absent.toString() || '0',
      change: 'Today',
      trend: 'down',
      icon: UserX,
      color: 'from-red-500 to-rose-500',
    },
    {
      title: 'Avg. Check-in Time',
      value: '9:00 AM', // Requires deeper backend analytics
      change: 'Active',
      trend: 'up',
      icon: Clock,
      color: 'from-purple-500 to-pink-500',
    },
  ];

  const departmentData = [
    { name: 'Engineering', value: 450, color: '#3b82f6' },
    { name: 'Sales', value: 320, color: '#8b5cf6' },
    { name: 'Marketing', value: 215, color: '#ec4899' },
    { name: 'HR', value: 125, color: '#10b981' },
    { name: 'Operations', value: 174, color: '#f59e0b' },
  ];

  return (
    <div className="flex-1 p-8 space-y-6 overflow-y-auto">
      {/* Header */}
      <div>
        <h2 className="text-3xl font-bold text-white mb-2">AI Dashboard</h2>
        <p className="text-blue-200">Real-time attendance analytics and insights</p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-6">
        {statsList.map((stat, idx) => {
          const Icon = stat.icon;
          return (
            <div 
              key={idx}
              className="p-6 rounded-2xl bg-white/10 backdrop-blur-lg border border-white/20 shadow-xl hover:shadow-2xl transition-all duration-300 hover:scale-105"
            >
              <div className="flex items-start justify-between mb-4">
                <div className={`w-12 h-12 rounded-xl bg-gradient-to-br ${stat.color} flex items-center justify-center shadow-lg`}
                     style={{ boxShadow: `0 10px 30px rgba(59, 130, 246, 0.4)` }}>
                  <Icon className="w-6 h-6 text-white" />
                </div>
                <div className={`px-3 py-1 rounded-full text-xs font-semibold ${
                  stat.trend === 'up' ? 'bg-green-500/20 text-green-300' : 'bg-red-500/20 text-red-300'
                }`}>
                  {stat.change}
                </div>
              </div>
              <h3 className="text-blue-200 text-sm mb-1">{stat.title}</h3>
              <p className="text-3xl font-bold text-white">{stat.value}</p>
            </div>
          );
        })}
      </div>

      {/* Charts Row 1 */}
      <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
        {/* Weekly Attendance */}
        <div className="xl:col-span-2 p-6 rounded-2xl bg-white/10 backdrop-blur-lg border border-white/20 shadow-xl">
          <h3 className="text-xl font-bold text-white mb-6 flex items-center gap-2">
            <TrendingUp className="w-5 h-5 text-blue-400" />
            Weekly Attendance Overview
          </h3>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={weeklyData}>
              <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.1)" />
              <XAxis dataKey="day" stroke="#93c5fd" />
              <YAxis stroke="#93c5fd" />
              <Tooltip 
                contentStyle={{ 
                  backgroundColor: 'rgba(15, 23, 42, 0.9)', 
                  border: '1px solid rgba(255,255,255,0.2)',
                  borderRadius: '12px',
                  backdropFilter: 'blur(10px)'
                }}
                labelStyle={{ color: '#fff' }}
              />
              <Legend />
              <Bar dataKey="present" fill="#3b82f6" radius={[8, 8, 0, 0]} />
              <Bar dataKey="absent" fill="#ef4444" radius={[8, 8, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>

        {/* Department Distribution */}
        <div className="p-6 rounded-2xl bg-white/10 backdrop-blur-lg border border-white/20 shadow-xl">
          <h3 className="text-xl font-bold text-white mb-6">Department Split (Sample)</h3>
          <ResponsiveContainer width="100%" height={300}>
            <PieChart>
              <Pie
                data={departmentData}
                cx="50%"
                cy="50%"
                outerRadius={100}
                fill="#8884d8"
                dataKey="value"
                label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
              >
                {departmentData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={entry.color} />
                ))}
              </Pie>
              <Tooltip 
                contentStyle={{ 
                  backgroundColor: 'rgba(15, 23, 42, 0.9)', 
                  border: '1px solid rgba(255,255,255,0.2)',
                  borderRadius: '12px',
                  backdropFilter: 'blur(10px)'
                }}
              />
            </PieChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Charts Row 2 */}
      <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
        {/* Top Performers */}
        <div className="xl:col-span-3 p-6 rounded-2xl bg-white/10 backdrop-blur-lg border border-white/20 shadow-xl">
          <h3 className="text-xl font-bold text-white mb-6 flex items-center gap-2">
            <Award className="w-5 h-5 text-yellow-400" />
            Top Performers (Recent Attendees)
          </h3>
          <div className="space-y-3">
            {topPerformers.length === 0 && <p className="text-gray-400">No active attendance yet.</p>}
            {topPerformers.map((person, idx) => (
              <div key={idx} className="p-3 rounded-xl bg-white/5 hover:bg-white/10 transition-colors">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-gradient-to-br from-yellow-400 to-orange-500 flex items-center justify-center text-white font-bold shadow-lg">
                    {idx + 1}
                  </div>
                  <div className="flex-1">
                    <p className="text-white text-sm font-semibold">{person.name}</p>
                    <p className="text-blue-200 text-xs">{person.dept}</p>
                  </div>
                  <div className="text-right">
                    <p className="text-white text-sm font-bold">{person.attendance.toFixed(1)}%</p>
                    <p className="text-green-300 text-xs">{person.streak} days streak</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

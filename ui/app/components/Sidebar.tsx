import { Home, Users, Activity, Settings, Camera, BarChart3, Calendar, UserCheck } from 'lucide-react';

interface SidebarProps {
  activeTab: string;
  onTabChange: (tab: string) => void;
}

export function Sidebar({ activeTab, onTabChange }: SidebarProps) {
  const menuItems = [
    { id: 'dashboard', label: 'Dashboard', icon: Home },
    { id: 'scan', label: 'Face Scan', icon: Camera },
    { id: 'attendance', label: 'Attendance', icon: UserCheck },
    { id: 'analytics', label: 'Analytics', icon: BarChart3 },
    { id: 'employees', label: 'Employees', icon: Users },
    { id: 'calendar', label: 'Calendar', icon: Calendar },
    { id: 'activity', label: 'Activity', icon: Activity },
    { id: 'settings', label: 'Settings', icon: Settings },
  ];

  return (
    <aside className="w-64 h-screen p-4 flex flex-col gap-6">
      {/* Logo */}
      <div className="flex items-center gap-3 px-4 py-2">
        <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center shadow-lg shadow-purple-500/50">
          <Camera className="w-6 h-6 text-white" />
        </div>
        <div>
          <h1 className="font-bold text-lg text-white">FaceTrack AI</h1>
          <p className="text-xs text-blue-200">Attendance System</p>
        </div>
      </div>

      {/* Navigation */}
      <nav className="flex-1 flex flex-col gap-2">
        {menuItems.map((item) => {
          const Icon = item.icon;
          const isActive = activeTab === item.id;
          
          return (
            <button
              key={item.id}
              onClick={() => onTabChange(item.id)}
              className={`
                flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-300
                ${isActive 
                  ? 'bg-white/20 backdrop-blur-lg text-white shadow-lg shadow-blue-500/20 border border-white/30' 
                  : 'text-blue-100 hover:bg-white/10 hover:backdrop-blur-lg hover:text-white'
                }
              `}
            >
              <Icon className={`w-5 h-5 ${isActive ? 'text-blue-300' : ''}`} />
              <span className="font-medium">{item.label}</span>
              {isActive && (
                <div className="ml-auto w-2 h-2 rounded-full bg-blue-400 shadow-lg shadow-blue-400/50 animate-pulse" />
              )}
            </button>
          );
        })}
      </nav>

      {/* User Profile */}
      <div className="p-4 rounded-xl bg-white/10 backdrop-blur-lg border border-white/20">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-full bg-gradient-to-br from-purple-400 to-pink-500 flex items-center justify-center text-white font-bold shadow-lg">
            AD
          </div>
          <div className="flex-1">
            <p className="text-sm font-semibold text-white">Admin User</p>
            <p className="text-xs text-blue-200">admin@facetrack.ai</p>
          </div>
        </div>
      </div>
    </aside>
  );
}

import * as React from "react";
import { Outlet, useLocation, useNavigate } from "react-router";
import { Home, BookOpen, User, PieChart } from "lucide-react";
import { cn } from "../../lib/utils";

export function DeviceContainer({ children, withNav = false }: { children: React.ReactNode, withNav?: boolean }) {
  return (
    <div className="min-h-screen bg-[#e5e5e5] sm:bg-[#2a2a2a] flex items-center justify-center sm:p-4">
      <div className="w-full sm:max-w-[400px] bg-white h-[100dvh] sm:h-[850px] sm:rounded-[40px] shadow-2xl overflow-hidden relative flex flex-col sm:border-[8px] border-gray-900">
        <main className={cn(
          "flex-1 overflow-y-auto overflow-x-hidden relative bg-[#F8F9FA]",
          withNav ? "pb-[80px]" : "pb-0"
        )}>
          {children}
        </main>
        {withNav && <BottomNav />}
      </div>
    </div>
  );
}

export function MobileLayout() {
  return (
    <DeviceContainer withNav>
      <Outlet />
    </DeviceContainer>
  );
}

export function StandaloneLayout() {
  return (
    <DeviceContainer>
      <Outlet />
    </DeviceContainer>
  );
}

function BottomNav() {
  const location = useLocation();
  const navigate = useNavigate();

  const navItems = [
    { icon: Home, label: "Главная", path: "/" },
    { icon: BookOpen, label: "Курсы", path: "/courses" },
    { icon: PieChart, label: "Прогресс", path: "/progress" },
    { icon: User, label: "Профиль", path: "/profile" },
  ];

  return (
    <div className="absolute bottom-0 left-0 right-0 h-[80px] bg-white border-t border-gray-100 flex items-center justify-around px-2 z-50 sm:rounded-b-[32px]">
      {navItems.map((item) => {
        const isCurrent = location.pathname === item.path;
        // Mock alias matching
        const isAlias = (location.pathname === '/' && item.path === '/') || 
                        (location.pathname === '/courses' && item.path === '/courses') ||
                        (location.pathname === '/progress' && item.path === '/progress') ||
                        (location.pathname === '/profile' && item.path === '/profile');

        return (
          <button
            key={item.label}
            onClick={() => navigate(item.path)}
            className={cn(
              "flex flex-col items-center justify-center w-16 h-16 rounded-2xl transition-all duration-300",
              isCurrent ? "text-[#A7738B]" : "text-gray-400 hover:text-gray-600"
            )}
          >
            <div className={cn(
              "p-2 rounded-xl mb-1 transition-all duration-300",
              isCurrent ? "bg-[#A7738B]/10" : ""
            )}>
              <item.icon size={22} strokeWidth={isCurrent ? 2.5 : 2} />
            </div>
            <span className="text-[10px] font-bold tracking-wide">
              {item.label}
            </span>
          </button>
        );
      })}
    </div>
  );
}

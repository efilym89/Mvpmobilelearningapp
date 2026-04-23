import * as React from "react";
import { Outlet, useLocation, useNavigate } from "react-router";
import { BookOpen, House, LayoutDashboard, UserRound } from "lucide-react";
import { cn } from "../../lib/utils";
import { useStore } from "../../store";

export function DeviceContainer({
  children,
  withNav = false,
}: {
  children: React.ReactNode;
  withNav?: boolean;
}) {
  return (
    <div className="flex min-h-screen items-center justify-center bg-[#e5e5e5] sm:bg-[#2a2a2a] sm:p-4">
      <div className="relative flex h-[100dvh] w-full flex-col overflow-hidden bg-white shadow-2xl sm:h-[850px] sm:max-w-[400px] sm:rounded-[40px] sm:border-[8px] sm:border-gray-900">
        <main
          className={cn(
            "relative flex-1 overflow-x-hidden overflow-y-auto bg-[#F8F9FA]",
            withNav ? "pb-[80px]" : "pb-0",
          )}
        >
          {children}
        </main>
        {withNav ? <BottomNav /> : null}
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
  const isAdmin = useStore((state) => state.isAdmin);

  const navItems = [
    { icon: House, label: "Главная", path: "/home" },
    { icon: BookOpen, label: "Каталог", path: "/catalog" },
    { icon: UserRound, label: "Профиль", path: "/profile" },
  ];

  if (isAdmin) {
    navItems.push({ icon: LayoutDashboard, label: "Управление", path: "/dashboard" });
  }

  return (
    <div className="absolute bottom-0 left-0 right-0 z-50 flex h-[80px] items-center justify-around border-t border-gray-100 bg-white px-2 sm:rounded-b-[32px]">
      {navItems.map((item) => {
        const isCurrent = location.pathname === item.path;

        return (
          <button
            key={item.label}
            onClick={() => navigate(item.path)}
            className={cn(
              "flex h-16 w-16 flex-col items-center justify-center rounded-2xl transition-all duration-300",
              isCurrent ? "text-[#A7738B]" : "text-gray-400 hover:text-gray-600",
            )}
          >
            <div
              className={cn(
                "mb-1 rounded-xl p-2 transition-all duration-300",
                isCurrent ? "bg-[#A7738B]/10" : "",
              )}
            >
              <item.icon size={22} strokeWidth={isCurrent ? 2.5 : 2} />
            </div>
            <span className="text-[10px] font-bold tracking-wide">{item.label}</span>
          </button>
        );
      })}
    </div>
  );
}

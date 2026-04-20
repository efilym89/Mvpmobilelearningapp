import { Outlet, NavLink, useLocation } from "react-router"
import { Home, BookOpen, User } from "lucide-react"

export function Layout() {
  const location = useLocation();
  const hideNavOnPages = ["/login", "/test", "/lesson"];
  
  const showNav = !hideNavOnPages.some(path => location.pathname.startsWith(path));

  return (
    <div className="flex min-h-screen flex-col bg-background font-sans mx-auto max-w-md border-x border-border shadow-xl">
      <main className="flex-1 overflow-y-auto pb-20">
        <Outlet />
      </main>

      {showNav && (
        <nav className="fixed bottom-0 w-full max-w-md bg-background border-t border-border pb-safe">
          <div className="flex h-16 items-center justify-around px-4">
            <NavItem to="/" icon={<Home />} label="Главная" />
            <NavItem to="/courses" icon={<BookOpen />} label="Мои курсы" />
            <NavItem to="/profile" icon={<User />} label="Профиль" />
          </div>
        </nav>
      )}
    </div>
  )
}

function NavItem({ to, icon, label }: { to: string; icon: React.ReactNode; label: string }) {
  return (
    <NavLink
      to={to}
      className={({ isActive }) =>
        `flex flex-col items-center justify-center space-y-1 ${
          isActive ? "text-primary" : "text-muted-foreground hover:text-foreground"
        }`
      }
    >
      <div className="h-6 w-6">{icon}</div>
      <span className="text-[10px] font-medium">{label}</span>
    </NavLink>
  )
}

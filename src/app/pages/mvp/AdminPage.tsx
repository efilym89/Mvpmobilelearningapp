import { motion } from "motion/react";
import { BarChart3, BookOpen, LogOut, Users } from "lucide-react";
import { Navigate, useNavigate } from "react-router";
import { Button } from "../../components/ui/Button";
import { Card } from "../../components/ui/Card";
import { api } from "../../lib/api";
import { useAsyncResource } from "../../hooks/useAsyncResource";
import { useStore } from "../../store";
import { cn } from "../../lib/utils";

export default function AdminPage() {
  const navigate = useNavigate();
  const session = useStore((state) => state.session);
  const isAdmin = useStore((state) => state.isAdmin);
  const clearSession = useStore((state) => state.clearSession);
  const accessToken = session?.accessToken ?? "";
  const { data, error, loading } = useAsyncResource(
    () => api.getAdminOverview(accessToken),
    [accessToken],
  );

  if (!isAdmin) {
    return <Navigate to="/courses" replace />;
  }

  return (
    <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} className="pb-8">
      <div className="sticky top-0 z-20 border-b border-gray-100 bg-white px-6 pb-5 pt-12 shadow-sm">
        <div className="flex items-start justify-between gap-4">
          <div>
            <p className="text-xs font-bold uppercase tracking-[0.24em] text-gray-400">
              Admin
            </p>
            <h1 className="mt-2 text-2xl font-extrabold text-gray-900">
              Панель управления
            </h1>
          </div>

          <button
            onClick={() => {
              clearSession();
              navigate("/login", { replace: true });
            }}
            className="flex h-11 w-11 items-center justify-center rounded-full bg-gray-50 text-gray-500 transition-colors hover:text-gray-900"
            title="Выйти"
          >
            <LogOut size={18} />
          </button>
        </div>
      </div>

      <div className="space-y-4 px-6 pt-6">
        {loading ? <InfoCard text="Загружаем admin overview..." /> : null}
        {error ? <InfoCard text={error} tone="error" /> : null}

        {data ? (
          <>
            <div className="grid grid-cols-2 gap-3">
              <StatCard icon={BookOpen} label="Курсы" value={String(data.stats.totalCourses)} />
              <StatCard icon={Users} label="Сотрудники" value={String(data.stats.activeEmployees)} />
              <StatCard icon={BarChart3} label="Попытки" value={String(data.stats.completedAttempts)} />
              <StatCard icon={BarChart3} label="Средний балл" value={`${data.stats.averageScore}%`} />
            </div>

            <section className="space-y-3">
              <div className="flex items-center justify-between">
                <h2 className="text-sm font-extrabold uppercase tracking-wider text-gray-400">
                  Курсы
                </h2>
                <Button variant="ghost" className="h-8 rounded-xl text-[#A7738B]">
                  Управление позже
                </Button>
              </div>

              {data.courses.map((course) => (
                <Card key={course.id} className="rounded-[24px] border-gray-100 p-4 shadow-sm">
                  <div className="flex items-start justify-between gap-4">
                    <div>
                      <h3 className="text-sm font-bold text-gray-900">{course.title}</h3>
                      <p className="mt-1 text-xs text-gray-500">
                        {course.completedLessons}/{course.totalLessons} уроков завершено
                      </p>
                    </div>
                    <span className="rounded-full bg-[#F8F9FA] px-3 py-1 text-[10px] font-bold uppercase tracking-wider text-gray-500">
                      {course.progress}%
                    </span>
                  </div>
                </Card>
              ))}
            </section>

            <section className="space-y-3">
              <h2 className="text-sm font-extrabold uppercase tracking-wider text-gray-400">
                Сотрудники
              </h2>

              {data.employees.map((employee) => (
                <Card key={employee.id} className="rounded-[24px] border-gray-100 p-4 shadow-sm">
                  <div className="flex items-center justify-between gap-4">
                    <div>
                      <h3 className="text-sm font-bold text-gray-900">{employee.name}</h3>
                      <p className="mt-1 text-xs text-gray-500">
                        {employee.role} · {employee.courses} курса
                      </p>
                    </div>
                    <div className="text-right">
                      <p className="text-sm font-extrabold text-[#A3B096]">{employee.averageScore}%</p>
                      <p className="text-[10px] font-bold uppercase tracking-wider text-gray-400">
                        прогресс {employee.progress}%
                      </p>
                    </div>
                  </div>
                </Card>
              ))}
            </section>
          </>
        ) : null}
      </div>
    </motion.div>
  );
}

function StatCard({
  icon: Icon,
  label,
  value,
}: {
  icon: typeof BarChart3;
  label: string;
  value: string;
}) {
  return (
    <Card className="rounded-[24px] border-gray-100 p-4 shadow-sm">
      <div className="flex items-center gap-3">
        <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-[#A7738B]/10 text-[#A7738B]">
          <Icon size={18} />
        </div>
        <div>
          <p className="text-[10px] font-bold uppercase tracking-wider text-gray-400">{label}</p>
          <p className="mt-1 text-lg font-extrabold text-gray-900">{value}</p>
        </div>
      </div>
    </Card>
  );
}

function InfoCard({
  text,
  tone = "neutral",
}: {
  text: string;
  tone?: "neutral" | "error";
}) {
  return (
    <Card
      className={cn(
        "rounded-[28px] border p-5 text-sm font-medium shadow-sm",
        tone === "error" ? "border-red-100 bg-red-50 text-red-700" : "border-gray-100 bg-white text-gray-500",
      )}
    >
      {text}
    </Card>
  );
}

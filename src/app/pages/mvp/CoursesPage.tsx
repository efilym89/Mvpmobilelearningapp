import * as React from "react";
import { motion } from "motion/react";
import { BookOpen, LogOut, Search } from "lucide-react";
import { useNavigate } from "react-router";
import { Card } from "../../components/ui/Card";
import { Input } from "../../components/ui/Input";
import { api } from "../../lib/api";
import { useAsyncResource } from "../../hooks/useAsyncResource";
import { useStore } from "../../store";
import { cn } from "../../lib/utils";

export default function CoursesPage() {
  const navigate = useNavigate();
  const session = useStore((state) => state.session);
  const clearSession = useStore((state) => state.clearSession);
  const [query, setQuery] = React.useState("");
  const accessToken = session?.accessToken ?? "";
  const { data, error, loading } = useAsyncResource(
    () => api.getCourses(accessToken),
    [accessToken],
  );

  const courses = React.useMemo(() => {
    if (!data) {
      return [];
    }

    return data.filter((course) =>
      course.title.toLowerCase().includes(query.trim().toLowerCase()),
    );
  }, [data, query]);

  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      className="pb-8"
    >
      <div className="sticky top-0 z-20 border-b border-gray-100 bg-white px-6 pb-5 pt-12 shadow-sm">
        <div className="mb-5 flex items-start justify-between gap-4">
          <div>
            <p className="text-xs font-bold uppercase tracking-[0.24em] text-gray-400">
              Сотрудник
            </p>
            <h1 className="mt-2 text-2xl font-extrabold text-gray-900">
              {session?.user.name}
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

        <div className="relative">
          <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-4 text-gray-400">
            <Search size={18} />
          </div>
          <Input
            type="text"
            value={query}
            onChange={(event) => setQuery(event.target.value)}
            placeholder="Поиск по курсам"
            className="h-12 rounded-2xl border-transparent bg-gray-50 pl-11"
          />
        </div>
      </div>

      <div className="space-y-4 px-6 pt-6">
        {loading ? <StateCard text="Загружаем курсы..." /> : null}
        {error ? <StateCard text={error} tone="error" /> : null}

        {!loading && !error
          ? courses.map((course) => (
              <Card
                key={course.id}
                className="cursor-pointer gap-4 rounded-[28px] border-gray-100 p-5 shadow-sm transition-transform hover:-translate-y-0.5"
                onClick={() => navigate(`/course/${course.id}`)}
              >
                <div className="flex items-start gap-4">
                  <div
                    className={cn(
                      "flex h-14 w-14 items-center justify-center rounded-tl-2xl rounded-br-2xl rounded-tr-md rounded-bl-md text-white",
                      course.color === "rose" ? "bg-[#A7738B]" : "bg-[#A3B096]",
                    )}
                  >
                    <BookOpen size={22} />
                  </div>

                  <div className="min-w-0 flex-1">
                    <div className="flex items-center justify-between gap-3">
                      <h2 className="text-base font-extrabold text-gray-900">
                        {course.title}
                      </h2>
                      <span className="rounded-full bg-gray-50 px-3 py-1 text-[10px] font-bold uppercase tracking-wider text-gray-500">
                        {course.progress}%
                      </span>
                    </div>

                    <p className="mt-2 text-sm leading-relaxed text-gray-500">
                      {course.description}
                    </p>

                    <div className="mt-4 flex items-center justify-between text-xs font-semibold text-gray-400">
                      <span>
                        {course.completedLessons} / {course.totalLessons} уроков
                      </span>
                      <span>{course.isMandatory ? "Обязательный" : "Доступный"}</span>
                    </div>

                    <div className="mt-3 h-2 overflow-hidden rounded-full bg-gray-100">
                      <div
                        className={cn(
                          "h-full rounded-full",
                          course.color === "rose" ? "bg-[#A7738B]" : "bg-[#A3B096]",
                        )}
                        style={{ width: `${course.progress}%` }}
                      />
                    </div>
                  </div>
                </div>
              </Card>
            ))
          : null}

        {!loading && !error && courses.length === 0 ? (
          <StateCard text="По вашему запросу курсы не найдены." />
        ) : null}
      </div>
    </motion.div>
  );
}

function StateCard({ text, tone = "neutral" }: { text: string; tone?: "neutral" | "error" }) {
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

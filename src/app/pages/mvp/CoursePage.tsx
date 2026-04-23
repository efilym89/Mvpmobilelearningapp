import { motion } from "motion/react";
import { BookOpen, ChevronLeft, ClipboardCheck, PlayCircle } from "lucide-react";
import { useNavigate, useParams } from "react-router";
import { Button } from "../../components/ui/Button";
import { Card } from "../../components/ui/Card";
import { api } from "../../lib/api";
import { useAsyncResource } from "../../hooks/useAsyncResource";
import { useStore } from "../../store";
import { cn } from "../../lib/utils";

export default function CoursePage() {
  const navigate = useNavigate();
  const { id } = useParams();
  const accessToken = useStore((state) => state.session?.accessToken ?? "");
  const { data: course, error, loading } = useAsyncResource(
    () => api.getCourse(accessToken, id ?? ""),
    [accessToken, id],
  );

  const nextLesson = course?.lessons.find((lesson) => !lesson.isCompleted) ?? course?.lessons[0];

  return (
    <motion.div initial={{ opacity: 0, x: 16 }} animate={{ opacity: 1, x: 0 }} className="min-h-full bg-[#F8F9FA]">
      <div className="bg-white px-6 pb-8 pt-12 shadow-sm">
        <div className="mb-6 flex items-center gap-4">
          <button
            onClick={() => navigate("/courses")}
            className="flex h-10 w-10 items-center justify-center rounded-full bg-gray-50 text-gray-500"
          >
            <ChevronLeft size={20} />
          </button>
          <p className="text-xs font-bold uppercase tracking-[0.24em] text-gray-400">
            Курс
          </p>
        </div>

        {loading ? <InfoCard text="Загружаем курс..." /> : null}
        {error ? <InfoCard text={error} tone="error" /> : null}

        {course ? (
          <>
            <div
              className={cn(
                "inline-flex rounded-full px-3 py-1 text-[10px] font-bold uppercase tracking-wider text-white",
                course.color === "rose" ? "bg-[#A7738B]" : "bg-[#A3B096]",
              )}
            >
              {course.isMandatory ? "Обязательный курс" : "Курс для развития"}
            </div>

            <h1 className="mt-4 text-3xl font-extrabold leading-tight text-gray-900">
              {course.title}
            </h1>
            <p className="mt-4 text-sm leading-relaxed text-gray-500">
              {course.description}
            </p>

            <div className="mt-6 grid grid-cols-3 gap-3 text-center">
              <Metric title="Прогресс" value={`${course.progress}%`} />
              <Metric title="Уроки" value={`${course.completedLessons}/${course.totalLessons}`} />
              <Metric title="Статус" value={course.status === "completed" ? "Готово" : "В работе"} />
            </div>

            <div className="mt-6 flex gap-3">
              <Button
                size="lg"
                className="h-12 flex-1 rounded-2xl"
                onClick={() => nextLesson && navigate(`/course/${course.id}/lesson/${nextLesson.id}`)}
              >
                <PlayCircle size={18} /> Продолжить
              </Button>
              <Button
                variant="secondary"
                size="lg"
                className="h-12 flex-1 rounded-2xl"
                onClick={() => navigate(`/course/${course.id}/test`)}
              >
                <ClipboardCheck size={18} /> Тест
              </Button>
            </div>
          </>
        ) : null}
      </div>

      <div className="space-y-4 px-6 py-6">
        {course?.lessons.map((lesson, index) => (
          <Card key={lesson.id} className="rounded-[28px] border-gray-100 p-5 shadow-sm">
            <div className="flex items-start gap-4">
              <div className="flex h-12 w-12 items-center justify-center rounded-tl-xl rounded-br-xl rounded-tr-md rounded-bl-md bg-gray-50 text-gray-500">
                <BookOpen size={20} />
              </div>
              <div className="flex-1">
                <div className="flex items-center justify-between gap-3">
                  <div>
                    <p className="text-[10px] font-bold uppercase tracking-wider text-gray-400">
                      Урок {index + 1}
                    </p>
                    <h2 className="mt-1 text-base font-bold text-gray-900">
                      {lesson.title}
                    </h2>
                  </div>
                  <span
                    className={cn(
                      "rounded-full px-3 py-1 text-[10px] font-bold uppercase tracking-wider",
                      lesson.isCompleted
                        ? "bg-[#A3B096]/10 text-[#7C8D6D]"
                        : "bg-gray-100 text-gray-500",
                    )}
                  >
                    {lesson.isCompleted ? "Готово" : lesson.duration}
                  </span>
                </div>

                <div className="mt-4 h-2 overflow-hidden rounded-full bg-gray-100">
                  <div
                    className={cn(
                      "h-full rounded-full",
                      course.color === "rose" ? "bg-[#A7738B]" : "bg-[#A3B096]",
                    )}
                    style={{ width: `${lesson.progress}%` }}
                  />
                </div>

                <Button
                  variant="ghost"
                  className="mt-4 h-10 rounded-xl px-0 text-[#A7738B] hover:bg-transparent"
                  onClick={() => navigate(`/course/${course.id}/lesson/${lesson.id}`)}
                >
                  Открыть урок
                </Button>
              </div>
            </div>
          </Card>
        ))}
      </div>
    </motion.div>
  );
}

function Metric({ title, value }: { title: string; value: string }) {
  return (
    <div className="rounded-2xl bg-[#F8F9FA] px-3 py-4">
      <p className="text-[10px] font-bold uppercase tracking-wider text-gray-400">{title}</p>
      <p className="mt-2 text-sm font-extrabold text-gray-900">{value}</p>
    </div>
  );
}

function InfoCard({ text, tone = "neutral" }: { text: string; tone?: "neutral" | "error" }) {
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

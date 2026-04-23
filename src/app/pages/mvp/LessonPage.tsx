import * as React from "react";
import { motion } from "motion/react";
import { CheckCircle2, ChevronLeft, FileText, PlayCircle } from "lucide-react";
import { useNavigate, useParams } from "react-router";
import { Button } from "../../components/ui/Button";
import { Card } from "../../components/ui/Card";
import { useAsyncResource } from "../../hooks/useAsyncResource";
import { api } from "../../lib/api";
import { cn } from "../../lib/utils";
import { useStore } from "../../store";

export default function LessonPage() {
  const navigate = useNavigate();
  const { id, lessonId } = useParams();
  const accessToken = useStore((state) => state.session?.accessToken ?? "");
  const [saving, setSaving] = React.useState(false);
  const [actionError, setActionError] = React.useState<string | null>(null);
  const { data, error, loading } = useAsyncResource(
    async () => {
      const [course, lesson] = await Promise.all([
        api.getCourse(accessToken, id ?? ""),
        api.getLesson(accessToken, id ?? "", lessonId ?? ""),
      ]);

      return { course, lesson };
    },
    [accessToken, id, lessonId],
  );

  async function handleComplete() {
    if (!id || !lessonId) {
      return;
    }

    setSaving(true);
    setActionError(null);

    try {
      await api.completeLesson(accessToken, id, lessonId);
      navigate(`/course/${id}`, { replace: true });
    } catch (reason) {
      setActionError(reason instanceof Error ? reason.message : "Не удалось сохранить прогресс");
    } finally {
      setSaving(false);
    }
  }

  return (
    <motion.div initial={{ opacity: 0, x: 16 }} animate={{ opacity: 1, x: 0 }} className="min-h-full bg-[#F8F9FA]">
      <div className="overflow-hidden bg-gray-900 px-6 pb-6 pt-12 text-white">
        <div className="flex items-center gap-4">
          <button
            onClick={() => navigate(`/course/${id}`)}
            className="flex h-10 w-10 items-center justify-center rounded-full bg-white/10"
          >
            <ChevronLeft size={20} />
          </button>
          <div>
            <p className="text-[10px] font-bold uppercase tracking-[0.24em] text-white/60">Урок</p>
            <p className="text-sm font-bold">{data?.lesson.title ?? "Загрузка..."}</p>
          </div>
        </div>

        <div className="mt-8 overflow-hidden rounded-[28px] bg-white/5">
          {data?.lesson.videoUrl ? (
            <video controls playsInline preload="metadata" className="aspect-video w-full bg-black" src={data.lesson.videoUrl} />
          ) : (
            <div className="flex aspect-video items-center justify-center">
              <div className="text-center">
                <PlayCircle className="mx-auto mb-3 text-white/70" size={34} />
                <p className="text-sm font-semibold text-white/70">Видео не приложено</p>
              </div>
            </div>
          )}
        </div>

        <div className="mt-6 flex items-center gap-4">
          <div className="flex h-14 w-14 items-center justify-center rounded-full bg-white/15">
            <PlayCircle size={24} />
          </div>
          <div>
            <p className="text-sm font-semibold text-white/70">Материал урока</p>
            <p className="text-xl font-extrabold">{data?.lesson.videoCaption ?? "Учебный блок"}</p>
          </div>
        </div>
      </div>

      <div className="-mt-6 rounded-t-[32px] bg-white px-6 pb-8 pt-6 shadow-sm">
        {loading ? <InfoCard text="Загружаем урок..." /> : null}
        {error ? <InfoCard text={error} tone="error" /> : null}

        {data ? (
          <>
            <div className="mb-6 flex items-center justify-between gap-3">
              <div>
                <p className="text-xs font-bold uppercase tracking-wider text-gray-400">{data.course.title}</p>
                <h1 className="mt-2 text-2xl font-extrabold leading-tight text-gray-900">{data.lesson.title}</h1>
              </div>
              <span
                className={cn(
                  "rounded-full px-3 py-1 text-[10px] font-bold uppercase tracking-wider",
                  data.lesson.isCompleted ? "bg-[#A3B096]/10 text-[#7C8D6D]" : "bg-[#A7738B]/10 text-[#A7738B]",
                )}
              >
                {data.lesson.isCompleted ? "Завершен" : data.lesson.duration}
              </span>
            </div>

            <div className="space-y-4">
              {data.lesson.content.map((paragraph, index) => (
                <p key={index} className="text-sm leading-7 text-gray-600">
                  {paragraph}
                </p>
              ))}
            </div>

            {data.lesson.objectives?.length ? (
              <Card className="mt-6 rounded-[28px] border-gray-100 bg-[#F8F9FA] p-5 shadow-sm">
                <h3 className="text-sm font-extrabold uppercase tracking-wider text-gray-900">Фокус урока</h3>
                <ul className="mt-4 space-y-3">
                  {data.lesson.objectives.map((objective, index) => (
                    <li key={index} className="flex items-start gap-3 text-sm leading-6 text-gray-600">
                      <span className="mt-2 h-2.5 w-2.5 shrink-0 rounded-full bg-[#A7738B]" />
                      <span>{objective}</span>
                    </li>
                  ))}
                </ul>
              </Card>
            ) : null}

            {data.lesson.presentationPdfUrl ? (
              <div className="mt-6">
                <h3 className="mb-4 flex items-center gap-2 text-lg font-bold text-gray-900">
                  <FileText size={18} className="text-[#A7738B]" />
                  Материалы урока
                </h3>

                <button
                  onClick={() => navigate(`/course/${id}/lesson/${lessonId}/pdf`)}
                  className="flex w-full items-center justify-between rounded-[24px] border border-gray-100 bg-white px-5 py-4 text-left shadow-sm transition-colors hover:border-gray-200 hover:bg-gray-50"
                >
                  <div>
                    <p className="text-sm font-bold text-gray-900">PDF-презентация</p>
                    <p className="mt-1 text-sm text-gray-500">Открывается внутри приложения без отдельной кнопки скачивания.</p>
                  </div>
                  <div className="ml-4 rounded-full bg-[#F8F1F4] px-3 py-2 text-xs font-bold uppercase tracking-[0.16em] text-[#A7738B]">
                    PDF
                  </div>
                </button>
              </div>
            ) : null}

            {actionError ? <InfoCard text={actionError} tone="error" className="mt-6" /> : null}

            <div className="mt-8 rounded-[28px] border border-gray-100 bg-[#FCFAFB] p-3 shadow-[0_18px_40px_rgba(17,24,39,0.08)]">
              <div className="grid gap-3 sm:grid-cols-2">
                {data.lesson.videoUrl ? (
                  <Button
                    variant="secondary"
                    size="lg"
                    className="h-12 rounded-2xl"
                    onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
                  >
                    Смотреть видео
                  </Button>
                ) : null}

                {data.lesson.presentationPdfUrl ? (
                  <Button
                    variant="secondary"
                    size="lg"
                    className="h-12 rounded-2xl"
                    onClick={() => navigate(`/course/${id}/lesson/${lessonId}/pdf`)}
                  >
                    Открыть PDF
                  </Button>
                ) : null}

                <Button
                  size="lg"
                  className="h-12 rounded-2xl"
                  onClick={() => navigate(`/course/${id}/lesson/${lessonId}/quiz`)}
                >
                  Пройти квиз
                </Button>

                {!data.lesson.isCompleted ? (
                  <Button onClick={handleComplete} size="lg" className="h-12 rounded-2xl" disabled={saving}>
                    <CheckCircle2 size={18} />
                    {saving ? "Сохраняем..." : "Отметить урок завершенным"}
                  </Button>
                ) : (
                  <div className="flex h-12 items-center justify-center rounded-2xl bg-[#EEF5EA] px-4 text-sm font-semibold text-[#69815F]">
                    Урок уже отмечен как завершенный
                  </div>
                )}
              </div>

              <Button
                variant="ghost"
                size="lg"
                className="mt-3 h-12 w-full rounded-2xl text-gray-600"
                onClick={() => navigate(`/course/${id}`)}
              >
                Вернуться к программе
              </Button>
            </div>
          </>
        ) : null}
      </div>
    </motion.div>
  );
}

function InfoCard({
  text,
  tone = "neutral",
  className,
}: {
  text: string;
  tone?: "neutral" | "error";
  className?: string;
}) {
  return (
    <Card
      className={cn(
        "rounded-[28px] border p-5 text-sm font-medium shadow-sm",
        tone === "error" ? "border-red-100 bg-red-50 text-red-700" : "border-gray-100 bg-white text-gray-500",
        className,
      )}
    >
      {text}
    </Card>
  );
}

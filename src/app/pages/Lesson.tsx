import * as React from "react";
import { motion } from "motion/react";
import { CheckCircle2, ChevronLeft, ChevronRight, Clock, FileText, PlayCircle } from "lucide-react";
import { useNavigate, useParams } from "react-router";
import { Button } from "../components/ui/Button";
import { courses } from "../lib/mock-data";
import { cn } from "../lib/utils";

export default function Lesson() {
  const { id, lessonId } = useParams();
  const navigate = useNavigate();
  const videoSectionRef = React.useRef<HTMLDivElement | null>(null);
  const course = courses.find((item) => item.id === id) || courses[0];
  const lesson = course.lessons.find((item) => item.id === lessonId) || course.lessons[0];
  const isRose = course.color === "rose";
  const progress = lesson.progress || 0;
  const hasPdf = Boolean(lesson.presentationPdfUrl);

  function handleOpenVideo() {
    if (!lesson.videoUrl) {
      return;
    }

    videoSectionRef.current?.scrollIntoView({ behavior: "smooth", block: "start" });
  }

  return (
    <motion.div
      initial={{ opacity: 0, x: 20 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: -20 }}
      transition={{ duration: 0.3 }}
      className="relative flex min-h-full flex-col bg-[#F8F9FA] pb-[168px]"
    >
      <div ref={videoSectionRef} className="relative aspect-video w-full shrink-0 overflow-hidden bg-gray-950">
        {lesson.videoUrl ? (
          <video
            controls
            playsInline
            preload="metadata"
            className="h-full w-full object-cover"
            poster={lesson.thumbnail}
            src={lesson.videoUrl}
          />
        ) : (
          <div
            className="flex h-full w-full items-center justify-center bg-cover bg-center"
            style={{ backgroundImage: `url(${lesson.thumbnail})` }}
          >
            <div className="rounded-3xl bg-black/55 px-6 py-5 text-center text-white backdrop-blur-sm">
              <FileText className="mx-auto mb-3" size={28} />
              <p className="text-sm font-bold">Видео для этого урока не приложено</p>
              <p className="mt-1 text-xs text-white/70">Материал доступен ниже во встроенном просмотре PDF</p>
            </div>
          </div>
        )}

        <div className="absolute left-0 right-0 top-0 z-10 flex items-center gap-4 bg-gradient-to-b from-black/65 to-transparent px-4 pb-8 pt-4 text-white">
          <button
            onClick={() => navigate(`/course/${id}`)}
            className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-black/40 backdrop-blur-sm transition-colors hover:bg-black/60"
          >
            <ChevronLeft size={22} />
          </button>
          <div className="min-w-0">
            <p className="text-[10px] font-bold uppercase tracking-[0.24em] text-white/70">Урок</p>
            <h2 className="truncate text-sm font-bold">{lesson.title}</h2>
          </div>
        </div>
      </div>

      <div className="relative z-10 -mt-4 flex-1 rounded-t-[32px] bg-white px-6 pb-8 pt-6 shadow-sm">
        <div className="mb-4 flex items-center gap-3">
          <span
            className={cn(
              "rounded-full px-3 py-1 text-xs font-bold uppercase tracking-wider",
              isRose ? "bg-[#A7738B]/10 text-[#A7738B]" : "bg-[#A3B096]/10 text-[#7C8D6D]",
            )}
          >
            {lesson.type}
          </span>
          <span className="flex items-center gap-2 rounded-full bg-gray-50 px-3 py-1 text-xs font-semibold text-gray-500">
            <Clock size={14} /> {lesson.duration}
          </span>
          {lesson.isCompleted ? (
            <span className="ml-auto flex items-center gap-1.5 rounded-full bg-[#A3B096]/10 px-3 py-1 text-xs font-bold text-[#7C8D6D]">
              <CheckCircle2 size={14} /> Завершен
            </span>
          ) : null}
        </div>

        <h1 className="text-2xl font-extrabold leading-tight text-gray-900">{lesson.title}</h1>
        <p className="mt-4 text-sm leading-7 text-gray-600">
          {lesson.fullDescription ?? lesson.description ?? "Материал урока уже добавлен в приложение и доступен для просмотра."}
        </p>

        {Array.isArray(lesson.objectives) && lesson.objectives.length > 0 ? (
          <div className="mt-8 rounded-[28px] border border-gray-100 bg-[#F8F9FA] p-5">
            <h3 className="flex items-center gap-2 text-sm font-extrabold uppercase tracking-wider text-gray-900">
              <PlayCircle size={16} className={isRose ? "text-[#A7738B]" : "text-[#7C8D6D]"} />
              Что разобрать в уроке
            </h3>
            <ul className="mt-4 space-y-3">
              {lesson.objectives.map((objective: string, index: number) => (
                <li key={index} className="flex items-start gap-3 text-sm leading-6 text-gray-600">
                  <span
                    className={cn("mt-1 h-2.5 w-2.5 shrink-0 rounded-full", isRose ? "bg-[#A7738B]" : "bg-[#A3B096]")}
                  />
                  <span>{objective}</span>
                </li>
              ))}
            </ul>
          </div>
        ) : null}

        {hasPdf ? (
          <div className="mt-8">
            <h3 className="mb-4 flex items-center gap-2 text-lg font-bold text-gray-900">
              <FileText size={20} className={isRose ? "text-[#A7738B]" : "text-[#7C8D6D]"} />
              Материалы урока
            </h3>
            <button
              onClick={() => navigate(`/course/${id}/lesson/${lesson.id}/pdf`)}
              className="flex w-full items-center justify-between rounded-[24px] border border-gray-100 bg-white px-5 py-4 text-left shadow-sm transition-colors hover:border-gray-200 hover:bg-gray-50"
            >
              <div>
                <p className="text-sm font-bold text-gray-800">PDF-презентация</p>
                <p className="mt-1 text-xs text-gray-500">Открыть во встроенном просмотре</p>
              </div>
              <ChevronRight size={18} className="text-gray-400" />
            </button>
          </div>
        ) : null}

        {!lesson.isCompleted && progress > 0 ? (
          <div className="mt-8 rounded-[24px] border border-gray-100 bg-gray-50 p-4">
            <div className="mb-2 flex justify-between text-xs font-bold uppercase tracking-wider text-gray-500">
              <span>Прогресс просмотра</span>
              <span>{progress}%</span>
            </div>
            <div className="h-2 overflow-hidden rounded-full bg-gray-200">
              <motion.div
                className={cn("h-full rounded-full", isRose ? "bg-[#A7738B]" : "bg-[#A3B096]")}
                initial={{ width: 0 }}
                animate={{ width: `${progress}%` }}
                transition={{ duration: 1, ease: "easeOut" }}
              />
            </div>
          </div>
        ) : null}
      </div>

      <div className="fixed bottom-0 left-0 right-0 z-40 bg-gradient-to-t from-[#F8F9FA] via-[#F8F9FA] to-white/0 p-6 pb-8">
        <div className="rounded-[30px] border border-white/70 bg-white/92 p-3 shadow-[0_18px_50px_rgba(20,20,20,0.12)] backdrop-blur-xl">
          {lesson.isCompleted ? (
            <div className="mb-3 flex items-center justify-center gap-2 rounded-[22px] bg-[#A3B096]/10 px-4 py-3 text-sm font-bold text-[#7C8D6D]">
              <CheckCircle2 size={18} /> Урок завершен
            </div>
          ) : (
            <>
              <div className={cn("grid gap-3", lesson.videoUrl ? "grid-cols-2" : "grid-cols-1")}>
                {lesson.videoUrl ? (
                  <Button
                    variant="outline"
                    size="lg"
                    className="h-12 w-full rounded-[22px] border-gray-200 bg-[#F8F9FA]"
                    onClick={handleOpenVideo}
                  >
                    Смотреть видео
                  </Button>
                ) : null}

                {hasPdf ? (
                  <Button
                    variant="outline"
                    size="lg"
                    className="h-12 rounded-[22px] border-gray-200 bg-[#F8F9FA]"
                    onClick={() => navigate(`/course/${id}/lesson/${lesson.id}/pdf`)}
                  >
                    Открыть PDF
                  </Button>
                ) : null}
              </div>

              <Button
                variant={isRose ? "primary" : "secondary"}
                size="lg"
                className="mt-3 h-12 w-full rounded-[22px] shadow-none"
                onClick={() => navigate(`/course/${id}/lesson/${lesson.id}/quiz`)}
              >
                Пройти квиз
              </Button>
            </>
          )}

          <Button
            variant="ghost"
            size="lg"
            onClick={() => navigate(`/course/${id}`)}
            className="mt-2 h-11 w-full rounded-[22px] text-gray-600 hover:bg-[#F8F9FA]"
          >
            Вернуться к программе
          </Button>
        </div>
      </div>
    </motion.div>
  );
}

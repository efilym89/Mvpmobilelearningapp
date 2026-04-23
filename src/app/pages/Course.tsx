import { ArrowLeft, CheckCircle, Circle, PlayCircle } from "lucide-react";
import { useNavigate, useParams } from "react-router";
import { Button } from "../components/ui/Button";
import { Progress } from "../components/ui/Progress";
import { useStore } from "../store";

export function Course() {
  const { id } = useParams();
  const navigate = useNavigate();
  const course = useStore((state) => state.courses.find((item) => item.id === id));

  if (!course) {
    return <div>Курс не найден</div>;
  }

  const nextLessonNumber =
    Math.min(course.completedLessons, Math.max(course.totalLessons - 1, 0)) + 1;

  return (
    <div className="flex min-h-screen flex-col bg-background pb-24">
      <header className="sticky top-0 z-10 flex h-14 items-center gap-4 border-b border-border bg-background/80 px-4 backdrop-blur-md">
        <Button variant="ghost" size="sm" className="h-8 w-8 rounded-full p-0" onClick={() => navigate(-1)}>
          <ArrowLeft className="h-5 w-5" />
        </Button>
        <span className="text-sm font-medium">Программа курса</span>
      </header>

      <div className="space-y-6 p-4">
        <div className="space-y-4 pt-4">
          <div className="inline-flex items-center rounded-full bg-secondary px-2.5 py-0.5 text-xs font-semibold text-primary">
            {course.status === "completed"
              ? "Завершен"
              : course.status === "in_progress"
                ? "В процессе"
                : "Не начат"}
          </div>
          <h1 className="text-2xl font-semibold leading-tight tracking-tight">{course.title}</h1>
          <p className="text-muted-foreground">{course.description}</p>
          <div className="space-y-2 pt-2">
            <div className="flex justify-between text-sm font-medium">
              <span>Ваш прогресс</span>
              <span className="text-primary">{course.progress}%</span>
            </div>
            <Progress value={course.progress} className="h-3" />
          </div>
        </div>

        <div className="space-y-4">
          <h2 className="text-lg font-medium tracking-tight">Уроки</h2>
          <div className="space-y-3">
            {Array.from({ length: course.totalLessons }).map((_, index) => {
              const lessonNumber = index + 1;
              const isCompleted = index < course.completedLessons;
              const isCurrent = index === course.completedLessons;
              const isLocked = index > course.completedLessons;

              return (
                <div
                  key={lessonNumber}
                  className={`flex items-start gap-4 rounded-[16px] border p-4 ${
                    isCompleted
                      ? "border-success/30 bg-card"
                      : isCurrent
                        ? "border-primary bg-secondary/50"
                        : "border-border bg-card opacity-60"
                  } ${!isLocked ? "cursor-pointer" : "cursor-not-allowed"}`}
                  onClick={() => !isLocked && navigate(`/course/${course.id}/lesson/${lessonNumber}`)}
                >
                  <div
                    className={`mt-0.5 flex h-6 w-6 shrink-0 items-center justify-center rounded-full ${
                      isCompleted ? "text-success" : isCurrent ? "text-primary" : "text-muted-foreground"
                    }`}
                  >
                    {isCompleted ? (
                      <CheckCircle className="h-6 w-6" />
                    ) : isCurrent ? (
                      <PlayCircle className="h-6 w-6 fill-primary/20 text-primary" />
                    ) : (
                      <Circle className="h-6 w-6" />
                    )}
                  </div>
                  <div className="flex flex-col">
                    <span className={`text-sm font-medium ${isLocked ? "text-muted-foreground" : "text-foreground"}`}>
                      Урок {lessonNumber}
                    </span>
                    <span className="text-xs text-muted-foreground">
                      {isCompleted ? "Пройден" : isCurrent ? "Доступен сейчас" : "Заблокирован"}
                    </span>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>

      <div className="fixed bottom-0 left-0 right-0 mx-auto max-w-md border-t border-border bg-background p-4">
        <Button
          className="w-full"
          size="lg"
          disabled={course.status === "completed"}
          onClick={() => navigate(`/course/${course.id}/lesson/${nextLessonNumber}`)}
        >
          {course.status === "not_started"
            ? "Начать курс"
            : course.status === "completed"
              ? "Курс завершен"
              : "Продолжить обучение"}
        </Button>
      </div>
    </div>
  );
}

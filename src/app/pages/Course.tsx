import { useParams, useNavigate } from "react-router"
import { useStore } from "../store"
import { Button } from "../components/ui/Button"
import { Progress } from "../components/ui/Progress"
import { ArrowLeft, CheckCircle, Circle, PlayCircle } from "lucide-react"

export function Course() {
  const { id } = useParams()
  const navigate = useNavigate()
  const course = useStore((state) => state.courses.find((c) => c.id === id))

  if (!course) return <div>Курс не найден</div>

  return (
    <div className="flex flex-col min-h-screen bg-background pb-24">
      <header className="sticky top-0 z-10 flex h-14 items-center gap-4 bg-background/80 px-4 backdrop-blur-md border-b border-border">
        <Button variant="ghost" size="sm" className="h-8 w-8 p-0 rounded-full" onClick={() => navigate(-1)}>
          <ArrowLeft className="h-5 w-5" />
        </Button>
        <span className="font-medium text-sm">Программа курса</span>
      </header>

      <div className="p-4 space-y-6">
        <div className="space-y-4 pt-4">
          <div className="inline-flex items-center rounded-full bg-secondary px-2.5 py-0.5 text-xs font-semibold text-primary">
            {course.status === "completed" ? "Пройден" : course.status === "in_progress" ? "В процессе" : "Не начат"}
          </div>
          <h1 className="text-2xl font-semibold tracking-tight leading-tight">{course.title}</h1>
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
            {Array.from({ length: course.totalLessons }).map((_, i) => {
              const isCompleted = i < course.completedLessons;
              const isCurrent = i === course.completedLessons;
              const isLocked = i > course.completedLessons;

              return (
                <div
                  key={i}
                  className={`flex items-start gap-4 p-4 rounded-[16px] border ${
                    isCompleted ? "bg-card border-success/30" :
                    isCurrent ? "bg-secondary/50 border-primary" : "bg-card border-border opacity-60"
                  } ${!isLocked ? 'cursor-pointer' : 'cursor-not-allowed'}`}
                  onClick={() => !isLocked && navigate(`/lesson/${course.id}?lessonId=${i+1}`)}
                >
                  <div className={`mt-0.5 flex shrink-0 h-6 w-6 items-center justify-center rounded-full ${
                    isCompleted ? "text-success" :
                    isCurrent ? "text-primary" : "text-muted-foreground"
                  }`}>
                    {isCompleted ? <CheckCircle className="h-6 w-6" /> : isCurrent ? <PlayCircle className="h-6 w-6 text-primary fill-primary/20" /> : <Circle className="h-6 w-6" />}
                  </div>
                  <div className="flex flex-col">
                    <span className={`text-sm font-medium ${isLocked ? 'text-muted-foreground' : 'text-foreground'}`}>Урок {i + 1}</span>
                    <span className="text-xs text-muted-foreground">
                      {isCompleted ? "Пройден" : isCurrent ? "К изучению" : "Заблокирован"}
                    </span>
                  </div>
                </div>
              )
            })}
          </div>
        </div>
      </div>

      <div className="fixed bottom-0 left-0 right-0 max-w-md mx-auto p-4 bg-background border-t border-border">
        <Button 
          className="w-full" 
          size="lg"
          disabled={course.status === "completed"}
          onClick={() => navigate(`/lesson/${course.id}?lessonId=${course.completedLessons + 1}`)}
        >
          {course.status === "not_started" ? "Начать курс" : course.status === "completed" ? "Курс завершен" : "Продолжить обучение"}
        </Button>
      </div>
    </div>
  )
}

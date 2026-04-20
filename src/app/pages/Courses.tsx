import { useNavigate } from "react-router"
import { useStore } from "../store"
import { Card, CardContent } from "../components/ui/Card"
import { Progress } from "../components/ui/Progress"
import { CheckCircle, PlayCircle, Clock } from "lucide-react"
import { Button } from "../components/ui/Button"

export function Courses() {
  const courses = useStore((state) => state.courses)
  const navigate = useNavigate()

  return (
    <div className="flex flex-col space-y-6 p-4">
      <header className="pt-4">
        <h1 className="text-2xl font-semibold tracking-tight">Мои курсы</h1>
        <p className="text-sm text-muted-foreground mt-1">Все доступные программы обучения</p>
      </header>

      <div className="flex gap-2 overflow-x-auto pb-2 scrollbar-hide">
        <Button size="sm" variant="default" className="rounded-full">Все</Button>
        <Button size="sm" variant="outline" className="rounded-full">В процессе</Button>
        <Button size="sm" variant="outline" className="rounded-full">Пройденные</Button>
      </div>

      <div className="space-y-4">
        {courses.map((course) => (
          <Card key={course.id} className="overflow-hidden cursor-pointer hover:border-primary/50 transition-colors" onClick={() => navigate(`/course/${course.id}`)}>
            <div className={`h-2 w-full ${
              course.status === 'completed' ? 'bg-success' : 
              course.status === 'in_progress' ? 'bg-primary' : 'bg-muted'
            }`} />
            <CardContent className="p-4 pt-5 flex gap-4">
              <div className={`flex h-16 w-16 shrink-0 items-center justify-center rounded-[12px] ${
                course.status === 'completed' ? 'bg-success/20 text-success' : 
                course.status === 'in_progress' ? 'bg-secondary text-primary' : 'bg-muted text-muted-foreground'
              }`}>
                {course.status === 'completed' ? <CheckCircle /> : course.status === 'in_progress' ? <PlayCircle /> : <Clock />}
              </div>
              <div className="flex flex-col justify-center flex-1 space-y-2">
                <h3 className="font-medium text-sm leading-tight">{course.title}</h3>
                <p className="text-xs text-muted-foreground line-clamp-1">{course.description}</p>
                <div className="flex items-center justify-between gap-4 mt-2">
                  <Progress value={course.progress} className="flex-1" />
                  <span className="text-xs text-muted-foreground whitespace-nowrap">{course.progress}%</span>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  )
}

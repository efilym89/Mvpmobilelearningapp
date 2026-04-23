import { motion } from "motion/react";
import { Award, ChevronLeft } from "lucide-react";
import { useLocation, useNavigate, useParams } from "react-router";
import { Button } from "../../components/ui/Button";
import { Card } from "../../components/ui/Card";
import type { TestResult } from "../../../domain/mvp";
import { cn } from "../../lib/utils";

export default function ResultPage() {
  const navigate = useNavigate();
  const { id } = useParams();
  const location = useLocation();
  const result = (location.state as { result?: TestResult } | null)?.result;

  if (!result) {
    return (
      <div className="flex min-h-full items-center justify-center bg-white px-6 py-10">
        <Card className="w-full max-w-sm rounded-[28px] border-gray-100 p-6 text-center shadow-sm">
          <h1 className="text-2xl font-extrabold text-gray-900">Результат недоступен</h1>
          <p className="mt-3 text-sm leading-relaxed text-gray-500">
            Откройте тест заново, чтобы получить свежий результат попытки.
          </p>
          <Button className="mt-6 h-12 w-full rounded-2xl" onClick={() => navigate(`/course/${id}/test`)}>
            Вернуться к тесту
          </Button>
        </Card>
      </div>
    );
  }

  return (
    <motion.div initial={{ opacity: 0, scale: 0.98 }} animate={{ opacity: 1, scale: 1 }} className="min-h-full bg-white px-6 py-10">
      <div className="flex items-center gap-4">
        <button
          onClick={() => navigate(`/course/${id}`)}
          className="flex h-10 w-10 items-center justify-center rounded-full bg-gray-50 text-gray-500"
        >
          <ChevronLeft size={20} />
        </button>
        <p className="text-xs font-bold uppercase tracking-[0.24em] text-gray-400">
          Результат теста
        </p>
      </div>

      <div className="mt-12 text-center">
        <div
          className={cn(
            "mx-auto flex h-24 w-24 items-center justify-center rounded-full text-white shadow-lg",
            result.passed ? "bg-[#A3B096]" : "bg-[#A7738B]",
          )}
        >
          <Award size={36} />
        </div>

        <h1
          className={cn(
            "mt-6 text-5xl font-extrabold",
            result.passed ? "text-[#7C8D6D]" : "text-[#A7738B]",
          )}
        >
          {result.score}%
        </h1>
        <p className="mt-3 text-lg font-bold text-gray-900">
          {result.passed ? "Тест пройден" : "Нужна еще попытка"}
        </p>
        <p className="mt-3 text-sm leading-relaxed text-gray-500">
          Правильных ответов: {result.correctAnswers} из {result.totalQuestions}
        </p>
      </div>

      <Card className="mt-10 rounded-[28px] border-gray-100 p-6 shadow-sm">
        <div className="grid grid-cols-2 gap-4">
          <Metric title="Попытка" value={result.attemptId} />
          <Metric title="Время" value={`${Math.round(result.spentTimeSeconds / 60)} мин`} />
          <Metric title="Статус" value={result.passed ? "passed" : "retry"} />
          <Metric title="Курс" value={result.courseId} />
        </div>
      </Card>

      <div className="mt-8 flex flex-col gap-3">
        <Button className="h-12 rounded-2xl" onClick={() => navigate("/courses")}>
          К списку курсов
        </Button>
        {!result.passed ? (
          <Button variant="secondary" className="h-12 rounded-2xl" onClick={() => navigate(`/course/${id}/test`)}>
            Пересдать тест
          </Button>
        ) : null}
      </div>
    </motion.div>
  );
}

function Metric({ title, value }: { title: string; value: string }) {
  return (
    <div className="rounded-2xl bg-[#F8F9FA] px-4 py-4">
      <p className="text-[10px] font-bold uppercase tracking-wider text-gray-400">{title}</p>
      <p className="mt-2 text-sm font-extrabold text-gray-900">{value}</p>
    </div>
  );
}

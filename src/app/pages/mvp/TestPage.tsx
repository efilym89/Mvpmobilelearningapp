import * as React from "react";
import { motion } from "motion/react";
import { Check, ChevronLeft } from "lucide-react";
import { useNavigate, useParams } from "react-router";
import { Button } from "../../components/ui/Button";
import { Card } from "../../components/ui/Card";
import { api } from "../../lib/api";
import { useAsyncResource } from "../../hooks/useAsyncResource";
import { useStore } from "../../store";
import { cn } from "../../lib/utils";

export default function TestPage() {
  const navigate = useNavigate();
  const { id } = useParams();
  const accessToken = useStore((state) => state.session?.accessToken ?? "");
  const { data: test, error, loading } = useAsyncResource(
    () => api.getTest(accessToken, id ?? ""),
    [accessToken, id],
  );
  const [currentQuestionIndex, setCurrentQuestionIndex] = React.useState(0);
  const [answers, setAnswers] = React.useState<number[]>([]);
  const [submitting, setSubmitting] = React.useState(false);
  const [submitError, setSubmitError] = React.useState<string | null>(null);

  const currentQuestion = test?.questions[currentQuestionIndex];
  const selectedAnswer = answers[currentQuestionIndex];

  function handleSelectAnswer(optionIndex: number) {
    setAnswers((previous) => {
      const nextAnswers = [...previous];
      nextAnswers[currentQuestionIndex] = optionIndex;
      return nextAnswers;
    });
  }

  async function handleNext() {
    if (!test || !id) {
      return;
    }

    if (currentQuestionIndex < test.questions.length - 1) {
      setCurrentQuestionIndex((value) => value + 1);
      return;
    }

    setSubmitting(true);
    setSubmitError(null);

    try {
      const result = await api.submitTest(accessToken, id, answers);
      navigate(`/course/${id}/result`, { state: { result }, replace: true });
    } catch (reason) {
      setSubmitError(reason instanceof Error ? reason.message : "Не удалось отправить тест");
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <motion.div initial={{ opacity: 0, x: 16 }} animate={{ opacity: 1, x: 0 }} className="min-h-full bg-[#F8F9FA]">
      <div className="bg-white px-6 pb-5 pt-12 shadow-sm">
        <div className="flex items-center gap-4">
          <button
            onClick={() => navigate(`/course/${id}`)}
            className="flex h-10 w-10 items-center justify-center rounded-full bg-gray-50 text-gray-500"
          >
            <ChevronLeft size={20} />
          </button>
          <div>
            <p className="text-[10px] font-bold uppercase tracking-[0.24em] text-gray-400">
              Итоговый тест
            </p>
            <h1 className="mt-1 text-xl font-extrabold text-gray-900">
              {test?.title ?? "Загрузка..."}
            </h1>
          </div>
        </div>

        {test ? (
          <div className="mt-5 h-2 overflow-hidden rounded-full bg-gray-100">
            <div
              className="h-full rounded-full bg-[#A7738B]"
              style={{
                width: `${((currentQuestionIndex + 1) / test.questions.length) * 100}%`,
              }}
            />
          </div>
        ) : null}
      </div>

      <div className="px-6 py-6">
        {loading ? <InfoCard text="Загружаем тест..." /> : null}
        {error ? <InfoCard text={error} tone="error" /> : null}

        {test && currentQuestion ? (
          <Card className="rounded-[28px] border-gray-100 p-6 shadow-sm">
            <p className="text-xs font-bold uppercase tracking-wider text-gray-400">
              Вопрос {currentQuestionIndex + 1} из {test.questions.length}
            </p>
            <h2 className="mt-4 text-xl font-extrabold leading-tight text-gray-900">
              {currentQuestion.question}
            </h2>

            <div className="mt-6 space-y-3">
              {currentQuestion.options.map((option, optionIndex) => {
                const isSelected = selectedAnswer === optionIndex;
                return (
                  <button
                    key={optionIndex}
                    onClick={() => handleSelectAnswer(optionIndex)}
                    className={cn(
                      "flex w-full items-center justify-between gap-4 rounded-[24px] border px-5 py-4 text-left transition-colors",
                      isSelected
                        ? "border-[#A7738B] bg-[#A7738B]/5"
                        : "border-gray-100 bg-white hover:border-gray-200",
                    )}
                  >
                    <span className="text-sm font-medium leading-6 text-gray-700">
                      {option}
                    </span>
                    <span
                      className={cn(
                        "flex h-6 w-6 shrink-0 items-center justify-center rounded-full border",
                        isSelected
                          ? "border-[#A7738B] bg-[#A7738B] text-white"
                          : "border-gray-200 text-transparent",
                      )}
                    >
                      <Check size={14} />
                    </span>
                  </button>
                );
              })}
            </div>

            {submitError ? <InfoCard text={submitError} tone="error" className="mt-6" /> : null}

            <Button
              onClick={handleNext}
              size="lg"
              className="mt-8 h-12 w-full rounded-2xl"
              disabled={selectedAnswer === undefined || submitting}
            >
              {submitting
                ? "Отправляем..."
                : currentQuestionIndex === test.questions.length - 1
                  ? "Завершить тест"
                  : "Следующий вопрос"}
            </Button>
          </Card>
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

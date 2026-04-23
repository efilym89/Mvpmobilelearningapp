import * as React from "react";
import { motion } from "motion/react";
import { Check, X, XCircle } from "lucide-react";
import { useNavigate, useParams } from "react-router";
import { Button } from "../components/ui/Button";
import { courses, getMockQuizForLesson } from "../lib/mock-data";
import { cn } from "../lib/utils";

export default function Quiz() {
  const { id, lessonId } = useParams();
  const navigate = useNavigate();
  const course = courses.find((item) => item.id === id) || courses[0];
  const question = getMockQuizForLesson(course.id, lessonId ?? course.lessons[0].id);
  const [hasStarted, setHasStarted] = React.useState(false);
  const [selectedOption, setSelectedOption] = React.useState<number | null>(null);
  const [isSubmitting, setIsSubmitting] = React.useState(false);
  const [result, setResult] = React.useState<"pass" | "fail" | null>(null);
  const isRose = course.color === "rose";

  function handleSubmit() {
    if (selectedOption === null) {
      return;
    }

    setIsSubmitting(true);
    window.setTimeout(() => {
      setIsSubmitting(false);
      setResult(selectedOption === question.correctAnswer ? "pass" : "fail");
    }, 700);
  }

  if (result) {
    const isPassed = result === "pass";
    return (
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        className="relative flex min-h-full flex-col items-center justify-center overflow-hidden bg-white px-6"
      >
        <motion.div
          initial={{ opacity: 0, scale: 0.5 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 1.2, ease: "easeOut" }}
          className={cn(
            "absolute -left-16 -top-16 aspect-square w-[140%] rounded-full opacity-10 blur-[100px]",
            isPassed ? "bg-[#A3B096]" : "bg-red-500",
          )}
        />

        <div className="z-10 flex flex-1 flex-col items-center justify-center py-12 text-center">
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ type: "spring", bounce: 0.45 }}
            className={cn(
              "mb-6 flex h-24 w-24 items-center justify-center rounded-full text-white shadow-2xl",
              isPassed ? "bg-[#A3B096] shadow-[#A3B096]/40" : "bg-red-500 shadow-red-500/40",
            )}
          >
            {isPassed ? <Check size={48} strokeWidth={3} /> : <XCircle size={48} strokeWidth={2} />}
          </motion.div>

          <h1 className={cn("mb-4 text-3xl font-extrabold leading-tight", isPassed ? "text-[#7C8D6D]" : "text-red-500")}>
            {isPassed ? "Квиз пройден" : "Ответ пока неверный"}
          </h1>
          <p className="mx-auto mb-8 max-w-xs text-base leading-relaxed text-gray-500">
            {isPassed
              ? "Тема урока закреплена. Можно возвращаться к программе и переходить дальше."
              : "Попробуйте еще раз: квиз проверяет, что тема урока действительно усвоена."}
          </p>
        </div>

        <div className="z-10 flex w-full flex-col gap-4 pb-8">
          {isPassed ? (
            <Button
              variant="secondary"
              size="lg"
              onClick={() => navigate(`/course/${id}`)}
              className="w-full bg-[#A3B096] text-white shadow-xl hover:bg-[#8e9c81]"
            >
              Вернуться к программе
            </Button>
          ) : (
            <>
              <Button
                variant="primary"
                size="lg"
                onClick={() => {
                  setSelectedOption(null);
                  setResult(null);
                  setHasStarted(false);
                }}
                className="w-full border-red-500 bg-red-500 text-white shadow-xl hover:border-red-600 hover:bg-red-600 focus-visible:ring-red-500/20"
              >
                Попробовать снова
              </Button>
              <Button variant="ghost" size="lg" onClick={() => navigate(`/course/${id}/lesson/${lessonId}`)} className="w-full text-gray-500 hover:text-gray-900">
                Вернуться к уроку
              </Button>
            </>
          )}
        </div>
      </motion.div>
    );
  }

  if (!hasStarted) {
    return (
      <motion.div
        initial={{ opacity: 0, x: 20 }}
        animate={{ opacity: 1, x: 0 }}
        exit={{ opacity: 0, x: -20 }}
        className="flex min-h-full flex-col justify-between bg-[#F8F9FA] p-6 pb-12"
      >
        <div className="flex flex-1 flex-col items-center justify-center text-center">
          <div
            className={cn(
              "mb-6 flex h-20 w-20 items-center justify-center rounded-full",
              isRose ? "bg-[#A7738B]/10 text-[#A7738B]" : "bg-[#A3B096]/10 text-[#7C8D6D]",
            )}
          >
            <Check size={32} />
          </div>
          <h2 className="mb-4 text-2xl font-extrabold text-gray-900">Промежуточный квиз</h2>
          <p className="max-w-[280px] text-sm text-gray-500">
            Один контрольный вопрос по теме урока поможет закрепить материал и перейти к следующему шагу программы.
          </p>
        </div>

        <div className="flex flex-col gap-4">
          <Button variant={isRose ? "primary" : "secondary"} size="lg" className="w-full" onClick={() => setHasStarted(true)}>
            Начать квиз
          </Button>
          <Button variant="ghost" size="lg" className="w-full text-gray-500 hover:text-gray-900" onClick={() => navigate(-1)}>
            Вернуться назад
          </Button>
        </div>
      </motion.div>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0, x: 20 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: -20 }}
      transition={{ duration: 0.3 }}
      className="relative flex min-h-full flex-col bg-[#F8F9FA]"
    >
      <div className="z-20 flex flex-col gap-6 bg-white px-6 pb-4 pt-12 shadow-sm">
        <div className="flex items-center justify-between">
          <button
            onClick={() => navigate(`/course/${id}/lesson/${lessonId}`)}
            className="flex h-10 w-10 items-center justify-center rounded-full bg-gray-50 text-gray-400 transition-colors hover:text-gray-900"
          >
            <X size={20} />
          </button>
          <span className="text-xs font-bold uppercase tracking-wider text-gray-400">Проверка темы урока</span>
          <div className="h-10 w-10" />
        </div>
      </div>

      <div className="flex-1 overflow-y-auto px-6 pb-32 pt-12">
        <div className="flex flex-col gap-8">
          <h2 className="text-[22px] font-extrabold leading-[1.4] text-gray-900">{question.question}</h2>

          <div className="flex flex-col gap-4">
            {question.options.map((option, index) => {
              const isSelected = selectedOption === index;
              return (
                <motion.button
                  key={index}
                  whileTap={{ scale: 0.98 }}
                  onClick={() => setSelectedOption(index)}
                  className={cn(
                    "relative w-full overflow-hidden rounded-tl-[24px] rounded-br-[24px] rounded-tr-[8px] rounded-bl-[8px] border-2 p-6 text-left transition-all duration-300",
                    isSelected
                      ? isRose
                        ? "border-[#A7738B] bg-[#A7738B]/5 shadow-md"
                        : "border-[#A3B096] bg-[#A3B096]/5 shadow-md"
                      : "border-gray-100 bg-white hover:border-gray-200",
                  )}
                >
                  <div className="relative z-10 flex items-center justify-between gap-4">
                    <span className={cn("text-base leading-[1.5]", isSelected ? "font-bold text-gray-900" : "font-medium text-gray-600")}>
                      {option}
                    </span>
                    <div
                      className={cn(
                        "flex h-6 w-6 shrink-0 items-center justify-center rounded-full border-2 transition-colors duration-300",
                        isSelected
                          ? isRose
                            ? "border-[#A7738B] bg-[#A7738B] text-white"
                            : "border-[#A3B096] bg-[#A3B096] text-white"
                          : "border-gray-200 bg-transparent text-transparent",
                      )}
                    >
                      <Check size={16} strokeWidth={3} />
                    </div>
                  </div>
                </motion.button>
              );
            })}
          </div>
        </div>
      </div>

      <div className="fixed bottom-0 left-0 right-0 z-40 bg-gradient-to-t from-[#F8F9FA] via-[#F8F9FA] to-white/0 p-6 pb-8">
        <Button
          variant={isRose ? "primary" : "secondary"}
          size="lg"
          disabled={selectedOption === null || isSubmitting}
          onClick={handleSubmit}
          className={cn("w-full shadow-xl transition-all duration-300", selectedOption === null && "cursor-not-allowed opacity-50 shadow-none")}
        >
          {isSubmitting ? "Проверяем..." : "Проверить ответ"}
        </Button>
      </div>
    </motion.div>
  );
}

import * as React from "react";
import { AnimatePresence, motion } from "motion/react";
import { AlertCircle, Check, Clock, X } from "lucide-react";
import { useNavigate, useParams } from "react-router";
import { Button } from "../components/ui/Button";
import { courses, getMockTestForCourse } from "../lib/mock-data";
import { cn } from "../lib/utils";

export default function Test() {
  const { id } = useParams();
  const navigate = useNavigate();
  const course = courses.find((item) => item.id === id) || courses[0];
  const testQuestions = getMockTestForCourse(course.id);
  const [hasStarted, setHasStarted] = React.useState(false);
  const [currentQuestion, setCurrentQuestion] = React.useState(0);
  const [selectedOption, setSelectedOption] = React.useState<number | null>(null);
  const [isSubmitting, setIsSubmitting] = React.useState(false);
  const isRose = course.color === "rose";

  const question = testQuestions[currentQuestion];
  const progressPercent = ((currentQuestion + 1) / testQuestions.length) * 100;

  function handleNext() {
    if (selectedOption === null) {
      return;
    }

    if (currentQuestion < testQuestions.length - 1) {
      setCurrentQuestion((value) => value + 1);
      setSelectedOption(null);
      return;
    }

    setIsSubmitting(true);
    window.setTimeout(() => {
      navigate(`/course/${id}/result`);
    }, 900);
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
              "mb-8 flex h-24 w-24 items-center justify-center rounded-tl-[32px] rounded-br-[32px] rounded-tr-[8px] rounded-bl-[8px] shadow-sm",
              isRose ? "bg-[#A7738B]/10 text-[#A7738B]" : "bg-[#A3B096]/10 text-[#7C8D6D]",
            )}
          >
            <AlertCircle size={40} />
          </div>
          <h2 className="mb-4 text-3xl font-extrabold leading-tight text-gray-900">Итоговый тест</h2>
          <p className="mb-8 max-w-[300px] text-sm text-gray-500">
            Вопросы собраны по темам курса «{course.title}» и помогают проверить, как вы связали все уроки программы между собой.
          </p>

          <div className="flex w-full flex-col gap-4 rounded-2xl border border-gray-100 bg-white p-6 text-left shadow-sm">
            <div className="flex items-center justify-between border-b border-gray-50 pb-4">
              <span className="text-sm font-medium text-gray-500">Количество вопросов</span>
              <span className="text-sm font-bold text-gray-900">{testQuestions.length}</span>
            </div>
            <div className="flex items-center justify-between border-b border-gray-50 pb-4">
              <span className="text-sm font-medium text-gray-500">Проходной балл</span>
              <span className="text-sm font-bold text-gray-900">80%</span>
            </div>
            <div className="flex items-center justify-between border-b border-gray-50 pb-4">
              <span className="text-sm font-medium text-gray-500">Попыток</span>
              <span className="text-sm font-bold text-gray-900">3</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-sm font-medium text-gray-500">Ориентир по времени</span>
              <span className="flex items-center gap-1 text-sm font-bold text-gray-900">
                <Clock size={16} /> 12 мин
              </span>
            </div>
          </div>
        </div>

        <div className="mt-8 flex flex-col gap-4">
          <Button
            variant={isRose ? "primary" : "secondary"}
            size="lg"
            className="w-full shadow-2xl"
            onClick={() => setHasStarted(true)}
          >
            Начать тестирование
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
      initial={{ opacity: 0, scale: 0.98 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, scale: 1.02 }}
      transition={{ duration: 0.4 }}
      className="relative flex min-h-full flex-col bg-[#F8F9FA]"
    >
      <div className="z-20 flex flex-col gap-6 bg-white px-6 pb-4 pt-12 shadow-sm">
        <div className="flex items-center justify-between">
          <button
            onClick={() => navigate(`/course/${id}`)}
            className="flex h-10 w-10 items-center justify-center rounded-full bg-gray-50 text-gray-400 transition-colors hover:text-gray-900"
          >
            <X size={20} />
          </button>
          <span className="text-xs font-bold uppercase tracking-wider text-gray-400">
            Вопрос {currentQuestion + 1} из {testQuestions.length}
          </span>
          <div className="h-10 w-10" />
        </div>

        <div className="h-2 w-full overflow-hidden rounded-full bg-gray-100">
          <motion.div
            initial={{ width: 0 }}
            animate={{ width: `${progressPercent}%` }}
            className={cn("h-full rounded-full", isRose ? "bg-[#A7738B]" : "bg-[#A3B096]")}
            transition={{ duration: 0.5, ease: "easeInOut" }}
          />
        </div>
      </div>

      <div className="flex-1 overflow-y-auto px-6 pb-32 pt-12">
        <AnimatePresence mode="wait">
          <motion.div
            key={question.id}
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            transition={{ duration: 0.3 }}
            className="flex flex-col gap-8"
          >
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
          </motion.div>
        </AnimatePresence>
      </div>

      <div className="fixed bottom-0 left-0 right-0 z-40 bg-gradient-to-t from-[#F8F9FA] via-[#F8F9FA] to-white/0 p-6 pb-8">
        <Button
          variant={isRose ? "primary" : "secondary"}
          size="lg"
          disabled={selectedOption === null || isSubmitting}
          onClick={handleNext}
          className={cn("w-full shadow-xl transition-all duration-300", selectedOption === null && "cursor-not-allowed opacity-50 shadow-none")}
        >
          {isSubmitting ? "Проверяем результат..." : currentQuestion < testQuestions.length - 1 ? "Следующий вопрос" : "Завершить тест"}
        </Button>
      </div>
    </motion.div>
  );
}

import * as React from "react";
import { useState } from "react";
import { motion, AnimatePresence } from "motion/react";
import { X, Check, XCircle } from "lucide-react";
import { useParams, useNavigate } from "react-router";
import { courses, mockQuiz } from "../lib/mock-data";
import { Button } from "../components/ui/Button";
import { cn } from "../lib/utils";

export default function Quiz() {
  const { id, lessonId } = useParams();
  const navigate = useNavigate();
  const course = courses.find((c) => c.id === id) || courses[0];
  
  const [selectedOption, setSelectedOption] = useState<number | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [result, setResult] = useState<"pass" | "fail" | null>(null);

  const isRose = course.color === "rose";
  const question = mockQuiz; // In real app, find quiz by lessonId

  const handleSubmit = () => {
    if (selectedOption === null) return;
    
    setIsSubmitting(true);
    setTimeout(() => {
      setIsSubmitting(false);
      if (selectedOption === question.correctAnswer) {
        setResult("pass");
      } else {
        setResult("fail");
      }
    }, 800);
  };

  const handleRetry = () => {
    setSelectedOption(null);
    setResult(null);
  };

  const handleContinue = () => {
    navigate(`/course/${id}`);
  };

  if (result) {
    const isPassed = result === "pass";
    return (
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        className="min-h-full bg-white flex flex-col justify-center items-center relative overflow-hidden px-6"
      >
        {/* Background Decor */}
        <motion.div
          initial={{ opacity: 0, scale: 0.5 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 1.5, ease: "easeOut" }}
          className={cn(
            "absolute -top-16 -left-16 w-[140%] aspect-square rounded-full blur-[100px] opacity-10",
            isPassed ? "bg-[#A3B096]" : "bg-red-500"
          )}
        />

        <div className="flex-1 flex flex-col items-center justify-center w-full z-10 py-12">
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ type: "spring", bounce: 0.5 }}
            className={cn(
              "w-24 h-24 rounded-full flex items-center justify-center text-white mb-6 shadow-2xl",
              isPassed ? "bg-[#A3B096] shadow-[#A3B096]/40" : "bg-red-500 shadow-red-500/40"
            )}
          >
            {isPassed ? <Check size={48} strokeWidth={3} /> : <XCircle size={48} strokeWidth={2} />}
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="text-center w-full"
          >
            <h1 className={cn(
              "text-3xl font-extrabold mb-4 leading-tight",
              isPassed ? "text-[#A3B096]" : "text-red-500"
            )}>
              {isPassed ? "Отлично! Квиз пройден." : "Ответ неверный"}
            </h1>
            <p className="text-base text-gray-500 mb-8 max-w-xs mx-auto leading-relaxed">
              {isPassed 
                ? "Вы усвоили материал этого урока. Следующий урок успешно разблокирован." 
                : "Похоже, вы пропустили важную деталь. Пересмотрите видео или попробуйте ответить снова."}
            </p>
          </motion.div>
        </div>

        <motion.div
          initial={{ opacity: 0, y: 32 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="w-full flex flex-col gap-4 pb-8"
        >
          {isPassed ? (
            <Button
              variant="secondary"
              size="lg"
              onClick={handleContinue}
              className="w-full shadow-xl bg-[#A3B096] text-white hover:bg-[#8e9c81]"
            >
              Вернуться к курсу
            </Button>
          ) : (
            <>
              <Button
                variant="primary"
                size="lg"
                onClick={handleRetry}
                className="w-full shadow-xl bg-red-500 border-red-500 text-white hover:bg-red-600 hover:border-red-600 focus-visible:ring-red-500/20"
              >
                Попробовать снова
              </Button>
              <Button
                variant="ghost"
                size="lg"
                onClick={() => navigate(`/course/${id}/lesson/${lessonId}`)}
                className="w-full font-bold text-gray-500 hover:text-gray-900"
              >
                Вернуться к видеоуроку
              </Button>
            </>
          )}
        </motion.div>
      </motion.div>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0, x: 20 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: -20 }}
      transition={{ duration: 0.3 }}
      className="min-h-full bg-[#F8F9FA] flex flex-col relative"
    >
      {/* Header */}
      <div className="bg-white px-6 pt-12 pb-4 shadow-sm flex flex-col gap-6 z-20">
        <div className="flex items-center justify-between">
          <button
            onClick={() => navigate(`/course/${id}/lesson/${lessonId}`)}
            className="w-10 h-10 rounded-full bg-gray-50 flex items-center justify-center text-gray-400 hover:text-gray-900 transition-colors"
          >
            <X size={20} />
          </button>
          <div className="flex flex-col items-center">
            <span className="text-xs uppercase font-bold text-gray-400 tracking-wider">
              Проверка знаний
            </span>
          </div>
          <div className="w-10 h-10" /> {/* Spacer */}
        </div>
      </div>

      {/* Question Content */}
      <div className="flex-1 px-6 pt-12 pb-32 overflow-y-auto">
        <div className="flex flex-col gap-8">
          <h2 className="text-[22px] font-extrabold text-gray-900 leading-[1.4]">
            {question.question}
          </h2>

          <div className="flex flex-col gap-4">
            {question.options.map((option, idx) => {
              const isSelected = selectedOption === idx;
              return (
                <motion.button
                  key={idx}
                  whileTap={{ scale: 0.98 }}
                  onClick={() => setSelectedOption(idx)}
                  className={cn(
                    "w-full text-left p-6 rounded-tl-[24px] rounded-br-[24px] rounded-tr-[8px] rounded-bl-[8px] border-2 transition-all duration-300 relative overflow-hidden group",
                    isSelected
                      ? (isRose ? "border-[#A7738B] bg-[#A7738B]/5 shadow-md" : "border-[#A3B096] bg-[#A3B096]/5 shadow-md")
                      : "border-gray-100 bg-white hover:border-gray-200"
                  )}
                >
                  <div className="flex items-center justify-between relative z-10">
                    <span className={cn(
                      "text-base font-medium leading-[1.5] pr-8 transition-colors",
                      isSelected ? "text-gray-900 font-bold" : "text-gray-600"
                    )}>
                      {option}
                    </span>
                    <div className={cn(
                      "w-6 h-6 rounded-full border-2 flex items-center justify-center shrink-0 transition-colors duration-300",
                      isSelected
                        ? (isRose ? "border-[#A7738B] bg-[#A7738B] text-white" : "border-[#A3B096] bg-[#A3B096] text-white")
                        : "border-gray-200 bg-transparent text-transparent"
                    )}>
                      <Check size={16} strokeWidth={3} />
                    </div>
                  </div>
                </motion.button>
              );
            })}
          </div>
        </div>
      </div>

      {/* Action Bar */}
      <div className="fixed bottom-0 left-0 right-0 p-6 pb-8 bg-gradient-to-t from-[#F8F9FA] via-[#F8F9FA] to-white/0 z-40">
        <Button
          variant={isRose ? "primary" : "secondary"}
          size="lg"
          disabled={selectedOption === null || isSubmitting}
          onClick={handleSubmit}
          className={cn(
            "w-full transition-all duration-300 shadow-xl",
            selectedOption === null && "opacity-50 cursor-not-allowed transform-none shadow-none"
          )}
        >
          {isSubmitting ? (
            <motion.div
              animate={{ rotate: 360 }}
              transition={{ repeat: Infinity, duration: 1, ease: "linear" }}
              className="w-6 h-6 border-2 border-white/30 border-t-white rounded-full"
            />
          ) : (
            "Проверить ответ"
          )}
        </Button>
      </div>
    </motion.div>
  );
}

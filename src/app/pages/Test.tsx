import * as React from "react";
import { useState } from "react";
import { motion, AnimatePresence } from "motion/react";
import { X, Check, Clock, AlertCircle } from "lucide-react";
import { useParams, useNavigate } from "react-router";
import { courses, mockTest } from "../lib/mock-data";
import { Button } from "../components/ui/Button";
import { cn } from "../lib/utils";

export default function Test() {
  const { id } = useParams();
  const navigate = useNavigate();
  const course = courses.find((c) => c.id === id) || courses[0];

  const [hasStarted, setHasStarted] = useState(false);
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [selectedOption, setSelectedOption] = useState<number | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const isRose = course.color === "rose";

  const handleNext = () => {
    if (selectedOption === null) return;
    
    if (currentQuestion < mockTest.length - 1) {
      setCurrentQuestion((prev) => prev + 1);
      setSelectedOption(null);
    } else {
      setIsSubmitting(true);
      setTimeout(() => {
        navigate(`/course/${id}/result`);
      }, 1000);
    }
  };

  const question = mockTest[currentQuestion];
  const progressPercent = ((currentQuestion + 1) / mockTest.length) * 100;

  if (!hasStarted) {
    return (
      <motion.div
        initial={{ opacity: 0, x: 20 }}
        animate={{ opacity: 1, x: 0 }}
        exit={{ opacity: 0, x: -20 }}
        className="min-h-full bg-[#F8F9FA] flex flex-col p-6 pb-12 justify-between"
      >
        <div className="flex flex-col flex-1 justify-center items-center text-center">
          <div className={cn("w-24 h-24 rounded-tl-[32px] rounded-br-[32px] rounded-tr-[8px] rounded-bl-[8px] flex items-center justify-center mb-8 shadow-sm", isRose ? "bg-[#A7738B]/10 text-[#A7738B]" : "bg-[#A3B096]/10 text-[#A3B096]")}>
            <AlertCircle size={40} />
          </div>
          <h2 className="text-3xl font-extrabold text-gray-900 mb-4 leading-tight">Итоговое<br/>тестирование</h2>
          <p className="text-gray-500 text-sm max-w-[280px] mb-8">
            Вам предстоит пройти финальное испытание для получения сертификата по курсу «{course.title}».
          </p>

          <div className="w-full bg-white rounded-2xl p-6 shadow-sm border border-gray-100 flex flex-col gap-4 text-left">
            <div className="flex items-center justify-between border-b border-gray-50 pb-4">
              <span className="text-sm font-medium text-gray-500">Количество вопросов</span>
              <span className="text-sm font-bold text-gray-900">{mockTest.length}</span>
            </div>
            <div className="flex items-center justify-between border-b border-gray-50 pb-4">
              <span className="text-sm font-medium text-gray-500">Проходной балл</span>
              <span className="text-sm font-bold text-gray-900">80%</span>
            </div>
            <div className="flex items-center justify-between border-b border-gray-50 pb-4">
              <span className="text-sm font-medium text-gray-500">Лимит попыток</span>
              <span className="text-sm font-bold text-gray-900">3</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-sm font-medium text-gray-500">Ограничение по времени</span>
              <span className="text-sm font-bold text-gray-900 flex items-center gap-1"><Clock size={16}/> 15 мин</span>
            </div>
          </div>
        </div>
        
        <div className="flex flex-col gap-4 mt-8">
          <Button 
            variant={isRose ? "primary" : "secondary"}
            size="lg"
            className="w-full shadow-2xl"
            onClick={() => setHasStarted(true)}
          >
            Начать тестирование
          </Button>
          <Button 
            variant="ghost"
            size="lg"
            className="w-full text-gray-500 hover:text-gray-900"
            onClick={() => navigate(-1)}
          >
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
      className="min-h-full bg-[#F8F9FA] flex flex-col relative"
    >
      {/* Header */}
      <div className="bg-white px-6 pt-12 pb-4 shadow-sm flex flex-col gap-6 z-20">
        <div className="flex items-center justify-between">
          <button
            onClick={() => navigate(`/course/${id}`)}
            className="w-10 h-10 rounded-full bg-gray-50 flex items-center justify-center text-gray-400 hover:text-gray-900 transition-colors"
          >
            <X size={20} />
          </button>
          <div className="flex flex-col items-center">
            <span className="text-xs uppercase font-bold text-gray-400 tracking-wider">
              Вопрос {currentQuestion + 1} из {mockTest.length}
            </span>
          </div>
          <div className="w-10 h-10" /> {/* Spacer */}
        </div>

        {/* Progress bar */}
        <div className="w-full h-2 bg-gray-100 rounded-full overflow-hidden">
          <motion.div
            initial={{ width: 0 }}
            animate={{ width: `${progressPercent}%` }}
            className={cn("h-full rounded-full", isRose ? "bg-[#A7738B]" : "bg-[#A3B096]")}
            transition={{ duration: 0.5, ease: "easeInOut" }}
          />
        </div>
      </div>

      {/* Question Content */}
      <div className="flex-1 px-6 pt-12 pb-32 overflow-y-auto">
        <AnimatePresence mode="wait">
          <motion.div
            key={currentQuestion}
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            transition={{ duration: 0.3 }}
            className="flex flex-col gap-8"
          >
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
          </motion.div>
        </AnimatePresence>
      </div>

      {/* Action Bar */}
      <div className="fixed bottom-0 left-0 right-0 p-6 pb-8 bg-gradient-to-t from-[#F8F9FA] via-[#F8F9FA] to-white/0 z-40">
        <Button
          variant={isRose ? "primary" : "secondary"}
          size="lg"
          disabled={selectedOption === null || isSubmitting}
          onClick={handleNext}
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
          ) : currentQuestion < mockTest.length - 1 ? (
            "Следующий вопрос"
          ) : (
            "Завершить тест"
          )}
        </Button>
      </div>
    </motion.div>
  );
}

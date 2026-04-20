import * as React from "react";
import { useEffect, useState } from "react";
import { motion } from "motion/react";
import { Award } from "lucide-react";
import { useParams, useNavigate } from "react-router";
import { courses } from "../lib/mock-data";
import { Button } from "../components/ui/Button";
import { cn } from "../lib/utils";

export default function Result() {
  const { id } = useParams();
  const navigate = useNavigate();
  const course = courses.find((c) => c.id === id) || courses[0];
  const [showContent, setShowContent] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => setShowContent(true), 1200);
    return () => clearTimeout(timer);
  }, []);

  const score = 85; // Mock score
  const isPassed = score >= 70;
  
  const isRose = course.color === "rose";
  const resultColor = isPassed ? "#A3B096" : "#A7738B";

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="min-h-full bg-white flex flex-col justify-center items-center relative overflow-hidden px-6"
    >
      {/* Background Decor */}
      <motion.div
        initial={{ opacity: 0, scale: 0.5 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 1.5, ease: "easeOut" }}
        className={cn("absolute -top-16 -left-16 w-[140%] aspect-square rounded-full blur-[100px] opacity-10", isPassed ? "bg-[#A3B096]" : "bg-[#A7738B]")}
      />

      <div className="flex-1 flex flex-col items-center justify-center w-full z-10 py-12">
        {/* Animated Circle / Score */}
        <div className="relative w-56 h-56 mb-8">
          <svg className="w-full h-full transform -rotate-90" viewBox="0 0 100 100">
            <circle
              cx="50"
              cy="50"
              r="46"
              fill="none"
              stroke="#f3f4f6"
              strokeWidth="6"
            />
            <motion.circle
              cx="50"
              cy="50"
              r="46"
              fill="none"
              stroke={resultColor}
              strokeWidth="6"
              strokeLinecap="round"
              strokeDasharray={289}
              initial={{ strokeDashoffset: 289 }}
              animate={{ strokeDashoffset: 289 - (289 * score) / 100 }}
              transition={{ duration: 2, ease: "easeOut", delay: 0.2 }}
            />
          </svg>
          
          <div className="absolute inset-0 flex flex-col items-center justify-center">
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ type: "spring", bounce: 0.5, delay: 0.8 }}
              className={cn("w-14 h-14 rounded-full flex items-center justify-center text-white mb-4 shadow-lg", isPassed ? "bg-[#A3B096]" : "bg-[#A7738B]")}
            >
              <Award size={28} />
            </motion.div>
            <motion.span
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 1 }}
              className="text-5xl font-extrabold text-gray-900 tracking-tighter"
            >
              {score}%
            </motion.span>
          </div>
        </div>

        {/* Text Results */}
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: showContent ? 1 : 0, y: showContent ? 0 : 24 }}
          transition={{ duration: 0.5 }}
          className="text-center w-full"
        >
          <h1 className={cn("text-3xl font-extrabold mb-4 leading-tight", isPassed ? "text-[#A3B096]" : "text-[#A7738B]")}>
            {isPassed ? "Отличная работа!" : "Попробуйте еще раз!"}
          </h1>
          <p className="text-base text-gray-500 mb-8 max-w-xs mx-auto leading-relaxed">
            {isPassed 
              ? `Вы успешно завершили курс "${course.title}" и усвоили ключевые концепции.` 
              : `Вы не набрали проходной балл по курсу "${course.title}". Повторите материалы и попробуйте снова.`}
          </p>

          <div className="bg-gray-50 rounded-tl-[32px] rounded-br-[32px] rounded-tr-[8px] rounded-bl-[8px] p-6 border border-gray-100 flex justify-between items-center shadow-sm w-full mb-8">
            <div className="text-left">
              <p className="text-xs uppercase font-bold text-gray-400 tracking-wider mb-2">Затрачено времени</p>
              <p className="text-lg font-bold text-gray-900">12м 45с</p>
            </div>
            <div className="w-[2px] h-12 bg-gray-200" />
            <div className="text-right">
              <p className="text-xs uppercase font-bold text-gray-400 tracking-wider mb-2">Правильно</p>
              <p className="text-lg font-bold text-gray-900">17 / 20</p>
            </div>
          </div>
        </motion.div>
      </div>

      {/* Action Buttons */}
      <motion.div
        initial={{ opacity: 0, y: 32 }}
        animate={{ opacity: showContent ? 1 : 0, y: showContent ? 0 : 32 }}
        transition={{ duration: 0.5, delay: 0.2 }}
        className="w-full flex flex-col gap-4 pb-8"
      >
        {isPassed ? (
          <Button
            variant="secondary"
            size="lg"
            onClick={() => navigate(`/course/${id}/certificate`)}
            className="w-full shadow-xl relative overflow-hidden bg-[#A3B096] text-white hover:bg-[#8e9c81]"
          >
            Получить сертификат
          </Button>
        ) : (
          <Button
            variant="primary"
            size="lg"
            onClick={() => navigate(`/course/${id}/test`)}
            className="w-full shadow-xl relative overflow-hidden bg-[#A7738B] text-white hover:bg-[#976077]"
          >
            Пересдать тест
          </Button>
        )}
        
        <Button
          variant="ghost"
          size="lg"
          onClick={() => navigate(isPassed ? "/" : `/course/${id}`)}
          className="w-full font-bold text-gray-500 hover:text-gray-900"
        >
          {isPassed ? "Вернуться на главную" : "Вернуться к описанию курса"}
        </Button>
      </motion.div>
    </motion.div>
  );
}

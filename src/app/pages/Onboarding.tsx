import * as React from "react";
import { useState } from "react";
import { motion, AnimatePresence } from "motion/react";
import { useNavigate } from "react-router";
import { ChevronRight, BookOpen, Target, LineChart } from "lucide-react";
import { Button } from "../components/ui/Button";
import { cn } from "../lib/utils";

const slides = [
  {
    id: 1,
    title: "Обучение в любом месте",
    description: "Получите доступ к корпоративным материалам и курсам прямо с вашего телефона.",
    icon: BookOpen,
    color: "rose",
  },
  {
    id: 2,
    title: "Проверка знаний",
    description: "Проходите тесты и закрепляйте полученные знания на практике.",
    icon: Target,
    color: "green",
  },
  {
    id: 3,
    title: "Отслеживание прогресса",
    description: "Следите за своими успехами, получайте сертификаты и повышайте уровень.",
    icon: LineChart,
    color: "rose",
  }
];

export default function Onboarding() {
  const navigate = useNavigate();
  const [currentSlide, setCurrentSlide] = useState(0);

  const slide = slides[currentSlide];
  const isRose = slide.color === "rose";

  const handleNext = () => {
    if (currentSlide < slides.length - 1) {
      setCurrentSlide(prev => prev + 1);
    } else {
      navigate("/login");
    }
  };

  const handleSkip = () => {
    navigate("/login");
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="min-h-full bg-white flex flex-col relative overflow-hidden"
    >
      {/* Decorative background blurs */}
      <AnimatePresence mode="wait">
        <motion.div
          key={`bg-${currentSlide}`}
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 0.15, scale: 1 }}
          exit={{ opacity: 0, scale: 1.1 }}
          transition={{ duration: 0.8 }}
          className={cn(
            "absolute -top-32 -right-32 w-[120%] aspect-square rounded-full blur-[100px]",
            isRose ? "bg-[#A7738B]" : "bg-[#A3B096]"
          )}
        />
      </AnimatePresence>

      {/* Header */}
      <div className="flex justify-end p-6 z-20">
        <button 
          onClick={handleSkip}
          className="text-sm font-bold text-gray-400 hover:text-gray-900 transition-colors uppercase tracking-wider"
        >
          Пропустить
        </button>
      </div>

      {/* Content */}
      <div className="flex-1 flex flex-col items-center justify-center px-8 z-20">
        <AnimatePresence mode="wait">
          <motion.div
            key={currentSlide}
            initial={{ opacity: 0, y: 20, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -20, scale: 1.05 }}
            transition={{ duration: 0.4, ease: "easeOut" }}
            className="flex flex-col items-center text-center w-full"
          >
            <div className={cn(
              "w-32 h-32 rounded-tl-[32px] rounded-br-[32px] rounded-tr-[8px] rounded-bl-[8px] flex items-center justify-center mb-10 shadow-2xl relative",
              isRose ? "bg-[#A7738B] shadow-[#A7738B]/30" : "bg-[#A3B096] shadow-[#A3B096]/30"
            )}>
              <div className="absolute inset-0 bg-white/10 rounded-tl-[32px] rounded-br-[32px] rounded-tr-[8px] rounded-bl-[8px] blur-sm mix-blend-overlay" />
              <slide.icon size={56} className="text-white relative z-10" strokeWidth={1.5} />
            </div>

            <h1 className="text-3xl font-extrabold font-serif text-gray-900 mb-4 leading-tight">
              {slide.title}
            </h1>
            <p className="text-base text-gray-500 leading-relaxed max-w-xs">
              {slide.description}
            </p>
          </motion.div>
        </AnimatePresence>
      </div>

      {/* Bottom Actions */}
      <div className="p-8 pb-12 z-20 flex flex-col items-center">
        {/* Pagination Dots */}
        <div className="flex gap-2 mb-8">
          {slides.map((_, idx) => (
            <motion.div
              key={idx}
              className={cn(
                "h-2 rounded-full transition-all duration-300",
                currentSlide === idx 
                  ? (isRose ? "w-6 bg-[#A7738B]" : "w-6 bg-[#A3B096]") 
                  : "w-2 bg-gray-200"
              )}
            />
          ))}
        </div>

        <Button
          variant={isRose ? "primary" : "secondary"}
          size="lg"
          onClick={handleNext}
          className={cn(
            "w-full shadow-xl transition-all duration-300",
            isRose ? "shadow-[#A7738B]/20" : "shadow-[#A3B096]/20"
          )}
        >
          {currentSlide === slides.length - 1 ? "Начать работу" : "Далее"}
          {currentSlide < slides.length - 1 && <ChevronRight size={24} />}
        </Button>
      </div>
    </motion.div>
  );
}

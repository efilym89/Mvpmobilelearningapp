import * as React from "react";
import { motion } from "motion/react";
import { ChevronLeft, PlayCircle, BookOpen, CheckCircle2, Lock, Sparkles } from "lucide-react";
import { useParams, useNavigate } from "react-router";
import { courses } from "../lib/mock-data";
import { Button } from "../components/ui/Button";
import { cn } from "../lib/utils";

export default function CourseDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const course = courses.find((c) => c.id === id) || courses[0];

  const isRose = course.color === "rose";
  const primaryColor = isRose ? "bg-[#A7738B]" : "bg-[#A3B096]";

  return (
    <motion.div
      initial={{ opacity: 0, x: 20 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: -20 }}
      transition={{ duration: 0.3 }}
      className="min-h-full bg-white flex flex-col relative"
    >
      {/* Top Banner Area */}
      <div className={cn("relative pt-12 pb-32 px-6 text-white overflow-hidden shadow-sm", primaryColor)}>
        <Sparkles className="absolute -right-10 top-0 opacity-20 text-white" size={180} strokeWidth={1} />
        {/* Subtle motion background patterns */}
        <motion.div
          animate={{ scale: [1, 1.1, 1], rotate: [0, 5, 0] }}
          transition={{ duration: 15, repeat: Infinity, ease: "linear" }}
          className="absolute -top-32 -right-32 w-96 h-96 bg-white/5 rounded-full blur-[80px]"
        />
        <motion.div
          animate={{ scale: [1, 1.2, 1], rotate: [0, -5, 0] }}
          transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
          className="absolute -bottom-32 -left-32 w-80 h-80 bg-white/10 rounded-full blur-[60px]"
        />

        <div className="flex items-center gap-4 relative z-10 mb-8">
          <button
            onClick={() => navigate("/")}
            className="w-10 h-10 rounded-full bg-white/20 backdrop-blur-md flex items-center justify-center hover:bg-white/30 transition-all"
          >
            <ChevronLeft size={24} />
          </button>
          <span className="text-sm font-semibold tracking-wide uppercase opacity-90">О курсе</span>
        </div>

        <div className="relative z-10 pr-8">
          <h1 className="text-3xl font-extrabold mb-4 leading-tight">{course.title}</h1>
          <p className="text-white/80 text-base leading-relaxed mb-8 font-medium">{course.description}</p>
          
          <div className="flex flex-col gap-6">
            <div className="flex items-center gap-6">
              <div>
                <p className="text-xs uppercase font-bold text-white/60 tracking-wider mb-2">Прогресс</p>
                <p className="text-2xl font-bold">{course.progress}%</p>
              </div>
              <div className="w-[2px] h-10 bg-white/20" />
              <div>
                <p className="text-xs uppercase font-bold text-white/60 tracking-wider mb-2">Уроки</p>
                <p className="text-2xl font-bold">{course.completedLessons} / {course.totalLessons}</p>
              </div>
            </div>
            
            <div className="h-1.5 w-full bg-white/20 rounded-full overflow-hidden max-w-xs">
              <motion.div 
                className="h-full bg-white rounded-full"
                initial={{ width: 0 }}
                animate={{ width: `${course.progress}%` }}
                transition={{ duration: 1, delay: 0.2 }}
              />
            </div>
          </div>
        </div>
      </div>

      {/* Content Sheet */}
      <div className="flex-1 bg-white -mt-16 rounded-t-[40px] px-6 pt-8 pb-12 relative z-20 shadow-[0_-8px_30px_rgb(0,0,0,0.06)] flex flex-col">
        <div className="w-16 h-2 bg-gray-200 rounded-full mx-auto absolute top-4 left-1/2 -translate-x-1/2" />
        
        <h2 className="text-2xl font-extrabold text-gray-900 mb-8 mt-4 flex items-center gap-4">
          <BookOpen size={24} className={isRose ? "text-[#A7738B]" : "text-[#A3B096]"} />
          Программа
        </h2>

        <div className="flex flex-col gap-10 relative">
          <div className="absolute left-10 top-12 bottom-12 w-[2px] bg-gray-100 z-0 hidden" />

          {[1, 2].map((day) => {
            const dayLessons = course.lessons.filter((l) => l.day === day || (!l.day && day === 1));
            if (dayLessons.length === 0) return null;
            
            const completedInDay = dayLessons.filter(l => l.isCompleted).length;
            const progressInDay = Math.round((completedInDay / dayLessons.length) * 100);

            return (
              <div key={`day-${day}`} className="relative z-10 flex flex-col gap-6">
                {/* Day Header */}
                <div className="flex items-center justify-between">
                  <h3 className="text-xl font-bold text-gray-900">День {day}</h3>
                  <div className="flex items-center gap-4">
                    <span className="text-xs font-bold text-gray-500 uppercase tracking-wider">{completedInDay} / {dayLessons.length}</span>
                  </div>
                </div>
                
                {/* Day Progress Bar */}
                <div className="h-1.5 w-full bg-gray-100 rounded-full overflow-hidden -mt-2">
                  <motion.div
                    className={cn("h-full rounded-full", isRose ? "bg-[#A7738B]" : "bg-[#A3B096]")}
                    initial={{ width: 0 }}
                    animate={{ width: `${progressInDay}%` }}
                    transition={{ duration: 1, ease: "easeOut" }}
                  />
                </div>

                <div className="flex flex-col gap-6">
                  {dayLessons.map((lesson, idx) => {
                    const globalIdx = course.lessons.findIndex(l => l.id === lesson.id);
                    const isLocked = !lesson.isCompleted && course.lessons[globalIdx - 1] && !course.lessons[globalIdx - 1].isCompleted;
                    const isActive = !lesson.isCompleted && !isLocked;
                    const isDone = lesson.isCompleted;
                    const progress = lesson.progress || 0;
                    const isPartial = isActive && progress > 0;

                    return (
                      <motion.div
                        key={lesson.id}
                        initial={{ opacity: 0, y: 16 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: globalIdx * 0.1 }}
                        className={cn(
                          "relative z-10 flex flex-col p-5 rounded-tl-[32px] rounded-br-[32px] rounded-tr-[8px] rounded-bl-[8px] border-2 transition-all duration-300",
                          !isLocked ? "cursor-pointer" : "cursor-not-allowed",
                          isActive ? (isRose ? "bg-white border-[#A7738B]/20 shadow-xl" : "bg-white border-[#A3B096]/20 shadow-xl") : "bg-white border-transparent",
                          isLocked && "opacity-50 grayscale",
                          isDone && "border-gray-100 bg-gray-50/50"
                        )}
                        onClick={() => {
                          if (!isLocked) {
                            if (lesson.type === 'тест') {
                              navigate(`/course/${course.id}/test`);
                            } else {
                              navigate(`/course/${course.id}/lesson/${lesson.id}`);
                            }
                          }
                        }}
                      >
                        {/* Active / Continue Watching Tag */}
                        {isActive && (
                          <div className="absolute -top-3 right-6 flex items-center z-20">
                            <span className={cn(
                              "text-[10px] font-extrabold uppercase tracking-wider px-3 py-1 rounded-full shadow-sm text-white flex items-center gap-1",
                              isRose ? "bg-[#A7738B]" : "bg-[#A3B096]"
                            )}>
                              {isPartial ? "Продолжить" : "Текущий"}
                            </span>
                          </div>
                        )}

                        <div className="flex gap-4">
                          {/* Video Thumbnail */}
                          <div className="w-32 aspect-video shrink-0 rounded-tl-xl rounded-br-xl rounded-tr-sm rounded-bl-sm overflow-hidden relative bg-gray-100 flex items-center justify-center border border-gray-200">
                            {lesson.thumbnail ? (
                              <img src={lesson.thumbnail} alt={lesson.title} className="w-full h-full object-cover" />
                            ) : (
                              <PlayCircle size={24} className="text-gray-400" />
                            )}
                            
                            {/* Overlay */}
                            <div className={cn(
                              "absolute inset-0 flex items-center justify-center bg-black/20 transition-colors",
                              isActive ? "bg-black/10" : ""
                            )}>
                              {isDone ? (
                                <div className="w-8 h-8 rounded-full bg-[#A3B096] flex items-center justify-center text-white shadow-md">
                                  <CheckCircle2 size={16} strokeWidth={3} />
                                </div>
                              ) : isLocked ? (
                                <div className="w-8 h-8 rounded-full bg-gray-900/60 backdrop-blur-sm flex items-center justify-center text-white">
                                  <Lock size={16} />
                                </div>
                              ) : (
                                <div className={cn(
                                  "w-8 h-8 rounded-full flex items-center justify-center text-white backdrop-blur-md shadow-lg",
                                  isRose ? "bg-[#A7738B]/80" : "bg-[#A3B096]/80"
                                )}>
                                  <PlayCircle size={18} fill="currentColor" className="ml-0.5" />
                                </div>
                              )}
                            </div>
                            
                            <div className="absolute bottom-1 right-1 bg-black/70 px-1.5 py-0.5 rounded text-[10px] font-mono text-white font-medium backdrop-blur-sm">
                              {lesson.duration}
                            </div>
                          </div>

                          <div className="flex-1 py-0.5 flex flex-col justify-center">
                            <div className="flex items-center justify-between mb-1.5">
                              <span className="text-[10px] uppercase font-extrabold tracking-wider text-gray-400">
                                {lesson.type === 'тест' ? 'Итоговый тест' : `Урок ${globalIdx + 1}`}
                              </span>
                            </div>
                            <h3 className={cn(
                              "text-sm font-bold leading-snug line-clamp-2",
                              isLocked ? "text-gray-500" : "text-gray-900"
                            )}>
                              {lesson.title}
                            </h3>
                          </div>
                        </div>

                        {isPartial && (
                          <div className="mt-4 flex items-center gap-3">
                            <div className="text-[10px] font-bold text-gray-500 uppercase tracking-wider">{progress}%</div>
                            <div className="flex-1 h-1.5 bg-gray-100 rounded-full overflow-hidden">
                              <motion.div 
                                className={cn("h-full rounded-full", isRose ? "bg-[#A7738B]" : "bg-[#A3B096]")}
                                initial={{ width: 0 }}
                                animate={{ width: `${progress}%` }}
                                transition={{ duration: 1, delay: 0.3 }}
                              />
                            </div>
                          </div>
                        )}
                      </motion.div>
                    );
                  })}
                </div>
              </div>
            );
          })}
        </div>

        <div className="mt-8 mb-8">
          <Button 
            variant={isRose ? "primary" : "secondary"}
            size="lg"
            onClick={() => {
              const nextLesson = course.lessons.find(l => !l.isCompleted) || course.lessons[0];
              navigate(`/course/${course.id}/lesson/${nextLesson.id}`);
            }}
          >
            {course.progress === 0 ? "Начать обучение" : "Продолжить"}
          </Button>
        </div>
      </div>
    </motion.div>
  );
}

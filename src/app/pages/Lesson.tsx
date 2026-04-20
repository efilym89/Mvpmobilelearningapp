import * as React from "react";
import { motion } from "motion/react";
import { ChevronLeft, Clock, PlayCircle, Maximize, Volume2, Pause, SkipForward, FileText, CheckCircle2 } from "lucide-react";
import { useParams, useNavigate } from "react-router";
import { courses } from "../lib/mock-data";
import { Button } from "../components/ui/Button";
import { cn } from "../lib/utils";

export default function Lesson() {
  const { id, lessonId } = useParams();
  const navigate = useNavigate();
  const course = courses.find((c) => c.id === id) || courses[0];
  const lesson = course.lessons.find((l) => l.id === lessonId) || course.lessons[0];

  const isTest = lesson.type === "тест";
  const isRose = course.color === "rose";
  const progress = lesson.progress || 0;
  
  // Dummy toggle for play state to make the mockup feel interactive
  const [isPlaying, setIsPlaying] = React.useState(false);

  return (
    <motion.div
      initial={{ opacity: 0, x: 20 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: -20 }}
      transition={{ duration: 0.3 }}
      className="min-h-full bg-[#F8F9FA] relative flex flex-col pb-[100px]"
    >
      {/* Video Section - Fixed at top visually or scrolled with page */}
      <div className="bg-black w-full relative aspect-video flex-shrink-0 z-50 group">
        {/* Top bar with back button overlaid on video */}
        <div className="absolute top-0 left-0 right-0 p-4 bg-gradient-to-b from-black/60 to-transparent flex items-center z-20">
          <button
            onClick={() => navigate(`/course/${id}`)}
            className="w-10 h-10 rounded-full bg-black/40 backdrop-blur-sm flex items-center justify-center text-white hover:bg-black/60 transition-colors shrink-0"
          >
            <ChevronLeft size={24} />
          </button>
          <div className="flex-1 px-4">
            <h2 className="text-sm font-bold text-white truncate drop-shadow-md">{lesson.title}</h2>
          </div>
        </div>

        {/* Video Thumbnail */}
        <img 
          src={lesson.thumbnail || "https://images.unsplash.com/photo-1552664730-d307ca884978?auto=format&fit=crop&q=80&w=1600&h=900"} 
          alt="Video thumbnail" 
          className={cn("w-full h-full object-cover transition-opacity duration-300", isPlaying ? "opacity-40" : "opacity-80")}
        />

        {/* Big Play Button Overlay */}
        {!isPlaying && (
          <div 
            className="absolute inset-0 flex items-center justify-center cursor-pointer z-10"
            onClick={() => setIsPlaying(true)}
          >
            <div className={cn(
              "w-16 h-16 rounded-full backdrop-blur-md flex items-center justify-center text-white shadow-2xl transition-transform hover:scale-110",
              isRose ? "bg-[#A7738B]/80" : "bg-[#A3B096]/80"
            )}>
              <PlayCircle size={36} className="ml-1" fill="currentColor" />
            </div>
          </div>
        )}

        {/* Bottom Playback UI (Static Mock) */}
        <div className={cn(
          "absolute bottom-0 left-0 right-0 p-4 bg-gradient-to-t from-black/80 to-transparent z-20 transition-opacity duration-300",
          isPlaying ? "opacity-100" : "opacity-0 group-hover:opacity-100"
        )}>
          {/* Progress Bar */}
          <div className="flex items-center gap-3 mb-3">
            <span className="text-[11px] font-medium text-white font-mono">03:42</span>
            <div className="flex-1 h-1.5 bg-white/30 rounded-full overflow-hidden cursor-pointer relative">
              <div 
                className={cn("absolute top-0 left-0 bottom-0 rounded-full", isRose ? "bg-[#A7738B]" : "bg-[#A3B096]")}
                style={{ width: `${progress > 0 ? progress : 35}%` }}
              />
            </div>
            <span className="text-[11px] font-medium text-white/70 font-mono">{lesson.duration}</span>
          </div>
          
          {/* Controls */}
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <button onClick={() => setIsPlaying(!isPlaying)} className="text-white hover:text-gray-300 transition-colors">
                {isPlaying ? <Pause size={20} fill="currentColor" /> : <PlayCircle size={20} fill="currentColor" />}
              </button>
              <button className="text-white hover:text-gray-300 transition-colors">
                <SkipForward size={20} fill="currentColor" />
              </button>
              <button className="text-white hover:text-gray-300 transition-colors hidden sm:block">
                <Volume2 size={20} />
              </button>
            </div>
            <div className="flex items-center gap-4">
              <button className="text-white hover:text-gray-300 transition-colors">
                <Maximize size={20} />
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Content Area */}
      <div className="flex-1 px-6 pt-6 pb-8 bg-white rounded-b-3xl shadow-sm z-10 relative">
        <div className="flex items-center gap-3 mb-4">
          <span className={cn(
            "px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider",
            isRose ? "bg-[#A7738B]/10 text-[#A7738B]" : "bg-[#A3B096]/10 text-[#A3B096]"
          )}>
            {lesson.type}
          </span>
          <span className="flex items-center gap-2 text-xs font-semibold text-gray-500 bg-gray-50 px-3 py-1 rounded-full">
            <Clock size={14} /> {lesson.duration}
          </span>
          {lesson.isCompleted && (
            <span className="flex items-center gap-1.5 text-xs font-bold text-[#A3B096] bg-[#A3B096]/10 px-3 py-1 rounded-full ml-auto">
              <CheckCircle2 size={14} /> Просмотрено
            </span>
          )}
        </div>

        <h1 className="text-2xl font-extrabold text-gray-900 mb-2 leading-tight">{lesson.title}</h1>
        
        {/* Watch Progress Display */}
        {!lesson.isCompleted && progress > 0 && (
          <div className="flex items-center gap-3 mb-6 bg-gray-50 p-4 rounded-tl-2xl rounded-br-2xl rounded-tr-md rounded-bl-md border border-gray-100">
            <div className="flex-1">
              <div className="flex justify-between text-xs font-bold text-gray-500 mb-2 uppercase tracking-wider">
                <span>Прогресс просмотра</span>
                <span>{progress}%</span>
              </div>
              <div className="h-2 w-full bg-gray-200 rounded-full overflow-hidden">
                <motion.div
                  className={cn("h-full rounded-full", isRose ? "bg-[#A7738B]" : "bg-[#A3B096]")}
                  initial={{ width: 0 }}
                  animate={{ width: `${progress}%` }}
                  transition={{ duration: 1, ease: "easeOut" }}
                />
              </div>
            </div>
          </div>
        )}

        <div className="mt-8 border-t border-gray-100 pt-8">
          <h3 className="text-lg font-bold text-gray-900 mb-4 flex items-center gap-2">
            <FileText size={20} className={isRose ? "text-[#A7738B]" : "text-[#A3B096]"} />
            Описание урока
          </h3>
          <div className="prose prose-sm prose-p:text-base prose-p:leading-relaxed prose-p:text-gray-600">
            <p>
              В этом видеоуроке мы подробно разберем ключевые концепции темы. 
              Внимательно следите за материалом, так как он будет включен в итоговое тестирование 
              данного модуля.
            </p>
            <p>
              Ключевые моменты, на которые стоит обратить внимание:
            </p>
            <ul className="list-disc pl-5 mt-2 space-y-2 text-gray-600 text-base">
              <li>Понимание базовых принципов взаимодействия.</li>
              <li>Разбор реальных корпоративных кейсов.</li>
              <li>Практические советы для применения в ежедневной работе.</li>
            </ul>
          </div>
        </div>
      </div>

      {/* Action Bar at Bottom */}
      <div className="fixed bottom-0 left-0 right-0 p-6 bg-gradient-to-t from-white via-white to-white/0 z-40 pb-8 flex flex-col gap-4">
        {lesson.isCompleted ? (
          <div className="bg-green-50 text-green-700 px-4 py-3 rounded-2xl border border-green-100 text-sm font-bold flex items-center justify-center gap-2 shadow-sm">
            <CheckCircle2 size={18} /> Следующий урок открыт
          </div>
        ) : null}

        <Button 
          variant={isRose ? "primary" : "secondary"}
          size="lg"
          onClick={() => {
            if (isTest) {
              navigate(`/course/${id}/test`);
            } else if (lesson.isCompleted) {
              navigate(`/course/${id}`);
            } else {
              // Navigate to lesson quiz
              navigate(`/course/${id}/lesson/${lesson.id}/quiz`);
            }
          }}
          className="shadow-2xl"
        >
          {isTest 
            ? "Начать итоговый тест" 
            : (lesson.isCompleted ? "Вернуться к курсу" : "Пройти квиз по уроку")}
        </Button>
      </div>
    </motion.div>
  );
}

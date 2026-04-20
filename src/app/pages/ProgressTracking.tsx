import * as React from "react";
import { motion } from "motion/react";
import { Award, Target, Trophy, Clock, CheckCircle2, TrendingUp } from "lucide-react";
import { courses, mockUser } from "../lib/mock-data";
import { Card } from "../components/ui/Card";
import { cn } from "../lib/utils";

export default function ProgressTracking() {
  const completedStats = [
    { label: "Курсы", value: 4, icon: Award, color: "rose" },
    { label: "Тесты", value: 12, icon: Target, color: "green" },
    { label: "Часы", value: 18, icon: Clock, color: "rose" },
    { label: "Балл", value: "92%", icon: Trophy, color: "green" }
  ];

  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -16 }}
      transition={{ duration: 0.35, ease: [0.22, 1, 0.36, 1] }}
      className="pb-8 h-full flex flex-col bg-[#F8F9FA]"
    >
      {/* Header */}
      <div className="bg-white pt-12 pb-6 px-6 shadow-sm border-b border-gray-100 z-10 sticky top-0">
        <h1 className="text-2xl font-extrabold text-gray-900 tracking-tight mb-2">Ваш прогресс</h1>
        <p className="text-sm text-gray-500">Отслеживайте свои успехи и достижения</p>
      </div>

      <div className="flex-1 overflow-y-auto px-6 py-6 flex flex-col gap-8">
        
        {/* Level Banner */}
        <Card className="overflow-hidden relative bg-[#A7738B] text-white p-6 shadow-xl shadow-[#A7738B]/20">
          <div className="absolute -top-12 -right-12 w-40 h-40 bg-white/10 rounded-full blur-2xl" />
          <div className="relative z-10 flex gap-6 items-center">
            <div className="w-16 h-16 shrink-0 rounded-2xl bg-white/20 backdrop-blur-md flex items-center justify-center border border-white/30 shadow-inner">
              <TrendingUp size={32} className="text-white drop-shadow-md" />
            </div>
            <div className="flex-1">
              <div className="flex items-center gap-2 mb-2">
                <span className="text-xs font-extrabold uppercase tracking-wider bg-white/20 px-3 py-1 rounded-full">Уровень 4</span>
              </div>
              <h2 className="text-xl font-extrabold leading-tight mb-4">Старший специалист</h2>
              
              <div className="flex flex-col gap-2">
                <div className="h-2 w-full bg-black/20 rounded-full overflow-hidden">
                  <motion.div
                    className="h-full bg-white rounded-full"
                    initial={{ width: 0 }}
                    animate={{ width: "75%" }}
                    transition={{ duration: 1, delay: 0.2, ease: "easeOut" }}
                  />
                </div>
                <div className="flex justify-between text-xs font-semibold text-white/80">
                  <span>1,500 XP</span>
                  <span>2,000 XP</span>
                </div>
              </div>
            </div>
          </div>
        </Card>

        {/* Quick Stats Grid */}
        <div className="grid grid-cols-2 gap-4">
          {completedStats.map((stat, i) => {
            const isRose = stat.color === "rose";
            return (
              <motion.div
                key={i}
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: 0.1 + i * 0.05 }}
              >
                <Card className="p-6 flex flex-col items-center justify-center text-center hover:-translate-y-1 transition-transform cursor-default">
                  <div className={cn(
                    "w-12 h-12 rounded-2xl flex items-center justify-center mb-4 transition-colors",
                    isRose ? "bg-[#A7738B]/10 text-[#A7738B]" : "bg-[#A3B096]/10 text-[#A3B096]"
                  )}>
                    <stat.icon size={24} strokeWidth={2} />
                  </div>
                  <h3 className="text-3xl font-extrabold text-gray-900 leading-none mb-2">
                    {stat.value}
                  </h3>
                  <p className="text-xs font-bold uppercase tracking-wider text-gray-400">
                    {stat.label}
                  </p>
                </Card>
              </motion.div>
            );
          })}
        </div>

        {/* Active Courses Progress */}
        <div>
          <h3 className="text-lg font-extrabold text-gray-900 mb-6 flex items-center gap-2">
            <Target size={20} className="text-[#A7738B]" /> Текущие курсы
          </h3>

          <div className="flex flex-col gap-4">
            {courses.slice(0, 2).map((course, i) => {
              const isRose = course.color === "rose";
              return (
                <Card key={course.id} className="p-6 flex flex-col gap-4">
                  <div className="flex justify-between items-start gap-4">
                    <div className="flex-1 pr-4">
                      <h4 className="text-base font-bold text-gray-900 leading-tight mb-2">{course.title}</h4>
                      <p className="text-sm font-semibold text-gray-500">Урок {course.completedLessons + 1} из {course.totalLessons}</p>
                    </div>
                    <div className={cn(
                      "w-14 h-14 rounded-full flex items-center justify-center shrink-0 border-4 shadow-inner text-sm font-bold",
                      isRose ? "border-[#A7738B]/20 text-[#A7738B]" : "border-[#A3B096]/20 text-[#A3B096]"
                    )}>
                      {course.progress}%
                    </div>
                  </div>
                  
                  <div className="h-2 w-full bg-gray-100 rounded-full overflow-hidden mt-2">
                    <motion.div
                      className={cn("h-full rounded-full", isRose ? "bg-[#A7738B]" : "bg-[#A3B096]")}
                      initial={{ width: 0 }}
                      animate={{ width: `${course.progress}%` }}
                      transition={{ duration: 1, delay: 0.3 + i * 0.1, ease: "easeOut" }}
                    />
                  </div>
                </Card>
              );
            })}
          </div>
        </div>

        {/* Recent Achievements */}
        <div className="mb-8">
          <h3 className="text-lg font-extrabold text-gray-900 mb-6 flex items-center gap-2">
            <Award size={20} className="text-[#A3B096]" /> Последние достижения
          </h3>
          <Card className="p-4 border border-[#A3B096]/20 bg-gradient-to-r from-white to-[#A3B096]/5">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 rounded-full bg-[#A3B096] text-white flex items-center justify-center shadow-lg shadow-[#A3B096]/30 shrink-0">
                <CheckCircle2 size={24} />
              </div>
              <div>
                <h4 className="text-sm font-bold text-gray-900 mb-1">Мастер Коммуникаций</h4>
                <p className="text-xs text-gray-500">Завершено 5 тестов подряд без ошибок</p>
              </div>
            </div>
          </Card>
        </div>

      </div>
    </motion.div>
  );
}

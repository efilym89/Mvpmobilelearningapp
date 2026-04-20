import * as React from "react";
import { motion } from "motion/react";
import { Settings, Award, BookOpen, Clock, Target, Sparkles } from "lucide-react";
import { mockUser } from "../lib/mock-data";
import { Card } from "../components/ui/Card";

export default function Profile() {
  const stats = [
    { label: "Пройдено курсов", value: mockUser.completedCourses, icon: BookOpen, color: "text-[#A7738B]", bg: "bg-[#A7738B]/10" },
    { label: "Часов обучения", value: mockUser.learningHours, icon: Clock, color: "text-[#A3B096]", bg: "bg-[#A3B096]/10" },
    { label: "Средний балл", value: `${mockUser.averageScore}%`, icon: Target, color: "text-[#A7738B]", bg: "bg-[#A7738B]/10" },
    { label: "Сертификаты", value: "2", icon: Award, color: "text-[#A3B096]", bg: "bg-[#A3B096]/10" },
  ];

  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -16 }}
      transition={{ duration: 0.35, ease: [0.22, 1, 0.36, 1] }}
      className="pb-8"
    >
      {/* Header Profile Section */}
      <div className="bg-gradient-to-b from-[#F8F9FA] to-white pt-12 pb-8 px-6 relative z-10 border-b border-gray-100">
        <div className="flex items-center justify-between mb-8">
          <h1 className="text-2xl font-bold text-gray-900 tracking-tight">Профиль</h1>
          <button className="w-12 h-12 rounded-full bg-white shadow-sm flex items-center justify-center text-gray-400 hover:text-gray-900 transition-colors">
            <Settings size={20} />
          </button>
        </div>

        <div className="flex flex-col items-center justify-center text-center">
          <motion.div
            initial={{ scale: 0.8 }}
            animate={{ scale: 1 }}
            className="relative mb-4"
          >
            <div className="absolute inset-0 bg-gradient-to-br from-[#A7738B] to-[#A3B096] rounded-full blur-xl opacity-20" />
            <img
              src={mockUser.avatar}
              alt={mockUser.name}
              className="w-24 h-24 rounded-tl-[32px] rounded-br-[32px] rounded-tr-[8px] rounded-bl-[8px] border-4 border-white shadow-lg object-cover relative z-10"
            />
          </motion.div>
          <h2 className="text-2xl font-extrabold text-gray-900 mb-2">{mockUser.name}</h2>
          <p className="text-sm font-medium text-[#A7738B] bg-[#A7738B]/10 px-4 py-1 rounded-full inline-block">
            {mockUser.role}
          </p>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="px-6 py-8">
        <h3 className="text-lg font-bold text-gray-900 mb-6">Ваша статистика</h3>
        <div className="grid grid-cols-2 gap-4 mb-8">
          {stats.map((stat, i) => (
            <Card key={i} className="p-6 flex flex-col gap-4">
              <div className={`w-12 h-12 rounded-xl flex items-center justify-center ${stat.bg} ${stat.color}`}>
                <stat.icon size={24} />
              </div>
              <div>
                <p className="text-2xl font-extrabold text-gray-900 leading-none mb-2">
                  {stat.value}
                </p>
                <p className="text-xs font-bold uppercase tracking-wider text-gray-400">
                  {stat.label}
                </p>
              </div>
            </Card>
          ))}
        </div>

        {/* Level Progress */}
        <Card className="p-6 bg-[#A3B096] text-white overflow-hidden relative">
          <Sparkles className="absolute -top-6 -right-6 text-white/20" size={100} strokeWidth={1} />
          <div className="relative z-10">
            <div className="flex items-center justify-between mb-6">
              <div>
                <p className="text-sm font-semibold opacity-80 uppercase tracking-wider mb-2">Текущий уровень</p>
                <p className="text-xl font-extrabold">Старший специалист</p>
              </div>
              <div className="w-14 h-14 rounded-full bg-white/20 backdrop-blur-md flex items-center justify-center">
                <Target size={24} />
              </div>
            </div>
            
            <div className="flex flex-col gap-2">
              <div className="flex justify-between text-xs font-medium text-white/80">
                <span>Уровень 4</span>
                <span>Уровень 5 (200 очков)</span>
              </div>
              <div className="h-2 w-full bg-black/20 rounded-full overflow-hidden">
                <motion.div
                  className="h-full bg-white rounded-full"
                  initial={{ width: 0 }}
                  animate={{ width: "75%" }}
                  transition={{ duration: 1, delay: 0.2 }}
                />
              </div>
              <p className="text-xs opacity-70 mt-2">Осталось 50 очков до следующего уровня</p>
            </div>
          </div>
        </Card>
      </div>
    </motion.div>
  );
}

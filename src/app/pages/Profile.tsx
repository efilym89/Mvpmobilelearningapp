import * as React from "react";
import { motion } from "motion/react";
import { Settings, Award, BookOpen, Clock, Target, Sparkles, LogOut, HelpCircle, FileText, ToggleLeft, ToggleRight, Medal } from "lucide-react";
import { mockUser, courses } from "../lib/mock-data";
import { Card } from "../components/ui/Card";
import { useStore } from "../store";

export default function Profile() {
  const { isAdmin, toggleAdmin } = useStore();

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
            {isAdmin ? "Администратор" : mockUser.role}
          </p>
        </div>
      </div>

      {/* Main Content */}
      <div className="px-6 py-6 space-y-8">
        
        {/* Level Progress */}
        <Card className="p-6 bg-[#A3B096] text-white overflow-hidden relative shadow-lg">
          <Sparkles className="absolute -top-6 -right-6 text-white/20" size={100} strokeWidth={1} />
          <div className="relative z-10">
            <div className="flex items-center justify-between mb-6">
              <div>
                <p className="text-[10px] font-bold opacity-80 uppercase tracking-wider mb-2">Текущий уровень</p>
                <p className="text-xl font-extrabold">{mockUser.level}</p>
              </div>
              <div className="w-14 h-14 rounded-full bg-white/20 backdrop-blur-md flex items-center justify-center">
                <Target size={24} />
              </div>
            </div>
            
            <div className="flex flex-col gap-2">
              <div className="flex justify-between text-xs font-bold text-white/80">
                <span>Уровень 4</span>
                <span>Уровень 5 (200 очков)</span>
              </div>
              <div className="h-1.5 w-full bg-black/20 rounded-full overflow-hidden">
                <motion.div
                  className="h-full bg-white rounded-full"
                  initial={{ width: 0 }}
                  animate={{ width: `${mockUser.levelProgress}%` }}
                  transition={{ duration: 1, delay: 0.2 }}
                />
              </div>
              <p className="text-[10px] opacity-70 mt-2 font-bold uppercase tracking-wider">Осталось {mockUser.levelPointsToNext} очков до следующего уровня</p>
            </div>
          </div>
        </Card>

        {/* Stats Grid */}
        <div>
          <h3 className="text-lg font-bold text-gray-900 mb-4 flex items-center gap-2">
            <Target size={20} className="text-[#A7738B]" /> Ваша статистика
          </h3>
          <div className="grid grid-cols-2 gap-3">
            {stats.map((stat, i) => (
              <Card key={i} className="p-4 flex flex-col gap-3 shadow-sm border border-gray-50">
                <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${stat.bg} ${stat.color}`}>
                  <stat.icon size={20} />
                </div>
                <div>
                  <p className="text-xl font-extrabold text-gray-900 leading-none mb-1">
                    {stat.value}
                  </p>
                  <p className="text-[10px] font-bold uppercase tracking-wider text-gray-400 leading-tight">
                    {stat.label}
                  </p>
                </div>
              </Card>
            ))}
          </div>
        </div>

        {/* Achievements */}
        <div>
          <h3 className="text-lg font-bold text-gray-900 mb-4 flex items-center gap-2">
            <Award size={20} className="text-[#A3B096]" /> Достижения
          </h3>
          <div className="flex gap-3 overflow-x-auto pb-4 scrollbar-hide -mx-6 px-6">
            {[
              { title: "Быстрый старт", desc: "Пройден первый курс", icon: Sparkles, color: "text-yellow-500", bg: "bg-yellow-50" },
              { title: "Перфекционист", desc: "Все тесты на 100%", icon: Target, color: "text-[#A7738B]", bg: "bg-[#A7738B]/10" },
              { title: "Лидер месяца", desc: "Топ-5 в рейтинге", icon: Medal, color: "text-[#A3B096]", bg: "bg-[#A3B096]/10" }
            ].map((ach, i) => (
              <div key={i} className="min-w-[140px] bg-white rounded-2xl p-4 border border-gray-100 shadow-sm flex flex-col items-center text-center gap-2">
                <div className={`w-12 h-12 rounded-full flex items-center justify-center ${ach.bg} ${ach.color} mb-1`}>
                  <ach.icon size={24} />
                </div>
                <p className="text-sm font-bold text-gray-900 leading-tight">{ach.title}</p>
                <p className="text-[10px] text-gray-500 font-medium leading-tight">{ach.desc}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Current & Completed Courses overview */}
        <div>
          <h3 className="text-lg font-bold text-gray-900 mb-4 flex items-center gap-2">
            <BookOpen size={20} className="text-[#A3B096]" /> Мое обучение
          </h3>
          <div className="flex flex-col gap-3">
            {/* Show an active course */}
            <div className="bg-white rounded-2xl p-4 border border-gray-100 shadow-sm flex items-center justify-between">
              <div className="flex flex-col gap-1">
                <span className="text-[10px] font-bold uppercase tracking-wider text-yellow-600">В процессе</span>
                <span className="text-sm font-bold text-gray-900 line-clamp-1">{courses[0].title}</span>
              </div>
              <div className="text-right">
                <span className="text-sm font-bold text-[#A7738B]">{courses[0].progress}%</span>
              </div>
            </div>

            {/* Show a completed course mock */}
            <div className="bg-white rounded-2xl p-4 border border-gray-100 shadow-sm flex items-center justify-between opacity-70">
              <div className="flex flex-col gap-1">
                <span className="text-[10px] font-bold uppercase tracking-wider text-gray-400">Завершен</span>
                <span className="text-sm font-bold text-gray-900 line-clamp-1">Основы безопасности</span>
              </div>
              <div className="text-right flex gap-2 items-center">
                <FileText size={16} className="text-gray-400" />
                <span className="text-sm font-bold text-[#A3B096]">100%</span>
              </div>
            </div>
          </div>
        </div>

        {/* Quick Actions */}
        <div>
          <h3 className="text-lg font-bold text-gray-900 mb-4 flex items-center justify-between">
            Настройки
            <span className="text-[10px] font-normal text-gray-400 uppercase tracking-wider bg-gray-100 px-2 py-1 rounded-md">
              Демо-режим
            </span>
          </h3>
          <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden flex flex-col">
            <button 
              onClick={toggleAdmin}
              className="flex items-center justify-between p-4 hover:bg-gray-50 transition-colors text-left border-b border-gray-50"
            >
              <div className="flex items-center gap-3">
                <Settings size={20} className={isAdmin ? "text-[#A7738B]" : "text-gray-400"} />
                <span className="text-sm font-bold text-gray-700">Права администратора</span>
              </div>
              {isAdmin ? (
                <ToggleRight size={24} className="text-[#A7738B]" />
              ) : (
                <ToggleLeft size={24} className="text-gray-300" />
              )}
            </button>
            <button className="flex items-center gap-3 p-4 hover:bg-gray-50 transition-colors text-left border-b border-gray-50">
              <HelpCircle size={20} className="text-gray-400" />
              <span className="text-sm font-bold text-gray-700">Поддержка</span>
            </button>
            <button className="flex items-center gap-3 p-4 hover:bg-red-50 text-red-500 transition-colors text-left">
              <LogOut size={20} />
              <span className="text-sm font-bold">Выйти из аккаунта</span>
            </button>
          </div>
        </div>
      </div>
    </motion.div>
  );
}

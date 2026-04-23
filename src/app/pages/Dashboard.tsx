import * as React from "react";
import { useState } from "react";
import { motion, AnimatePresence } from "motion/react";
import { Plus, Users, BookOpen, Settings, ChevronRight, FileText, Activity, Search, Edit2, BarChart2 } from "lucide-react";
import { useNavigate } from "react-router";
import { mockUser, courses, mockEmployees } from "../lib/mock-data";
import { Card } from "../components/ui/Card";
import { Input } from "../components/ui/Input";
import { cn } from "../lib/utils";

export default function Dashboard() {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState<"courses" | "employees">("courses");
  const [searchQuery, setSearchQuery] = useState("");

  // If the user somehow gets here without access
  if (!mockUser.isAdmin) {
    return (
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className="flex flex-col items-center justify-center h-full p-6 text-center bg-[#F8F9FA]"
      >
        <div className="w-24 h-24 bg-white shadow-sm rounded-tl-[32px] rounded-br-[32px] rounded-tr-[8px] rounded-bl-[8px] flex items-center justify-center mb-8 text-[#A7738B]">
          <Settings size={40} />
        </div>
        <h2 className="text-3xl font-extrabold text-gray-900 mb-4 leading-tight">Доступ<br/>запрещен</h2>
        <p className="text-sm text-gray-500 mb-10 max-w-[280px]">
          Для просмотра раздела Дашборд необходимы права администратора. Обратитесь в поддержку для запроса доступа.
        </p>
        <button 
          onClick={() => navigate("/")}
          className="bg-gray-900 text-white font-bold py-4 px-8 rounded-2xl shadow-xl shadow-gray-900/20 w-full active:scale-95 transition-transform"
        >
          Вернуться на главную
        </button>
      </motion.div>
    );
  }

  const actions = [
    { label: "Создать курс", icon: Plus, color: "text-[#A7738B]", bg: "bg-[#A7738B]/10" },
    { label: "Тесты и квизы", icon: FileText, color: "text-[#A3B096]", bg: "bg-[#A3B096]/10" },
    { label: "Отчеты", icon: Activity, color: "text-[#A7738B]", bg: "bg-[#A7738B]/10" },
    { label: "Назначения", icon: Users, color: "text-[#A3B096]", bg: "bg-[#A3B096]/10" },
  ];

  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -16 }}
      transition={{ duration: 0.35, ease: [0.22, 1, 0.36, 1] }}
      className="pb-8"
    >
      <div className="bg-white pt-12 pb-4 px-6 relative z-20 sticky top-0 border-b border-gray-100 shadow-sm">
        <h1 className="text-2xl font-extrabold text-gray-900 tracking-tight mb-1">Дашборд</h1>
        <p className="text-[11px] uppercase font-bold tracking-wider text-gray-400 mb-6">Управление обучением</p>
        
        {/* Search */}
        <div className="relative group mb-6">
          <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-gray-400 group-focus-within:text-[#A7738B] transition-colors">
            <Search size={20} />
          </div>
          <Input
            type="text"
            placeholder="Поиск курсов или сотрудников..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-12 h-14 bg-gray-50 border-transparent focus:border-[#A7738B] focus:bg-white focus:ring-4 focus:ring-[#A7738B]/10 rounded-xl text-sm transition-all"
          />
        </div>

        {/* Tabs */}
        <div className="flex bg-gray-50 p-1 rounded-xl">
          <button
            onClick={() => setActiveTab("courses")}
            className={cn(
              "flex-1 py-2.5 text-sm font-bold rounded-lg transition-all",
              activeTab === "courses" ? "bg-white text-gray-900 shadow-sm" : "text-gray-500 hover:text-gray-700"
            )}
          >
            Курсы
          </button>
          <button
            onClick={() => setActiveTab("employees")}
            className={cn(
              "flex-1 py-2.5 text-sm font-bold rounded-lg transition-all",
              activeTab === "employees" ? "bg-white text-gray-900 shadow-sm" : "text-gray-500 hover:text-gray-700"
            )}
          >
            Сотрудники
          </button>
        </div>
      </div>

      <div className="px-6 pt-6">
        <AnimatePresence mode="wait">
          {activeTab === "courses" ? (
            <motion.div
              key="courses"
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: 20 }}
              transition={{ duration: 0.2 }}
              className="flex flex-col gap-6"
            >
              <div>
                <h3 className="text-sm font-extrabold text-gray-400 uppercase tracking-wider mb-4">Быстрые действия</h3>
                <div className="grid grid-cols-2 gap-3 mb-2">
                  {actions.map((action, i) => (
                    <Card key={i} hoverable className="p-4 flex flex-col gap-3 cursor-pointer border border-gray-50 shadow-sm">
                      <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${action.bg} ${action.color}`}>
                        <action.icon size={20} />
                      </div>
                      <p className="text-xs font-bold text-gray-900 leading-tight">
                        {action.label}
                      </p>
                    </Card>
                  ))}
                </div>
              </div>

              <div>
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-sm font-extrabold text-gray-400 uppercase tracking-wider">Все курсы</h3>
                </div>

                <div className="flex flex-col gap-3">
                  {courses.filter(c => c.title.toLowerCase().includes(searchQuery.toLowerCase())).map((course) => (
                    <Card key={course.id} className="p-4 border border-gray-50 shadow-sm relative group overflow-hidden">
                      <div className="flex flex-col gap-4">
                        <div className="flex items-start gap-4">
                          <div className={cn(
                            "w-12 h-12 rounded-tl-xl rounded-br-xl rounded-tr-md rounded-bl-md flex items-center justify-center shrink-0 shadow-sm",
                            course.color === "rose" ? "bg-[#A7738B] text-white shadow-[#A7738B]/20" : "bg-[#A3B096] text-white shadow-[#A3B096]/20"
                          )}>
                            <BookOpen size={20} strokeWidth={1.5} />
                          </div>
                          <div className="flex-1 min-w-0 pr-8">
                            <h4 className="font-bold text-gray-900 text-sm leading-snug mb-1 truncate">{course.title}</h4>
                            <p className="text-[11px] font-bold text-gray-400 uppercase tracking-wider">{course.totalLessons} уроков • 12 назначено</p>
                          </div>
                        </div>

                        <div className="flex items-center justify-between pt-3 border-t border-gray-50">
                          <button className="text-xs font-bold text-[#A7738B] flex items-center gap-1 hover:text-[#8a5f73] transition-colors">
                            <Edit2 size={14} /> Редактировать
                          </button>
                          <button className="text-xs font-bold text-[#A3B096] flex items-center gap-1 hover:text-[#8e9c81] transition-colors">
                            <BarChart2 size={14} /> Статистика
                          </button>
                        </div>
                      </div>
                    </Card>
                  ))}
                </div>
              </div>
            </motion.div>
          ) : (
            <motion.div
              key="employees"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              transition={{ duration: 0.2 }}
              className="flex flex-col gap-4"
            >
              {mockEmployees.filter(e => e.name.toLowerCase().includes(searchQuery.toLowerCase())).map((employee) => (
                <Card key={employee.id} hoverable className="p-4 border border-gray-50 shadow-sm flex items-center justify-between cursor-pointer">
                  <div className="flex items-center gap-4">
                    <div className="w-12 h-12 rounded-full bg-gray-100 flex items-center justify-center shrink-0 text-gray-500 font-bold">
                      {employee.name.charAt(0)}
                    </div>
                    <div>
                      <h4 className="font-bold text-gray-900 text-sm mb-1">{employee.name}</h4>
                      <p className="text-[11px] font-bold text-gray-400 uppercase tracking-wider">{employee.role}</p>
                    </div>
                  </div>
                  <div className="flex flex-col items-end gap-1">
                    <span className="text-xs font-bold text-[#A3B096]">{employee.progress}% ср. балл</span>
                    <span className="text-[10px] text-gray-400 font-bold">{employee.courses} курса</span>
                  </div>
                </Card>
              ))}
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </motion.div>
  );
}

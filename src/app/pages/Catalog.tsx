import * as React from "react";
import { useState } from "react";
import { motion, AnimatePresence } from "motion/react";
import { Search, Filter, BookOpen, Star, Clock } from "lucide-react";
import { useNavigate } from "react-router";
import { courses } from "../lib/mock-data";
import { Card } from "../components/ui/Card";
import { Input } from "../components/ui/Input";
import { cn } from "../lib/utils";

const filters = ["Все", "Обязательные", "В процессе", "Новые"];

export default function Catalog() {
  const navigate = useNavigate();
  const [activeFilter, setActiveFilter] = useState("Все");
  const [searchQuery, setSearchQuery] = useState("");

  const filteredCourses = courses.filter((course) => {
    if (activeFilter === "В процессе") return course.progress > 0 && course.progress < 100;
    if (activeFilter === "Обязательные") return course.color === "rose"; // Just a mock condition
    return true;
  }).filter((course) => course.title.toLowerCase().includes(searchQuery.toLowerCase()));

  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -16 }}
      transition={{ duration: 0.35, ease: [0.22, 1, 0.36, 1] }}
      className="pb-8 h-full flex flex-col"
    >
      {/* Header */}
      <div className="bg-white pt-12 pb-4 px-6 relative z-10 sticky top-0 border-b border-gray-100 shadow-sm">
        <h1 className="text-2xl font-extrabold text-gray-900 tracking-tight mb-6">Каталог курсов</h1>

        {/* Search */}
        <div className="relative group mb-6">
          <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-gray-400 group-focus-within:text-[#A7738B] transition-colors">
            <Search size={20} />
          </div>
          <Input
            type="text"
            placeholder="Поиск по навыкам, темам..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-12 h-14 bg-gray-50 border-transparent focus:border-[#A7738B] focus:bg-white focus:ring-4 focus:ring-[#A7738B]/10 rounded-xl text-sm transition-all"
          />
          <button className="absolute inset-y-0 right-0 pr-4 flex items-center text-gray-400 hover:text-gray-900 transition-colors">
            <Filter size={20} />
          </button>
        </div>

        {/* Filters */}
        <div className="flex gap-2 overflow-x-auto pb-2 scrollbar-hide -mx-6 px-6">
          {filters.map((filter) => {
            const isActive = activeFilter === filter;
            return (
              <button
                key={filter}
                onClick={() => setActiveFilter(filter)}
                className={cn(
                  "px-6 py-2 rounded-full text-sm font-bold whitespace-nowrap transition-all duration-300 border-2",
                  isActive
                    ? "bg-[#A7738B] text-white border-[#A7738B] shadow-md shadow-[#A7738B]/20"
                    : "bg-white text-gray-500 border-gray-100 hover:border-gray-200 hover:bg-gray-50"
                )}
              >
                {filter}
              </button>
            );
          })}
        </div>
      </div>

      {/* Course List */}
      <div className="flex-1 overflow-y-auto px-6 pt-6 bg-[#F8F9FA]">
        <AnimatePresence mode="popLayout">
          {filteredCourses.length > 0 ? (
            <motion.div className="flex flex-col gap-4">
              {filteredCourses.map((course, i) => (
                <motion.div
                  key={course.id}
                  initial={{ opacity: 0, y: 16 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, scale: 0.95 }}
                  transition={{ delay: i * 0.05 }}
                  onClick={() => navigate(`/course/${course.id}`)}
                >
                  <Card hoverable className="p-6 overflow-hidden relative group">
                    {course.color === "rose" && (
                      <div className="absolute top-0 right-0 p-4">
                        <span className="bg-[#A7738B]/10 text-[#A7738B] px-3 py-1.5 rounded-full text-[10px] font-extrabold uppercase tracking-wider">
                          Обязательно
                        </span>
                      </div>
                    )}
                    
                    <div className="flex gap-4 items-start">
                      <div className={cn(
                        "w-14 h-14 rounded-tl-2xl rounded-br-2xl rounded-tr-md rounded-bl-md flex items-center justify-center shrink-0 shadow-sm transition-transform group-hover:scale-110 duration-300",
                        course.color === "rose" ? "bg-[#A7738B] text-white shadow-[#A7738B]/30" : "bg-[#A3B096] text-white shadow-[#A3B096]/30"
                      )}>
                        <BookOpen size={24} strokeWidth={1.5} />
                      </div>
                      <div className="flex-1 pr-12">
                        <h4 className="font-extrabold text-gray-900 text-base leading-tight mb-2">{course.title}</h4>
                        <p className="text-sm text-gray-500 line-clamp-2 leading-relaxed mb-4">{course.description}</p>
                        
                        <div className="flex items-center gap-4 text-xs font-semibold text-gray-400">
                          <span className="flex items-center gap-2 bg-gray-50 px-2 py-1 rounded-md">
                            <Clock size={16} /> {course.totalLessons * 10} мин
                          </span>
                          <span className="flex items-center gap-2 bg-gray-50 px-2 py-1 rounded-md">
                            <Star size={16} className={course.color === "rose" ? "text-[#A7738B]" : "text-[#A3B096]"} /> 
                            {course.totalLessons} уроков
                          </span>
                        </div>
                      </div>
                    </div>
                  </Card>
                </motion.div>
              ))}
            </motion.div>
          ) : (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="flex flex-col items-center justify-center text-center py-20"
            >
              <div className="w-20 h-20 bg-gray-100 rounded-full flex items-center justify-center text-gray-300 mb-6">
                <Search size={32} />
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-2">Ничего не найдено</h3>
              <p className="text-base text-gray-500 max-w-[240px]">Попробуйте изменить параметры поиска или фильтры</p>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </motion.div>
  );
}

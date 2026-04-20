import * as React from "react";
import { motion } from "motion/react";
import { Search, Play, BookOpen, Star } from "lucide-react";
import { useNavigate } from "react-router";
import { mockUser, courses } from "../lib/mock-data";
import { Card } from "../components/ui/Card";
import { Progress } from "../components/ui/Progress";
import { cn } from "../lib/utils";

export default function Home() {
  const navigate = useNavigate();

  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -16 }}
      transition={{ duration: 0.35, ease: [0.22, 1, 0.36, 1] }}
      className="pb-8"
    >
      {/* Header Profile Section */}
      <div className="bg-gradient-to-b from-[#F8F9FA] to-white pt-12 pb-8 px-6 relative z-10">
        <div className="flex items-center justify-between mb-8">
          <div className="flex items-center gap-4">
            <motion.img
              initial={{ scale: 0.8 }}
              animate={{ scale: 1 }}
              src={mockUser.avatar}
              alt="User"
              className="w-14 h-14 rounded-full border-4 border-white shadow-md object-cover"
            />
            <div>
              <p className="text-sm text-gray-500 font-medium">Доброе утро,</p>
              <h1 className="text-2xl font-bold text-gray-900 tracking-tight">{mockUser.name}</h1>
            </div>
          </div>
          <button className="w-12 h-12 rounded-full bg-white shadow-sm flex items-center justify-center text-gray-400 hover:text-gray-900 transition-colors">
            <Search size={20} />
          </button>
        </div>

        {/* Featured / Continue Learning Card */}
        <motion.div
          whileTap={{ scale: 0.98 }}
          onClick={() => navigate(`/course/${courses[0].id}`)}
          className="relative overflow-hidden rounded-tl-4xl rounded-br-4xl rounded-tr-md rounded-bl-md bg-[#A7738B] p-6 text-white shadow-2xl cursor-pointer"
        >
          {/* Decorative circles */}
          <div className="absolute -top-8 -right-8 w-32 h-32 bg-white/10 rounded-full blur-2xl" />
          <div className="absolute -bottom-4 -left-4 w-24 h-24 bg-white/10 rounded-full blur-xl" />

          <div className="relative z-10">
            <div className="flex items-center gap-2 mb-4">
              <span className="bg-white/20 px-3 py-1 rounded-full text-xs font-semibold uppercase tracking-wider">
                Продолжить
              </span>
            </div>
            <h2 className="text-xl font-bold mb-2">{courses[0].title}</h2>
            <div className="flex items-center justify-between mt-8">
              <div className="flex flex-col gap-2 w-3/5">
                <div className="flex items-center justify-between text-xs font-medium text-white/80">
                  <span>Урок {courses[0].completedLessons + 1} из {courses[0].totalLessons}</span>
                  <span>{courses[0].progress}%</span>
                </div>
                <div className="h-2 w-full bg-black/20 rounded-full overflow-hidden">
                  <motion.div
                    className="h-full bg-white rounded-full"
                    initial={{ width: 0 }}
                    animate={{ width: `${courses[0].progress}%` }}
                    transition={{ duration: 1, delay: 0.2 }}
                  />
                </div>
              </div>
              <div className="w-12 h-12 rounded-full bg-white/20 flex items-center justify-center backdrop-blur-sm">
                <Play size={20} fill="currentColor" />
              </div>
            </div>
          </div>
        </motion.div>
      </div>

      {/* Courses List */}
      <div className="px-6 mt-4">
        <h3 className="text-lg font-bold text-gray-900 mb-6 flex items-center gap-2">
          <BookOpen size={20} className="text-[#A7738B]" /> Каталог курсов
        </h3>

        <div className="flex flex-col gap-4">
          {courses.slice(1).map((course, i) => (
            <Card
              key={course.id}
              hoverable
              onClick={() => navigate(`/course/${course.id}`)}
              className="p-6"
            >
              <div className="flex gap-4 items-start">
                <div className={cn(
                  "w-14 h-14 rounded-2xl flex items-center justify-center shrink-0 shadow-sm",
                  course.color === "rose" ? "bg-[#A7738B]/10 text-[#A7738B]" : "bg-[#A3B096]/10 text-[#A3B096]"
                )}>
                  <Star size={24} className={course.color === "rose" ? "text-[#A7738B]" : "text-[#A3B096]"} />
                </div>
                <div className="flex-1">
                  <h4 className="font-bold text-gray-900 text-base leading-tight mb-2">{course.title}</h4>
                  <p className="text-sm text-gray-500 mb-4 line-clamp-2">{course.description}</p>
                  
                  <div className="flex items-center gap-4">
                    <div className="flex-1">
                      <Progress value={course.progress} color={course.color as "rose" | "green"} />
                    </div>
                    <span className="text-xs font-bold text-gray-400 w-8 text-right">
                      {course.progress}%
                    </span>
                  </div>
                </div>
              </div>
            </Card>
          ))}
        </div>
      </div>
    </motion.div>
  );
}

import * as React from "react";
import { motion } from "motion/react";
import { Search, Play, BookOpen } from "lucide-react";
import { useNavigate } from "react-router";
import { mockUser, courses, news } from "../lib/mock-data";
import { Card } from "../components/ui/Card";

export default function Home() {
  const navigate = useNavigate();
  const featuredCourse = courses[0];

  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -16 }}
      transition={{ duration: 0.35, ease: [0.22, 1, 0.36, 1] }}
      className="pb-8"
    >
      <div className="relative z-10 bg-gradient-to-b from-[#F8F9FA] to-white px-6 pb-8 pt-12">
        <div className="mb-8 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <motion.img
              initial={{ scale: 0.8 }}
              animate={{ scale: 1 }}
              src={mockUser.avatar}
              alt={mockUser.name}
              className="h-14 w-14 rounded-full border-4 border-white object-cover shadow-md"
            />
            <div>
              <p className="text-sm font-medium text-gray-500">Доброе утро,</p>
              <h1 className="text-2xl font-bold tracking-tight text-gray-900">{mockUser.name}</h1>
            </div>
          </div>

          <button className="flex h-12 w-12 items-center justify-center rounded-full bg-white text-gray-400 shadow-sm transition-colors hover:text-gray-900">
            <Search size={20} />
          </button>
        </div>

        {featuredCourse ? (
          <motion.div
            whileTap={{ scale: 0.98 }}
            onClick={() => navigate(`/course/${featuredCourse.id}`)}
            className="relative cursor-pointer overflow-hidden rounded-tl-[32px] rounded-br-[32px] rounded-tr-md rounded-bl-md bg-[#A7738B] p-6 text-white shadow-2xl"
          >
            <div className="absolute -right-8 -top-8 h-32 w-32 rounded-full bg-white/10 blur-2xl" />
            <div className="absolute -bottom-4 -left-4 h-24 w-24 rounded-full bg-white/10 blur-xl" />

            <div className="relative z-10">
              <div className="mb-4 flex items-center gap-2">
                <span className="rounded-full bg-white/20 px-3 py-1 text-xs font-semibold uppercase tracking-wider">
                  Продолжить
                </span>
              </div>

              <h2 className="text-xl font-bold">{featuredCourse.title}</h2>

              <div className="mt-8 flex items-center justify-between">
                <div className="flex w-3/5 flex-col gap-2">
                  <div className="flex items-center justify-between text-xs font-medium text-white/80">
                    <span>
                      Урок {featuredCourse.completedLessons + 1} из {featuredCourse.totalLessons}
                    </span>
                    <span>{featuredCourse.progress}%</span>
                  </div>

                  <div className="h-2 w-full overflow-hidden rounded-full bg-black/20">
                    <motion.div
                      className="h-full rounded-full bg-white"
                      initial={{ width: 0 }}
                      animate={{ width: `${featuredCourse.progress}%` }}
                      transition={{ duration: 1, delay: 0.2 }}
                    />
                  </div>
                </div>

                <div className="flex h-12 w-12 items-center justify-center rounded-full bg-white/20 backdrop-blur-sm">
                  <Play size={20} fill="currentColor" />
                </div>
              </div>
            </div>
          </motion.div>
        ) : null}
      </div>

      <div className="mt-4 px-6">
        <h3 className="mb-6 flex items-center gap-2 text-lg font-bold text-gray-900">
          <BookOpen size={20} className="text-[#A7738B]" />
          Новости компании
        </h3>

        <div className="flex flex-col gap-6">
          {news.map((item) => (
            <Card key={item.id} hoverable className="overflow-hidden bg-white">
              <div className="relative h-48 w-full">
                <img src={item.image} alt={item.title} className="h-full w-full object-cover" />
                <div className="absolute left-4 top-4 rounded-full bg-white/90 px-3 py-1 text-xs font-bold text-[#A7738B] shadow-sm backdrop-blur-sm">
                  {item.tag}
                </div>
              </div>

              <div className="p-5">
                <span className="mb-2 block text-xs font-medium text-gray-400">
                  {new Date(item.date).toLocaleDateString("ru-RU", {
                    day: "numeric",
                    month: "long",
                    year: "numeric",
                  })}
                </span>
                <h4 className="mb-2 text-lg font-bold leading-tight text-gray-900">{item.title}</h4>
                <p className="line-clamp-3 text-sm text-gray-500">{item.description}</p>
              </div>
            </Card>
          ))}
        </div>
      </div>
    </motion.div>
  );
}

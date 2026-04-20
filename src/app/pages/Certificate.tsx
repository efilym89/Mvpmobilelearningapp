import * as React from "react";
import { motion } from "motion/react";
import { Download, Share2, X, Award } from "lucide-react";
import { useParams, useNavigate } from "react-router";
import { courses, mockUser } from "../lib/mock-data";
import { Button } from "../components/ui/Button";
import { cn } from "../lib/utils";

export default function Certificate() {
  const { id } = useParams();
  const navigate = useNavigate();
  const course = courses.find((c) => c.id === id) || courses[0];
  const isRose = course.color === "rose";

  const completionDate = new Intl.DateTimeFormat('ru-RU', {
    day: 'numeric',
    month: 'long',
    year: 'numeric'
  }).format(new Date());

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      className="min-h-full bg-[#F8F9FA] flex flex-col relative"
    >
      <div className="flex items-center justify-between p-6 z-20">
        <button
          onClick={() => navigate("/")}
          className="w-10 h-10 rounded-full bg-white shadow-sm flex items-center justify-center text-gray-400 hover:text-gray-900 transition-colors"
        >
          <X size={20} />
        </button>
        <span className="text-xs uppercase font-bold text-gray-400 tracking-wider">
          Сертификат
        </span>
        <div className="w-10" />
      </div>

      <div className="flex-1 px-6 flex flex-col items-center justify-center -mt-8 pb-32">
        {/* Certificate Card */}
        <motion.div 
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.2 }}
          className="w-full bg-white rounded-tl-[32px] rounded-br-[32px] rounded-tr-[8px] rounded-bl-[8px] shadow-2xl p-8 relative overflow-hidden text-center border-4 border-gray-50"
        >
          <div className="absolute top-0 left-0 right-0 h-2 bg-gradient-to-r from-[#A7738B] to-[#A3B096]" />
          
          {/* Subtle background decoration */}
          <div className="absolute -top-10 -right-10 w-40 h-40 bg-[#F8F9FA] rounded-full blur-2xl opacity-50" />
          <div className="absolute -bottom-10 -left-10 w-40 h-40 bg-[#F8F9FA] rounded-full blur-2xl opacity-50" />

          <div className="relative z-10 flex flex-col items-center">
            <div className={cn(
              "w-16 h-16 rounded-full flex items-center justify-center text-white mb-6 shadow-lg",
              isRose ? "bg-[#A7738B]" : "bg-[#A3B096]"
            )}>
              <Award size={32} />
            </div>

            <p className="text-xs uppercase font-extrabold tracking-widest text-gray-400 mb-2">Настоящим подтверждается, что</p>
            <h2 className="text-2xl font-serif font-extrabold text-gray-900 mb-6 border-b border-gray-100 pb-6 w-full">{mockUser.name}</h2>
            
            <p className="text-xs uppercase font-extrabold tracking-widest text-gray-400 mb-2">Успешно прошел(ла) курс</p>
            <h3 className="text-xl font-extrabold text-gray-900 mb-8 leading-tight">«{course.title}»</h3>
            
            <div className="w-full flex justify-between items-center pt-6 border-t border-gray-100">
              <div className="text-left">
                <p className="text-[10px] uppercase font-bold text-gray-400 mb-1">Дата выдачи</p>
                <p className="text-sm font-bold text-gray-900">{completionDate}</p>
              </div>
              <div className="text-right">
                <p className="text-[10px] uppercase font-bold text-gray-400 mb-1">ID сертификата</p>
                <p className="text-sm font-mono font-bold text-gray-900">CERT-{Math.floor(Math.random() * 1000000)}</p>
              </div>
            </div>
          </div>
        </motion.div>
      </div>

      <div className="fixed bottom-0 left-0 right-0 p-6 pb-8 bg-gradient-to-t from-[#F8F9FA] via-[#F8F9FA] to-white/0 z-40 flex flex-col gap-4">
        <div className="flex gap-4">
          <Button
            variant="secondary"
            className="flex-1 shadow-md bg-white border border-gray-200 text-gray-900 hover:bg-gray-50 flex items-center justify-center gap-2"
          >
            <Download size={18} /> Скачать
          </Button>
          <Button
            variant="secondary"
            className="flex-1 shadow-md bg-white border border-gray-200 text-gray-900 hover:bg-gray-50 flex items-center justify-center gap-2"
          >
            <Share2 size={18} /> Поделиться
          </Button>
        </div>
        <Button
          variant={isRose ? "primary" : "secondary"}
          size="lg"
          onClick={() => navigate("/")}
          className={cn(
            "w-full shadow-xl",
            isRose ? "bg-[#A7738B] text-white" : "bg-[#A3B096] text-white"
          )}
        >
          Вернуться на главную
        </Button>
      </div>
    </motion.div>
  );
}

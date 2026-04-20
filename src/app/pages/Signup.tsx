import * as React from "react";
import { motion } from "motion/react";
import { Sparkles, ChevronLeft } from "lucide-react";
import { useNavigate } from "react-router";
import { Button } from "../components/ui/Button";
import { Input } from "../components/ui/Input";

export default function Signup() {
  const navigate = useNavigate();

  const handleSignup = (e: React.FormEvent) => {
    e.preventDefault();
    // In a real app, this would submit a request
    navigate("/login");
  };

  return (
    <div className="flex min-h-full flex-col p-6 bg-white relative overflow-hidden">
      {/* Decorative Brand Sparkles */}
      <Sparkles className="absolute -top-10 -right-10 text-[#A3B096]/10" size={160} strokeWidth={1} />
      
      <div className="pt-6 relative z-10 mb-8">
        <button
          onClick={() => navigate("/login")}
          className="w-10 h-10 rounded-full bg-gray-50 flex items-center justify-center text-gray-600 hover:bg-gray-100 transition-colors"
        >
          <ChevronLeft size={22} />
        </button>
      </div>

      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="w-full max-w-sm mx-auto space-y-8 relative z-10"
      >
        <div className="flex flex-col space-y-2">
          <h2 className="text-3xl font-bold text-gray-900 font-serif">
            Доступ к платформе
          </h2>
          <p className="text-sm text-gray-500 font-medium leading-relaxed">
            Оставьте заявку на предоставление доступа к корпоративному порталу обучения.
          </p>
        </div>
        
        <form onSubmit={handleSignup} className="space-y-6">
          <div className="space-y-2">
            <label className="text-xs font-bold uppercase tracking-wider text-gray-500" htmlFor="name">
              ФИО
            </label>
            <Input id="name" type="text" placeholder="Иванов Иван Иванович" required />
          </div>
          <div className="space-y-2">
            <label className="text-xs font-bold uppercase tracking-wider text-gray-500" htmlFor="email">
              Корпоративный Email
            </label>
            <Input id="email" type="email" placeholder="name@annaelle.ru" required />
          </div>
          <div className="space-y-2">
            <label className="text-xs font-bold uppercase tracking-wider text-gray-500" htmlFor="department">
              Отдел
            </label>
            <Input id="department" type="text" placeholder="Например, отдел продаж" required />
          </div>
          
          <div className="pt-6">
            <Button type="submit" size="lg" variant="secondary">
              Отправить заявку
            </Button>
          </div>
        </form>
      </motion.div>
    </div>
  );
}

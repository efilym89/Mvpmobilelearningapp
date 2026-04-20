import * as React from "react";
import { motion } from "motion/react";
import { Sparkles } from "lucide-react";
import { useNavigate } from "react-router";
import { Button } from "../components/ui/Button";
import { Input } from "../components/ui/Input";

export default function Login() {
  const navigate = useNavigate();

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    navigate("/");
  };

  return (
    <div className="flex min-h-full flex-col items-center justify-center p-6 bg-white relative overflow-hidden">
      {/* Decorative Brand Sparkles */}
      <Sparkles className="absolute -top-10 -left-10 text-[#A7738B]/10" size={160} strokeWidth={1} />
      <Sparkles className="absolute -bottom-10 -right-10 text-[#A3B096]/10" size={160} strokeWidth={1} />

      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="w-full max-w-sm space-y-10 relative z-10"
      >
        <div className="flex flex-col items-center space-y-2 text-center">
          <div className="flex flex-col items-center space-y-2 mb-8">
            <Sparkles className="h-8 w-8 text-[#A7738B]" fill="currentColor" strokeWidth={1} />
            <h1 className="text-4xl font-serif text-gray-900 tracking-tight lowercase">annaelle</h1>
            <p className="text-[9px] uppercase tracking-[0.2em] font-bold text-gray-400">corporate education</p>
          </div>
          
          <h2 className="text-2xl font-bold text-gray-900 font-serif">
            Вход в систему
          </h2>
          <p className="text-sm text-gray-500 font-medium">
            Используйте корпоративный email для доступа
          </p>
        </div>
        
        <form onSubmit={handleLogin} className="space-y-6">
          <div className="space-y-2">
            <label className="text-xs font-bold uppercase tracking-wider text-gray-500" htmlFor="email">
              Email
            </label>
            <Input id="email" type="email" placeholder="name@annaelle.ru" required />
          </div>
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <label className="text-xs font-bold uppercase tracking-wider text-gray-500" htmlFor="password">
                Пароль
              </label>
              <a href="#" className="text-sm font-bold text-[#A7738B] hover:text-[#976077] transition-colors">
                Забыли пароль?
              </a>
            </div>
            <Input id="password" type="password" required />
          </div>
          <div className="pt-6">
            <Button type="submit" size="lg">
              Войти
            </Button>
          </div>
          
          <div className="text-center pt-6">
            <p className="text-sm text-gray-500">
              Нет доступа?{" "}
              <button 
                type="button" 
                onClick={() => navigate("/signup")} 
                className="font-bold text-[#A3B096] hover:text-[#92a184] transition-colors"
              >
                Оставить заявку
              </button>
            </p>
          </div>
        </form>
      </motion.div>
    </div>
  );
}

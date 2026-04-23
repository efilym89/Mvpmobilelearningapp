import * as React from "react";
import { useState } from "react";
import { motion } from "motion/react";
import { Sparkles, ChevronLeft, MailCheck } from "lucide-react";
import { useNavigate } from "react-router";
import { Button } from "../components/ui/Button";
import { Input } from "../components/ui/Input";

export default function ForgotPassword() {
  const navigate = useNavigate();
  const [isSubmitted, setIsSubmitted] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitted(true);
  };

  if (isSubmitted) {
    return (
      <div className="flex min-h-full flex-col p-6 bg-white relative overflow-hidden items-center justify-center text-center">
        <Sparkles className="absolute -top-10 -right-10 text-[#A7738B]/10" size={160} strokeWidth={1} />
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          className="w-full max-w-sm mx-auto space-y-8 relative z-10 flex flex-col items-center"
        >
          <div className="w-24 h-24 rounded-full bg-[#A7738B]/10 text-[#A7738B] flex items-center justify-center mb-6 shadow-sm">
            <MailCheck size={40} strokeWidth={1.5} />
          </div>
          <h2 className="text-3xl font-bold text-gray-900 font-serif leading-tight">
            Письмо<br/>отправлено
          </h2>
          <p className="text-sm text-gray-500 font-medium leading-relaxed max-w-[280px]">
            Мы отправили инструкции по восстановлению пароля на указанный email. Проверьте папку "Спам", если не найдете письмо.
          </p>
          <Button onClick={() => navigate("/login")} size="lg" variant="primary" className="w-full mt-8 shadow-xl bg-[#A7738B] text-white">
            Вернуться ко входу
          </Button>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="flex min-h-full flex-col p-6 bg-white relative overflow-hidden">
      {/* Decorative Brand Sparkles */}
      <Sparkles className="absolute -top-10 -right-10 text-[#A7738B]/10" size={160} strokeWidth={1} />
      
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
          <h2 className="text-3xl font-bold text-gray-900 font-serif leading-tight">
            Восстановление<br/>пароля
          </h2>
          <p className="text-sm text-gray-500 font-medium leading-relaxed">
            Введите корпоративный email, привязанный к вашему аккаунту. Мы отправим ссылку для сброса.
          </p>
        </div>
        
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="space-y-2">
            <label className="text-xs font-bold uppercase tracking-wider text-gray-500" htmlFor="email">
              Корпоративный Email
            </label>
            <Input id="email" type="email" placeholder="name@annaelle.ru" required />
          </div>
          
          <div className="pt-6">
            <Button type="submit" size="lg" variant="primary" className="w-full shadow-xl bg-[#A7738B] text-white">
              Сбросить пароль
            </Button>
          </div>
        </form>
      </motion.div>
    </div>
  );
}
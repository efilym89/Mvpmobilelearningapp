import * as React from "react";
import { motion } from "motion/react";
import { AlertCircle, ShieldCheck } from "lucide-react";
import { useNavigate } from "react-router";
import { Button } from "../../components/ui/Button";
import { Input } from "../../components/ui/Input";
import { api } from "../../lib/api";
import { useStore } from "../../store";

export default function LoginPage() {
  const navigate = useNavigate();
  const setSession = useStore((state) => state.setSession);
  const isAuthenticated = useStore((state) => state.isAuthenticated);
  const isAdmin = useStore((state) => state.isAdmin);
  const [email, setEmail] = React.useState("employee@annaelle.ru");
  const [password, setPassword] = React.useState("demo123");
  const [error, setError] = React.useState<string | null>(null);
  const [loading, setLoading] = React.useState(false);

  React.useEffect(() => {
    if (isAuthenticated) {
      navigate(isAdmin ? "/dashboard" : "/home", { replace: true });
    }
  }, [isAdmin, isAuthenticated, navigate]);

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setLoading(true);
    setError(null);

    try {
      const session = await api.login(email, password);
      setSession(session);
      navigate(session.user.role === "admin" ? "/dashboard" : "/home", {
        replace: true,
      });
    } catch (reason) {
      setError(reason instanceof Error ? reason.message : "Не удалось выполнить вход");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="flex min-h-full flex-col justify-center bg-white px-6 py-10">
      <motion.div
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        className="mx-auto flex w-full max-w-sm flex-col gap-8"
      >
        <div className="space-y-4 text-center">
          <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-tl-[28px] rounded-br-[28px] rounded-tr-[8px] rounded-bl-[8px] bg-[#A7738B]/10 text-[#A7738B]">
            <ShieldCheck size={28} />
          </div>
          <div>
            <p className="text-xs font-bold uppercase tracking-[0.28em] text-gray-400">
              Аннаэль Обучение
            </p>
            <h1 className="mt-3 text-3xl font-extrabold text-gray-900">
              Вход в MVP
            </h1>
          </div>
          <p className="text-sm leading-relaxed text-gray-500">
            Оставили только ключевой поток: авторизация, курсы, уроки, тест и базовый admin.
          </p>
        </div>

        <form className="space-y-5" onSubmit={handleSubmit}>
          <div className="space-y-2">
            <label className="text-xs font-bold uppercase tracking-wider text-gray-500" htmlFor="email">
              Email
            </label>
            <Input
              id="email"
              type="email"
              value={email}
              onChange={(event) => setEmail(event.target.value)}
              className="h-12 rounded-xl border-gray-200"
            />
          </div>

          <div className="space-y-2">
            <label className="text-xs font-bold uppercase tracking-wider text-gray-500" htmlFor="password">
              Пароль
            </label>
            <Input
              id="password"
              type="password"
              value={password}
              onChange={(event) => setPassword(event.target.value)}
              className="h-12 rounded-xl border-gray-200"
            />
          </div>

          {error ? (
            <div className="flex items-start gap-2 rounded-2xl border border-red-100 bg-red-50 px-4 py-3 text-sm font-medium text-red-700">
              <AlertCircle size={18} className="mt-0.5 shrink-0" />
              <span>{error}</span>
            </div>
          ) : null}

          <Button type="submit" size="lg" className="h-12 w-full rounded-2xl" disabled={loading}>
            {loading ? "Входим..." : "Войти"}
          </Button>
        </form>

        <div className="rounded-[28px] border border-gray-100 bg-[#F8F9FA] p-5 text-sm text-gray-600 shadow-sm">
          <p className="mb-3 text-xs font-bold uppercase tracking-wider text-gray-400">
            Демо-доступы
          </p>
          <p>`employee@annaelle.ru` / `demo123`</p>
          <p>`admin@annaelle.ru` / `demo123`</p>
        </div>
      </motion.div>
    </div>
  );
}

export const APP_BASE_PATH = import.meta.env.BASE_URL || "/";
export const IS_STATIC_DEMO = import.meta.env.VITE_STATIC_DEMO === "true";
export const USE_HASH_ROUTER = import.meta.env.VITE_ROUTER_MODE === "hash";

export function withBasePath(value?: string | null) {
  if (!value) {
    return value ?? null;
  }

  if (/^(?:https?:|data:|blob:)/i.test(value)) {
    return value;
  }

  const normalizedBase = APP_BASE_PATH.endsWith("/") ? APP_BASE_PATH : `${APP_BASE_PATH}/`;
  const normalizedValue = value.replace(/^\/+/, "");
  return `${normalizedBase}${normalizedValue}`;
}

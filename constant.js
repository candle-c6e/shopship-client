export const __prod__ = process.env.NODE_ENV === "production";
export const isServer = typeof window === "undefined";
export const urlClient = __prod__
  ? "https://jjams.co/shopship"
  : "http://localhost:3000";
export const urlServer = __prod__
  ? "https://jjams.co/api/shopship"
  : "http://localhost:4000";

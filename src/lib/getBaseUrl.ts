export const getBaseUrl = () => {
  if (typeof window !== "undefined") {
    return window.location.origin;
  }
  if (process.env.NEXT_PUBLIC_VERCEL_PROJECT_PRODUCTION_URL !== undefined) {
    return `https://${process.env.NEXT_PUBLIC_VERCEL_PROJECT_PRODUCTION_URL}`;
  }
  if (process.env.NEXT_PUBLIC_BASE_URL !== undefined) {
    return process.env.NEXT_PUBLIC_BASE_URL;
  }
  return `http://localhost:${process.env.PORT ?? 3000}`;
};

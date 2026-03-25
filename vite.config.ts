import { defineConfig, loadEnv } from "vite";
import react from "@vitejs/plugin-react";

export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, process.cwd(), "");

  return {
    plugins: [react()],
    server: {
      proxy: {
        "/api/wakatime": {
          target: "https://wakatime.com",
          changeOrigin: true,
          rewrite: (path) => path.replace(/^\/api\/wakatime/, "/api/v1"),
          headers: {
            Authorization: `Basic ${Buffer.from(env.WAKATIME_API_KEY + ":").toString("base64")}`,
          },
        },
      },
    },
  };
});

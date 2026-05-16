import { defineConfig, loadEnv } from "vite";
import react from "@vitejs/plugin-react";

export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, process.cwd(), "");
  const ngrokHost = (env.NGROK_HOST || "").trim();
  const useNgrokTunnelDev =
    ngrokHost && (env.VITE_USE_NGROK_TUNNEL || "").trim() === "1";
  const ngrokHmrEnabled = (env.VITE_NGROK_HMR || "").trim() === "1";

  return {
    plugins: [react()],
    server: {
      host: true,
      proxy: {
        "/api": { target: "http://localhost:4000", changeOrigin: true },
        "/uploads": { target: "http://localhost:4000", changeOrigin: true },
      },
      // Leading dot allows every tunnel subdomain (ngrok changes the name each run on free tier).
      allowedHosts: [
        "antisocial.onrender.com",
        "anti-social-chi.vercel.app",
        ".ngrok-free.dev",
        ".ngrok-free.app",
        ".ngrok.io",
        ".ngrok.app",
      ],
      // Only when you browse the dev server through ngrok (see .env.example). Otherwise NGROK_HOST
      // alone would misconfigure localhost:5173 (wrong origin + HMR WS → reload loops on free ngrok).
      ...(useNgrokTunnelDev
        ? {
            origin: `https://${ngrokHost}`,
            ...(ngrokHmrEnabled
              ? {
                  hmr: {
                    host: ngrokHost,
                    protocol: "wss",
                    clientPort: 443,
                  },
                }
              : { hmr: false }),
          }
        : {}),
    },
  };
});

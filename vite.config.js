import { defineConfig, loadEnv } from "vite";
import react from "@vitejs/plugin-react";
import { fileURLToPath, URL } from "node:url";

const requiredEnv = [
  "VITE_SANITY_PROJECT_ID",
  "VITE_SANITY_DATASET",
  "VITE_SANITY_API_VERSION",
];

export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, process.cwd(), "");
  const missing = requiredEnv.filter((key) => !env[key]);

  if (missing.length > 0) {
    throw new Error(
      `Missing Sanity environment variables: ${missing.join(", ")}. ` +
        `Set them in .env locally and in the Netlify project configuration.`,
    );
  }

  return {
    plugins: [react()],
    // The functions run under `netlify dev` (port 8888, see netlify.toml), so /api also works on :5173.
    server: {
      proxy: { "/api": "http://localhost:8888" },
    },
    resolve: {
      alias: {
        "@": fileURLToPath(new URL("./src", import.meta.url)),
      },
    },
  };
});

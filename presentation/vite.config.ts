import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import path from "path";
import { CodeHikeConfig } from "codehike/mdx";
import Unfonts from "unplugin-fonts/vite";

// https://vitejs.dev/config/
export default defineConfig(async () => {
  const mdx = await import("@mdx-js/rollup");
  const { remarkCodeHike, recmaCodeHike } = await import("codehike/mdx");

  const chConfig: CodeHikeConfig = {
    syntaxHighlighting: {
      theme: "github-dark",
    },
  };

  return {
    plugins: [
      react(),
      mdx.default({
        remarkPlugins: [[remarkCodeHike, chConfig]],
        recmaPlugins: [[recmaCodeHike, chConfig]],
      }),
      Unfonts({
        custom: {
          families: [
            {
              name: "Geist",
              src: "./src/assets/fonts/geist/*.woff2",
            },
          ],
        },
      }),
    ],
    resolve: {
      alias: {
        "@": path.resolve(__dirname, "./src"),
      },
    },
    optimizeDeps: {
      include: ["react/jsx-runtime"],
    },
  };
});

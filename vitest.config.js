import { defineConfig } from "vitest/config";
import path from "path";

export default defineConfig({
    test: {
        environment: "jsdom",
        globals: true,
        setupFiles: "./vitest.setup.ts",
        coverage: {
            provider: "v8",
            reporter: ["text", "html"],
            all: true,
            include: ["**/**/*.{ts,tsx}"],
            exclude: ["node_modules/**", "tests/**", "types/**"],
            dir: "coverage",
        },
    },
    resolve: {
        alias: {
            "@": path.resolve(__dirname, "./"),
        },
    },
});
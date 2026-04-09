import { defineConfig } from "vitest/config";
import path from "path";

export default defineConfig({
    test: {
        environment: "jsdom",
        globals: true,
        setupFiles: "./vitest.setup.ts",
        reporters: [
            'default',
            ['vitest-sonar-reporter', { outputFile: 'coverage/sonar-report.xml' }],
        ],
        coverage: {
            provider: "v8",
            reporter: ["text", "html", "lcov"],
            all: true,
            include: ["**/**/*.{ts,tsx}"],
            exclude: ["node_modules/**", "test/**", "types/**", "next-env.d.ts", "next.config.ts"],
            dir: "coverage",
        },
    },
    resolve: {
        alias: {
            "@": path.resolve(__dirname, "./"),
        },
    },
});
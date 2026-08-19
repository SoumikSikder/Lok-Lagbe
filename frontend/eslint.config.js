import js from "@eslint/js";
import globals from "globals";
import reactHooks from "eslint-plugin-react-hooks";
import reactRefresh from "eslint-plugin-react-refresh";
import { defineConfig, globalIgnores } from "eslint/config";


export default defineConfig([
    globalIgnores(["dist", "docs/jsdoc"]),
    {
        files: ["**/*.{js,jsx}"],
        extends: [
            js.configs.recommended,
            reactHooks.configs.flat.recommended,
            reactRefresh.configs.vite,
        ],
        languageOptions: {
            ecmaVersion: "latest",
            globals: globals.browser,
            parserOptions: {
                ecmaFeatures: { jsx: true },
                sourceType: "module",
            },
        },
        rules: {
            camelcase: ["error", { properties: "never" }],
            indent: ["error", 4, { SwitchCase: 1 }],
            "new-cap": "error",
            "no-unused-vars": ["error", { varsIgnorePattern: "^[A-Z_]" }],
        },
    },
    {
        files: ["tests/**/*.{js,mjs}"],
        extends: [js.configs.recommended],
        languageOptions: {
            ecmaVersion: "latest",
            globals: globals.node,
            parserOptions: {
                sourceType: "module",
            },
        },
    },
]);

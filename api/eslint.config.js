import js from "@eslint/js";
import globals from "globals";
import { defineConfig } from "eslint";
import importPlugin from "eslint-plugin-import";

export default defineConfig([
  { 
    files: ["**/*.{js,mjs,cjs}"], 
    plugins: { js, import: importPlugin }, 
    extends: ["js/recommended"], 
    languageOptions: { 
      globals: globals.node 
    },
    rules: {
      "import/no-unresolved": "error",
      "import/no-extraneous-dependencies": "warn",
      "import/order": ["warn", { "newlines-between": "always" }],
      "no-unused-vars": "warn"
    }
  },
]);

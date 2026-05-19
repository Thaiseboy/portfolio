const browserGlobals = {
  console: "readonly",
  document: "readonly",
  fetch: "readonly",
  IntersectionObserver: "readonly",
  setTimeout: "readonly",
  window: "readonly",
};

module.exports = [
  {
    ignores: ["dist/**", "node_modules/**", "studio/**"],
  },
  {
    files: ["src/**/*.{js,jsx}"],
    languageOptions: {
      ecmaVersion: "latest",
      globals: browserGlobals,
      parserOptions: {
        ecmaFeatures: {
          jsx: true,
        },
        sourceType: "module",
      },
    },
    rules: {
      "no-console": "off",
      "no-undef": "error",
    },
  },
  {
    files: ["src/**/*.js"],
    rules: {
      "no-unused-vars": "warn",
    },
  },
];

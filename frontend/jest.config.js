const config = {
  testEnvironment: "jsdom", // simulateur de navigateur
  rootDir: "./", // racine du frontend
  setupFilesAfterEnv: ["<rootDir>/jest.setup.js"], // ton setup global

  transform: {
    "^.+\\.(ts|tsx|js|jsx)$": ["babel-jest", { presets: ["next/babel"] }],
  },
  moduleNameMapper: {
    "^@/(.*)$": "<rootDir>/src/$1",
    "\\.(css|less|scss|sass)$": "identity-obj-proxy",
  },
  moduleFileExtensions: ["ts", "tsx", "js", "jsx", "json", "node"],

  testPathIgnorePatterns: [
    "/node_modules/",
    "/.next/",
    "/out/",
    "/coverage/",
    "/dist/",
    "/tests/e2e/",
  ],
  transformIgnorePatterns: ["/node_modules/(?!(uuid)/)"],

  collectCoverage: true,
  coverageDirectory: "<rootDir>/coverage",
  collectCoverageFrom: [
    // Composants essentiels
    "src/components/*.{ts,tsx}",
    "src/hooks/*.{ts,tsx}",
    "src/lib/*.{ts,tsx}",
    "src/config/*.{ts,tsx}",
    "src/middleware.ts",
    // Exclusions
    "!<rootDir>/**/*.d.ts",
    "!<rootDir>/**/index.{ts,tsx,js,jsx}",
    "!<rootDir>/**/types.{ts,tsx}",
    "!<rootDir>/**/mocks/**",
    "!<rootDir>/jest.setup.js",
    "!<rootDir>/next.config.{js,ts}",
    "!<rootDir>/src/app/**/*.{ts,tsx}",
    "!<rootDir>/src/**/*.css",
    "!<rootDir>/src/**/layout.{ts,tsx}",
    "!<rootDir>/src/**/not-found.{ts,tsx}",
    "!<rootDir>/src/**/robots.{ts,tsx}",
    "!<rootDir>/src/**/sitemap.{ts,tsx}",
    "!<rootDir>/src/lib/toast.ts",
    "!<rootDir>/src/config/auth.config.ts",
  ],

  coverageThreshold: {
    global: {
      branches: 80,
      functions: 80,
      lines: 80,
      statements: 80,
    },
  },

  clearMocks: true,
  verbose: true,
  testMatch: [
    "**/__tests__/**/*.spec.[jt]s?(x)",
    "**/?(*.)+(spec|test).[jt]s?(x)",
  ],
};

export default config;

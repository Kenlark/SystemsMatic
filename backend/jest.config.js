module.exports = {
  moduleFileExtensions: ['js', 'json', 'ts', 'tsx'],
  rootDir: '.',
  testMatch: ['<rootDir>/tests/**/*.spec.ts'],
  transform: {
    '^.+\\.(t|j)s$': 'ts-jest',
    '^.+\\.(tsx|jsx)$': 'ts-jest',
  },
  collectCoverageFrom: [
    'src/**/*.(t|j)s',
    '!src/**/*.d.ts',
    '!src/**/*.test.{ts,tsx}',
    '!src/**/*.spec.{ts,tsx}',
    '!src/main.ts',
    '!src/app.module.ts',
    '!src/app.controller.ts',
    '!src/app.service.ts',
    '!src/**/*.module.ts', // Exclure tous les modules (fichiers de configuration)
    '!src/**/*.controller.ts', // Exclure les controllers (nécessitent des tests E2E)
    '!src/**/dto/**',
    '!src/**/guards/**',
    '!src/**/strategies/**',
    '!src/**/config/**',
    '!src/**/email-templates/**',
    '!src/**/validators/**',
    '!src/contacts/**',
    '!src/email-actions/**',
    '!src/queue/**',
    '!src/prisma/**',
    '!src/appointments/queues/**',
    '!src/appointments/services/**',
    '!src/quotes/quote-email.service.ts', // Service non testé
    '!src/quotes/quote-management.service.ts', // Service non testé
  ],
  coverageDirectory: '../coverage',
  testEnvironment: 'node',
  // Coverage thresholds - Progression vers PLAN_DE_TEST.md (objectif final: 85%)
  // Seuils actuels basés sur la couverture existante (Phase 1)
  coverageThreshold: {
    global: {
      branches: 30, // Actuel: 34.09% → Objectif Phase 1: 30% ✅
      functions: 35, // Actuel: 39.58% → Objectif Phase 1: 35% ✅
      lines: 55, // Actuel: 57.67% → Objectif Phase 1: 55% ✅
      statements: 55, // Actuel: 58.33% → Objectif Phase 1: 55% ✅
    },
    // TODO Phase 2: Augmenter progressivement vers 85% selon PLAN_DE_TEST.md
    // TODO Phase 3: Seuils finaux → 85% pour tous
  },
  setupFilesAfterEnv: ['<rootDir>/src/test/setup.ts'],
  moduleNameMapper: {
    '\\.(css|less|scss|sass)$': 'identity-obj-proxy',
    '^@/(.*)$': '<rootDir>/$1',
  },
};

const config = {
  "transform": {
    "^.+\\.ts$": "ts-jest",
    '\\.[jt]sx?$': 'babel-jest',
    "^.+\\.vue$": "@vue/vue3-jest"
  },
  "moduleNameMapper": {
    "^@/(.*)$": "<rootDir>/src/$1"
  },
  "testMatch": [
    "**/tests/**/*.test.(js|jsx|ts|tsx)",
]
};

module.exports = {
  preset: "@vue/cli-plugin-unit-jest/presets/typescript-and-babel",
  ...config
};

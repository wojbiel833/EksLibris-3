"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
// Sync object
const config = {
  verbose: true,
  transform: {
    "^.+\\.tsx?$": "ts-jest",
  },
  globals: {
    window: {},
  },
  testMatch: ["**/?(*.)+(spec|test).ts"],
  testEnvironment: "jsdom",
};
exports.default = config;

"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.isValidPair = exports.isValidTriple = void 0;
const isValidTriple = (arg) => (Array.isArray(arg) && arg.length === 3 && arg.every((el) => typeof el === "number"));
exports.isValidTriple = isValidTriple;
const isValidPair = (arg) => (Array.isArray(arg) && arg.length === 2 && arg.every((el) => typeof el === "number"));
exports.isValidPair = isValidPair;

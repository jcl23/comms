export type Triple = [number, number, number]; 
export type Pair = [number, number];
export const isValidTriple = (arg: any): arg is Triple => (
    Array.isArray(arg) && arg.length === 3 && arg.every((el) => typeof el === "number")
);

export const isValidPair = (arg: any): arg is Pair => (
    Array.isArray(arg) && arg.length === 2 && arg.every((el) => typeof el === "number")
);
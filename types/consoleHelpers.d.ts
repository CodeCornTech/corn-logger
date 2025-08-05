// types/consoleHelpers.d.ts

export const color: any;
export const log: any;
export const whiteBG: any;
export const bgWhite: any;
export const bgYellowBright: any;
export const bgCyanBright: any;
export const cyanBright: any;
export const whiteBright: any;
export const white: any;
export const blueBright: any;
export const red: any;
export const green: any;
export const cyan: any;
export const yellow: any;
export const orange: any;
export const magenta: any;

export function usage(): void;
export function colorizeKeysAsString(obj: any, keyColor?: Function, valueColor?: Function, bgColor?: Function | null, textDecoration?: Function | null, indent?: number): string;

export function colorizeKeysAsStringIndent(obj: any, keyColor?: Function, valueColor?: Function, bgColor?: Function | null, textDecoration?: Function | null): string;

export function logError(context: string, error: any, subContext?: string, messageColor?: Function): void;
export function logDebug(context: string, message: any, subContext?: string, messageColor?: Function): void;
export function logInfo(context: string, message: any, subContext?: string, messageColor?: Function): void;
export function logWarn(context: string, message: any, subContext?: string, messageColor?: Function): void;
export function logMessage(level: string, context: string, message: any, subContext?: string, messageColor?: Function): void;
export function logDebugData(label: string, context: string, fusername: string, data: any, verbosityLevel: number, requiredVerbosity: number, messageColor?: Function): void;

export function getFunctionName(): string;

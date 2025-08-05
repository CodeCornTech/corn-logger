// consoleHelpers.js
import fs from 'fs';
import path from 'path';
import stripAnsi from 'strip-ansi';

import { color, log, red, green, cyan, gray, cyanBright, whiteBright, white, whiteBG, bgWhite, bgYellowBright, bgCyanBright, blueBright, yellow, magenta } from 'console-log-colors';
const ENABLE_LOG_STORE = process.env.LOG_STORE === 'true';

/* ─────────────── CONFIGURAZIONE BASE ──────────────── */
const LOG_DIR = path.resolve(process.env.LOG_DIR || 'logs'); // cartella log

const DATE_FMT = new Intl.DateTimeFormat('it-IT', {
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
});
const TIME_FMT = new Intl.DateTimeFormat('it-IT', {
    hour: '2-digit',
    minute: '2-digit',
    second: '2-digit',
    hourCycle: 'h23',
});

/* ─────────────── UTIL per il colore in console ─────── */
type LogLevel = 'ERROR' | 'WARN' | 'INFO' | 'DEBUG';
type ColorFn = (input: string) => string;
type LoggableValue = string | Record<string, any> | Error;
type LogMessage = string | Record<string, any>;

interface CallerInfo {
    function: string;
    file: string;
    line: number;
    column: number;
}

/**
 * Restituisce la configurazione (etichetta + colore) per un determinato livello di log.
 *
 * @param lvl - Livello del log (ERROR, WARN, INFO, DEBUG)
 * @returns Oggetto contenente label testuale e funzione di colorazione
 */
const levelColor = (lvl: LogLevel): { label: string; color: ColorFn } => {
    const map: Record<LogLevel, { label: string; color: ColorFn }> = {
        ERROR: { label: 'ERROR', color: color.bgRed.white },
        WARN: { label: 'WARN', color: color.bgYellow.black },
        INFO: { label: 'INFO', color: color.bgGreen.black },
        DEBUG: { label: 'DEBUG', color: color.bgBlue.white },
    };
    return map[lvl] || { label: lvl, color: white };
};

/**
 * Restituisce la funzione colore solo se valida.
 *
 * @param fn - Funzione di colore (opzionale)
 * @returns Funzione se valida, altrimenti undefined
 */
const safeColor = (fn: ColorFn | null | undefined): ColorFn | undefined => (typeof fn === 'function' ? fn : undefined);

/**
 * Converte un valore generico in un valore loggabile.
 *
 * @param value - Valore da convertire
 * @returns Valore compatibile con log (stringa, oggetto o errore)
 */
const toLoggable = (value: unknown): LoggableValue => {
    if (value instanceof Error) return value;
    if (typeof value === 'string') return value;
    if (typeof value === 'object' && value !== null) return value as Record<string, any>;
    return String(value);
};

/**
 * Restituisce timestamp formattato in stile italiano (gg/mm/aaaa hh:mm:ss).
 *
 * @returns Stringa timestamp
 */
const getLogTimestamp = (): string => {
    const now = new Date();
    return `${DATE_FMT.format(now)} ${TIME_FMT.format(now)}`;
};

// Prepara la cartella dei log se richiesto e non esiste
try {
    ENABLE_LOG_STORE && !fs.existsSync(LOG_DIR) && fs.mkdirSync(LOG_DIR);
} catch (err: unknown) {
    console.warn(`⚠️ Errore creando directory logs: ${err instanceof Error ? err.message : String(err)}`);
}
/**
 * Restituisce la data corrente in formato YYYY-MM-DD
 * (utile per nome file log: 2025-08-05)
 */
const getLogDateString = (): string => {
    const [day, month, year] = DATE_FMT.format(new Date()).split('/');
    return `${year}-${month}-${day}`;
};

/**
 * Scrive il log su file se abilitato da env.
 *
 * @param {string} level - Livello del log.
 * @param {string} context - Contesto della chiamata.
 * @param {string} subMex - Contesto secondario opzionale.
 * @param {string} formattedMessage - Messaggio formattato.
 * @param {string} errorStack - Stack trace (solo per Error).
 */
const writeLogToFile = (level: LogLevel, context: string, subMex: string, formattedMessage: LogMessage, errorStack: string = ''): void => {
    if (!ENABLE_LOG_STORE) return;

    const timestamp = getLogTimestamp();
    const logLine = `[${timestamp}] [${context}] ${level} ${subMex}:\n${typeof formattedMessage === 'string' ? formattedMessage : JSON.stringify(formattedMessage, null, 2)}\n${errorStack}\n`;
    const cleanLog = stripAnsi(logLine); // 🔥 pulizia ansi solo qui

    const logFileName = path.join(LOG_DIR, `${getLogDateString()}.log`);
    try {
        fs.appendFileSync(logFileName, cleanLog + '\n');
    } catch (err: unknown) {
        const e = toLoggable(err);
        console.warn(`[consoleHelpers] ❌ Errore scrittura log file: ${e instanceof Error ? e.message : String(e)}`);
    }
};

/**
 * Funzione di esempio per mostrare l'utilizzo delle funzioni di colorazione.
 * Stampa un oggetto JSON formattato con chiavi colorate.
 */
const usage = function () {
    const json = {
        os: {
            name: 'Windows',
            version: '10',
        },
        device: {
            type: 'desktop',
            model: null,
            vendor: null,
        },
    };

    // Stampa con chiavi colorate e formattate
    console.log(color.bgWhite.black('Parsed with Client Hints:'));
    console.log(colorizeKeysAsString(json, color.cyan, color.bgBlue, color.bold)); // Colore cyan, sfondo blu, grassetto

    console.log(color.bgWhite.black('Parsed with Feature Check:'));

    console.log(colorizeKeysAsStringIndent(json, color.green, safeColor(null), color.italic)); // Colore green, decorazione italic
};

/**
 * Funzione per colorare e formattare il JSON come stringa con chiavi e valori personalizzati.
 *
 * @param {Object} obj - Oggetto JSON da formattare e colorare.
 * @param {Function} keyColor - Funzione di colore applicata alle chiavi.
 * @param {Function} valueColor - Funzione di colore applicata ai valori.
 * @param {Function|null} bgColor - Funzione per il colore di sfondo delle chiavi.
 * @param {Function|null} textDecoration - Funzione per decorazione testo (es. bold, italic).
 * @param {number} indent - Livello di indentazione iniziale.
 * @returns {string} - Stringa JSON formattata con chiavi e valori colorati.
 */
const colorizeKeysAsString = (obj: Record<string, any>, keyColor: ColorFn = color.magenta, valueColor: ColorFn = color.green, bgColor: ColorFn | null = null, textDecoration: ColorFn | null = null, indent: number = 2): string => {
    const styleKey = (key: string): string => {
        let styled = keyColor(key);
        if (bgColor) styled = bgColor(styled);
        if (textDecoration) styled = textDecoration(styled);
        return styled;
    };

    const styleValue = (value: any): string => {
        if (value instanceof Date) return color.blue(value.toISOString()); // Date in blu
        if (typeof value === 'string') return color.yellow(`"${value}"`); // Stringhe in giallo
        if (typeof value === 'number') return color.cyan(value); // Numeri in cyan
        if (value === null) return color.dim('null'); // null in grigio
        if (value === undefined) return color.gray('undefined');
        if (typeof value === 'object') return formatObject(value, indent + 2); // Chiamata sicura a oggetti
        return valueColor(String(value)); // Default per altri tipi
    };

    const formatObject = (obj: any, currentIndent: number): string => {
        if (!obj || typeof obj !== 'object') return styleValue(obj); // Evita ricorsione infinita

        if (Array.isArray(obj)) {
            return `[\n${obj.map((item) => ' '.repeat(currentIndent) + styleValue(item)).join(',\n')}\n${' '.repeat(currentIndent - 2)}]`;
        }

        return `{\n${Object.entries(obj)
            .map(([key, value]) => `${' '.repeat(currentIndent)}${styleKey(key)}: ${styleValue(value)}`)
            .join(',\n')}\n${' '.repeat(currentIndent - 2)}}`;
    };

    return formatObject(obj, indent);
};

/**
 * Variante di `colorizeKeysAsString` con indentazione specifica per ogni livello e valori colorati.
 *
 * @param {Object} obj - Oggetto JSON da formattare e colorare.
 * @param {Function} keyColor - Funzione di colore applicata alle chiavi.
 *                              Default: `color.magenta`.
 * @param {Function} valueColor - Funzione di colore applicata ai valori.
 *                                Default: `color.green`.
 * @param {Function|null} bgColor - Colore di sfondo delle chiavi (opzionale). Default: `null`.
 * @param {Function|null} textDecoration - Decorazione testo delle chiavi (opzionale). Default: `null`.
 *
 * @returns {string} - JSON formattato con indentazione e chiavi colorate.
 */
const colorizeKeysAsStringIndent = (obj: Record<string, any>, keyColor: ColorFn = color.magenta, valueColor: ColorFn = color.green, bgColor: ColorFn | null = null, textDecoration: ColorFn | null = null, indent: number = 2): string => {
    const styleKey = (key: string): string => {
        let styled = keyColor(key);
        if (bgColor) styled = bgColor(styled);
        if (textDecoration) styled = textDecoration(styled);
        return styled;
    };

    const styleValue = (value: any): string => {
        // Formattazione delle date (\d{4}[-/]\d{2}[-/]\d{2}T\d{2}:\d{2}:\d{2}\.\d{3}Z) = nn per tutti i formati
        const regexDate = /(\d+[-/]\d+[-/]\d+T\d{2}:\d{2}:\d{2}\.\d{3}Z)/;
        if (value instanceof Date || (typeof value === 'string' && regexDate.test(value))) {
            const date = new Date(value);
            return color.blue(date.toLocaleString('it-IT', { timeZone: 'Europe/Rome' })); // Data leggibile in formato italiano
        }

        // Formattazione dei booleani
        if (typeof value === 'boolean') {
            return value ? color.green('true') : color.red('false'); // Booleani colorati in verde/rosso
        }

        // Formattazione delle stringhe
        if (typeof value === 'string') {
            return color.yellow(`"${value}"`); // Stringhe in giallo
        }

        // Formattazione dei numeri
        if (typeof value === 'number') {
            return color.cyan(value); // Numeri in cyan
        }

        // Formattazione dei valori null
        if (value === null) {
            return color.dim('null'); // null in grigio
        }

        // Formattazione dei valori undefined
        if (value === undefined) {
            return color.gray('undefined'); // undefined in grigio
        }

        // Formattazione degli oggetti e degli array
        if (typeof value === 'object') {
            return formatObject(value, indent + 2); // Formattazione ricorsiva degli oggetti
        }

        // Default per altri tipi
        return valueColor(value);
    };
    const formatObject = (obj: any, indent: number = 2): string => {
        if (typeof obj !== 'object' || obj === null) return styleValue(obj);
        if (Array.isArray(obj)) {
            return `[\n${obj.map((item) => ' '.repeat(indent) + formatObject(item, indent + 2)).join(',\n')}\n${' '.repeat(indent - 2)}]`;
        }
        return `{\n${Object.entries(obj)
            .map(([key, value]) => {
                const formattedValue = value instanceof Date ? styleValue(value) : formatObject(value, indent + 2);
                return `${' '.repeat(indent)}${styleKey(key)}: ${formattedValue}`;
            })
            .join(',\n')}\n${' '.repeat(indent - 2)}}`;
    };

    return formatObject(obj);
};

/**
 * Funzione per logging generico con supporto per oggetti JSON.
 *
 * @param {string} level - Livello del log (INFO, DEBUG, WARN, ERROR).
 * @param {string} context - Contesto del log (es. nome del modulo o funzione).
 * @param {string|Error|Object} message - Messaggio da loggare (stringa, errore o JSON).
 * @param {string|null} [subContext=null] - Contesto secondario opzionale.
 * @param {Function|null} [messageColor=null] - Colore personalizzato per il messaggio (opzionale).
 */
const logMessage = (level: LogLevel, context: string, message: unknown, subContext: string | null = null, messageColor: ColorFn | null = null): void => {
    const parsedMessage = toLoggable(message);

    const levelConfig = levelColor(level);

    const subMex = subContext ? `> ${subContext}` : '';

    // Applica il colore personalizzato, se specificato
    const applyMessageColor = (msg: string): string => (messageColor ? messageColor(msg) : msg);

    // Messaggio principale (testo o JSON)
    const isJSON = typeof parsedMessage === 'object' && parsedMessage !== null && !(parsedMessage instanceof Error);
    const formattedMessage = isJSON ? colorizeKeysAsStringIndent(parsedMessage as Record<string, any>, messageColor || color.cyan, color.green, null, color.bold) : parsedMessage instanceof Error ? applyMessageColor(parsedMessage.message) : applyMessageColor(parsedMessage);
    // Stack trace (solo per Error)
    const errorStack = parsedMessage instanceof Error ? color.gray(parsedMessage.stack || '') : '';

    // Log finale
    console.log(`${levelConfig.color(`[${context}] ${levelConfig.label} ${subMex}:`)}\n${formattedMessage}\n${errorStack}`);

    // Log su file condizionale
    writeLogToFile(level, context, subMex, formattedMessage, errorStack);
};

/**
 * Funzione per logging degli errori.
 */
const logError = (context: string, error: unknown, subContext?: string, messageColor: ColorFn | null = null): void => {
    const { function: fun, file, line, column } = getCallerManzotin();
    const parsedMessage = toLoggable(error);
    logMessage('ERROR', context || file, parsedMessage, subContext || `${fun} at line:${line} col: ${column}`, messageColor);
};

/**
 * Funzione per logging dei warning.
 */
const logWarn = (context: string, message: unknown, subContext?: string, messageColor: ColorFn | null = null): void => {
    const { function: fun, file, line, column } = getCallerManzotin();
    const parsedMessage = toLoggable(message);
    logMessage('WARN', context || file, parsedMessage, subContext || `${fun} at line:${line} col: ${column}`, messageColor);
};

/**
 * Funzione per logging informativo.
 */
const logInfo = (context: string, message: unknown, subContext?: string, messageColor: ColorFn | null = null): void => {
    const { function: fun, file, line, column } = getCallerManzotin();
    const parsedMessage = toLoggable(message);
    logMessage('INFO', context || file, parsedMessage, subContext || `${fun} at line:${line} col: ${column}`, messageColor);
};

/**
 * Funzione per logging di debug.
 */
const logDebug = (context: string, message: unknown, subContext?: string, messageColor: ColorFn | null = null): void => {
    const { function: fun, file, line, column } = getCallerManzotin();
    const parsedMessage = toLoggable(message);
    logMessage('DEBUG', context || file, parsedMessage, subContext || `${fun} at line:${line} col: ${column}`, messageColor);
};

/**
 * Logger centralizzato per il debug delle informazioni utente e degli aggiornamenti del database.
 *
 * @param {string} label - Etichetta per il log (es. "Matched Servers JSON" o "mainPrisma User Updated result").
 * @param {string} context - Contesto del log (es. "handleAuthentication").
 * @param {string} fusername - Nome utente in fase di autenticazione.
 * @param {Object} data - Dati da loggare (es. `matchedServers` o `updatedMainPrisma`).
 * @param {number} verbosityLevel - Livello di verbosità richiesto per il log.
 * @param {number} requiredVerbosity - Livello minimo di verbosità per stampare il log.
 * @param {Function|null} [messageColor=null] - Colore personalizzato per il messaggio (opzionale).
 *
 * @example
 * // Log dei server associati
 * logDebugData(
 *   'Matched Servers JSON',
 *   'handleAuthentication',
 *   fusername,
 *   matchedServers,
 *   AUTH_VERBOSITY,
 *   1,
 *   color.cyan
 * );
 */
const logDebugData = (label: string, context: string, fusername: string, data: Record<string, any>, verbosityLevel: number, requiredVerbosity: number, messageColor: ColorFn | null = null): void => {
    if (verbosityLevel >= requiredVerbosity) {
        const formattedData = colorizeKeysAsStringIndent(data, messageColor || color.cyan, color.green);
        console.log(`${color.bgMagenta(`[${context}] > DEBUG:`)} User ${fusername}\n` + `${color.green.bold(`${label}:`)}\n${formattedData}`);
    }
};

/**
 * Recupera il nome della prima funzione chiamante esterna significativa,
 * saltando frame interni e quelli anonimi.
 *
 * @returns {string} - Nome della funzione chiamante o 'anonymous' se non identificabile.
 */
const getFunctionName = (): string => {
    try {
        throw new Error();
    } catch (e: unknown) {
        if (!(e instanceof Error) || !e.stack) return 'anonymous';

        const stackLines = e.stack.split('\n').slice(1);
        const excludeKeywords = ['getFunctionName', 'logInfo', 'logDebug', 'logError', 'logWarn', 'logMessage', 'logDebugData'];

        for (const line of stackLines) {
            const match = line.trim().match(/at (\S+)/);
            if (match && match[1] && !excludeKeywords.some((k) => match[1].includes(k))) {
                return match[1];
            }
        }

        return 'anonymous';
    }
};

/**
 * Estrae dettagli dal primo stack frame esterno significativo:
 * funzione, file, linea, colonna. Se trova "anonymous", continua a cercare in alto.
 *
 * @returns {{
 *   function: string,
 *   file: string,
 *   line: number,
 *   column: number
 * }} - Informazioni sul chiamante.
 */
const getCallerManzotin = (): CallerInfo => {
    try {
        throw new Error();
    } catch (e: unknown) {
        if (!(e instanceof Error) || !e.stack) {
            return { function: 'anonymous', file: 'unknown', line: -1, column: -1 };
        }

        const stackLines = e.stack.split('\n').slice(1);
        const excludeKeywords = ['getCallerManzotin', 'getFunctionName', 'logInfo', 'logDebug', 'logError', 'logWarn', 'logMessage', 'logDebugData'];

        for (const line of stackLines) {
            const match = line.trim().match(/at (\S+) \((.*):(\d+):(\d+)\)/) || line.trim().match(/at (.*):(\d+):(\d+)/);

            if (match) {
                const fnName = match[1];
                const filePath = match[2] || match[1];
                const lineNum = parseInt(match[3], 10);
                const colNum = parseInt(match[4], 10);
                const fileName = filePath.split('/').pop() || 'unknown';

                const isAnon = !fnName || fnName.includes('/') || fnName === filePath || fnName === 'anonymous';
                const isExcluded = excludeKeywords.some((kw) => fnName.includes(kw));

                if (!isExcluded && !isAnon && !isNaN(lineNum) && !isNaN(colNum)) {
                    return {
                        function: `${fnName}()`,
                        file: fileName,
                        line: lineNum,
                        column: colNum,
                    };
                }

                if (isAnon && !isExcluded && fileName !== 'unknown') {
                    return {
                        function: `${fileName}@${lineNum}`,
                        file: fileName,
                        line: lineNum,
                        column: colNum,
                    };
                }
            }
        }

        return { function: 'anonymous', file: 'unknown', line: -1, column: -1 };
    }
};

// Esporta le funzioni principali e di test
export { color, log, whiteBG, bgWhite, bgYellowBright, bgCyanBright, cyanBright, whiteBright, white, blueBright, red, green, cyan, yellow, magenta, usage, colorizeKeysAsString, colorizeKeysAsStringIndent, logError, logDebug, logInfo, logMessage, logWarn, logDebugData, getFunctionName };

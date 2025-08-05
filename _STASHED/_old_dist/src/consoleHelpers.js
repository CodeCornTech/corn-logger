"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.getFunctionName = exports.logDebugData = exports.logWarn = exports.logMessage = exports.logInfo = exports.logDebug = exports.logError = exports.colorizeKeysAsStringIndent = exports.colorizeKeysAsString = exports.usage = exports.magenta = exports.yellow = exports.cyan = exports.green = exports.red = exports.blueBright = exports.white = exports.whiteBright = exports.cyanBright = exports.bgCyanBright = exports.bgYellowBright = exports.bgWhite = exports.whiteBG = exports.log = exports.color = void 0;
// consoleHelpers.js
const fs_1 = __importDefault(require("fs"));
const path_1 = __importDefault(require("path"));
const console_log_colors_1 = require("console-log-colors");
Object.defineProperty(exports, "color", { enumerable: true, get: function () { return console_log_colors_1.color; } });
Object.defineProperty(exports, "log", { enumerable: true, get: function () { return console_log_colors_1.log; } });
Object.defineProperty(exports, "red", { enumerable: true, get: function () { return console_log_colors_1.red; } });
Object.defineProperty(exports, "green", { enumerable: true, get: function () { return console_log_colors_1.green; } });
Object.defineProperty(exports, "cyan", { enumerable: true, get: function () { return console_log_colors_1.cyan; } });
Object.defineProperty(exports, "cyanBright", { enumerable: true, get: function () { return console_log_colors_1.cyanBright; } });
Object.defineProperty(exports, "whiteBright", { enumerable: true, get: function () { return console_log_colors_1.whiteBright; } });
Object.defineProperty(exports, "white", { enumerable: true, get: function () { return console_log_colors_1.white; } });
Object.defineProperty(exports, "whiteBG", { enumerable: true, get: function () { return console_log_colors_1.whiteBG; } });
Object.defineProperty(exports, "bgWhite", { enumerable: true, get: function () { return console_log_colors_1.bgWhite; } });
Object.defineProperty(exports, "bgYellowBright", { enumerable: true, get: function () { return console_log_colors_1.bgYellowBright; } });
Object.defineProperty(exports, "bgCyanBright", { enumerable: true, get: function () { return console_log_colors_1.bgCyanBright; } });
Object.defineProperty(exports, "blueBright", { enumerable: true, get: function () { return console_log_colors_1.blueBright; } });
Object.defineProperty(exports, "yellow", { enumerable: true, get: function () { return console_log_colors_1.yellow; } });
Object.defineProperty(exports, "magenta", { enumerable: true, get: function () { return console_log_colors_1.magenta; } });
const ENABLE_LOG_STORE = process.env.LOG_STORE === 'true';
/* ─────────────── CONFIGURAZIONE BASE ──────────────── */
const LOG_DIR = path_1.default.resolve('logs'); // cartella log
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
/**
 * Restituisce la configurazione (etichetta + colore) per un determinato livello di log.
 *
 * @param lvl - Livello del log (ERROR, WARN, INFO, DEBUG)
 * @returns Oggetto contenente label testuale e funzione di colorazione
 */
const levelColor = (lvl) => {
    const map = {
        ERROR: { label: 'ERROR', color: console_log_colors_1.color.bgRed.white },
        WARN: { label: 'WARN', color: console_log_colors_1.color.bgYellow.black },
        INFO: { label: 'INFO', color: console_log_colors_1.color.bgGreen.black },
        DEBUG: { label: 'DEBUG', color: console_log_colors_1.color.bgBlue.white },
    };
    return map[lvl] || { label: lvl, color: console_log_colors_1.white };
};
/**
 * Restituisce la funzione colore solo se valida.
 *
 * @param fn - Funzione di colore (opzionale)
 * @returns Funzione se valida, altrimenti undefined
 */
const safeColor = (fn) => (typeof fn === 'function' ? fn : undefined);
/**
 * Converte un valore generico in un valore loggabile.
 *
 * @param value - Valore da convertire
 * @returns Valore compatibile con log (stringa, oggetto o errore)
 */
const toLoggable = (value) => {
    if (value instanceof Error)
        return value;
    if (typeof value === 'string')
        return value;
    if (typeof value === 'object' && value !== null)
        return value;
    return String(value);
};
/**
 * Restituisce timestamp formattato in stile italiano (gg/mm/aaaa hh:mm:ss).
 *
 * @returns Stringa timestamp
 */
const getLogTimestamp = () => {
    const now = new Date();
    return `${DATE_FMT.format(now)} ${TIME_FMT.format(now)}`;
};
// Prepara la cartella dei log se richiesto e non esiste
try {
    ENABLE_LOG_STORE && !fs_1.default.existsSync(LOG_DIR) && fs_1.default.mkdirSync(LOG_DIR);
}
catch (err) {
    console.warn(`⚠️ Errore creando directory logs: ${err instanceof Error ? err.message : String(err)}`);
}
/**
 * Restituisce la data corrente in formato YYYY-MM-DD
 * (utile per nome file log: 2025-08-05)
 */
const getLogDateString = () => {
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
const writeLogToFile = (level, context, subMex, formattedMessage, errorStack = '') => {
    if (!ENABLE_LOG_STORE)
        return;
    const timestamp = getLogTimestamp();
    const logLine = `[${timestamp}] [${context}] ${level} ${subMex}:\n${typeof formattedMessage === 'string' ? formattedMessage : JSON.stringify(formattedMessage, null, 2)}\n${errorStack}\n`;
    const logFileName = path_1.default.join(LOG_DIR, `${getLogDateString()}.log`);
    try {
        fs_1.default.appendFileSync(logFileName, logLine);
    }
    catch (err) {
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
    console.log(console_log_colors_1.color.bgWhite.black('Parsed with Client Hints:'));
    console.log(colorizeKeysAsString(json, console_log_colors_1.color.cyan, console_log_colors_1.color.bgBlue, console_log_colors_1.color.bold)); // Colore cyan, sfondo blu, grassetto
    console.log(console_log_colors_1.color.bgWhite.black('Parsed with Feature Check:'));
    console.log(colorizeKeysAsStringIndent(json, console_log_colors_1.color.green, safeColor(null), console_log_colors_1.color.italic)); // Colore green, decorazione italic
};
exports.usage = usage;
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
const colorizeKeysAsString = (obj, keyColor = console_log_colors_1.color.magenta, valueColor = console_log_colors_1.color.green, bgColor = null, textDecoration = null, indent = 2) => {
    const styleKey = (key) => {
        let styled = keyColor(key);
        if (bgColor)
            styled = bgColor(styled);
        if (textDecoration)
            styled = textDecoration(styled);
        return styled;
    };
    const styleValue = (value) => {
        if (value instanceof Date)
            return console_log_colors_1.color.blue(value.toISOString()); // Date in blu
        if (typeof value === 'string')
            return console_log_colors_1.color.yellow(`"${value}"`); // Stringhe in giallo
        if (typeof value === 'number')
            return console_log_colors_1.color.cyan(value); // Numeri in cyan
        if (value === null)
            return console_log_colors_1.color.dim('null'); // null in grigio
        if (value === undefined)
            return console_log_colors_1.color.gray('undefined');
        if (typeof value === 'object')
            return formatObject(value, indent + 2); // Chiamata sicura a oggetti
        return valueColor(String(value)); // Default per altri tipi
    };
    const formatObject = (obj, currentIndent) => {
        if (!obj || typeof obj !== 'object')
            return styleValue(obj); // Evita ricorsione infinita
        if (Array.isArray(obj)) {
            return `[\n${obj.map((item) => ' '.repeat(currentIndent) + styleValue(item)).join(',\n')}\n${' '.repeat(currentIndent - 2)}]`;
        }
        return `{\n${Object.entries(obj)
            .map(([key, value]) => `${' '.repeat(currentIndent)}${styleKey(key)}: ${styleValue(value)}`)
            .join(',\n')}\n${' '.repeat(currentIndent - 2)}}`;
    };
    return formatObject(obj, indent);
};
exports.colorizeKeysAsString = colorizeKeysAsString;
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
const colorizeKeysAsStringIndent = (obj, keyColor = console_log_colors_1.color.magenta, valueColor = console_log_colors_1.color.green, bgColor = null, textDecoration = null, indent = 2) => {
    const styleKey = (key) => {
        let styled = keyColor(key);
        if (bgColor)
            styled = bgColor(styled);
        if (textDecoration)
            styled = textDecoration(styled);
        return styled;
    };
    const styleValue = (value) => {
        // Formattazione delle date (\d{4}[-/]\d{2}[-/]\d{2}T\d{2}:\d{2}:\d{2}\.\d{3}Z) = nn per tutti i formati
        const regexDate = /(\d+[-/]\d+[-/]\d+T\d{2}:\d{2}:\d{2}\.\d{3}Z)/;
        if (value instanceof Date || (typeof value === 'string' && regexDate.test(value))) {
            const date = new Date(value);
            return console_log_colors_1.color.blue(date.toLocaleString('it-IT', { timeZone: 'Europe/Rome' })); // Data leggibile in formato italiano
        }
        // Formattazione dei booleani
        if (typeof value === 'boolean') {
            return value ? console_log_colors_1.color.green('true') : console_log_colors_1.color.red('false'); // Booleani colorati in verde/rosso
        }
        // Formattazione delle stringhe
        if (typeof value === 'string') {
            return console_log_colors_1.color.yellow(`"${value}"`); // Stringhe in giallo
        }
        // Formattazione dei numeri
        if (typeof value === 'number') {
            return console_log_colors_1.color.cyan(value); // Numeri in cyan
        }
        // Formattazione dei valori null
        if (value === null) {
            return console_log_colors_1.color.dim('null'); // null in grigio
        }
        // Formattazione dei valori undefined
        if (value === undefined) {
            return console_log_colors_1.color.gray('undefined'); // undefined in grigio
        }
        // Formattazione degli oggetti e degli array
        if (typeof value === 'object') {
            return formatObject(value, indent + 2); // Formattazione ricorsiva degli oggetti
        }
        // Default per altri tipi
        return valueColor(value);
    };
    const formatObject = (obj, indent = 2) => {
        if (typeof obj !== 'object' || obj === null)
            return styleValue(obj);
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
exports.colorizeKeysAsStringIndent = colorizeKeysAsStringIndent;
/**
 * Funzione per logging generico con supporto per oggetti JSON.
 *
 * @param {string} level - Livello del log (INFO, DEBUG, WARN, ERROR).
 * @param {string} context - Contesto del log (es. nome del modulo o funzione).
 * @param {string|Error|Object} message - Messaggio da loggare (stringa, errore o JSON).
 * @param {string|null} [subContext=null] - Contesto secondario opzionale.
 * @param {Function|null} [messageColor=null] - Colore personalizzato per il messaggio (opzionale).
 */
const logMessage = (level, context, message, subContext = null, messageColor = null) => {
    const parsedMessage = toLoggable(message);
    const levelConfig = levelColor(level);
    const subMex = subContext ? `> ${subContext}` : '';
    // Applica il colore personalizzato, se specificato
    const applyMessageColor = (msg) => (messageColor ? messageColor(msg) : msg);
    // Messaggio principale (testo o JSON)
    const isJSON = typeof parsedMessage === 'object' && parsedMessage !== null && !(parsedMessage instanceof Error);
    const formattedMessage = isJSON ? colorizeKeysAsStringIndent(parsedMessage, messageColor || console_log_colors_1.color.cyan, console_log_colors_1.color.green, null, console_log_colors_1.color.bold) : parsedMessage instanceof Error ? applyMessageColor(parsedMessage.message) : applyMessageColor(parsedMessage);
    // Stack trace (solo per Error)
    const errorStack = parsedMessage instanceof Error ? console_log_colors_1.color.gray(parsedMessage.stack || '') : '';
    // Log finale
    console.log(`${levelConfig.color(`[${context}] ${levelConfig.label} ${subMex}:`)}\n${formattedMessage}\n${errorStack}`);
    // Log su file condizionale
    writeLogToFile(level, context, subMex, formattedMessage, errorStack);
};
exports.logMessage = logMessage;
/**
 * Funzione per logging degli errori.
 */
const logError = (context, error, subContext, messageColor = null) => {
    const { function: fun, file, line, column } = getCallerManzotin();
    const parsedMessage = toLoggable(error);
    logMessage('ERROR', context || file, parsedMessage, subContext || `${fun} at line:${line} col: ${column}`, messageColor);
};
exports.logError = logError;
/**
 * Funzione per logging dei warning.
 */
const logWarn = (context, message, subContext, messageColor = null) => {
    const { function: fun, file, line, column } = getCallerManzotin();
    const parsedMessage = toLoggable(message);
    logMessage('WARN', context || file, parsedMessage, subContext || `${fun} at line:${line} col: ${column}`, messageColor);
};
exports.logWarn = logWarn;
/**
 * Funzione per logging informativo.
 */
const logInfo = (context, message, subContext, messageColor = null) => {
    const { function: fun, file, line, column } = getCallerManzotin();
    const parsedMessage = toLoggable(message);
    logMessage('INFO', context || file, parsedMessage, subContext || `${fun} at line:${line} col: ${column}`, messageColor);
};
exports.logInfo = logInfo;
/**
 * Funzione per logging di debug.
 */
const logDebug = (context, message, subContext, messageColor = null) => {
    const { function: fun, file, line, column } = getCallerManzotin();
    const parsedMessage = toLoggable(message);
    logMessage('DEBUG', context || file, parsedMessage, subContext || `${fun} at line:${line} col: ${column}`, messageColor);
};
exports.logDebug = logDebug;
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
const logDebugData = (label, context, fusername, data, verbosityLevel, requiredVerbosity, messageColor = null) => {
    if (verbosityLevel >= requiredVerbosity) {
        const formattedData = colorizeKeysAsStringIndent(data, messageColor || console_log_colors_1.color.cyan, console_log_colors_1.color.green);
        console.log(`${console_log_colors_1.color.bgMagenta(`[${context}] > DEBUG:`)} User ${fusername}\n` + `${console_log_colors_1.color.green.bold(`${label}:`)}\n${formattedData}`);
    }
};
exports.logDebugData = logDebugData;
/**
 * Recupera il nome della prima funzione chiamante esterna significativa,
 * saltando frame interni e quelli anonimi.
 *
 * @returns {string} - Nome della funzione chiamante o 'anonymous' se non identificabile.
 */
const getFunctionName = () => {
    try {
        throw new Error();
    }
    catch (e) {
        if (!(e instanceof Error) || !e.stack)
            return 'anonymous';
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
exports.getFunctionName = getFunctionName;
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
const getCallerManzotin = () => {
    try {
        throw new Error();
    }
    catch (e) {
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

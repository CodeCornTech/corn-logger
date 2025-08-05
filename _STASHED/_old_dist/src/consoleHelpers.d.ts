import { color, log, red, green, cyan, cyanBright, whiteBright, white, whiteBG, bgWhite, bgYellowBright, bgCyanBright, blueBright, yellow, magenta } from 'console-log-colors';
type LogLevel = 'ERROR' | 'WARN' | 'INFO' | 'DEBUG';
type ColorFn = (input: string) => string;
/**
 * Funzione di esempio per mostrare l'utilizzo delle funzioni di colorazione.
 * Stampa un oggetto JSON formattato con chiavi colorate.
 */
declare const usage: () => void;
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
declare const colorizeKeysAsString: (obj: Record<string, any>, keyColor?: ColorFn, valueColor?: ColorFn, bgColor?: ColorFn | null, textDecoration?: ColorFn | null, indent?: number) => string;
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
declare const colorizeKeysAsStringIndent: (obj: Record<string, any>, keyColor?: ColorFn, valueColor?: ColorFn, bgColor?: ColorFn | null, textDecoration?: ColorFn | null, indent?: number) => string;
/**
 * Funzione per logging generico con supporto per oggetti JSON.
 *
 * @param {string} level - Livello del log (INFO, DEBUG, WARN, ERROR).
 * @param {string} context - Contesto del log (es. nome del modulo o funzione).
 * @param {string|Error|Object} message - Messaggio da loggare (stringa, errore o JSON).
 * @param {string|null} [subContext=null] - Contesto secondario opzionale.
 * @param {Function|null} [messageColor=null] - Colore personalizzato per il messaggio (opzionale).
 */
declare const logMessage: (level: LogLevel, context: string, message: unknown, subContext?: string | null, messageColor?: ColorFn | null) => void;
/**
 * Funzione per logging degli errori.
 */
declare const logError: (context: string, error: unknown, subContext?: string, messageColor?: ColorFn | null) => void;
/**
 * Funzione per logging dei warning.
 */
declare const logWarn: (context: string, message: unknown, subContext?: string, messageColor?: ColorFn | null) => void;
/**
 * Funzione per logging informativo.
 */
declare const logInfo: (context: string, message: unknown, subContext?: string, messageColor?: ColorFn | null) => void;
/**
 * Funzione per logging di debug.
 */
declare const logDebug: (context: string, message: unknown, subContext?: string, messageColor?: ColorFn | null) => void;
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
declare const logDebugData: (label: string, context: string, fusername: string, data: Record<string, any>, verbosityLevel: number, requiredVerbosity: number, messageColor?: ColorFn | null) => void;
/**
 * Recupera il nome della prima funzione chiamante esterna significativa,
 * saltando frame interni e quelli anonimi.
 *
 * @returns {string} - Nome della funzione chiamante o 'anonymous' se non identificabile.
 */
declare const getFunctionName: () => string;
export { color, log, whiteBG, bgWhite, bgYellowBright, bgCyanBright, cyanBright, whiteBright, white, blueBright, red, green, cyan, yellow, magenta, usage, colorizeKeysAsString, colorizeKeysAsStringIndent, logError, logDebug, logInfo, logMessage, logWarn, logDebugData, getFunctionName };

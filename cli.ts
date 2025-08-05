#!/usr/bin/env node
import { logInfo, logError, logWarn, logDebug } from './index'; // ⚠️ Usa path corretto se transpili in `dist/`
import { program } from 'commander';

program.name('cornlog').description('🧠 Logger CLI CodeCorn - log colorato e opzionale su file').version('1.0.2');

program.requiredOption('-c, --context <context>', 'Contesto del log (es: SYSTEM, DB, API)').requiredOption('-l, --level <level>', 'Livello log: info | warn | error | debug').requiredOption('-m, --message <message>', 'Messaggio da loggare').option('-s, --sub <subContext>', 'Sotto-contesto opzionale').parse();

const opts = program.opts();

const ctx = opts.context;
const lvl = opts.level.toLowerCase();
const msg = opts.message;
const sub = opts.sub || null;

switch (lvl) {
    case 'info':
        logInfo(ctx, msg, sub);
        break;
    case 'warn':
        logWarn(ctx, msg, sub);
        break;
    case 'error':
        logError(ctx, new Error(msg), sub);
        break;
    case 'debug':
        logDebug(ctx, msg, sub);
        break;
    default:
        console.error(`❌ Livello non valido: ${lvl}`);
        process.exit(1);
}

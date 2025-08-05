#!/usr/bin/env node
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const index_js_1 = require("./dist/index.js"); // ⚠️ Usa path corretto se transpili in `dist/`
const commander_1 = require("commander");
commander_1.program.name('cornlog').description('🧠 Logger CLI CodeCorn – log colorato e opzionale su file').version('1.0.0');
commander_1.program.requiredOption('-c, --context <context>', 'Contesto del log (es: SYSTEM, DB, API)').requiredOption('-l, --level <level>', 'Livello log: info | warn | error | debug').requiredOption('-m, --message <message>', 'Messaggio da loggare').option('-s, --sub <subContext>', 'Sotto-contesto opzionale').parse();
const opts = commander_1.program.opts();
const ctx = opts.context;
const lvl = opts.level.toLowerCase();
const msg = opts.message;
const sub = opts.sub || null;
switch (lvl) {
    case 'info':
        (0, index_js_1.logInfo)(ctx, msg, sub);
        break;
    case 'warn':
        (0, index_js_1.logWarn)(ctx, msg, sub);
        break;
    case 'error':
        (0, index_js_1.logError)(ctx, new Error(msg), sub);
        break;
    case 'debug':
        (0, index_js_1.logDebug)(ctx, msg, sub);
        break;
    default:
        console.error(`❌ Livello non valido: ${lvl}`);
        process.exit(1);
}

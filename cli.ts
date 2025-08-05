#!/usr/bin/env node
import { program } from 'commander';
import { logInfo, logError, logWarn, logDebug } from './index.js'; // ⚠️ Usa path corretto se transpili in `dist/`

program
  .name('cornlog')
  .description('🧠 Logger CLI CodeCorn - log colorato e opzionale su file')
  .version('1.0.3')
  .requiredOption('-c, --context <context>', 'Contesto del log (es: SYSTEM, DB, API)')
  .requiredOption('-l, --level <level>', 'Livello log: info | warn | error | debug')
  .requiredOption('-m, --message <message>', 'Messaggio da loggare')
  .option('-s, --sub <subContext>', 'Sotto-contesto opzionale');

program.on('--help', () => {
  console.log('');
  console.log('📌 Esempi:');
  console.log('');
  console.log('  ✅  Log semplice');
  console.log('     $ cornlog -c SYSTEM -l info -m "Avvio completato"');
  console.log('');
  console.log('  ✅  Log con sub-context');
  console.log('     $ cornlog -c DB -l error -m "Connessione fallita" -s DBConnect');
  console.log('');
  console.log('  ✅  Usabile anche con npm run:');
  console.log('     $ npm run cli -- -c API -l warn -m "Endpoint lento"');
  console.log('');
  console.log('  ✅  Salvataggio su file');
  console.log('     Abilita via .env: LOG_STORE=true');
  console.log('');
});

program.parse();

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

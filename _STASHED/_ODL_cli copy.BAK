#!/usr/bin/env tsx
import { logInfo, logError, logDebug, logWarn } from './src/consoleHelpers';
import * as dotenv from 'dotenv';
dotenv.config();

const args = process.argv.slice(2);

if (args.length < 1) {
  logWarn('CLI', 'Nessun argomento fornito', 'Usage: cli.ts --message "Ciao mondo"');
  process.exit(1);
}

const msgArg = args.find((a) => a.startsWith('--message'));
const msg = msgArg ? msgArg.split('=')[1] || 'Messaggio non specificato' : 'Messaggio mancante';

logInfo('CLI', msg, 'Avvio');

try {
  // Simula operazione
  if (msg === 'fail') throw new Error('Simulazione fallimento');
  logDebug('CLI', { success: true, msg }, 'Operazione completata');
} catch (e) {
  logError('CLI', e, 'Errore generato');
}
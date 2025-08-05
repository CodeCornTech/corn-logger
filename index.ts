import * as dotenv from 'dotenv';
dotenv.config(); // ⚠️ Deve stare prima di accedere a process.env
export * from './src/consoleHelpers'; // Esporta tutto il logger

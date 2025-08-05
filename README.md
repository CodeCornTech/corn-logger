# 🌽 @codecorn/corn-logger

> 🧠 Logger TypeScript avanzato per Node.js con supporto a colori, salvataggio su file, sub-contesto e livello log.  
> Colori, contesto, stack trace, log file, livelli e supporto a `.env`.
> Basato su [`console-log-colors`](https://www.npmjs.com/package/console-log-colors) e ottimizzato per ambienti CLI/DevOps.

[![Downloads](https://img.shields.io/npm/dt/@codecorn/corn-logger?color=blue&label=npm%20downloads)](https://www.npmjs.com/package/@codecorn/corn-logger)
[![npm version](https://img.shields.io/npm/v/@codecorn/corn-logger?color=brightgreen&logo=npm)](https://www.npmjs.com/package/@codecorn/corn-logger)
[![GitHub stars](https://img.shields.io/github/stars/CodeCornTech/corn-logger?style=social)](https://github.com/CodeCornTech/corn-logger)
[![GitHub issues](https://img.shields.io/github/issues/CodeCornTech/corn-logger?color=blue)](https://github.com/CodeCornTech/corn-logger/issues)
[![Tests](https://github.com/CodeCornTech/corn-logger/actions/workflows/test.yml/badge.svg)](https://github.com/CodeCornTech/corn-logger/actions/workflows/test.yml)
[![MIT License](https://img.shields.io/github/license/CodeCornTech/corn-logger)](LICENSE)

---

## 🚀 Installazione

```bash
npm install @codecorn/corn-logger
```

oppure con yarn:

```bash
yarn add @codecorn/corn-logger
```

> ⚠️ Il logger legge automaticamente variabili da `.env` se presenti (`dotenv.config()` è incluso).

---

## ✨ Funzionalità

-   ✅ Log colorati con contesto e sub-contesto
-   ✅ Livelli: `DEBUG`, `INFO`, `WARN`, `ERROR`
-   ✅ Logging condizionale su file (`process.env.LOG_STORE=true`)
-   ✅ Supporto a stack trace errori
-   ✅ Pretty-print JSON e oggetti complessi
-   ✅ Time e date `IT` friendly (`dd/MM/yyyy HH:mm:ss`)

---

## 🔧 Setup base

```ts
// index.ts o bootstrap
import * as dotenv from 'dotenv';
dotenv.config();

import { logInfo, logError, logWarn, logDebug, logMessage } from '@codecorn/corn-logger';

logMessage('DEBUG', 'BOOT', 'Logger pronto 🚀');
logInfo('MAIN', 'Tutto ok');
logWarn('INIT', { warning: 'config mancante' });
logError('DB', new Error('Connessione fallita'), 'DBConnect');
logDebug('SERVICE', { id: 123, state: 'running' }, 'JobRunner');
```

---

## 🔥 Esempi

```ts
logInfo('SERVER', 'Server avviato sulla porta 3000');

logWarn('DB', 'Connessione lenta rilevata', 'Postgres');

logError('API', new Error('Endpoint fallito'), 'GET /api/user');

logDebug('AUTH', { user: 'admin', role: 'superuser' }, 'SessionPayload');
```

> Tutti i log vengono stampati in console colorata e salvati in `logs/YYYY-MM-DD.log` se `LOG_STORE=true`.

---

## ⚙️ Variabili `.env` e 📦 Logger su File

Per abilitare la scrittura su file nella directory `logs/`:

```env
LOG_STORE=true
```

> Se `LOG_STORE=true`, ogni log sarà anche salvato in file `logs/YYYY-MM-DD.log`.

Output nel formato:

```
[2025-08-05 14:33:05] [SERVICE] DEBUG > JobRunner:
{ id: 123, state: 'running' }
```

---

## ✨ Features

-   ✅ Colorazione ANSI per ogni livello log
-   ✅ Sub-context support (`logError(context, err, subContext)`)
-   ✅ Supporto a `Error`, `object`, `string`, `null`, `undefined`
-   ✅ Salvataggio su file con timestamp (`LOG_STORE=true`)
-   ✅ Estendibile e minimalista

---

## 🔧 Scripts utili

Nel tuo `package.json`:

```json
"scripts": {
  "build": "tsc",
  "dev": "tsc --watch",
  "lint": "tsc --noEmit",
  "prepare": "npm run build"
}
```

---

## 🗂 Struttura progetto

```
corn-logger/
├── dist/              # Build finale JS
├── src/               # Codice sorgente TS
├── types/             # Tipi definiti
├── index.ts           # Entry point
├── .env               # (opzionale)
├── .npmignore
├── package.json
├── README.md
├── LICENSE
└── tsconfig.json
```

---

## 🛠 Integrazione CLI (facoltativa)

Puoi usare il logger anche da terminale:

```bash
npx cornlog --context "SYSTEM" --level info --message "Avvio completato"
```

---

## 🧪 Test

```bash
npm run lint
npm test
```

---

## 👤 Maintainer

<div style="display: flex; justify-content: space-between; align-items: center;"> 
  <div> 
    <p><strong>👨‍💻 Federico Girolami</strong></p> 
    <p><strong>Full Stack Developer</strong> | <strong>System Integrator</strong> | <strong>Digital Solution Architect</strong> 🚀</p> 
    <p>📫 <strong>Get in Touch</strong></p> 
    <p>🌐 <strong>Website</strong>: <a href="https://codecorn.it">codecorn.it</a> *(Under Construction)*</p> 
    <p>📧 <strong>Email</strong>: <a href="mailto:f.girolami@codecorn.it">f.girolami@codecorn.it</a></p> 
    <p>🐙 <strong>GitHub</strong>: <a href="https://github.com/fgirolami29">github.com/fgirolami29</a></p> 
  </div> 
  <div style="text-align: center;">
    <a href="https://www.codecorn.it"> 
      <img src="https://codecorn.it/wp-content/uploads/2025/05/CODECORN-trasp-qhite.png" alt="Code Corn Logo"  width="250px" height="90px" style="margin-top:30px;margin-bottom:20px;"/>
    </a> 
    <a href="https://github.com/fgirolami29"> 
      <img src="https://avatars.githubusercontent.com/u/68548715?s=200&v=4" alt="Federico Girolami Avatar" style="border-radius: 50%; width: 125px; height: 125px;border: 5px solid gold" /> 
    </a> 
  </div> 
</div>

---

## 📝 License

MIT © [CodeCorn™](https://codecorn.it)

Distribuito sotto licenza [MIT](LICENSE).

---

### 🤝 Contribuisci

Pull request benvenute. Per grosse modifiche apri una issue prima di iniziare.

> Powered by CodeCorn™ 🚀

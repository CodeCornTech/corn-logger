# 🧠 @codecorn/corn-logger

> Logger stiloso, potente e ANSI-friendly per Node.js e TypeScript.  
> Colori, contesto, stack trace, log file, livelli e supporto a `.env`.

[![npm version](https://img.shields.io/npm/v/@codecorn/corn-logger.svg?style=flat-square)](https://www.npmjs.com/package/@codecorn/corn-logger)
[![License: MIT](https://img.shields.io/badge/license-MIT-green.svg?style=flat-square)](LICENSE)
[![CodeCorn™](https://img.shields.io/badge/powered%20by-CodeCorn™-ff69b4?style=flat-square)](https://codecorn.it)
[![Tests](https://github.com/CodeCornTech/corn-logger/actions/workflows/test.yml/badge.svg)](https://github.com/CodeCornTech/corn-logger/actions/workflows/test.yml)

---

## 🚀 Installazione

```bash
npm install @codecorn/corn-logger
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

import { logInfo, logError, logWarn, logDebug } from '@codecorn/corn-logger';

logInfo('BOOT', 'Logger pronto 🚀');
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

## ⚙️ Variabili `.env`

```env
LOG_STORE=true
```

> Se `LOG_STORE=true`, ogni log sarà anche salvato in file `logs/YYYY-MM-DD.log`.

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

---

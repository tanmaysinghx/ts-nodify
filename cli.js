#!/usr/bin/env node

import inquirer from 'inquirer';
import { execSync } from 'child_process';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import chalk from 'chalk';
import figlet from 'figlet';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const pkg = JSON.parse(fs.readFileSync(path.join(__dirname, 'package.json'), 'utf-8'));


const args = process.argv.slice(2);

/* ---------- HELP MESSAGE ---------- */
if (args.includes('--help') || args.includes('-h')) {
  console.log(
    chalk.cyan(
      figlet.textSync('TS-Nodify', { font: 'Standard' })
    )
  );

  (async () => {
    let exit = false;
    while (!exit) {
      const { section } = await inquirer.prompt([
        {
          type: 'list',
          name: 'section',
          message: 'Select a help section:',
          choices: [
            'Overview',
            'Commands',
            'Options',
            'Examples',
            'Exit Help'
          ]
        }
      ]);

      switch (section) {
        case 'Overview':
          console.log(`
${chalk.bold('TS-Nodify')} - ${pkg.description}
Author: ${chalk.green(pkg.author)}
Version: ${chalk.yellow(pkg.version)}
Purpose: Quickly scaffold Node.js + Express projects with TypeScript/JavaScript.
          `);
          break;

        case 'Commands':
          console.log(`
${chalk.bold('Available commands:')}
  ${chalk.cyan('--help, -h')}       Show this help menu
  ${chalk.cyan('--version, -v')}    Show CLI version
  ${chalk.cyan('create')}           Start a new project scaffold
          `);
          break;

        case 'Options':
          console.log(`
${chalk.bold('Options for project creation:')}
  Language: TypeScript or JavaScript
  Module system: ES Modules (import/export)
  Packages: express, dotenv, cors, mongoose, winston, etc.
  Deployment helpers: Dockerfile, docker-compose, Jenkinsfile, GitHub Actions CI
          `);
          break;

        case 'Examples':
          console.log(`
${chalk.bold('Example usage:')}
  ${chalk.cyan('ts-nodify')}          Start interactive project creation
  ${chalk.cyan('ts-nodify --version')}  Show CLI version
  ${chalk.cyan('ts-nodify --help')}     Show this interactive help
          `);
          break;

        case 'Exit Help':
          exit = true;
          break;
      }
    }
  })();
}


/* ---------- Version MESSAGE ---------- */
if (args.includes('--version') || args.includes('-v')) {
  console.log(
    chalk.red(
      figlet.textSync('TS-Nodify', {
        font: 'Slant', // try 'Big', 'Doom', 'Standard'
        horizontalLayout: 'default',
        verticalLayout: 'default'
      })
    )
  );

  console.log(chalk.cyanBright('══════════════════════════════════════════════'));
  console.log(chalk.greenBright(`🚀 Version : v${pkg.version}`));
  console.log(chalk.magentaBright(`👤 Author  : ${pkg.author}`));
  console.log(chalk.yellowBright(`ℹ️  Description : ${pkg.description}`));
  console.log(chalk.cyanBright('══════════════════════════════════════════════'));
  console.log(chalk.gray(`✨ Created with ❤️ by Tanmay Singh <tanmaysinghx@gmail.com>`));
  console.log(); // extra line for spacing

  process.exit(0);
}

/* ---------- LOGGER TEMPLATES ---------- */
const LOGGER_TS_ESM = `
import winston from 'winston';

const customFormat = winston.format.combine(
  winston.format.colorize(),
  winston.format.timestamp({ format: 'YYYY-MM-DD HH:mm:ss' }),
  winston.format.printf(({ timestamp, level, message }) => {
    return \`\${timestamp} \${level}: \${message}\`;
  })
);

const logger = winston.createLogger({
  level: 'info',
  format: customFormat,
  transports: [
    new winston.transports.Console(),
    new winston.transports.File({
      filename: 'combined.log',
      format: winston.format.json()
    })
  ]
});

export default logger;
`.trim();

const LOGGER_JS_ESM = LOGGER_TS_ESM;

const LOGGER_TS_CJS = `
const winston = require('winston');

const customFormat = winston.format.combine(
  winston.format.colorize(),
  winston.format.timestamp({ format: 'YYYY-MM-DD HH:mm:ss' }),
  winston.format.printf(({ timestamp, level, message }) => {
    return \`\${timestamp} \${level}: \${message}\`;
  })
);

const logger = winston.createLogger({
  level: 'info',
  format: customFormat,
  transports: [
    new winston.transports.Console(),
    new winston.transports.File({
      filename: 'combined.log',
      format: winston.format.json()
    })
  ]
});

module.exports = logger;
`.trim();

const LOGGER_JS_CJS = LOGGER_TS_CJS;

/* ---------- MAIN SCRIPT ---------- */
(async () => {
  console.log("🚀 Starting Node.js project setup...");

  const answers = await inquirer.prompt([
    {
      type: 'input',
      name: 'projectName',
      message: 'Enter your project name:',
      default: 'my-node-app'
    },
    {
      type: 'list',
      name: 'language',
      message: 'Choose your language:',
      choices: ['TypeScript', 'JavaScript'],
      default: 'TypeScript'
    },
    {
      type: 'list',
      name: 'moduleSystem',
      message: 'Choose module system:',
      choices: [
        { name: 'ES Modules (import/export)', value: 'ES Modules (import/export)' },
        { name: 'CommonJS (require/module.exports)', value: 'CommonJS (require/module.exports)', disabled: 'Will be supported in future releases' }
      ],
      default: 'ES Modules (import/export)'
    },
    {
      type: 'checkbox',
      name: 'packages',
      message: 'Select packages to install (Note: Required ones are suggested):',
      choices: [
        // Core
        'express', 'dotenv', 'cors', 'mongoose', 'prisma', 'morgan', 'winston',
        'uuid', 'bcrypt', 'swagger-ui-express', 'cookie-parser',
        // Extra
        'helmet', 'compression', 'express-rate-limit',
        'joi', 'zod', 'axios',
        'jsonwebtoken', 'passport', 'multer', 'socket.io'
      ],
      default: [
        'express', 'dotenv', 'cors', 'mongoose', 'morgan', 'winston',
        'uuid', 'bcrypt', 'swagger-ui-express', 'cookie-parser',
      ]
    },
    {
      type: 'input',
      name: 'port',
      message: 'Enter the port number for your server:',
      default: '3000',
      validate: input => {
        const parsed = parseInt(input, 10);
        return !isNaN(parsed) && parsed > 0 && parsed < 65536 ? true : 'Please enter a valid port number';
      }
    },
    {
      type: 'checkbox',
      name: 'deploymentHelpers',
      message: 'Select deployment helpers to generate:',
      choices: [
        { name: 'Dockerfile', value: 'dockerfile' },
        { name: 'docker-compose.yml', value: 'compose' },
        { name: 'Jenkinsfile', value: 'jenkins' },
        { name: 'GitHub Actions CI/CD (ci.yml)', value: 'github' }
      ],
      default: ['dockerfile', 'compose']
    }

  ]);

  let { projectName, language, moduleSystem, packages, port, deploymentHelpers } = answers;

  const isTS = language === 'TypeScript';
  const isESM = moduleSystem.startsWith('ES Modules');

  // Handle folder conflicts
  if (fs.existsSync(projectName)) {
    const choices = await inquirer.prompt([
      {
        type: 'list',
        name: 'action',
        message: `Folder '${projectName}' already exists. What would you like to do?`,
        choices: ['Continue (overwrite)', 'Choose a different name', 'Cancel setup']
      }
    ]);
    if (choices.action === 'Cancel setup') process.exit(1);
    if (choices.action === 'Choose a different name') {
      const newName = await inquirer.prompt([
        {
          type: 'input',
          name: 'projectName',
          message: 'Enter a new project name:',
          default: `${projectName}-new`
        }
      ]);
      projectName = newName.projectName;
    }
  }

  fs.mkdirSync(projectName, { recursive: true });
  process.chdir(projectName);

  /* ---------- Install base dependencies ---------- */
  execSync('npm init -y', { stdio: 'inherit' });
  execSync(`npm install ${packages.join(' ')}`, { stdio: 'inherit' });

  /* ---------- TS / JS setup ---------- */
  if (isTS) {
    execSync(
      'npm install --save-dev typescript ts-node ts-node-dev @types/node @types/express @types/cors @types/cookie-parser @types/morgan @types/bcrypt @types/swagger-ui-express @types/uuid',
      { stdio: 'inherit' }
    );
    const tsconfig = {
      compilerOptions: {
        target: "ES2020",
        module: isESM ? "NodeNext" : "CommonJS",
        moduleResolution: isESM ? "NodeNext" : "Node",
        outDir: "dist",
        rootDir: "./src",
        strict: true,
        esModuleInterop: true,
        forceConsistentCasingInFileNames: true,
        ...(isESM && { allowSyntheticDefaultImports: true })
      },
      include: ["src/**/*.ts"],
      exclude: ["node_modules"]
    };
    fs.writeFileSync('tsconfig.json', JSON.stringify(tsconfig, null, 2));
  } else {
    execSync('npm install --save-dev nodemon', { stdio: 'inherit' });
  }

  /* ---------- Scaffold folders ---------- */
  const folders = [
    'src/controllers', 'src/routes', 'src/services', 'src/models',
    'src/middleware', 'src/utils', 'src/types', 'src/config'
  ];
  folders.forEach(f => fs.mkdirSync(f, { recursive: true }));

  fs.writeFileSync('.env', `PORT=${port}\nDB_URI=\nAPI_VERSION=v1\n`);

  /* ---------- Update package.json ---------- */
  const pkgPath = path.join(process.cwd(), 'package.json');
  const pkgJson = JSON.parse(fs.readFileSync(pkgPath, 'utf-8'));
  if (isESM) pkgJson.type = "module";

  if (isTS) {
    pkgJson.scripts.start = "node dist/server.js";
    pkgJson.scripts.dev = isESM
      ? 'node --loader ts-node/esm src/server.ts'
      : 'ts-node src/server.ts';
  } else {
    pkgJson.scripts.start = "node src/server.js";
    pkgJson.scripts.dev = "nodemon src/server.js";
  }
  fs.writeFileSync(pkgPath, JSON.stringify(pkgJson, null, 2));

  /* ---------- Generate utils/logger ---------- */
  const loggerPath = path.join('src', 'utils', isTS ? 'logger.ts' : 'logger.js');
  let loggerContent;
  if (isTS && isESM) loggerContent = LOGGER_TS_ESM;
  else if (isTS && !isESM) loggerContent = LOGGER_TS_CJS;
  else if (!isTS && isESM) loggerContent = LOGGER_JS_ESM;
  else loggerContent = LOGGER_JS_CJS;
  fs.writeFileSync(loggerPath, loggerContent);

  /* ---------- Scaffold stubs ---------- */
  const ext = isTS ? 'ts' : 'js';
  const esmExt = isESM ? '.js' : '';

  // DB Stub
  fs.writeFileSync(`src/config/db.${ext}`, isTS ?
    `export async function connectToDatabase(): Promise<void> {\n  console.log("📦 Connected to database");\n}` :
    (isESM ?
      `export async function connectToDatabase() {\n  console.log("📦 Connected to database");\n}` :
      `async function connectToDatabase() {\n  console.log("📦 Connected to database");\n}\nmodule.exports = { connectToDatabase };`
    )
  );

  // Swagger Stub
  fs.writeFileSync(`src/config/swagger.${ext}`, isTS ?
    `import swaggerUi from 'swagger-ui-express';\nimport { Express } from 'express';\n\nexport function setupSwagger(app: Express) {\n  const swaggerSpec = { openapi: '3.0.0', info: { title: 'API Docs', version: '1.0.0' } };\n  app.use('/docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec));\n}` :
    (isESM ?
      `import swaggerUi from 'swagger-ui-express';\n\nexport function setupSwagger(app) {\n  const swaggerSpec = { openapi: '3.0.0', info: { title: 'API Docs', version: '1.0.0' } };\n  app.use('/docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec));\n}` :
      `const swaggerUi = require('swagger-ui-express');\nfunction setupSwagger(app) {\n  const swaggerSpec = { openapi: '3.0.0', info: { title: 'API Docs', version: '1.0.0' } };\n  app.use('/docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec));\n}\nmodule.exports = { setupSwagger };`
    )
  );

  // Middleware: transactionId
  fs.writeFileSync(`src/middleware/transactionIdMiddleware.${ext}`, isTS ?
    `import { v4 as uuidv4 } from 'uuid';\nimport { Request, Response, NextFunction } from 'express';\n\ndeclare global { namespace Express { interface Request { transactionId?: string } } }\n\nexport function transactionIdMiddleware(req: Request, _res: Response, next: NextFunction) {\n  req.transactionId = uuidv4();\n  next();\n}` :
    (isESM ?
      `import { v4 as uuidv4 } from 'uuid';\n\nexport function transactionIdMiddleware(req, _res, next) {\n  req.transactionId = uuidv4();\n  next();\n}` :
      `const { v4: uuidv4 } = require('uuid');\nfunction transactionIdMiddleware(req, _res, next) {\n  req.transactionId = uuidv4();\n  next();\n}\nmodule.exports = { transactionIdMiddleware };`
    )
  );

  // Middleware: loggerConsole
  fs.writeFileSync(`src/middleware/loggerConsole.${ext}`, isTS ?
    `import { Request, Response, NextFunction } from 'express';\nexport function loggerConsole(req: Request, _res: Response, next: NextFunction) {\n  console.log(\`[\${req.method}] \${req.url} - txId:\${req.transactionId}\`);\n  next();\n}` :
    (isESM ?
      `export function loggerConsole(req, _res, next) {\n  console.log(\`[\${req.method}] \${req.url} - txId:\${req.transactionId}\`);\n  next();\n}` :
      `function loggerConsole(req, _res, next) {\n  console.log(\`[\${req.method}] \${req.url} - txId:\${req.transactionId}\`);\n  next();\n}\nmodule.exports = { loggerConsole };`
    )
  );

  // Middleware: errorHandler
  fs.writeFileSync(`src/middleware/errorHandler.${ext}`, isTS ?
    `import { Request, Response, NextFunction } from 'express';\n\nexport function errorHandler(err: Error, _req: Request, res: Response, _next: NextFunction) {\n  console.error('❌ Error:', err.message);\n  res.status(500).json({ error: err.message });\n}` :
    (isESM ?
      `export function errorHandler(err, _req, res, _next) {\n  console.error('❌ Error:', err.message);\n  res.status(500).json({ error: err.message });\n}` :
      `function errorHandler(err, _req, res, _next) {\n  console.error('❌ Error:', err.message);\n  res.status(500).json({ error: err.message });\n}\nmodule.exports = { errorHandler };`
    )
  );

  /* ---------- Scaffold healthCheckRoute ---------- */
  fs.writeFileSync(`src/routes/healthCheckRoute.${ext}`, isTS ?
    `import { Router } from 'express';\n\nconst router = Router();\n\nrouter.get('/health', (req, res) => {\n  res.json({ status: 'ok', transactionId: req.transactionId });\n});\n\nexport default router;` :
    (isESM ?
      `import { Router } from 'express';\n\nconst router = Router();\n\nrouter.get('/health', (req, res) => {\n  res.json({ status: 'ok', transactionId: req.transactionId });\n});\n\nexport default router;` :
      `const { Router } = require('express');\n\nconst router = Router();\n\nrouter.get('/health', (req, res) => {\n  res.json({ status: 'ok', transactionId: req.transactionId });\n});\n\nmodule.exports = router;`
    )
  );

  /* ---------- Scaffold app.ts/js ---------- */
  const appFile = `src/app.${ext}`;
  const appFileContent = isTS ?
    `import express from 'express';\nimport cors from 'cors';\nimport cookieParser from 'cookie-parser';\nimport { transactionIdMiddleware } from './middleware/transactionIdMiddleware${esmExt}';\nimport { loggerConsole } from './middleware/loggerConsole${esmExt}';\nimport { errorHandler } from './middleware/errorHandler${esmExt}';\nimport { setupSwagger } from './config/swagger${esmExt}';\nimport healthCheckRoute from './routes/healthCheckRoute${esmExt}';\nimport { env } from 'process';\n\nconst app = express();\n\napp.use(cors());\napp.use(express.json());\napp.use(cookieParser());\napp.use(transactionIdMiddleware);\napp.use(loggerConsole);\n\nconst apiVersion = env.API_VERSION || 'v1';\napp.use(\`/api/\${apiVersion}\`, healthCheckRoute);\n\nsetupSwagger(app);\n\napp.use(errorHandler);\n\nexport default app;` :
    (isESM ?
      `import express from 'express';\nimport cors from 'cors';\nimport cookieParser from 'cookie-parser';\nimport { transactionIdMiddleware } from './middleware/transactionIdMiddleware.js';\nimport { loggerConsole } from './middleware/loggerConsole.js';\nimport { errorHandler } from './middleware/errorHandler.js';\nimport { setupSwagger } from './config/swagger.js';\nimport healthCheckRoute from './routes/healthCheckRoute.js';\n\nconst app = express();\n\napp.use(cors());\napp.use(express.json());\napp.use(cookieParser());\napp.use(transactionIdMiddleware);\napp.use(loggerConsole);\n\nconst apiVersion = process.env.API_VERSION || 'v1';\napp.use(\`/api/\${apiVersion}\`, healthCheckRoute);\n\nsetupSwagger(app);\n\napp.use(errorHandler);\n\nexport default app;` :
      `const express = require('express');\nconst cors = require('cors');\nconst cookieParser = require('cookie-parser');\nconst { transactionIdMiddleware } = require('./middleware/transactionIdMiddleware');\nconst { loggerConsole } = require('./middleware/loggerConsole');\nconst { errorHandler } = require('./middleware/errorHandler');\nconst { setupSwagger } = require('./config/swagger');\nconst healthCheckRoute = require('./routes/healthCheckRoute');\n\nconst app = express();\n\napp.use(cors());\napp.use(express.json());\napp.use(cookieParser());\napp.use(transactionIdMiddleware);\napp.use(loggerConsole);\n\nconst apiVersion = process.env.API_VERSION || 'v1';\napp.use(\`/api/\${apiVersion}\`, healthCheckRoute);\n\nsetupSwagger(app);\n\napp.use(errorHandler);\n\nmodule.exports = app;`
    );

  fs.writeFileSync(appFile, appFileContent);

  /* ---------- Scaffold server.ts/js ---------- */
  const serverFile = `src/server.${ext}`;
  const serverFileContent = isTS ?
    `import app from './app${esmExt}';\nimport dotenv from 'dotenv';\nimport logger from './utils/logger${esmExt}';\nimport { connectToDatabase } from './config/db${esmExt}';\n\ndotenv.config();\n\nconst PORT: number = Number(process.env.PORT) || ${port};\n\n(async () => {\n  try {\n    await connectToDatabase();\n    app.listen(PORT, () => logger.info(\`🚀 Server running at http://localhost:\${PORT}\`));\n  } catch (err) {\n    logger.error('❌ Failed to start server: ' + (err as Error).message);\n    process.exit(1);\n  }\n})();` :
    (isESM ?
      `import dotenv from 'dotenv';\nimport app from './app.js';\nimport logger from './utils/logger.js';\nimport { connectToDatabase } from './config/db.js';\n\ndotenv.config();\n\nconst PORT = process.env.PORT || ${port};\n\n(async () => {\n  try {\n    await connectToDatabase();\n    app.listen(PORT, () => logger.info(\`🚀 Server running at http://localhost:\${PORT}\`));\n  } catch (err) {\n    logger.error('❌ Failed to start server: ' + err.message);\n    process.exit(1);\n  }\n})();` :
      `const dotenv = require('dotenv');\nconst app = require('./app');\nconst logger = require('./utils/logger');\nconst { connectToDatabase } = require('./config/db');\n\ndotenv.config();\n\nconst PORT = process.env.PORT || ${port};\n\n(async () => {\n  try {\n    await connectToDatabase();\n    app.listen(PORT, () => logger.info(\`🚀 Server running at http://localhost:\${PORT}\`));\n  } catch (err) {\n    logger.error('❌ Failed to start server: ' + err.message);\n    process.exit(1);\n  }\n})();`
    );
  fs.writeFileSync(serverFile, serverFileContent);

  /* ---------- Deployment Templates ---------- */
  const dockerfileContent = `# Dockerfile
FROM node:20-alpine

WORKDIR /app

COPY package*.json ./
RUN npm install

COPY . .

${isTS ? "RUN npm run build" : ""}

EXPOSE ${port}

CMD ["npm", "start"]
`;

  const dockerComposeContent = `version: "3.8"

services:
  app:
    build: .
    container_name: ${projectName}
    ports:
      - "${port}:${port}"
    environment:
      - NODE_ENV=development
      - PORT=${port}
    volumes:
      - .:/app
      - /app/node_modules
    command: npm run dev
`;

  const jenkinsfileContent = `pipeline {
  agent any

  stages {
    stage('Checkout') {
      steps {
        checkout scm
      }
    }

    stage('Install') {
      steps {
        sh 'npm install'
      }
    }

    ${isTS ? `
    stage('Build') {
      steps {
        sh 'npm run build'
      }
    }` : ""}

    stage('Test') {
      steps {
        sh 'npm test || echo "No tests configured"'
      }
    }

    stage('Docker Build & Push') {
      steps {
        sh 'docker build -t ${projectName.toLowerCase()}:latest .'
      }
    }
  }
}
`;

  if (deploymentHelpers.includes("dockerfile")) {
    fs.writeFileSync("Dockerfile", dockerfileContent);
    console.log("✅ Dockerfile generated");
  }

  if (deploymentHelpers.includes("compose")) {
    fs.writeFileSync("docker-compose.yml", dockerComposeContent);
    console.log("✅ docker-compose.yml generated");
  }

  if (deploymentHelpers.includes("jenkins")) {
    fs.writeFileSync("Jenkinsfile", jenkinsfileContent);
    console.log("✅ Jenkinsfile generated");
  }

  if (deploymentHelpers.includes("github")) {
    const ciContent = `name: Node.js CI

on:
  push:
    branches: [ "main" ]
  pull_request:
    branches: [ "main" ]

jobs:
  build:
    runs-on: ubuntu-latest

    steps:
    - uses: actions/checkout@v3
    - name: Use Node.js
      uses: actions/setup-node@v3
      with:
        node-version: 20
    - run: npm install
    ${isTS ? "- run: npm run build" : ""}
    - run: npm test
`;
    fs.mkdirSync(".github/workflows", { recursive: true });
    fs.writeFileSync(".github/workflows/ci.yml", ciContent);
    console.log("✅ GitHub Actions CI workflow generated");
  }


  /* ---------- Final messages ---------- */
  console.log(
    chalk.green(
      figlet.textSync('TS-Nodify', { font: 'Small' }) // smaller banner
    )
  );

  console.log(chalk.yellow.bold('🚀 Project Setup Complete!'));
  console.log(chalk.green(`✅ Project '${chalk.cyan(projectName)}' scaffolded successfully!`));
  console.log(chalk.blue('🎉 Node.js backend template is ready!'));

  console.log(chalk.magenta.bold('\n👉 Next steps:'));
  console.log(chalk.white(`  1. Navigate to your project: ${chalk.cyan(`cd ${projectName}`)}`));
  console.log(chalk.white(`  2. Start development server: ${chalk.cyan('npm run dev')}`));
  console.log(chalk.white(`  3. Check health endpoint: ${chalk.cyan(`http://localhost:${port}/api/v1/health`)}`));
  console.log(chalk.white(`  4. Open Swagger docs: ${chalk.cyan(`http://localhost:${port}/docs`)}`));

  console.log(chalk.green.bold('\n💡 Tip: Use --help for more commands and options!'));

  console.log(chalk.gray(`\nCreated with ❤️ by Tanmay Singh <tanmaysinghx@gmail.com>`));


})();

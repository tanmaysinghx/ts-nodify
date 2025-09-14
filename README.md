# TS Nodify CLI 🚀

**TS Nodify** is a lightweight CLI tool to quickly scaffold a modern Node.js backend project with Express, TypeScript or JavaScript, modular folder structure, logging, middleware, and optional deployment helpers (Docker, Docker Compose, Jenkins, GitHub Actions).

---

## Features

- Scaffold a ready-to-use Node.js backend project in seconds.
- Supports **TypeScript** and **JavaScript**.
- Modular folder structure: `controllers`, `routes`, `services`, `middleware`, `utils`, `config`.
- Built-in **logger** using Winston.
- Transaction ID middleware and error handling.
- Swagger API docs setup (`/docs`).
- Deployment helpers: Dockerfile, docker-compose, Jenkinsfile, GitHub Actions CI/CD.
- Configurable server port and dependencies.

---

## Installation

Globally (recommended):

```bash
npm install -g ts-nodify
```

```bash
npx ts-nodify
```

---

## Usage
Run the CLI and follow the prompts:

You will be asked to:

- Enter project name
- Choose language (TypeScript / JavaScript)
- Select packages
- Enter server port
- Select deployment helpers

---

## After setup:

```bash
cd your-project-name
npm run dev      # Start development server
npm run build    # Build project (TypeScript only)
npm start        # Start production server
```

---

## Open in browser:
- Health check: http://localhost:<port>/api/v1/health
- Swagger API docs: http://localhost:<port>/docs

## License
MIT © Tanmay Singh

## Contributing

Contributions, suggestions, and bug reports are welcome! Open an issue or submit a pull request."# ts-nodify" 

# Work in Progress
This is a training/sandbox project, not a production application. It is still in active development, subject to breaking changes, and may contain bugs or incomplete features.

# Development Guide

Monorepo NX — `execution-service` · `sandbox-web-app` · `worker-go`

---

## Prerequisites

| Tool | Usage |
|------|-------|
| [Docker](https://www.docker.com/) | Run the infrastructure (Khaos) |
| [NX CLI](https://nx.dev/) | Run monorepo targets |
| Java / Gradle | Build and run `execution-service` |
| Go | Build and run `worker-go` |
| Node.js | Run `sandbox-web-app` |

---

## Architecture

```
monorepo/
├── apps/
│   ├── api/
│   │   └── execution-service/   # Spring Boot API (Java/Gradle)
│   ├── worker/
│   │   └── worker-go/           # Worker (Go)
│   └── sandbox-web-app/         # Frontend Angular
└── docker/
    └── khaos/
        └── docker-compose.yml   # Docker infrastructure
```

---

## Start Everything at Once

The easiest way to spin up the full stack. Uses `concurrently` and `wait-on` to start all services in the right order — the worker waits for the API to be ready on port `8080` before starting.

```bash
# Linux / macOS
npm run start:all:linux

# Windows
npm run start:all:windows
```

Each service is color-coded in the terminal output:

| Color | Service |
|-------|---------|
| 🔵 Blue | `execution-service` (API) |
| 🟢 Green | `worker-go` |
| 🟣 Magenta | `sandbox-web-app` |

> ⚠️ **Docker must be running** on your machine before using these scripts.  
> The API starts Docker Compose internally before booting Spring Boot.

Install the required dependencies if not already present:

```bash
npm install --save-dev concurrently wait-on
```

---

## Projects

### 1. `execution-service` — Spring Boot API

> ⚠️ **Docker must be running** on your machine before starting this service.

#### Full start (Docker + API)

Resets Docker Compose then starts the Spring Boot server.

```bash
# Linux
nx serve execution-service --configuration=linux

# Windows
nx serve execution-service --configuration=windows
```

What it does:
1. `docker compose down -v` — removes existing containers
2. `docker compose up -d --build` — rebuilds and starts the infrastructure
3. `gradlew bootRun` — starts the Spring Boot API

#### Simple start (Docker already running)

If Docker is already up and you just want to restart the API:

```bash
# Linux
nx run execution-service:simple-start --configuration=linux

# Windows
nx run execution-service:simple-start --configuration=windows
```

#### Build

```bash
# Linux
nx build execution-service --configuration=linux

# Windows
nx build execution-service --configuration=windows
```

#### Tests

```bash
# Linux
nx test execution-service --configuration=linux

# Windows
nx test execution-service --configuration=windows
```

---

### 2. `worker-go` — Go Worker

> ⚠️ **`execution-service` must be running** before starting the worker.

#### Start

```bash
nx serve worker-go
```

#### Build

```bash
nx build worker-go
```

Output binary at `apps/worker/worker-go/dist/worker`.

---

### 3. `sandbox-web-app` — Angular Frontend

#### Start in development

```bash
nx serve sandbox-web-app
```

Available at [http://localhost:4200](http://localhost:4200)

#### Serve static build

```bash
nx serve-static sandbox-web-app
```

Available at [http://localhost:4200](http://localhost:4200)

#### Build

```bash
# Production
nx build sandbox-web-app --configuration=production

# Development
nx build sandbox-web-app --configuration=development
```

Output at `dist/apps/sandbox-web-app/browser/`

#### Lint

```bash
nx lint sandbox-web-app
```

#### Tests

```bash
nx test sandbox-web-app
```

---

## Startup Order

```
Docker (Khaos)
     ↓
execution-service   (Spring Boot API — port 8080)
     ↓
worker-go           (Go Worker)
     ↓
sandbox-web-app     (Angular Frontend — port 4200)
```

---

## Troubleshooting

**Docker won't start**
→ Check the daemon is running: `docker info`

**Worker crashes on startup**
→ Make sure `execution-service` is up and reachable on port `8080`

**Port already in use**
→ `lsof -i :8080` (Linux/macOS) or `netstat -ano | findstr :8080` (Windows)

**Gradle not found (Linux)**
→ Use the wrapper: `./gradlew` from the monorepo root

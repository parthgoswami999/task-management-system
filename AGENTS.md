# Repository Guidelines

## Project Structure & Module Organization
This repository is an npm workspace with two apps: `client/` and `server/`. Frontend code lives in `client/src`, organized into `app/` for app wiring, `features/` for domain code, and `shared/` for reusable UI and utilities. Backend code lives in `server/src`, organized into `app/` for composition, `core/` for configuration, `features/` for domain modules, and `shared/` for cross-cutting middleware, models, and utilities. A client environment example is provided in `client/.env.example`, and the server variables are documented in `README.md`.

## Build, Test, and Development Commands
Run commands from the repository root unless noted.

- `npm install`: install workspace dependencies.
- `npm run dev`: start the Express API and Vite client together.
- `npm run build`: build the frontend bundle in `client/dist`.
- `npm run start`: run the production server from `server/src/server.js`.
- `npm run lint`: run the client ESLint config.
- `npm run preview --workspace client`: preview the built frontend locally.

## Coding Style & Naming Conventions
Follow the existing style: ES modules, semicolons, and 2-space indentation in both apps. React components and page files use PascalCase, for example `DashboardPage.tsx` and `TaskBoard.tsx`. Hooks use `useX` naming, Redux slices end with `Slice.ts`, and service helpers use camelCase filenames such as `taskService.ts`. On the server, keep route/controller/service names descriptive and aligned by feature, for example `taskRoutes.js`, `taskController.js`, and `taskService.js`.

## Testing Guidelines
There is no automated test runner configured in this checkout yet. Until one is added, treat linting and manual verification as the minimum bar: run `npm run lint`, start the app with `npm run dev`, and exercise auth, task CRUD, and drag-and-drop flows before submitting changes. If you add tests, place them beside the feature or under a dedicated `__tests__/` folder and use names like `taskService.test.js` or `DashboardPage.test.tsx`.

## Commit & Pull Request Guidelines
Local git history is not available in this workspace, so no repository-specific commit convention can be confirmed from `git log`. Use short, imperative commit messages such as `Add task status filter`. For pull requests, include a clear summary, affected areas (`client`, `server`, or both), setup or migration notes, linked issues, and screenshots or short recordings for UI changes.

## Security & Configuration Tips
Do not commit populated `.env` files or secrets. Keep `server/.env` aligned with MongoDB, JWT, and `CLIENT_URL` settings, and set `client/.env` `VITE_API_URL` to the server API base URL.

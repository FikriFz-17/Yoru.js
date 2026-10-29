# Yoru.js

## Overview

Yoru.js eliminates the repetitive setup of React applications. It comes pre-configured with a powerful global API cache factory, lightweight state handling without Redux, global interceptors, and a custom view generator to scaffold your modules consistently and quickly.

## Tech Stack

* Engine: Bun
* Bundler: Vite
* Core: React 19
* State Management & Caching: TanStack Query (React Query)
* HTTP Client: Axios
* UI Framework: Material UI (MUI) & Emotion
* Routing: React Router DOM

## Commands

### Project Initialization
Create a new Yoru.js project from scratch. It automatically scaffolds the architecture without downloading unnecessary packages.

```bash
bun create yoru my-app
```

### Module Generator
Inside your generated project, you can easily scaffold new views (automatically generates the View, Style, Hooks, Components folder, and injects the route).

```bash
bun run g:view [module-name]
```
*Example: `bun run g:view dashboard`*

### Development Server
Run the blazing fast Vite development server.

```bash
bun run dev
```

### Production Build
Build the application for production.

```bash
bun run build
```

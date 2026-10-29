#!/usr/bin/env bun
import { existsSync, cpSync, readFileSync, writeFileSync, renameSync } from "node:fs";
import { resolve, join, basename } from "node:path";
import { spawn } from "node:child_process";
import pc from "picocolors";
import { generateView } from "./commands/generate-view";

const firstArg = process.argv[2];

const runProcess = (command, args) => {
  const child = spawn(command, args, { stdio: "inherit", shell: true });
  child.on("exit", (code) => process.exit(code || 0));
};

// 1. yoru dev
if (firstArg === "dev") {
  runProcess("bunx", ["vite", ...process.argv.slice(3)]);
} 
// 2. yoru build
else if (firstArg === "build") {
  runProcess("bunx", ["vite", "build", ...process.argv.slice(3)]);
} 
// 3. yoru preview
else if (firstArg === "preview") {
  runProcess("bunx", ["vite", "preview", ...process.argv.slice(3)]);
} 
// 4. yoru create:view / g:view
else if (firstArg === "create:view" || firstArg === "c:v" || firstArg === "g:view") {
  const name = process.argv[3];
  const isProtected = 
    process.argv.includes("--protect") || 
    process.argv.includes("--protected") || 
    process.argv.includes("-p");
  generateView(name, isProtected);
  process.exit(0);
} 

// Default: create new project
else {
  const projectName = firstArg || "yoru-app";
  const targetDir = resolve(process.cwd(), projectName);
  if (existsSync(targetDir)) {
    console.error(pc.red(`\n Error: Folder "${projectName}" already exists!\n`));
    process.exit(1);
  }

console.log(pc.cyan(`\n Generating project Yoru.js in ./${projectName}...`));

const templateDir = resolve(import.meta.dir, "template");
cpSync(templateDir, targetDir, {
  recursive: true,
  filter: (source) => {
    const name = basename(source);
    if (name === "node_modules" || name === "dist" || name === "bun.lock") {
      return false; 
    }
    return true; 
  },
});


const pkgPath = join(targetDir, "package.json");
if (existsSync(pkgPath)) {
  const pkg = JSON.parse(readFileSync(pkgPath, "utf-8"));
  pkg.name = projectName;
  writeFileSync(pkgPath, JSON.stringify(pkg, null, 2));
}

const rawIgnorePath = join(targetDir, "gitignore");
const targetIgnorePath = join(targetDir, ".gitignore");

if (existsSync(rawIgnorePath)) {
  renameSync(rawIgnorePath, targetIgnorePath);
} else if (!existsSync(targetIgnorePath)) {
  const gitignoreContent = `# dependencies (bun install)
node_modules

# output
out
dist
*.tgz

# code coverage
coverage
*.lcov

# logs
logs
*.log
report.[0-9]*.[0-9]*.[0-9]*.[0-9]*.json

# dotenv environment variable files
.env
.env.development.local
.env.test.local
.env.production.local
.env.local

# caches
.eslintcache
.cache
*.tsbuildinfo

# IntelliJ based IDEs
.idea

# Finder (MacOS) folder config
.DS_Store
`;
  writeFileSync(targetIgnorePath, gitignoreContent);
}

console.log(pc.green(`\n Proyek generated successfully!\n`));
}
import { existsSync, mkdirSync, writeFileSync, readFileSync } from "node:fs";
import { resolve, join } from "node:path";
import pc from "picocolors";

export function generateView(rawName?: string, isProtected: boolean = false) {
  if (!rawName) {
    process.exit(1);
  }

  // Naming format: 'kebab-case' for folder/file, 'PascalCase' for components React
  const kebabName = rawName.toLowerCase();
  const pascalName = kebabName
    .split("-")
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
    .join("");

  const cwd = process.cwd();
  const srcDir = resolve(cwd, "src");

  // Validation: make sure user run command in root project Yoru.js (folder src not found)
  if (!existsSync(srcDir)) {
    console.error(pc.red("\n folder src not found!\n"));
    process.exit(1);
  }

  // --- 1. GENERATE VIEW LAYER ---
  const viewDir = join(srcDir, "views", kebabName);
  if (existsSync(viewDir)) {
    console.error(pc.red(`\n view "${kebabName}" already exist!\n`));
    process.exit(1);
  }

  // Create folder view and subfolder
  mkdirSync(viewDir, { recursive: true });
  for (const sub of ["components", "hooks", "modals"]) {
    const subPath = join(viewDir, sub);
    mkdirSync(subPath, { recursive: true });
  }

  // File styles
  const styleContent = `import { SxProps, Theme } from "@mui/material";

export const styles: Record<string, SxProps<Theme>> = {
  root: {
    padding: { xs: 2, md: 4 },
  },
  card: {
    padding: 3,
  },
};
`;
  writeFileSync(join(viewDir, `${kebabName}-view-style.ts`), styleContent);

  // File view orchestrator
  const viewContent = `import { Box, Typography, Paper } from "@mui/material";
import { styles } from "./${kebabName}-view-style";

export const ${pascalName}View = () => {
  return (
    <Box sx={styles.root}>
      <Paper sx={styles.card}>
        <Typography variant="h4" gutterBottom>
          ${pascalName} View
        </Typography>
        <Typography variant="body1" color="text.secondary">
          Modul ${kebabName} ready
        </Typography>
      </Paper>
    </Box>
  );
};
`;
  writeFileSync(join(viewDir, `${kebabName}-view.tsx`), viewContent);

  // --- 2. GENERATE PAGE LAYER ---
  const pageDir = join(srcDir, "page");
  if (!existsSync(pageDir)) mkdirSync(pageDir, { recursive: true });

  const pageFile = join(pageDir, `${pascalName}Page.tsx`);
  if (existsSync(pageFile)) {
    console.error(pc.red(`\n Page "${pascalName}Page.tsx" already exists!\n`));
    process.exit(1);
  }
  const pageContent = `import { ${pascalName}View } from "@/views/${kebabName}/${kebabName}-view";

export default function ${pascalName}Page() {
  return <${pascalName}View />;
}
`;
  writeFileSync(pageFile, pageContent);

  // --- 3. AUTO-UPDATE ROUTES ---
  const routeFile = join(srcDir, "routes", "index.tsx");
  if (existsSync(routeFile)) {
    let routeCode = readFileSync(routeFile, "utf-8");

    // Sisipkan import page baru di baris awal
    const importStatement = `import ${pascalName}Page from "@/page/${pascalName}Page";\n`;
    routeCode = importStatement + routeCode;

    if (isProtected) {
      // Pastikan import ProtectedRoutes sudah ada jika belum ada di template
      if (!routeCode.includes("ProtectedRoutes")) {
        routeCode = `import { ProtectedRoutes } from "./protected-routes";\n` + routeCode;
      }

      // Indentasi 6 & 8 spasi agar rapi
      const protectedRouteItem = `      {\n        path: "/${kebabName}",\n        element: <${pascalName}Page />,\n      },\n`;

      if (routeCode.includes("children: [")) {
        // Sisipkan tepat di awal array children: [...]
        routeCode = routeCode.replace("children: [", `children: [\n${protectedRouteItem}`);
      } else {
        // Jika belum ada blok ProtectedRoutes, buat baru
        const protectedBlock = `  {\n    element: <ProtectedRoutes />,\n    children: [\n${protectedRouteItem}    ],\n  },\n`;
        const lastBracketIndex = routeCode.lastIndexOf("]");
        routeCode = routeCode.slice(0, lastBracketIndex) + protectedBlock + routeCode.slice(lastBracketIndex);
      }
    } else {
      // Route Publik biasa
      const publicRouteItem = `  {\n    path: "/${kebabName}",\n    element: <${pascalName}Page />,\n  },\n`;

      if (routeCode.includes("element: <ProtectedRoutes />")) {
        // Sisipkan tepat sebelum blok ProtectedRoutes agar rute publik tetap di atas
        routeCode = routeCode.replace(
          /(\s*\{\s*\n\s*element:\s*<ProtectedRoutes\s*\/>)/,
          `${publicRouteItem}$1`
        );
      } else if (routeCode.includes("]);")) {
        routeCode = routeCode.replace("]);", `${publicRouteItem}]);`);
      } else if (routeCode.includes("]")) {
        const lastBracketIndex = routeCode.lastIndexOf("]");
        routeCode = routeCode.slice(0, lastBracketIndex) + publicRouteItem + routeCode.slice(lastBracketIndex);
      }
    }

    writeFileSync(routeFile, routeCode);
  }

  console.log(pc.green(`\n Modul [${kebabName}] successfully created! ${isProtected ? pc.yellow("(Protected)") : ""}\n`));
  console.log(`  ├── src/views/${kebabName}/`);
  console.log(`  │   ├── components/`);
  console.log(`  │   ├── hooks/`);
  console.log(`  │   ├── modals/`);
  console.log(`  │   ├── ${kebabName}-view-style.ts`);
  console.log(`  │   └── ${kebabName}-view.tsx`);
  console.log(`  ├── src/page/${pascalName}Page.tsx`);
  console.log(`  └── src/routes/index.tsx (route "/${kebabName}" ${isProtected ? "[Protected]" : ""})\n`);
}
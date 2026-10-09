import type { Plugin } from "vite";
import { spawn, type ChildProcess } from "node:child_process";
import path from "node:path";

export function apiServerPlugin(): Plugin {
  let child: ChildProcess | null = null;

  function startServer() {
    const apiDir = path.resolve(__dirname, "..", "api-server");
    child = spawn("node", ["--enable-source-maps", "./dist/index.mjs"], {
      cwd: apiDir,
      stdio: "inherit",
      env: {
        ...process.env,
        NODE_ENV: "development",
        PORT: "8080",
      },
    });

    child.on("exit", (code) => {
      if (code !== null && code !== 0) {
        console.error(`[api-server] exited with code ${code}`);
      }
    });
  }

  return {
    name: "api-server-plugin",
    apply: "serve",
    configureServer() {
      startServer();
    },
    configurePreviewServer() {
      startServer();
    },
    closeBundle() {
      if (child) {
        child.kill();
        child = null;
      }
    },
  };
}

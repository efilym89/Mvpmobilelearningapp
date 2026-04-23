import fs from "node:fs";
import path from "node:path";
import tailwindcss from "@tailwindcss/vite";
import react from "@vitejs/plugin-react";
import { defineConfig } from "vite";

const deployTarget = process.env.VITE_DEPLOY_TARGET;
const repositoryName = process.env.GITHUB_REPOSITORY?.split("/")[1];
const githubPagesBase =
  deployTarget === "github-pages" && repositoryName ? `/${repositoryName}/` : "/";

function figmaAssetResolver() {
  return {
    name: "figma-asset-resolver",
    resolveId(id: string) {
      if (id.startsWith("figma:asset/")) {
        const filename = id.replace("figma:asset/", "");
        return path.resolve(__dirname, "src/assets", filename);
      }
    },
  };
}

function storageAssetPlugin() {
  const storageRoot = path.resolve(__dirname, "storage");
  const distStorageRoot = path.resolve(__dirname, "dist", "storage");
  const contentTypes: Record<string, string> = {
    ".json": "application/json; charset=utf-8",
    ".pdf": "application/pdf",
    ".pptx": "application/vnd.openxmlformats-officedocument.presentationml.presentation",
    ".mp4": "video/mp4",
    ".m4v": "video/x-m4v",
    ".mov": "video/quicktime",
    ".webm": "video/webm",
    ".mkv": "video/x-matroska",
    ".jpg": "image/jpeg",
    ".jpeg": "image/jpeg",
    ".png": "image/png",
    ".webp": "image/webp",
    ".svg": "image/svg+xml",
    ".avif": "image/avif",
  };

  function copyStorageToDist() {
    if (!fs.existsSync(storageRoot)) {
      return;
    }

    fs.mkdirSync(path.dirname(distStorageRoot), { recursive: true });
    fs.cpSync(storageRoot, distStorageRoot, { recursive: true, force: true });
  }

  function resolveStorageFile(urlPath: string) {
    const relativePath = urlPath.replace(/^\/storage\/?/, "");
    const absolutePath = path.resolve(storageRoot, relativePath);

    if (
      !absolutePath.startsWith(storageRoot) ||
      !fs.existsSync(absolutePath) ||
      fs.statSync(absolutePath).isDirectory()
    ) {
      return null;
    }

    return absolutePath;
  }

  return {
    name: "storage-asset-plugin",
    configureServer(server: { middlewares: { use: (path: string, handler: Function) => void } }) {
      server.middlewares.use("/storage", (request: { url?: string }, response: NodeJS.WritableStream & { setHeader: (name: string, value: string) => void }, next: () => void) => {
        const filePath = request.url ? resolveStorageFile(`/storage${request.url}`) : null;

        if (!filePath) {
          next();
          return;
        }

        const extension = path.extname(filePath).toLowerCase();
        response.setHeader("Content-Type", contentTypes[extension] ?? "application/octet-stream");
        fs.createReadStream(filePath).pipe(response);
      });
    },
    closeBundle() {
      copyStorageToDist();
    },
  };
}

export default defineConfig({
  base: githubPagesBase,
  plugins: [
    figmaAssetResolver(),
    storageAssetPlugin(),
    react(),
    tailwindcss(),
  ],
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
  },
  assetsInclude: ["**/*.svg", "**/*.csv"],
});

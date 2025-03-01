import { execSync } from "node:child_process";
import * as esbuild from "esbuild";
import fs from "node:fs";
import path from "node:path";

// Caminhos principais
const entryFile = "src/index.ts"; // Entrada principal
const typesOutputDir = "dist/types"; // Saída dos tipos
const esmOutputFile = "dist/esm/index.js"; // Saída ESM
const cjsOutputFile = "dist/cjs/index.cjs"; // Saída CommonJS

try {
  // 1. Gera os arquivos de tipagem (.d.ts)
  console.log("Gerando arquivos de declaração (.d.ts)...");
  execSync(
    `tsc --emitDeclarationOnly --declaration --declarationDir ${typesOutputDir}`,
    { stdio: "inherit" },
  );

  // 2. Build para ESM
  console.log("Gerando build ESM...");
  esbuild.buildSync({
    entryPoints: [entryFile],
    bundle: true,
    minify: false, // Opcional: minify
    sourcemap: true,
    format: "esm",
    outfile: esmOutputFile,
    target: ["esnext"],
    platform: "node",
    external: [
      // Dependências marcadas como externas
      "util",
      "stream",
      "axios",
      "ws",
      "form-data",
    ],
  });

  // 3. Build para CommonJS
  console.log("Gerando build CommonJS...");
  esbuild.buildSync({
    entryPoints: [entryFile],
    bundle: true,
    minify: false, // Opcional: minify
    sourcemap: true,
    format: "cjs",
    outfile: cjsOutputFile,
    target: ["esnext"],
    platform: "node",
    external: ["util", "stream", "axios", "ws", "form-data"],
  });

  // 4. Certifique-se de que o arquivo package.json do CJS tem type=commonjs
  const cjsDir = path.dirname(cjsOutputFile);
  const cjsPackageJson = path.join(cjsDir, 'package.json');
  
  console.log("Criando package.json para compatibilidade CommonJS...");
  fs.writeFileSync(
    cjsPackageJson,
    JSON.stringify({ type: "commonjs" }, null, 2)
  );

  console.log("Build concluído com sucesso!");
} catch (error) {
  console.error("Erro durante o processo de build:", error);
  process.exit(1);
}

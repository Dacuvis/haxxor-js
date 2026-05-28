// build.ts
await Bun.build({
  entrypoints: ['/index.ts'], // pastikan kamu punya file index.ts yang meng-export SuJS
  outdir: './dist',
  target: 'node', // atau 'browser'/'bun' tergantung target pasar frameworkmu
})

// Generate types (opsional, jalankan tsc jika kamu menginstall typescript)
import { spawnSync } from "child_process";
spawnSync("bunx", ["tsc", "--emitDeclarationOnly", "--outDir", "dist"]);

console.log("📦 Build SuJS berhasil diselesaikan di folder /dist!");
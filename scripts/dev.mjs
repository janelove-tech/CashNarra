import { spawn } from "node:child_process";

// Node does not use the Windows certificate store unless asked. Without this,
// every story call fails before the reader replies.
const child = spawn(
  process.execPath,
  [
    "--use-system-ca",
    "node_modules/next/dist/bin/next",
    "dev",
    "--hostname",
    "127.0.0.1",
    ...process.argv.slice(2),
  ],
  {
    stdio: "inherit",
    env: { ...process.env, NODE_USE_SYSTEM_CA: "1" },
  },
);
child.on("exit", (code, signal) => {
  if (signal) process.kill(process.pid, signal);
  process.exit(code ?? 1);
});

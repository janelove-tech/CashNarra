import { defineConfig, globalIgnores } from "eslint/config";
import next from "eslint-config-next/core-web-vitals";
import ts from "eslint-config-next/typescript";
export default defineConfig([
  ...next,
  ...ts,
  globalIgnores([".next/**", "references/**"]),
  { rules: { "@next/next/no-img-element": "off" } },
  {
    files: [
      "src/app/auth/page.tsx",
      "src/app/page.tsx",
      "src/components/cashnarra.tsx",
    ],
    rules: {
      // Full document navigation deliberately discards private client state at authentication boundaries.
      "@next/next/no-location-assign-relative-destination": "off",
    },
  },
]);

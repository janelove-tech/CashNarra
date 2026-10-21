import { expect, it } from "vitest";
import { exportFileTargets } from "../src/lib/export-targets";

const spaces = [
  { id: "a", name: "Ama Works" },
  { id: "b", name: "Home" },
  { id: "c", name: "Ama/Works" },
];

it("exports only the open workspace and keeps the usual filename", () => {
  expect(exportFileTargets("a", spaces, "this", "b", false)).toEqual([
    { id: "a" },
  ]);
});

it("exports one other workspace under a safe name", () => {
  expect(exportFileTargets("a", spaces, "another", "b", false)).toEqual([
    { id: "b", mark: "Home" },
  ]);
});

it("does not treat the open workspace as another workspace", () => {
  expect(() => exportFileTargets("a", spaces, "another", "a", false)).toThrow(
    "Choose another workspace.",
  );
});

it("exports each of the user's workspaces as its own file", () => {
  expect(exportFileTargets("a", spaces, "all", "", false)).toEqual([
    { id: "a", mark: "Ama-Works" },
    { id: "b", mark: "Home" },
    { id: "c", mark: "Ama-Works-2" },
  ]);
});

it("keeps workspace names out of filenames while amounts are hidden", () => {
  expect(exportFileTargets("a", spaces, "all", "", true)).toEqual([
    { id: "a", mark: "workspace" },
    { id: "b", mark: "workspace-2" },
    { id: "c", mark: "workspace-3" },
  ]);
});

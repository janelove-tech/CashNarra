import { expect, it } from "vitest";
import { parseEntryAmount } from "../src/domain/money";

it("accepts ordinary pasted amounts and rejects ambiguous grouping", () => {
  expect(parseEntryAmount("17000.00")).toBe("17000.00");
  expect(parseEntryAmount("17,000.00")).toBe("17000.00");
  expect(parseEntryAmount(" GH₵17,000.00 ")).toBe("17000.00");
  expect(parseEntryAmount("₵12.50")).toBe("12.50");
  for (const value of ["17,00.00", "1,70", "17.000", "USD 10.00", "10.0.0"])
    expect(() => parseEntryAmount(value)).toThrow(/exact amount/);
});

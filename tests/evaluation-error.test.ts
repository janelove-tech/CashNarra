import { expect, it } from "vitest";
import OpenAI from "openai";
import { evaluationError } from "../scripts/lib/evaluation-error";

it("reports useful provider status without exposing arbitrary provider content", () => {
  const error = new OpenAI.APIError(
    403,
    { message: "secret narration", code: "secret-key" },
    "secret message",
    new Headers({ authorization: "secret" }),
  );
  expect(evaluationError(error)).toEqual({
    category: "provider",
    status: 403,
    code: "unclassified",
  });
  expect(JSON.stringify(evaluationError(error))).not.toContain("secret");
});

it("distinguishes known quota failures and transport failures", () => {
  expect(
    evaluationError(
      new OpenAI.APIError(
        429,
        { code: "insufficient_quota" },
        "private",
        new Headers(),
      ),
    ),
  ).toEqual({ category: "provider", status: 429, code: "insufficient_quota" });
  expect(evaluationError(new OpenAI.APIConnectionTimeoutError())).toEqual({
    category: "timeout",
  });
  expect(
    evaluationError(new OpenAI.APIConnectionError({ message: "private" })),
  ).toEqual({ category: "connection" });
  expect(evaluationError(new Error("private"))).toEqual({
    category: "local_or_response_validation",
  });
});

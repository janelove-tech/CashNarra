import OpenAI from "openai";

// Never serialize provider messages, headers, bodies or arbitrary error codes.
export function evaluationError(error: unknown) {
  if (error instanceof OpenAI.APIConnectionTimeoutError)
    return { category: "timeout" };
  if (error instanceof OpenAI.APIConnectionError)
    return { category: "connection" };
  if (error instanceof OpenAI.APIError) {
    const codes = [
      "invalid_api_key",
      "insufficient_quota",
      "rate_limit_exceeded",
      "model_not_found",
      "permission_denied",
      "invalid_json_schema",
    ];
    return {
      category: "provider",
      status:
        error.status && error.status >= 400 && error.status <= 599
          ? error.status
          : undefined,
      code:
        error.code && codes.includes(error.code) ? error.code : "unclassified",
    };
  }
  return { category: "local_or_response_validation" };
}

/** Postgres: undefined_column */
export function isMissingColumnError(err: unknown, column?: string): boolean {
  const cause = getCause(err);
  if (!cause || typeof cause !== "object") return false;

  const code = "code" in cause ? cause.code : undefined;
  if (code !== "42703") return false;

  if (!column) return true;
  const message = "message" in cause && typeof cause.message === "string" ? cause.message : "";
  return message.includes(column);
}

function getCause(err: unknown): unknown {
  if (err && typeof err === "object" && "cause" in err) {
    return err.cause;
  }
  return err;
}

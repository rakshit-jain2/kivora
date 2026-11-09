export interface JsonError {
  message: string;
  hint?: string;
  line?: number;
  column?: number;
}

export type JsonResult =
  | { ok: true; value: string }
  | { ok: false; error: JsonError };

export type TokenType = "key" | "string" | "number" | "boolean" | "null" | "plain";
export interface JsonToken {
  text: string;
  type: TokenType;
}

export const SAMPLE_JSON = `{"name":"Kivora","version":"1.0.0","isFree":true,"tags":["developer","utilities","online"],"author":{"name":"Jane Doe","email":"jane@example.com"},"stats":{"tools":24,"rating":4.8},"deprecated":null}`;

function offsetToLineColumn(input: string, offset: number) {
  const lines = input.slice(0, offset).split("\n");
  return { line: lines.length, column: lines[lines.length - 1].length + 1 };
}

function toJsonError(err: unknown, input: string): JsonError {
  const raw = err instanceof Error ? err.message : String(err);
  let line: number | undefined;
  let column: number | undefined;

  const lc = /line (\d+) column (\d+)/i.exec(raw);
  const pos = /position (\d+)/i.exec(raw);
  if (lc) {
    line = Number(lc[1]);
    column = Number(lc[2]);
  } else if (pos) {
    ({ line, column } = offsetToLineColumn(input, Number(pos[1])));
  } else if (/end of (the )?json|unexpected end/i.test(raw)) {
    ({ line, column } = offsetToLineColumn(input, input.length));
  }

  if (/end of (the )?json|unexpected end/i.test(raw)) {
    return {
      message: "The JSON ends unexpectedly.",
      hint: "Check for a missing closing bracket, brace or quote.",
      line,
      column,
    };
  }
  return {
    message: "This isn't valid JSON.",
    hint: "Common causes: trailing commas, single quotes, unquoted keys, or a missing bracket or comma.",
    line,
    column,
  };
}

function parse(input: string): JsonResult | { ok: true; parsed: unknown } {
  if (!input.trim()) {
    return { ok: false, error: { message: "Paste some JSON first." } };
  }
  try {
    return { ok: true, parsed: JSON.parse(input) as unknown };
  } catch (err) {
    return { ok: false, error: toJsonError(err, input) };
  }
}

export function formatJson(input: string, indent = 2): JsonResult {
  const r = parse(input);
  if (!r.ok) return r;
  return { ok: true, value: JSON.stringify((r as { parsed: unknown }).parsed, null, indent) };
}

export function minifyJson(input: string): JsonResult {
  const r = parse(input);
  if (!r.ok) return r;
  return { ok: true, value: JSON.stringify((r as { parsed: unknown }).parsed) };
}

export function validateJson(input: string): JsonResult {
  const r = parse(input);
  if (!r.ok) return r;
  return { ok: true, value: "" };
}

/** Splits JSON text into typed tokens for safe React rendering (no innerHTML). */
export function tokenizeJson(text: string): JsonToken[] {
  const re = /("(?:\\.|[^"\\])*")(\s*:)?|\b(?:true|false)\b|\bnull\b|-?\d+(?:\.\d+)?(?:[eE][+-]?\d+)?/g;
  const tokens: JsonToken[] = [];
  let last = 0;
  for (const m of text.matchAll(re)) {
    const start = m.index ?? 0;
    if (start > last) tokens.push({ text: text.slice(last, start), type: "plain" });
    if (m[1] !== undefined) {
      if (m[2] !== undefined) {
        tokens.push({ text: m[1], type: "key" });
        tokens.push({ text: m[2], type: "plain" });
      } else {
        tokens.push({ text: m[1], type: "string" });
      }
    } else if (m[0] === "true" || m[0] === "false") {
      tokens.push({ text: m[0], type: "boolean" });
    } else if (m[0] === "null") {
      tokens.push({ text: m[0], type: "null" });
    } else {
      tokens.push({ text: m[0], type: "number" });
    }
    last = start + m[0].length;
  }
  if (last < text.length) tokens.push({ text: text.slice(last), type: "plain" });
  return tokens;
}
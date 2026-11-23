// RFC 9110: the most specific matching media range determines its quality.
// Prefer HTML on ties, including the default */* used by ordinary clients.
export function representation(accept: string | null): "html" | "markdown" | "none" {
  const ranges = (accept || "*/*").toLowerCase().split(",").map((part) => {
    const [type, ...params] = part.trim().split(";");
    const qParam = params.find((p) => p.trim().startsWith("q="));
    const q = qParam ? Number(qParam.trim().slice(2)) : 1;
    return { type: type.trim(), q: Number.isFinite(q) && q >= 0 && q <= 1 ? q : 0 };
  });
  function quality(type: string) {
    for (const match of [type, "text/*", "*/*"]) {
      const matches = ranges.filter((r) => r.type === match);
      if (matches.length) return Math.max(...matches.map((r) => r.q));
    }
    return 0;
  }
  const html = quality("text/html"), md = quality("text/markdown");
  return md > html ? "markdown" : html > 0 ? "html" : "none";
}
export function apiError(status: number, code: string, message: string, hint: string) {
  return Response.json({ error: { code, message, hint } }, { status });
}
export function methodNotAllowed() {
  const response = apiError(405, "METHOD_NOT_ALLOWED", "This endpoint is read-only.", "Use GET or HEAD. See /openapi.json.");
  response.headers.set("Allow", "GET, HEAD, OPTIONS");
  return response;
}

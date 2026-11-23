import { apiError } from "@/lib/agent-http";

function missing() {
  return apiError(404, "NOT_FOUND", "This API endpoint does not exist.", "See /openapi.json for supported endpoints, or GET /api/product.");
}
export { missing as GET, missing as POST, missing as PUT, missing as PATCH, missing as DELETE, missing as OPTIONS };

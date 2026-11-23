import { PRODUCT } from "@/lib/agent-content";
import { methodNotAllowed } from "@/lib/agent-http";

export function GET() { return Response.json(PRODUCT); }
export const POST = methodNotAllowed;
export const PUT = methodNotAllowed;
export const PATCH = methodNotAllowed;
export const DELETE = methodNotAllowed;

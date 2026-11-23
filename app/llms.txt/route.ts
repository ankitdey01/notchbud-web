import { LLMS, markdown } from "@/lib/agent-content";
export function GET() { return markdown(LLMS); }

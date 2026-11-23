import { HOME_MARKDOWN, markdown } from "@/lib/agent-content";
export function GET() { return markdown(HOME_MARKDOWN); }

import { PRODUCT, SITE_URL } from "./agent-content";

const error = {
  description: "Structured API error with a resolution hint.",
  content: { "application/json": { schema: { $ref: "#/components/schemas/Error" } } },
};
export const openapi = {
  openapi: "3.1.1",
  info: { title: "notchbud public discovery API", version: "1.0.0", description: PRODUCT.limitations },
  security: [], // All documented endpoints are public.
  servers: [{ url: SITE_URL }],
  paths: {
    "/api/product": {
      get: {
        operationId: "getProduct", summary: "Get product capabilities, requirements and setup links",
        responses: {
          "200": { description: "Public product information", content: { "application/json": { schema: { $ref: "#/components/schemas/Product" }, example: PRODUCT } } },
          "405": error,
        },
      },
    },
    "/api/download": {
      get: {
        operationId: "downloadInstaller", summary: "Redirect to the latest Windows installer",
        description: "Falls back to the GitHub releases page when an installer cannot be resolved. Follow the Location header. No authentication required.",
        responses: {
          "307": { description: "Installer URL or GitHub releases page", headers: { Location: { required: true, schema: { type: "string", format: "uri" } } } },
          "405": error,
        },
      },
    },
  },
  components: { schemas: {
    Product: {
      type: "object", required: Object.keys(PRODUCT),
      properties: Object.fromEntries(Object.entries(PRODUCT).map(([key, value]) => [key,
        Array.isArray(value) ? { type: "array", items: { type: "string" } } : { type: "string" },
      ])),
    },
    Error: {
      type: "object", required: ["error"],
      properties: { error: { type: "object", required: ["code", "message", "hint"],
        properties: { code: { type: "string" }, message: { type: "string" }, hint: { type: "string" } },
      } },
    },
  } },
};

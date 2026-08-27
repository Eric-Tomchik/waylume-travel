import { ConvexHttpClient } from "convex/browser";
import { makeFunctionReference } from "convex/server";

export function getConvexServerClient() {
  const url = process.env.NEXT_PUBLIC_CONVEX_URL;
  if (!url) throw new Error("NEXT_PUBLIC_CONVEX_URL is not configured");
  return new ConvexHttpClient(url);
}

export const portalCreateAccess = makeFunctionReference<"mutation">("portal:createAccess");
export const portalResolveAccess = makeFunctionReference<"query">("portal:resolveAccess");
export const itineraryListByRequest = makeFunctionReference<"query">("itineraries:listByRequest");
export const itineraryUpsert = makeFunctionReference<"mutation">("itineraries:upsert");

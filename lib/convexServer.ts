import { ConvexHttpClient } from "convex/browser";
import { makeFunctionReference } from "convex/server";

export function getConvexServerClient() {
  const url = process.env.NEXT_PUBLIC_CONVEX_URL;
  if (!url) throw new Error("NEXT_PUBLIC_CONVEX_URL is not configured");
  return new ConvexHttpClient(url);
}

export const portalCreateAccess = makeFunctionReference<"mutation">("portal:createAccess");
export const portalResolveAccess = makeFunctionReference<"query">("portal:resolveAccess");
export const portalListAccess = makeFunctionReference<"query">("portal:listAccess");
export const portalRevokeAccess = makeFunctionReference<"mutation">("portal:revokeAccess");
export const quoteTravelerRespond = makeFunctionReference<"mutation">("quotes:travelerRespond");
export const itineraryListByRequest = makeFunctionReference<"query">("itineraries:listByRequest");
export const itineraryListAll = makeFunctionReference<"query">("itineraries:listAll");
export const itineraryUpsert = makeFunctionReference<"mutation">("itineraries:upsert");
export const analyticsTrack = makeFunctionReference<"mutation">("analytics:track");
export const analyticsSummary = makeFunctionReference<"query">("analytics:summary");
export const notificationsList = makeFunctionReference<"query">("notifications:list");
export const notificationsEnqueue = makeFunctionReference<"mutation">("notifications:enqueue");
export const notificationsMarkResult = makeFunctionReference<"mutation">("notifications:markResult");
export const adminSettingsGet = makeFunctionReference<"query">("adminSettings:get");
export const adminSettingsGetCredential = makeFunctionReference<"query">("adminSettings:getCredential");
export const adminSettingsSave = makeFunctionReference<"mutation">("adminSettings:save");
export const adminSettingsSetPasscode = makeFunctionReference<"mutation">("adminSettings:setPasscode");
export const travelRequestGetForAdmin = makeFunctionReference<"query">("travelRequests:getForAdmin");

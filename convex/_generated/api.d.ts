/* eslint-disable */
/**
 * Generated `api` utility.
 *
 * THIS CODE IS AUTOMATICALLY GENERATED.
 *
 * To regenerate, run `npx convex dev`.
 * @module
 */

import type * as analytics from "../analytics.js";
import type * as dashboard from "../dashboard.js";
import type * as http from "../http.js";
import type * as itineraries from "../itineraries.js";
import type * as notifications from "../notifications.js";
import type * as portal from "../portal.js";
import type * as promotions from "../promotions.js";
import type * as quotes from "../quotes.js";
import type * as savedTrips from "../savedTrips.js";
import type * as suppliers from "../suppliers.js";
import type * as travelRequests from "../travelRequests.js";

import type {
  ApiFromModules,
  FilterApi,
  FunctionReference,
} from "convex/server";

declare const fullApi: ApiFromModules<{
  analytics: typeof analytics;
  dashboard: typeof dashboard;
  http: typeof http;
  itineraries: typeof itineraries;
  notifications: typeof notifications;
  portal: typeof portal;
  promotions: typeof promotions;
  quotes: typeof quotes;
  savedTrips: typeof savedTrips;
  suppliers: typeof suppliers;
  travelRequests: typeof travelRequests;
}>;

/**
 * A utility for referencing Convex functions in your app's public API.
 *
 * Usage:
 * ```js
 * const myFunctionReference = api.myModule.myFunction;
 * ```
 */
export declare const api: FilterApi<
  typeof fullApi,
  FunctionReference<any, "public">
>;

/**
 * A utility for referencing Convex functions in your app's internal API.
 *
 * Usage:
 * ```js
 * const myFunctionReference = internal.myModule.myFunction;
 * ```
 */
export declare const internal: FilterApi<
  typeof fullApi,
  FunctionReference<any, "internal">
>;

export declare const components: {};

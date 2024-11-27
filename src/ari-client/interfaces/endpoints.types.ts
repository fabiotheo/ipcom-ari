// endpoints.types.ts

/**
 * Represents a basic endpoint.
 */
export interface Endpoint {
  technology: string; // The technology of the endpoint, e.g., "PJSIP"
  resource: string; // The resource name of the endpoint, e.g., "9001"
  state: string; // The current state of the endpoint, e.g., "available"
}

/**
 * Represents detailed information about an endpoint.
 */
export interface EndpointDetails {
  technology: string; // The technology of the endpoint, e.g., "PJSIP"
  resource: string; // The resource name of the endpoint, e.g., "9001"
  state: string; // The current state of the endpoint, e.g., "available"
  channel_ids: string[]; // List of channel IDs associated with the endpoint
  variables?: Record<string, string>; // Optional custom variables
}

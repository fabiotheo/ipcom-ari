/**
 * Represents a basic endpoint.
 */
export interface Endpoint {
    technology: string;
    resource: string;
    state: string;
}
/**
 * Represents detailed information about an endpoint.
 */
export interface EndpointDetails {
    technology: string;
    resource: string;
    state: string;
    channel_ids: string[];
    variables?: Record<string, string>;
}
//# sourceMappingURL=endpoints.types.d.ts.map
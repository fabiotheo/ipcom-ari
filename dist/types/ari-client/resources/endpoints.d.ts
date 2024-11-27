import type { BaseClient } from "../baseClient.js";
import type { Endpoint, EndpointDetails } from "../interfaces/endpoints.types";
export declare class Endpoints {
    private client;
    constructor(client: BaseClient);
    /**
     * Lists all available endpoints.
     *
     * @returns A promise that resolves to an array of Endpoint objects representing all available endpoints.
     * @throws {Error} If the API response is not an array.
     */
    list(): Promise<Endpoint[]>;
    /**
     * Retrieves details of a specific endpoint.
     *
     * @param technology - The technology of the endpoint (e.g., "PJSIP").
     * @param resource - The specific resource name of the endpoint (e.g., "9001").
     * @returns A promise that resolves to an EndpointDetails object containing the details of the specified endpoint.
     */
    getDetails(technology: string, resource: string): Promise<EndpointDetails>;
    /**
     * Sends a message to a specific endpoint.
     *
     * @param technology - The technology of the endpoint (e.g., "PJSIP").
     * @param resource - The specific resource name of the endpoint (e.g., "9001").
     * @param message - The message payload to send to the endpoint.
     * @returns A promise that resolves when the message has been successfully sent.
     */
    sendMessage(technology: string, resource: string, message: Record<string, unknown>): Promise<void>;
}
//# sourceMappingURL=endpoints.d.ts.map
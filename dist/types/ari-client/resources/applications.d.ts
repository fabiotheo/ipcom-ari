import type { BaseClient } from "../baseClient.js";
import type { Application, ApplicationDetails } from "../interfaces/applications.types.js";
export interface ApplicationMessage {
    event: string;
    data?: Record<string, any>;
}
export declare class Applications {
    private client;
    constructor(client: BaseClient);
    /**
     * Lists all applications.
     *
     * @returns A promise that resolves to an array of Application objects.
     * @throws {Error} If the API response is not an array.
     */
    list(): Promise<Application[]>;
    /**
     * Retrieves details of a specific application.
     *
     * @param appName - The name of the application to retrieve details for.
     * @returns A promise that resolves to an ApplicationDetails object.
     * @throws {Error} If there's an error fetching the application details.
     */
    getDetails(appName: string): Promise<ApplicationDetails>;
    /**
     * Sends a message to a specific application.
     *
     * @param appName - The name of the application to send the message to.
     * @param body - The message to be sent, containing an event and optional data.
     * @returns A promise that resolves when the message is successfully sent.
     */
    sendMessage(appName: string, body: ApplicationMessage): Promise<void>;
}
//# sourceMappingURL=applications.d.ts.map
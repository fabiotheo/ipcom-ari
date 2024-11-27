import type { BaseClient } from "../baseClient.js";
import type { Application, ApplicationDetails } from "../interfaces/applications.types.js";
export declare class Applications {
    private client;
    constructor(client: BaseClient);
    /**
     * Lists all applications.
     *
     * @returns A promise that resolves to an array of Application objects representing all registered applications.
     * @throws {Error} If the API response is not an array.
     */
    list(): Promise<Application[]>;
    /**
     * Retrieves details of a specific application.
     *
     * @param appName - The unique name of the application.
     * @returns A promise that resolves to an ApplicationDetails object containing the details of the specified application.
     */
    getDetails(appName: string): Promise<ApplicationDetails>;
    /**
     * Sends a message to a specific application.
     *
     * @param appName - The unique name of the application.
     * @param body - The message body to send.
     * @returns A promise that resolves when the message is sent successfully.
     */
    sendMessage(appName: string, body: any): Promise<void>;
}
//# sourceMappingURL=applications.d.ts.map
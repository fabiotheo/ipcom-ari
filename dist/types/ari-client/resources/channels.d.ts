import type { BaseClient } from "../baseClient.js";
import type { Channel, OriginateRequest } from "../interfaces/channels.types.js";
export declare class Channels {
    private client;
    constructor(client: BaseClient);
    /**
     * Lists all active channels.
     *
     * @returns A promise that resolves to an array of Channel objects representing all active channels.
     * @throws {Error} If the API response is not an array.
     */
    list(): Promise<Channel[]>;
    /**
     * Creates a new channel.
     *
     * @param data - The OriginateRequest object containing the necessary data to create a new channel.
     * @returns A promise that resolves to a Channel object representing the newly created channel.
     */
    originate(data: OriginateRequest): Promise<Channel>;
    /**
     * Retrieves details of a specific channel.
     *
     * @param channelId - The unique identifier of the channel.
     * @returns A promise that resolves to a Channel object containing the details of the specified channel.
     */
    getDetails(channelId: string): Promise<Channel>;
    /**
     * Hangs up (terminates) a specific channel.
     *
     * @param channelId - The unique identifier of the channel to be hung up.
     * @returns A promise that resolves when the channel has been successfully hung up.
     */
    hangup(channelId: string): Promise<void>;
    /**
     * Continues the dialplan for a specific channel.
     *
     * @param channelId - The unique identifier of the channel.
     * @param context - Optional. The context to continue in the dialplan.
     * @param extension - Optional. The extension to continue in the dialplan.
     * @param priority - Optional. The priority to continue in the dialplan.
     * @param label - Optional. The label to continue in the dialplan.
     * @returns A promise that resolves when the dialplan continuation has been successfully initiated.
     */
    continueDialplan(channelId: string, context?: string, extension?: string, priority?: number, label?: string): Promise<void>;
    /**
     * Moves the channel to another Stasis application.
     *
     * @param channelId - The unique identifier of the channel to be moved.
     * @param app - The name of the Stasis application to move the channel to.
     * @param appArgs - Optional. Arguments to be passed to the Stasis application.
     * @returns A promise that resolves when the channel has been successfully moved to the new application.
     */
    moveToApplication(channelId: string, app: string, appArgs?: string): Promise<void>;
}
//# sourceMappingURL=channels.d.ts.map
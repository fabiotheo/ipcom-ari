import type { Application, ApplicationDetails } from "./interfaces/applications.types";
import type { Channel, OriginateRequest } from "./interfaces/channels.types";
import type { Endpoint, EndpointDetails } from "./interfaces/endpoints.types.js";
import type { AriClientConfig } from "./interfaces/requests.js";
import { Applications } from "./resources/applications.js";
import { Channels } from "./resources/channels.js";
import { Endpoints } from "./resources/endpoints";
export declare class AriClient {
    private config;
    private wsClient;
    private readonly baseClient;
    private isReconnecting;
    channels: Channels;
    endpoints: Endpoints;
    applications: Applications;
    constructor(config: AriClientConfig);
    /**
     * Connects to the ARI WebSocket for a specific application.
     *
     * @param app - The application name to connect to.
     * @returns {Promise<void>} Resolves when the WebSocket connects successfully.
     */
    connectWebSocket(app: string): Promise<void>;
    /**
     * Ensures the ARI application is registered.
     *
     * @param app - The application name to ensure is registered.
     * @returns {Promise<void>}
     */
    ensureAppRegistered(app: string): Promise<void>;
    /**
     * Checks if the WebSocket connection is active.
     *
     * @returns {boolean} True if connected, false otherwise.
     */
    isWebSocketConnected(): boolean;
    /**
     * Registers a callback for a specific WebSocket event.
     *
     * @param event - The WebSocket event to listen for.
     * @param callback - The callback function to execute when the event occurs.
     */
    onWebSocketEvent(event: string, callback: (data: any) => void): void;
    /**
     * Closes the WebSocket connection.
     */
    closeWebSocket(): void;
    /**
     * Retrieves a list of active channels from the Asterisk ARI.
     *
     * @returns {Promise<Channel[]>} A promise resolving to the list of active channels.
     */
    listChannels(): Promise<Channel[]>;
    /**
     * Initiates a new channel on the Asterisk server.
     *
     * @param data - The parameters for creating the new channel.
     * @returns {Promise<Channel>} A promise resolving to the new channel's details.
     */
    originateChannel(data: OriginateRequest): Promise<Channel>;
    /**
     * Retrieves details of a specific channel.
     *
     * @param channelId - The unique identifier of the channel.
     * @returns {Promise<Channel>} A promise resolving to the details of the channel.
     */
    getChannelDetails(channelId: string): Promise<Channel>;
    /**
     * Hangs up a specific channel.
     *
     * @param channelId - The unique identifier of the channel to hang up.
     * @returns {Promise<void>}
     */
    hangupChannel(channelId: string): Promise<void>;
    /**
     * Continues the dialplan for a specific channel.
     *
     * @param channelId - The unique identifier of the channel.
     * @param context - Optional. The context to continue in the dialplan.
     * @param extension - Optional. The extension to continue in the dialplan.
     * @param priority - Optional. The priority to continue in the dialplan.
     * @param label - Optional. The label to continue in the dialplan.
     * @returns {Promise<void>}
     */
    continueChannelDialplan(channelId: string, context?: string, extension?: string, priority?: number, label?: string): Promise<void>;
    /**
     * Moves a channel to another Stasis application.
     *
     * @param channelId - The unique identifier of the channel.
     * @param app - The name of the Stasis application to move the channel to.
     * @param appArgs - Optional arguments for the Stasis application.
     * @returns {Promise<void>}
     */
    moveChannelToApplication(channelId: string, app: string, appArgs?: string): Promise<void>;
    /**
     * Lists all endpoints.
     *
     * @returns {Promise<Endpoint[]>} A promise resolving to the list of endpoints.
     */
    listEndpoints(): Promise<Endpoint[]>;
    /**
     * Retrieves details of a specific endpoint.
     *
     * @param technology - The technology of the endpoint.
     * @param resource - The resource name of the endpoint.
     * @returns {Promise<EndpointDetails>} A promise resolving to the details of the endpoint.
     */
    getEndpointDetails(technology: string, resource: string): Promise<EndpointDetails>;
    /**
     * Sends a message to an endpoint.
     *
     * @param technology - The technology of the endpoint.
     * @param resource - The resource name of the endpoint.
     * @param body - The message body to send.
     * @returns {Promise<void>} A promise resolving when the message is sent.
     */
    sendMessageToEndpoint(technology: string, resource: string, body: any): Promise<void>;
    /**
     * Lists all applications.
     *
     * @returns {Promise<Application[]>} A promise resolving to the list of applications.
     */
    listApplications(): Promise<Application[]>;
    /**
     * Retrieves details of a specific application.
     *
     * @param appName - The name of the application.
     * @returns {Promise<ApplicationDetails>} A promise resolving to the application details.
     */
    getApplicationDetails(appName: string): Promise<ApplicationDetails>;
    /**
     * Sends a message to a specific application.
     *
     * @param appName - The name of the application.
     * @param body - The message body to send.
     * @returns {Promise<void>} A promise resolving when the message is sent successfully.
     */
    sendMessageToApplication(appName: string, body: any): Promise<void>;
}
//# sourceMappingURL=ariClient.d.ts.map
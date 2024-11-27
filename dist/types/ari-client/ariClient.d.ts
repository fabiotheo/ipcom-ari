import type { Application, ApplicationDetails } from "./interfaces/applications.types";
import type { AsteriskInfo, Logging, Module, Variable } from "./interfaces/asterisk.types";
import type { Channel, ChannelPlayback, ChannelVar, ExternalMediaOptions, OriginateRequest, PlaybackOptions, RTPStats, RecordingOptions, SnoopOptions } from "./interfaces/channels.types";
import type { Endpoint, EndpointDetails } from "./interfaces/endpoints.types.js";
import type { Playback as APIPlayback, PlaybackControlRequest } from "./interfaces/playbacks.types";
import type { AriClientConfig } from "./interfaces/requests.js";
import type { Sound, SoundListRequest } from "./interfaces/sounds.types";
import { Applications } from "./resources/applications.js";
import { Asterisk } from "./resources/asterisk";
import { Channels } from "./resources/channels.js";
import { Endpoints } from "./resources/endpoints";
import { Playbacks } from "./resources/playbacks";
import { Sounds } from "./resources/sounds";
export declare class AriClient {
    private config;
    private wsClient;
    private readonly baseClient;
    private isReconnecting;
    channels: Channels;
    endpoints: Endpoints;
    applications: Applications;
    playbacks: Playbacks;
    sounds: Sounds;
    asterisk: Asterisk;
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
    /**
     * Lists all active channels.
     */
    listChannels(): Promise<Channel[]>;
    /**
     * Creates a new channel.
     */
    originateChannel(data: OriginateRequest): Promise<Channel>;
    /**
     * Retrieves details of a specific channel.
     */
    getChannelDetails(channelId: string): Promise<Channel>;
    /**
     * Hangs up a specific channel.
     */
    hangupChannel(channelId: string): Promise<void>;
    /**
     * Continues the dialplan for a specific channel.
     */
    continueChannelDialplan(channelId: string, context?: string, extension?: string, priority?: number, label?: string): Promise<void>;
    /**
     * Moves a channel to another Stasis application.
     */
    moveChannelToApplication(channelId: string, app: string, appArgs?: string): Promise<void>;
    /**
     * Sets a channel variable.
     */
    setChannelVariable(channelId: string, variable: string, value: string): Promise<void>;
    /**
     * Gets a channel variable.
     */
    getChannelVariable(channelId: string, variable: string): Promise<ChannelVar>;
    /**
     * Plays a media file to a channel.
     */
    playMediaToChannel(channelId: string, media: string, options?: PlaybackOptions): Promise<ChannelPlayback>;
    /**
     * Starts music on hold for a channel.
     */
    startChannelMusicOnHold(channelId: string): Promise<void>;
    /**
     * Stops music on hold for a channel.
     */
    stopChannelMusicOnHold(channelId: string): Promise<void>;
    /**
     * Starts playback of a media file on a channel.
     */
    startChannelPlayback(channelId: string, media: string, options?: PlaybackOptions): Promise<ChannelPlayback>;
    /**
     * Stops playback of a media file on a channel.
     */
    stopChannelPlayback(channelId: string, playbackId: string): Promise<void>;
    /**
     * Pauses playback of a media file on a channel.
     */
    pauseChannelPlayback(channelId: string, playbackId: string): Promise<void>;
    /**
     * Resumes playback of a media file on a channel.
     */
    resumeChannelPlayback(channelId: string, playbackId: string): Promise<void>;
    /**
     * Rewinds playback of a media file on a channel.
     */
    rewindChannelPlayback(channelId: string, playbackId: string, skipMs: number): Promise<void>;
    /**
     * Fast-forwards playback of a media file on a channel.
     */
    fastForwardChannelPlayback(channelId: string, playbackId: string, skipMs: number): Promise<void>;
    /**
     * Records audio from a channel.
     */
    recordAudio(channelId: string, options: RecordingOptions): Promise<Channel>;
    /**
     * Starts snooping on a channel.
     */
    snoopChannel(channelId: string, options: SnoopOptions): Promise<Channel>;
    /**
     * Starts snooping on a channel with a specific snoop ID.
     */
    snoopChannelWithId(channelId: string, snoopId: string, options: SnoopOptions): Promise<Channel>;
    /**
     * Dials a created channel.
     */
    dialChannel(channelId: string, caller?: string, timeout?: number): Promise<void>;
    /**
     * Retrieves RTP statistics for a channel.
     */
    getRTPStatistics(channelId: string): Promise<RTPStats>;
    /**
     * Creates a channel to an external media source/sink.
     */
    createExternalMedia(options: ExternalMediaOptions): Promise<Channel>;
    /**
     * Redirects a channel to a different location.
     */
    redirectChannel(channelId: string, endpoint: string): Promise<void>;
    /**
     * Answers a channel.
     */
    answerChannel(channelId: string): Promise<void>;
    /**
     * Sends a ringing indication to a channel.
     */
    ringChannel(channelId: string): Promise<void>;
    /**
     * Stops ringing indication on a channel.
     */
    stopRingChannel(channelId: string): Promise<void>;
    /**
     * Sends DTMF to a channel.
     */
    sendDTMF(channelId: string, dtmf: string, options?: {
        before?: number;
        between?: number;
        duration?: number;
        after?: number;
    }): Promise<void>;
    /**
     * Mutes a channel.
     */
    muteChannel(channelId: string, direction?: "both" | "in" | "out"): Promise<void>;
    /**
     * Unmutes a channel.
     */
    unmuteChannel(channelId: string, direction?: "both" | "in" | "out"): Promise<void>;
    /**
     * Puts a channel on hold.
     */
    holdChannel(channelId: string): Promise<void>;
    /**
     * Removes a channel from hold.
     */
    unholdChannel(channelId: string): Promise<void>;
    /**
     * Creates a new channel using the provided originate request data.
     *
     * @param data - The originate request data containing channel creation parameters.
     * @returns A promise that resolves to the created Channel object.
     */
    createChannel(data: OriginateRequest): Promise<Channel>;
    /**
     * Hangs up a specific channel.
     *
     * @param channelId - The unique identifier of the channel to hang up.
     * @param options - Optional parameters for the hangup operation.
     * @param options.reason_code - An optional reason code for the hangup.
     * @param options.reason - An optional textual reason for the hangup.
     * @returns A promise that resolves when the hangup operation is complete.
     */
    hangup(channelId: string, options?: {
        reason_code?: string;
        reason?: string;
    }): Promise<void>;
    /**
     * Originates a new channel with a specified ID using the provided originate request data.
     *
     * @param channelId - The desired unique identifier for the new channel.
     * @param data - The originate request data containing channel creation parameters.
     * @returns A promise that resolves to the created Channel object.
     */
    originateWithId(channelId: string, data: OriginateRequest): Promise<Channel>;
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
    /**
     * Retrieves details of a specific playback.
     *
     * @param playbackId - The unique identifier of the playback.
     * @returns {Promise<Playback>} A promise resolving to the playback details.
     */
    getPlaybackDetails(playbackId: string): Promise<APIPlayback>;
    /**
     * Controls a specific playback.
     *
     * @param playbackId - The unique identifier of the playback.
     * @param controlRequest - The PlaybackControlRequest containing the control operation.
     * @returns {Promise<void>} A promise resolving when the control operation is successfully executed.
     */
    controlPlayback(playbackId: string, controlRequest: PlaybackControlRequest): Promise<void>;
    /**
     * Stops a specific playback.
     *
     * @param playbackId - The unique identifier of the playback.
     * @returns {Promise<void>} A promise resolving when the playback is successfully stopped.
     */
    stopPlayback(playbackId: string): Promise<void>;
    /**
     * Lists all available sounds.
     *
     * @param params - Optional parameters to filter the list of sounds.
     * @returns {Promise<Sound[]>} A promise resolving to the list of sounds.
     */
    listSounds(params?: SoundListRequest): Promise<Sound[]>;
    /**
     * Retrieves details of a specific sound.
     *
     * @param soundId - The unique identifier of the sound.
     * @returns {Promise<Sound>} A promise resolving to the sound details.
     */
    getSoundDetails(soundId: string): Promise<Sound>;
    /**
     * Retrieves information about the Asterisk server.
     */
    getAsteriskInfo(): Promise<AsteriskInfo>;
    /**
     * Lists all loaded modules in the Asterisk server.
     */
    listModules(): Promise<Module[]>;
    /**
     * Manages a specific module in the Asterisk server.
     */
    manageModule(moduleName: string, action: "load" | "unload" | "reload"): Promise<void>;
    /**
     * Retrieves all configured logging channels.
     */
    listLoggingChannels(): Promise<Logging[]>;
    /**
     * Adds or removes a log channel in the Asterisk server.
     */
    manageLogChannel(logChannelName: string, action: "add" | "remove", configuration?: {
        type?: string;
        configuration?: string;
    }): Promise<void>;
    /**
     * Retrieves the value of a global variable.
     */
    getGlobalVariable(variableName: string): Promise<Variable>;
    /**
     * Sets a global variable.
     */
    setGlobalVariable(variableName: string, value: string): Promise<void>;
}
//# sourceMappingURL=ariClient.d.ts.map
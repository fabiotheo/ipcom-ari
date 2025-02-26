import type { AriClient } from "../ariClient";
import type { BaseClient } from "../baseClient.js";
import type { Channel, ChannelPlayback, ChannelVar, ExternalMediaOptions, OriginateRequest, PlaybackOptions, RTPStats, RecordingOptions, SnoopOptions, WebSocketEvent } from "../interfaces";
import type { PlaybackInstance } from "./playbacks";
/**
 * Represents an instance of a communication channel managed by the AriClient.
 */
export declare class ChannelInstance {
    private readonly client;
    private readonly baseClient;
    private readonly eventEmitter;
    private channelData;
    private readonly listenersMap;
    readonly id: string;
    constructor(client: AriClient, baseClient: BaseClient, channelId?: string);
    /**
     * Registers an event listener for specific channel events
     */
    on<T extends WebSocketEvent["type"]>(event: T, listener: (data: Extract<WebSocketEvent, {
        type: T;
    }>) => void): void;
    /**
     * Registers a one-time event listener
     */
    once<T extends WebSocketEvent["type"]>(event: T, listener: (data: Extract<WebSocketEvent, {
        type: T;
    }>) => void): void;
    /**
     * Removes event listener(s) for a specific WebSocket event type.
     * If a specific listener is provided, only that listener is removed.
     * Otherwise, all listeners for the given event type are removed.
     *
     * @param {T} event - The type of WebSocket event to remove listener(s) for
     * @param {(data: WebSocketEvent) => void} [listener] - Optional specific listener to remove
     * @throws {Error} If no event type is provided
     */
    off<T extends WebSocketEvent["type"]>(event: T, listener?: (data: Extract<WebSocketEvent, {
        type: T;
    }>) => void): void;
    /**
     * Cleans up the ChannelInstance, resetting its state and clearing resources.
     */
    cleanup(): void;
    /**
     * Emits an event if it matches the current channel
     */
    emitEvent(event: WebSocketEvent): void;
    /**
     * Removes all event listeners associated with the current instance.
     * This ensures that there are no lingering event handlers for the channel.
     *
     * @return {void} This method does not return a value.
     */
    removeAllListeners(): void;
    /**
     * Answers the channel
     */
    answer(): Promise<void>;
    /**
     * Originates a new channel
     *
     * @param data - Channel origination configuration
     * @returns Promise resolving to the created channel
     * @throws Error if channel already exists or origination fails
     */
    originate(data: OriginateRequest): Promise<Channel>;
    /**
     * Plays media on the channel
     */
    play(options: {
        media: string;
        lang?: string;
    }, playbackId?: string): Promise<PlaybackInstance>;
    /**
     * Gets the current channel details
     */
    getDetails(): Promise<Channel>;
    /**
     * Checks if the channel has any listeners for a specific event
     */
    hasListeners(event: string): boolean;
    /**
     * Gets the count of listeners for a specific event
     */
    getListenerCount(event: string): number;
    /**
     * Fetches a specific channel variable.
     *
     * @param {string} variable - The name of the variable to retrieve. This parameter is required.
     * @return {Promise<ChannelVar>} A promise that resolves with the value of the requested channel variable.
     * @throws {Error} If the 'variable' parameter is not provided.
     */
    getVariable(variable: string): Promise<ChannelVar>;
    /**
     * Terminates the active call associated with the current channel.
     * This method ensures that channel details are initialized before attempting to hang up.
     * If the channel ID is invalid or cannot be determined, an error is thrown.
     *
     * @return {Promise<void>} A promise that resolves when the call is successfully terminated.
     */
    hangup(): Promise<void>;
    /**
     * Plays media on the specified channel using the provided media URL and optional playback options.
     *
     * @param {string} media - The URL or identifier of the media to be played.
     * @param {PlaybackOptions} [options] - Optional playback settings such as volume, playback speed, etc.
     * @return {Promise<ChannelPlayback>} A promise that resolves with the playback details for the channel.
     * @throws {Error} Throws an error if the channel has not been created.
     */
    playMedia(media: string, options?: PlaybackOptions): Promise<ChannelPlayback>;
    /**
     * Stops the playback for the given playback ID.
     *
     * @param {string} playbackId - The unique identifier for the playback to be stopped.
     * @return {Promise<void>} A promise that resolves when the playback is successfully stopped.
     * @throws {Error} Throws an error if the instance is not associated with a channel.
     */
    stopPlayback(playbackId: string): Promise<void>;
    /**
     * Pauses the playback of the specified media on a channel.
     *
     * @param {string} playbackId - The unique identifier of the playback to be paused.
     * @return {Promise<void>} A promise that resolves when the playback has been successfully paused.
     * @throws {Error} Throws an error if the channel is not associated with the current instance.
     */
    pausePlayback(playbackId: string): Promise<void>;
    /**
     * Resumes playback of the specified playback session on the associated channel.
     *
     * @param {string} playbackId - The unique identifier of the playback session to be resumed.
     * @return {Promise<void>} A promise that resolves when the playback has been successfully resumed.
     * @throws {Error} Throws an error if the channel is not associated with this instance.
     */
    resumePlayback(playbackId: string): Promise<void>;
    /**
     * Rewinds the playback of a media by a specified amount of milliseconds.
     *
     * @param {string} playbackId - The unique identifier for the playback session to be rewound.
     * @param {number} skipMs - The number of milliseconds to rewind the playback.
     * @return {Promise<void>} A promise that resolves when the rewind operation is complete.
     */
    rewindPlayback(playbackId: string, skipMs: number): Promise<void>;
    /**
     * Fast forwards the playback by a specific duration in milliseconds.
     *
     * @param {string} playbackId - The unique identifier of the playback to be fast-forwarded.
     * @param {number} skipMs - The number of milliseconds to fast forward the playback.
     * @return {Promise<void>} A Promise that resolves when the fast-forward operation is complete.
     * @throws {Error} If no channel is associated with this instance.
     */
    fastForwardPlayback(playbackId: string, skipMs: number): Promise<void>;
    /**
     * Mutes the specified channel for the given direction.
     *
     * @param {("both" | "in" | "out")} [direction="both"] - The direction to mute the channel. It can be "both" to mute incoming and outgoing, "in" to mute incoming, or "out" to mute outgoing.
     * @return {Promise<void>} A promise that resolves when the channel is successfully muted.
     * @throws {Error} If the channel is not associated with this instance.
     */
    muteChannel(direction?: "both" | "in" | "out"): Promise<void>;
    /**
     * Unmutes a previously muted channel in the specified direction.
     *
     * @param {"both" | "in" | "out"} direction - The direction in which to unmute the channel.
     *        Defaults to "both", which unmutes both incoming and outgoing communication.
     * @return {Promise<void>} A promise that resolves once the channel has been successfully unmuted.
     * @throws {Error} If the channel is not associated with the current instance.
     */
    unmuteChannel(direction?: "both" | "in" | "out"): Promise<void>;
    /**
     * Places the associated channel on hold if the channel is valid and linked to this instance.
     *
     * @return {Promise<void>} A promise that resolves when the hold action is successfully executed.
     * @throws {Error} Throws an error if the channel is not associated with this instance.
     */
    holdChannel(): Promise<void>;
    /**
     * Removes the hold status from a specific channel associated with this instance.
     * The method sends a delete request to the server to release the hold on the channel.
     * If no channel is associated with this instance, an error will be thrown.
     *
     * @return {Promise<void>} A promise that resolves when the channel hold has been successfully removed.
     * @throws {Error} If no channel is associated with this instance.
     */
    unholdChannel(): Promise<void>;
}
/**
 * The `Channels` class provides a comprehensive interface for managing
 * and interacting with communication channels.
 */
export declare class Channels {
    private readonly baseClient;
    private readonly client;
    private readonly channelInstances;
    private eventQueue;
    constructor(baseClient: BaseClient, client: AriClient);
    /**
     * Creates or retrieves a ChannelInstance.
     *
     * @param {Object} [params] - Optional parameters for getting/creating a channel instance
     * @param {string} [params.id] - Optional ID of an existing channel
     * @returns {ChannelInstance} The requested or new channel instance
     * @throws {Error} If channel creation/retrieval fails
     *
     * @example
     * // Create new channel without ID
     * const channel1 = client.channels.Channel();
     *
     * // Create/retrieve channel with specific ID
     * const channel2 = client.channels.Channel({ id: 'some-id' });
     */
    Channel(params?: {
        id?: string;
    }): ChannelInstance;
    cleanup(): void;
    /**
     * Removes all channel instances and cleans up their resources.
     * This method ensures proper cleanup of all channels and their associated listeners.
     */
    remove(): void;
    /**
     * Retrieves the details of a specific channel.
     *
     * @param {string} id - The unique identifier of the channel to retrieve.
     * @returns {Promise<Channel>} A promise that resolves to the Channel object containing the channel details.
     * @throws {Error} If no channel ID is associated with this instance or if there's an error retrieving the channel details.
     */
    get(id: string): Promise<Channel>;
    /**
     * Removes a channel instance from the collection.
     */
    removeChannelInstance(channelId: string): void;
    /**
     * Propagates a WebSocket event to a specific channel.
     */
    propagateEventToChannel(event: WebSocketEvent): void;
    /**
     * Initiates a new channel.
     */
    originate(data: OriginateRequest): Promise<Channel>;
    /**
     * Lists all active channels.
     */
    list(): Promise<Channel[]>;
    /**
     * Gets the count of active channel instances.
     */
    getInstanceCount(): number;
    /**
     * Checks if a channel instance exists.
     */
    hasInstance(channelId: string): boolean;
    /**
     * Gets all active channel instances.
     */
    getAllInstances(): Map<string, ChannelInstance>;
    /**
     * Terminates an active call on the specified channel.
     *
     * @param {string} channelId - The unique identifier of the channel to hang up.
     * @param {Object} [options] - Optional parameters for the hangup request.
     * @param {string} [options.reason_code] - A code indicating the reason for the hangup.
     * @param {string} [options.reason] - A descriptive reason for the hangup.
     * @return {Promise<void>} A promise that resolves when the call has been successfully terminated.
     */
    hangup(channelId: string, options?: {
        reason_code?: string;
        reason?: string;
    }): Promise<void>;
    /**
     * Initiates snooping on a specified channel with the provided options.
     *
     * @param {string} channelId - The unique identifier of the channel to snoop on.
     * @param {SnoopOptions} options - Configuration options for the snooping operation.
     * @return {Promise<Channel>} A promise that resolves to the snooped channel data.
     */
    snoopChannel(channelId: string, options: SnoopOptions): Promise<Channel>;
    /**
     * Starts a silence mode for the specified channel.
     *
     * @param {string} channelId - The unique identifier of the channel where silence mode should be started.
     * @return {Promise<void>} A promise that resolves when the silence mode is successfully started.
     */
    startSilence(channelId: string): Promise<void>;
    /**
     * Stops the silence mode for a specific channel.
     *
     * @param {string} channelId - The unique identifier of the channel for which silence mode should be stopped.
     * @return {Promise<void>} A promise that resolves when the operation is complete.
     */
    stopSilence(channelId: string): Promise<void>;
    /**
     * Retrieves the Real-Time Protocol (RTP) statistics for a specific channel.
     *
     * @param {string} channelId - The unique identifier of the channel for which RTP statistics are fetched.
     * @return {Promise<RTPStats>} A promise that resolves to the RTP statistics for the specified channel.
     */
    getRTPStatistics(channelId: string): Promise<RTPStats>;
    /**
     * Creates an external media channel with the given options.
     *
     * @param {ExternalMediaOptions} options - The configuration options for creating the external media channel.
     * @return {Promise<Channel>} A promise that resolves with the created external media channel.
     */
    createExternalMedia(options: ExternalMediaOptions): Promise<Channel>;
    /**
     * Initiates playback of a specific media item on a channel using the provided playback ID.
     *
     * @param {string} channelId - The unique identifier of the channel where playback will occur.
     * @param {string} playbackId - The unique identifier for the specific playback session.
     * @param {string} media - The media content to be played.
     * @param {PlaybackOptions} [options] - Optional playback configuration parameters.
     * @return {Promise<ChannelPlayback>} A promise that resolves with the playback details for the channel.
     */
    playWithId(channelId: string, playbackId: string, media: string, options?: PlaybackOptions): Promise<ChannelPlayback>;
    /**
     * Initiates a snoop operation on a specific channel using the provided channel ID and snoop ID.
     *
     * @param {string} channelId - The unique identifier of the channel to snoop on.
     * @param {string} snoopId - The unique identifier for the snoop operation.
     * @param {SnoopOptions} options - Additional options and parameters for the snoop operation.
     * @return {Promise<Channel>} A promise that resolves to the channel details after the snoop operation is initiated.
     */
    snoopChannelWithId(channelId: string, snoopId: string, options: SnoopOptions): Promise<Channel>;
    /**
     * Starts Music on Hold for the specified channel with the provided Music on Hold class.
     *
     * @param {string} channelId - The unique identifier of the channel.
     * @param {string} mohClass - The Music on Hold class to be applied.
     * @return {Promise<void>} A promise that resolves when the operation is complete.
     */
    startMohWithClass(channelId: string, mohClass: string): Promise<void>;
    /**
     * Retrieves the value of a specified variable for a given channel.
     *
     * @param {string} channelId - The unique identifier of the channel.
     * @param {string} variable - The name of the variable to retrieve.
     * @return {Promise<ChannelVar>} A promise that resolves to the value of the channel variable.
     * @throws {Error} Throws an error if the 'variable' parameter is not provided.
     */
    getChannelVariable(channelId: string, variable: string): Promise<ChannelVar>;
    /**
     * Sets a variable for a specific channel.
     *
     * @param {string} channelId - The unique identifier of the channel.
     * @param {string} variable - The name of the variable to be set. This parameter is required.
     * @param {string} [value] - The value of the variable to be set. This parameter is optional.
     * @return {Promise<void>} A promise that resolves when the variable is successfully set.
     * @throws {Error} Throws an error if the `variable` parameter is not provided.
     */
    setChannelVariable(channelId: string, variable: string, value?: string): Promise<void>;
    /**
     * Moves a specified channel to the given application with optional arguments.
     *
     * @param {string} channelId - The unique identifier of the channel to be moved.
     * @param {string} app - The target application to which the channel will be moved.
     * @param {string} [appArgs] - Optional arguments to be passed to the target application.
     * @return {Promise<void>} A promise that resolves when the operation is completed.
     */
    moveToApplication(channelId: string, app: string, appArgs?: string): Promise<void>;
    /**
     * Continues the execution of a dialplan for a specific channel.
     *
     * @param {string} channelId - The unique identifier of the channel.
     * @param {string} [context] - The dialplan context to continue execution in, if specified.
     * @param {string} [extension] - The dialplan extension to proceed with, if provided.
     * @param {number} [priority] - The priority within the dialplan extension to resume at, if specified.
     * @param {string} [label] - The label to start from within the dialplan, if given.
     * @return {Promise<void>} Resolves when the dialplan is successfully continued.
     */
    continueDialplan(channelId: string, context?: string, extension?: string, priority?: number, label?: string): Promise<void>;
    /**
     * Stops the music on hold for the specified channel.
     *
     * @param {string} channelId - The unique identifier of the channel where music on hold should be stopped.
     * @return {Promise<void>} Resolves when the music on hold is successfully stopped.
     */
    stopMusicOnHold(channelId: string): Promise<void>;
    /**
     * Initiates the music on hold for the specified channel.
     *
     * @param {string} channelId - The unique identifier of the channel where the music on hold will be started.
     * @return {Promise<void>} A promise that resolves when the operation has been successfully invoked.
     */
    startMusicOnHold(channelId: string): Promise<void>;
    /**
     * Starts recording for a specific channel based on the provided options.
     *
     * @param {string} channelId - The unique identifier of the channel to start recording.
     * @param {RecordingOptions} options - The recording options to configure the recording process.
     * @return {Promise<Channel>} A promise that resolves to the channel object with updated recording state.
     */
    record(channelId: string, options: RecordingOptions): Promise<Channel>;
    /**
     * Initiates a call on the specified channel with optional parameters for caller identification and timeout duration.
     *
     * @param {string} channelId - The ID of the channel where the call will be initiated.
     * @param {string} [caller] - Optional parameter specifying the name or identifier of the caller.
     * @param {number} [timeout] - Optional parameter defining the timeout duration for the call in seconds.
     * @return {Promise<void>} A promise that resolves when the call has been successfully initiated.
     */
    dial(channelId: string, caller?: string, timeout?: number): Promise<void>;
    /**
     * Redirects a channel to the specified endpoint.
     *
     * This method sends a POST request to update the redirect endpoint for the given channel.
     *
     * @param {string} channelId - The unique identifier of the channel to be redirected.
     * @param {string} endpoint - The new endpoint to redirect the channel to.
     * @return {Promise<void>} A promise that resolves when the operation is complete.
     */
    redirectChannel(channelId: string, endpoint: string): Promise<void>;
    /**
     * Answers a specified channel by sending a POST request to the corresponding endpoint.
     *
     * @param {string} channelId - The unique identifier of the channel to be answered.
     * @return {Promise<void>} A promise that resolves when the channel has been successfully answered.
     */
    answerChannel(channelId: string): Promise<void>;
    /**
     * Rings the specified channel by sending a POST request to the appropriate endpoint.
     *
     * @param {string} channelId - The unique identifier of the channel to be rung.
     * @return {Promise<void>} A promise that resolves when the operation completes successfully.
     */
    ringChannel(channelId: string): Promise<void>;
    /**
     * Stops the ring channel for the specified channel ID.
     *
     * This method sends a DELETE request to the server to stop the ring action
     * associated with the provided channel ID.
     *
     * @param {string} channelId - The unique identifier of the channel for which the ring action should be stopped.
     * @return {Promise<void>} A promise that resolves when the ring channel is successfully stopped.
     */
    stopRingChannel(channelId: string): Promise<void>;
    /**
     * Sends DTMF (Dual-Tone Multi-Frequency) signals to a specified channel.
     *
     * @param {string} channelId - The ID of the channel to which the DTMF signals should be sent.
     * @param {string} dtmf - The DTMF tones to be sent, represented as a string. Each character corresponds to a specific tone.
     * @param {Object} [options] - Optional configuration for the DTMF signal timing.
     * @param {number} [options.before] - Time in milliseconds to wait before sending the first DTMF tone.
     * @param {number} [options.between] - Time in milliseconds to wait between sending successive DTMF tones.
     * @param {number} [options.duration] - Duration in milliseconds for each DTMF tone.
     * @param {number} [options.after] - Time in milliseconds to wait after sending the last DTMF tone.
     * @return {Promise<void>} A promise that resolves when the DTMF signals are successfully sent.
     */
    sendDTMF(channelId: string, dtmf: string, options?: {
        before?: number;
        between?: number;
        duration?: number;
        after?: number;
    }): Promise<void>;
    /**
     * Mutes a specified channel in the given direction.
     *
     * @param {string} channelId - The unique identifier of the channel to be muted.
     * @param {"both" | "in" | "out"} [direction="both"] - The direction for muting, can be "both", "in", or "out". Default is "both".
     * @return {Promise<void>} A promise that resolves when the channel is successfully muted.
     */
    muteChannel(channelId: string, direction?: "both" | "in" | "out"): Promise<void>;
    /**
     * Unmutes a previously muted channel, allowing communication in the specified direction(s).
     *
     * @param {string} channelId - The unique identifier of the channel to be unmuted.
     * @param {"both" | "in" | "out"} [direction="both"] - The direction of communication to unmute. Valid options are "both", "in" (incoming messages), or "out" (outgoing messages). Defaults to "both".
     * @return {Promise<void>} A promise that resolves when the channel is successfully unmuted.
     */
    unmuteChannel(channelId: string, direction?: "both" | "in" | "out"): Promise<void>;
    /**
     * Places a specific channel on hold by sending a POST request to the server.
     *
     * @param {string} channelId - The unique identifier of the channel to be placed on hold.
     * @return {Promise<void>} A promise that resolves when the channel hold operation is completed.
     */
    holdChannel(channelId: string): Promise<void>;
    /**
     * Removes the hold status from a specific channel by its ID.
     *
     * @param {string} channelId - The unique identifier of the channel to unhold.
     * @return {Promise<void>} A promise that resolves when the channel hold is successfully removed.
     */
    unholdChannel(channelId: string): Promise<void>;
    /**
     * Creates a new communication channel with the specified configuration.
     *
     * @param {OriginateRequest} data - The configuration data required to create the channel, including relevant details such as endpoint and channel variables.
     * @return {Promise<Channel>} A promise that resolves with the details of the created channel.
     */
    createChannel(data: OriginateRequest): Promise<Channel>;
    /**
     * Initiates a new channel with the specified channel ID and originates a call using the provided data.
     *
     * @param {string} channelId - The unique identifier of the channel to be created.
     * @param {OriginateRequest} data - The data required to originate the call, including details such as endpoint and caller information.
     * @return {Promise<Channel>} A promise that resolves to the created Channel object.
     */
    originateWithId(channelId: string, data: OriginateRequest): Promise<Channel>;
}
//# sourceMappingURL=channels.d.ts.map
import type { BaseClient } from "../baseClient.js";
import type { Channel, ChannelPlayback, ChannelVar, ExternalMediaOptions, OriginateRequest, PlaybackOptions, RTPStats, RecordingOptions, SnoopOptions } from "../interfaces/channels.types.js";
export declare class Channels {
    private client;
    constructor(client: BaseClient);
    /**
     * Lists all active channels.
     */
    list(): Promise<Channel[]>;
    /**
     * Creates a new channel.
     */
    originate(data: OriginateRequest): Promise<Channel>;
    /**
     * Retrieves details of a specific channel.
     */
    getDetails(channelId: string): Promise<Channel>;
    /**
     * Creates a channel and places it in a Stasis app without dialing it.
     */
    createChannel(data: OriginateRequest): Promise<Channel>;
    /**
     * Creates a new channel with a specific ID and originates a call.
     */
    originateWithId(channelId: string, data: OriginateRequest): Promise<Channel>;
    /**
     * Hangs up (terminates) a specific channel.
     */
    /**
     * Hangs up a specific channel with optional reason or reason code.
     */
    hangup(channelId: string, options?: {
        reason_code?: string;
        reason?: string;
    }): Promise<void>;
    /**
     * Continues the dialplan for a specific channel.
     */
    continueDialplan(channelId: string, context?: string, extension?: string, priority?: number, label?: string): Promise<void>;
    /**
     * Moves the channel to another Stasis application.
     */
    moveToApplication(channelId: string, app: string, appArgs?: string): Promise<void>;
    /**
     * Sets a channel variable.
     */
    setVariable(channelId: string, variable: string, value: string): Promise<void>;
    /**
     * Gets a channel variable.
     */
    getVariable(channelId: string, variable: string): Promise<ChannelVar>;
    /**
     * Plays a media file to a channel.
     */
    playMedia(channelId: string, media: string, options?: PlaybackOptions): Promise<ChannelPlayback>;
    /**
     * Starts music on hold (MOH) for a channel.
     */
    startMusicOnHold(channelId: string): Promise<void>;
    /**
     * Stops music on hold (MOH) for a channel.
     */
    stopMusicOnHold(channelId: string): Promise<void>;
    /**
     * Starts playback of a media file on a channel.
     */
    startPlayback(channelId: string, media: string, options?: PlaybackOptions): Promise<ChannelPlayback>;
    /**
     * Stops playback of a media file on a channel.
     */
    stopPlayback(channelId: string, playbackId: string): Promise<void>;
    /**
     * Pauses playback of a media file on a channel.
     */
    pausePlayback(channelId: string, playbackId: string): Promise<void>;
    /**
     * Resumes playback of a media file on a channel.
     */
    resumePlayback(channelId: string, playbackId: string): Promise<void>;
    /**
     * Rewinds playback of a media file on a channel.
     */
    rewindPlayback(channelId: string, playbackId: string, skipMs: number): Promise<void>;
    /**
     * Fast-forwards playback of a media file on a channel.
     */
    fastForwardPlayback(channelId: string, playbackId: string, skipMs: number): Promise<void>;
    /**
     * Records audio from a channel.
     */
    record(channelId: string, options: RecordingOptions): Promise<Channel>;
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
    dial(channelId: string, caller?: string, timeout?: number): Promise<void>;
    /**
     * Retrieves RTP statistics for a channel.
     */
    getRTPStatistics(channelId: string): Promise<RTPStats>;
    /**
     * Creates a channel to an external media source/sink.
     */
    createExternalMedia(options: ExternalMediaOptions): Promise<Channel>;
    /**
     * Redirects the channel to a different location.
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
}
//# sourceMappingURL=channels.d.ts.map
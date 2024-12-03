import type { BaseClient } from "../baseClient.js";
import type { AddChannelRequest, Bridge, BridgePlayback, CreateBridgeRequest, PlayMediaRequest, RemoveChannelRequest } from "../interfaces/bridges.types.js";
export declare class Bridges {
    private client;
    constructor(client: BaseClient);
    /**
     * Lists all active bridges.
     */
    list(): Promise<Bridge[]>;
    /**
     * Creates a new bridge.
     */
    createBridge(request: CreateBridgeRequest): Promise<Bridge>;
    /**
     * Retrieves details of a specific bridge.
     */
    getDetails(bridgeId: string): Promise<Bridge>;
    /**
     * Destroys (deletes) a specific bridge.
     */
    destroy(bridgeId: string): Promise<void>;
    /**
     * Adds a channel or multiple channels to a bridge.
     */
    addChannels(bridgeId: string, request: AddChannelRequest): Promise<void>;
    /**
     * Removes a channel or multiple channels from a bridge.
     */
    removeChannels(bridgeId: string, request: RemoveChannelRequest): Promise<void>;
    /**
     * Plays media to a bridge.
     */
    playMedia(bridgeId: string, request: PlayMediaRequest): Promise<BridgePlayback>;
    /**
     * Stops media playback on a bridge.
     */
    stopPlayback(bridgeId: string, playbackId: string): Promise<void>;
    /**
     * Sets the video source for a bridge.
     */
    setVideoSource(bridgeId: string, channelId: string): Promise<void>;
    /**
     * Clears the video source for a bridge.
     */
    clearVideoSource(bridgeId: string): Promise<void>;
}
//# sourceMappingURL=bridges.d.ts.map
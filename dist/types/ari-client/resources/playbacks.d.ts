import type { BaseClient } from "../baseClient.js";
import type { Playback, PlaybackControlRequest } from "../interfaces/playbacks.types.js";
export declare class Playbacks {
    private client;
    constructor(client: BaseClient);
    /**
     * Retrieves details of a specific playback.
     *
     * @param playbackId - The unique identifier of the playback.
     * @returns A promise that resolves to a Playback object containing the details of the specified playback.
     */
    getDetails(playbackId: string): Promise<Playback>;
    /**
     * Controls a specific playback (e.g., pause, resume, rewind, forward, stop).
     *
     * @param playbackId - The unique identifier of the playback to control.
     * @param controlRequest - The PlaybackControlRequest containing the control operation.
     * @returns A promise that resolves when the control operation is successfully executed.
     */
    control(playbackId: string, controlRequest: PlaybackControlRequest): Promise<void>;
    /**
     * Stops a specific playback.
     *
     * @param playbackId - The unique identifier of the playback to stop.
     * @returns A promise that resolves when the playback is successfully stopped.
     */
    stop(playbackId: string): Promise<void>;
}
//# sourceMappingURL=playbacks.d.ts.map
import type { BaseClient } from '../baseClient';
import type { StoredRecording, LiveRecording, GetStoredParams, DeleteStoredParams, GetStoredFileParams, CopyStoredParams, GetLiveParams, CancelParams, StopParams, PauseParams, UnpauseParams, MuteParams, UnmuteParams } from '../interfaces';
export declare class Recordings {
    private readonly baseClient;
    constructor(baseClient: BaseClient);
    /**
     * List recordings that are complete.
     * @returns Promise<StoredRecording[]>
     */
    listStored(): Promise<StoredRecording[]>;
    /**
     * Get a stored recording's details.
     * @param params - The parameters for getting a stored recording
     * @returns Promise<StoredRecording>
     */
    getStored(params: GetStoredParams): Promise<StoredRecording>;
    /**
     * Delete a stored recording.
     * @param params - The parameters for deleting a stored recording
     * @returns Promise<void>
     */
    deleteStored(params: DeleteStoredParams): Promise<void>;
    /**
     * Get the file associated with the stored recording.
     * @param params - The parameters for getting a stored recording file
     * @returns Promise<ArrayBuffer>
     */
    getStoredFile(params: GetStoredFileParams): Promise<ArrayBuffer>;
    /**
     * Copy a stored recording.
     * @param params - The parameters for copying a stored recording
     * @returns Promise<StoredRecording>
     */
    copyStored(params: CopyStoredParams): Promise<StoredRecording>;
    /**
     * List live recordings.
     * @param params - The parameters for getting a live recording
     * @returns Promise<LiveRecording>
     */
    getLive(params: GetLiveParams): Promise<LiveRecording>;
    /**
     * Stop a live recording and discard it.
     * @param params - The parameters for canceling a recording
     * @returns Promise<void>
     */
    cancel(params: CancelParams): Promise<void>;
    /**
     * Stop a live recording and store it.
     * @param params - The parameters for stopping a recording
     * @returns Promise<void>
     */
    stop(params: StopParams): Promise<void>;
    /**
     * Pause a live recording.
     * @param params - The parameters for pausing a recording
     * @returns Promise<void>
     */
    pause(params: PauseParams): Promise<void>;
    /**
     * Unpause a live recording.
     * @param params - The parameters for unpausing a recording
     * @returns Promise<void>
     */
    unpause(params: UnpauseParams): Promise<void>;
    /**
     * Mute a live recording.
     * @param params - The parameters for muting a recording
     * @returns Promise<void>
     */
    mute(params: MuteParams): Promise<void>;
    /**
     * Unmute a live recording.
     * @param params - The parameters for unmuting a recording
     * @returns Promise<void>
     */
    unmute(params: UnmuteParams): Promise<void>;
}
//# sourceMappingURL=recordings.d.ts.map
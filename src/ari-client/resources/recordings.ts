import type { BaseClient } from '../baseClient';
import type {
  StoredRecording,
  LiveRecording,
  GetStoredParams,
  DeleteStoredParams,
  GetStoredFileParams,
  CopyStoredParams,
  GetLiveParams,
  CancelParams,
  StopParams,
  PauseParams,
  UnpauseParams,
  MuteParams,
  UnmuteParams,
} from '../interfaces';

export class Recordings {
  constructor(private readonly baseClient: BaseClient) {}
  /**
   * List recordings that are complete.
   * @returns Promise<StoredRecording[]>
   */
  async listStored(): Promise<StoredRecording[]> {
    return this.baseClient.get<StoredRecording[]>('/recordings/stored');
  }

  /**
   * Get a stored recording's details.
   * @param params - The parameters for getting a stored recording
   * @returns Promise<StoredRecording>
   */
  async getStored(params: GetStoredParams): Promise<StoredRecording> {
    return this.baseClient.get<StoredRecording>(
      `/recordings/stored/${params.recordingName}`
    );
  }

  /**
   * Delete a stored recording.
   * @param params - The parameters for deleting a stored recording
   * @returns Promise<void>
   */
  async deleteStored(params: DeleteStoredParams): Promise<void> {
    return this.baseClient.delete<void>(
      `/recordings/stored/${params.recordingName}`
    );
  }

  /**
   * Get the file associated with the stored recording.
   * @param params - The parameters for getting a stored recording file
   * @returns Promise<ArrayBuffer>
   */
  async getStoredFile(params: GetStoredFileParams): Promise<ArrayBuffer> {
    return this.baseClient.get<ArrayBuffer>(
      `/recordings/stored/${params.recordingName}/file`,
      { responseType: 'arraybuffer' }
    );
  }

  /**
   * Copy a stored recording.
   * @param params - The parameters for copying a stored recording
   * @returns Promise<StoredRecording>
   */
  async copyStored(params: CopyStoredParams): Promise<StoredRecording> {
    return this.baseClient.post<StoredRecording>(
      `/recordings/stored/${params.recordingName}/copy`,
      undefined,
      {
        params: {
          destinationRecordingName: params.destinationRecordingName,
        },
      }
    );
  }

  /**
   * List live recordings.
   * @param params - The parameters for getting a live recording
   * @returns Promise<LiveRecording>
   */
  async getLive(params: GetLiveParams): Promise<LiveRecording> {
    return this.baseClient.get<LiveRecording>(
      `/recordings/live/${params.recordingName}`
    );
  }

  /**
   * Stop a live recording and discard it.
   * @param params - The parameters for canceling a recording
   * @returns Promise<void>
   */
  async cancel(params: CancelParams): Promise<void> {
    return this.baseClient.delete<void>(
      `/recordings/live/${params.recordingName}`
    );
  }

  /**
   * Stop a live recording and store it.
   * @param params - The parameters for stopping a recording
   * @returns Promise<void>
   */
  async stop(params: StopParams): Promise<void> {
    return this.baseClient.post<void>(
      `/recordings/live/${params.recordingName}/stop`
    );
  }

  /**
   * Pause a live recording.
   * @param params - The parameters for pausing a recording
   * @returns Promise<void>
   */
  async pause(params: PauseParams): Promise<void> {
    return this.baseClient.post<void>(
      `/recordings/live/${params.recordingName}/pause`
    );
  }

  /**
   * Unpause a live recording.
   * @param params - The parameters for unpausing a recording
   * @returns Promise<void>
   */
  async unpause(params: UnpauseParams): Promise<void> {
    return this.baseClient.delete<void>(
      `/recordings/live/${params.recordingName}/pause`
    );
  }

  /**
   * Mute a live recording.
   * @param params - The parameters for muting a recording
   * @returns Promise<void>
   */
  async mute(params: MuteParams): Promise<void> {
    return this.baseClient.post<void>(
      `/recordings/live/${params.recordingName}/mute`
    );
  }

  /**
   * Unmute a live recording.
   * @param params - The parameters for unmuting a recording
   * @returns Promise<void>
   */
  async unmute(params: UnmuteParams): Promise<void> {
    return this.baseClient.delete<void>(
      `/recordings/live/${params.recordingName}/mute`
    );
  }
}

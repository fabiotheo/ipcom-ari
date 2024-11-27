import type { BaseClient } from "../baseClient.js";
import type {
  Playback,
  PlaybackControlRequest,
} from "../interfaces/playbacks.types.js";

export class Playbacks {
  constructor(private client: BaseClient) {}

  /**
   * Retrieves details of a specific playback.
   *
   * @param playbackId - The unique identifier of the playback.
   * @returns A promise that resolves to a Playback object containing the details of the specified playback.
   */
  async getDetails(playbackId: string): Promise<Playback> {
    return this.client.get<Playback>(`/playbacks/${playbackId}`);
  }

  /**
   * Controls a specific playback (e.g., pause, resume, rewind, forward, stop).
   *
   * @param playbackId - The unique identifier of the playback to control.
   * @param controlRequest - The PlaybackControlRequest containing the control operation.
   * @returns A promise that resolves when the control operation is successfully executed.
   */
  async control(
    playbackId: string,
    controlRequest: PlaybackControlRequest,
  ): Promise<void> {
    await this.client.post<void>(
      `/playbacks/${playbackId}/control`,
      controlRequest,
    );
  }

  /**
   * Stops a specific playback.
   *
   * @param playbackId - The unique identifier of the playback to stop.
   * @returns A promise that resolves when the playback is successfully stopped.
   */
  async stop(playbackId: string): Promise<void> {
    await this.client.post<void>(`/playbacks/${playbackId}/stop`);
  }
}

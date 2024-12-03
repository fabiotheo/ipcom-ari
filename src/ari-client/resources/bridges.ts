import type { BaseClient } from "../baseClient.js";
import type {
  AddChannelRequest,
  Bridge,
  BridgePlayback,
  CreateBridgeRequest,
  PlayMediaRequest,
  RemoveChannelRequest,
} from "../interfaces/bridges.types.js";

export class Bridges {
  constructor(private client: BaseClient) {}

  /**
   * Lists all active bridges.
   */
  async list(): Promise<Bridge[]> {
    return this.client.get<Bridge[]>("/bridges");
  }

  /**
   * Creates a new bridge.
   */
  async createBridge(request: CreateBridgeRequest): Promise<Bridge> {
    return this.client.post<Bridge>("/bridges", request);
  }

  /**
   * Retrieves details of a specific bridge.
   */
  async getDetails(bridgeId: string): Promise<Bridge> {
    return this.client.get<Bridge>(`/bridges/${bridgeId}`);
  }

  /**
   * Destroys (deletes) a specific bridge.
   */
  async destroy(bridgeId: string): Promise<void> {
    return this.client.delete<void>(`/bridges/${bridgeId}`);
  }

  /**
   * Adds a channel or multiple channels to a bridge.
   */
  async addChannels(
    bridgeId: string,
    request: AddChannelRequest,
  ): Promise<void> {
    const queryParams = new URLSearchParams({
      channel: Array.isArray(request.channel)
        ? request.channel.join(",")
        : request.channel,
      ...(request.role && { role: request.role }),
    }).toString();

    await this.client.post<void>(
      `/bridges/${bridgeId}/addChannel?${queryParams}`,
    );
  }

  /**
   * Removes a channel or multiple channels from a bridge.
   */
  async removeChannels(
    bridgeId: string,
    request: RemoveChannelRequest,
  ): Promise<void> {
    const queryParams = new URLSearchParams({
      channel: Array.isArray(request.channel)
        ? request.channel.join(",")
        : request.channel,
    }).toString();

    await this.client.post<void>(
      `/bridges/${bridgeId}/removeChannel?${queryParams}`,
    );
  }

  /**
   * Plays media to a bridge.
   */
  async playMedia(
    bridgeId: string,
    request: PlayMediaRequest,
  ): Promise<BridgePlayback> {
    const queryParams = new URLSearchParams({
      ...(request.lang && { lang: request.lang }),
      ...(request.offsetms && { offsetms: request.offsetms.toString() }),
      ...(request.skipms && { skipms: request.skipms.toString() }),
      ...(request.playbackId && { playbackId: request.playbackId }),
    }).toString();

    return this.client.post<BridgePlayback>(
      `/bridges/${bridgeId}/play?${queryParams}`,
      { media: request.media },
    );
  }

  /**
   * Stops media playback on a bridge.
   */
  async stopPlayback(bridgeId: string, playbackId: string): Promise<void> {
    await this.client.delete<void>(`/bridges/${bridgeId}/play/${playbackId}`);
  }

  /**
   * Sets the video source for a bridge.
   */
  async setVideoSource(bridgeId: string, channelId: string): Promise<void> {
    await this.client.post<void>(
      `/bridges/${bridgeId}/videoSource?channelId=${encodeURIComponent(channelId)}`,
    );
  }

  /**
   * Clears the video source for a bridge.
   */
  async clearVideoSource(bridgeId: string): Promise<void> {
    await this.client.delete<void>(`/bridges/${bridgeId}/videoSource`);
  }
}

import type { BaseClient } from "../baseClient.js";
import type {
  Channel,
  ChannelDialplan,
  ChannelVar,
  OriginateRequest,
  Playback,
  PlaybackOptions,
} from "../interfaces/channels.types.js";

export class Channels {
  constructor(private client: BaseClient) {}

  /**
   * Lists all active channels.
   */
  async list(): Promise<Channel[]> {
    const channels = await this.client.get<unknown>("/channels");

    if (!Array.isArray(channels)) {
      throw new Error("Resposta da API /channels não é um array.");
    }

    return channels as Channel[];
  }

  /**
   * Creates a new channel.
   */
  async originate(data: OriginateRequest): Promise<Channel> {
    return this.client.post<Channel>("/channels", data);
  }

  /**
   * Retrieves details of a specific channel.
   */
  async getDetails(channelId: string): Promise<Channel> {
    return this.client.get<Channel>(`/channels/${channelId}`);
  }

  /**
   * Hangs up (terminates) a specific channel.
   */
  async hangup(channelId: string): Promise<void> {
    return this.client.post<void>(`/channels/${channelId}/hangup`);
  }

  /**
   * Continues the dialplan for a specific channel.
   */
  async continueDialplan(
    channelId: string,
    context?: string,
    extension?: string,
    priority?: number,
    label?: string,
  ): Promise<void> {
    return this.client.post<void>(`/channels/${channelId}/continue`, {
      context,
      extension,
      priority,
      label,
    });
  }

  /**
   * Moves the channel to another Stasis application.
   */
  async moveToApplication(
    channelId: string,
    app: string,
    appArgs?: string,
  ): Promise<void> {
    return this.client.post<void>(`/channels/${channelId}/move`, {
      app,
      appArgs,
    });
  }

  /**
   * Sets a channel variable.
   */
  async setVariable(
    channelId: string,
    variable: string,
    value: string,
  ): Promise<void> {
    return this.client.post<void>(`/channels/${channelId}/variable`, {
      variable,
      value,
    });
  }

  /**
   * Gets a channel variable.
   */
  async getVariable(channelId: string, variable: string): Promise<ChannelVar> {
    return this.client.get<ChannelVar>(
      `/channels/${channelId}/variable?variable=${encodeURIComponent(variable)}`,
    );
  }

  /**
   * Plays a media file to a channel.
   */
  async playMedia(
    channelId: string,
    media: string,
    options?: PlaybackOptions,
  ): Promise<Playback> {
    const queryParams = options
      ? `?${new URLSearchParams(options as Record<string, string>).toString()}`
      : "";

    return this.client.post<Playback>(
      `/channels/${channelId}/play${queryParams}`,
      { media },
    );
  }

  /**
   * Starts music on hold (MOH) for a channel.
   */
  async startMusicOnHold(channelId: string): Promise<void> {
    return this.client.post<void>(`/channels/${channelId}/moh`);
  }

  /**
   * Stops music on hold (MOH) for a channel.
   */
  async stopMusicOnHold(channelId: string): Promise<void> {
    return this.client.delete<void>(`/channels/${channelId}/moh`);
  }

  /**
   * Starts playback of a media file on a channel.
   */
  async startPlayback(
    channelId: string,
    media: string,
    options?: PlaybackOptions,
  ): Promise<Playback> {
    const queryParams = options
      ? `?${new URLSearchParams(options as Record<string, string>).toString()}`
      : "";

    return this.client.post<Playback>(
      `/channels/${channelId}/play${queryParams}`,
      { media },
    );
  }

  /**
   * Stops playback of a media file on a channel.
   */
  async stopPlayback(channelId: string, playbackId: string): Promise<void> {
    return this.client.delete<void>(
      `/channels/${channelId}/play/${playbackId}`,
    );
  }

  /**
   * Pauses playback of a media file on a channel.
   */
  async pausePlayback(channelId: string, playbackId: string): Promise<void> {
    return this.client.post<void>(
      `/channels/${channelId}/play/${playbackId}/pause`,
    );
  }

  /**
   * Resumes playback of a media file on a channel.
   */
  async resumePlayback(channelId: string, playbackId: string): Promise<void> {
    return this.client.delete<void>(
      `/channels/${channelId}/play/${playbackId}/pause`,
    );
  }

  /**
   * Rewinds playback of a media file on a channel.
   */
  async rewindPlayback(
    channelId: string,
    playbackId: string,
    skipMs: number,
  ): Promise<void> {
    return this.client.post<void>(
      `/channels/${channelId}/play/${playbackId}/rewind`,
      { skipMs },
    );
  }

  /**
   * Fast-forwards playback of a media file on a channel.
   */
  async fastForwardPlayback(
    channelId: string,
    playbackId: string,
    skipMs: number,
  ): Promise<void> {
    return this.client.post<void>(
      `/channels/${channelId}/play/${playbackId}/forward`,
      { skipMs },
    );
  }
}

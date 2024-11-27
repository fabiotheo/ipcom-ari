import type { BaseClient } from "../baseClient.js";
import type {
  Channel,
  ChannelPlayback,
  ChannelVar,
  ExternalMediaOptions,
  OriginateRequest,
  PlaybackOptions,
  RTPStats,
  RecordingOptions,
  SnoopOptions,
} from "../interfaces/channels.types.js";

function toQueryParams<T>(options: T): string {
  return new URLSearchParams(
    Object.entries(options as Record<string, string>) // Conversão explícita
      .filter(([, value]) => value !== undefined)
      .map(([key, value]) => [key, value as string]), // Garante que value é string
  ).toString();
}

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
   * Creates a channel and places it in a Stasis app without dialing it.
   */
  async createChannel(data: OriginateRequest): Promise<Channel> {
    return this.client.post<Channel>("/channels/create", data);
  }

  /**
   * Creates a new channel with a specific ID and originates a call.
   */
  async originateWithId(
    channelId: string,
    data: OriginateRequest,
  ): Promise<Channel> {
    return this.client.post<Channel>(`/channels/${channelId}`, data);
  }

  /**
   * Hangs up (terminates) a specific channel.
   */
  /**
   * Hangs up a specific channel with optional reason or reason code.
   */
  async hangup(
    channelId: string,
    options?: { reason_code?: string; reason?: string },
  ): Promise<void> {
    const queryParams = new URLSearchParams({
      ...(options?.reason_code && { reason_code: options.reason_code }),
      ...(options?.reason && { reason: options.reason }),
    });

    return this.client.delete<void>(
      `/channels/${channelId}?${queryParams.toString()}`,
    );
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
  ): Promise<ChannelPlayback> {
    const queryParams = options
      ? `?${new URLSearchParams(options as Record<string, string>).toString()}`
      : "";

    return this.client.post<ChannelPlayback>(
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
  ): Promise<ChannelPlayback> {
    const queryParams = options
      ? `?${new URLSearchParams(options as Record<string, string>).toString()}`
      : "";

    return this.client.post<ChannelPlayback>(
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

  /**
   * Records audio from a channel.
   */
  async record(channelId: string, options: RecordingOptions): Promise<Channel> {
    // Converte RecordingOptions para URLSearchParams, garantindo compatibilidade
    const queryParams = new URLSearchParams(
      Object.entries(options as unknown as Record<string, string>).filter(
        ([, value]) => value !== undefined,
      ),
    );

    return this.client.post<Channel>(
      `/channels/${channelId}/record?${queryParams.toString()}`,
    );
  }

  /**
   * Starts snooping on a channel.
   */
  async snoopChannel(
    channelId: string,
    options: SnoopOptions,
  ): Promise<Channel> {
    const queryParams = toQueryParams(options);

    return this.client.post<Channel>(
      `/channels/${channelId}/snoop?${queryParams}`,
    );
  }

  /**
   * Starts snooping on a channel with a specific snoop ID.
   */
  async snoopChannelWithId(
    channelId: string,
    snoopId: string,
    options: SnoopOptions,
  ): Promise<Channel> {
    const queryParams = new URLSearchParams(options as Record<string, string>);
    return this.client.post<Channel>(
      `/channels/${channelId}/snoop/${snoopId}?${queryParams.toString()}`,
    );
  }

  /**
   * Dials a created channel.
   */
  async dial(
    channelId: string,
    caller?: string,
    timeout?: number,
  ): Promise<void> {
    const queryParams = new URLSearchParams({
      ...(caller && { caller }),
      ...(timeout && { timeout: timeout.toString() }),
    });
    return this.client.post<void>(
      `/channels/${channelId}/dial?${queryParams.toString()}`,
    );
  }

  /**
   * Retrieves RTP statistics for a channel.
   */
  async getRTPStatistics(channelId: string): Promise<RTPStats> {
    return this.client.get<RTPStats>(`/channels/${channelId}/rtp_statistics`);
  }

  /**
   * Creates a channel to an external media source/sink.
   */
  async createExternalMedia(options: ExternalMediaOptions): Promise<Channel> {
    const queryParams = new URLSearchParams(options as Record<string, string>);
    return this.client.post<Channel>(
      `/channels/externalMedia?${queryParams.toString()}`,
    );
  }

  /**
   * Redirects the channel to a different location.
   */
  async redirectChannel(channelId: string, endpoint: string): Promise<void> {
    return this.client.post<void>(
      `/channels/${channelId}/redirect?endpoint=${encodeURIComponent(endpoint)}`,
    );
  }

  /**
   * Answers a channel.
   */
  async answerChannel(channelId: string): Promise<void> {
    return this.client.post<void>(`/channels/${channelId}/answer`);
  }

  /**
   * Sends a ringing indication to a channel.
   */
  async ringChannel(channelId: string): Promise<void> {
    return this.client.post<void>(`/channels/${channelId}/ring`);
  }

  /**
   * Stops ringing indication on a channel.
   */
  async stopRingChannel(channelId: string): Promise<void> {
    return this.client.delete<void>(`/channels/${channelId}/ring`);
  }

  /**
   * Sends DTMF to a channel.
   */
  async sendDTMF(
    channelId: string,
    dtmf: string,
    options?: {
      before?: number;
      between?: number;
      duration?: number;
      after?: number;
    },
  ): Promise<void> {
    const queryParams = new URLSearchParams({
      dtmf,
      ...(options?.before && { before: options.before.toString() }),
      ...(options?.between && { between: options.between.toString() }),
      ...(options?.duration && { duration: options.duration.toString() }),
      ...(options?.after && { after: options.after.toString() }),
    });

    return this.client.post<void>(
      `/channels/${channelId}/dtmf?${queryParams.toString()}`,
    );
  }

  /**
   * Mutes a channel.
   */
  async muteChannel(
    channelId: string,
    direction: "both" | "in" | "out" = "both",
  ): Promise<void> {
    return this.client.post<void>(
      `/channels/${channelId}/mute?direction=${direction}`,
    );
  }

  /**
   * Unmutes a channel.
   */
  async unmuteChannel(
    channelId: string,
    direction: "both" | "in" | "out" = "both",
  ): Promise<void> {
    return this.client.delete<void>(
      `/channels/${channelId}/mute?direction=${direction}`,
    );
  }

  /**
   * Puts a channel on hold.
   */
  async holdChannel(channelId: string): Promise<void> {
    return this.client.post<void>(`/channels/${channelId}/hold`);
  }

  /**
   * Removes a channel from hold.
   */
  async unholdChannel(channelId: string): Promise<void> {
    return this.client.delete<void>(`/channels/${channelId}/hold`);
  }
}

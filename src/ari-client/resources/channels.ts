import { EventEmitter } from "events";
import { v4 as uuidv4 } from "uuid";
import type { AriClient } from "../ariClient";
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
  WebSocketEvent,
} from "../interfaces";
import { toQueryParams } from "../utils";
import type { PlaybackInstance } from "./playbacks";

export class ChannelInstance {
  private eventEmitter = new EventEmitter();
  private channelData: Channel | null = null;
  public id: string; // ID do canal

  constructor(
    private client: AriClient,
    private baseClient: BaseClient,
    private channelId: string = `channel-${Date.now()}`, // Gera um ID padrão se não fornecido
  ) {
    this.id = channelId || `channel-${Date.now()}`; // Inicializa o ID do canal
  }

  /**
   * Registra um listener para eventos específicos deste canal.
   */
  on<T extends WebSocketEvent["type"]>(
    event: T,
    listener: (data: Extract<WebSocketEvent, { type: T }>) => void,
  ): void {
    const wrappedListener = (data: WebSocketEvent) => {
      if ("channel" in data && data.channel?.id === this.id) {
        listener(data as Extract<WebSocketEvent, { type: T }>);
      }
    };
    this.eventEmitter.on(event, wrappedListener);
  }

  /**
   * Registra um listener único para eventos específicos deste canal.
   */
  once<T extends WebSocketEvent["type"]>(
    event: T,
    listener: (data: Extract<WebSocketEvent, { type: T }>) => void,
  ): void {
    const wrappedListener = (data: WebSocketEvent) => {
      if ("channel" in data && data.channel?.id === this.id) {
        // Garante que o evento é para este canal
        listener(data as Extract<WebSocketEvent, { type: T }>);
      }
    };

    this.eventEmitter.once(event, wrappedListener);
  }

  /**
   * Remove um listener para eventos específicos deste canal.
   */
  off<T extends WebSocketEvent["type"]>(
    event: T,
    listener?: (data: Extract<WebSocketEvent, { type: T }>) => void,
  ): void {
    if (listener) {
      this.eventEmitter.off(event, listener);
    } else {
      // Remove todos os listeners associados ao evento para este canal
      const listeners = this.eventEmitter.listeners(event) as Array<
        (...args: any[]) => void
      >;

      listeners.forEach((fn) => {
        this.eventEmitter.off(event, fn);
      });
    }
  }

  /**
   * Obtém a quantidade de listeners registrados para o evento especificado.
   */
  getListenerCount(event: string): number {
    return this.eventEmitter.listenerCount(event);
  }

  /**
   * Emite eventos internamente para o canal.
   * Verifica o ID do canal antes de emitir.
   */
  emitEvent(event: WebSocketEvent): void {
    if ("channel" in event && event.channel?.id === this.id) {
      this.eventEmitter.emit(event.type, event);
    }
  }

  /**
   * Remove todos os listeners para este canal.
   */
  removeAllListeners(): void {
    console.log(`Removendo todos os listeners para o canal ${this.id}`);
    this.eventEmitter.removeAllListeners();
  }

  async answer(): Promise<void> {
    await this.baseClient.post<void>(`/channels/${this.id}/answer`);
  }

  /**
   * Origina um canal físico no Asterisk.
   */
  async originate(data: OriginateRequest): Promise<Channel> {
    if (this.channelData) {
      throw new Error("O canal já foi criado.");
    }

    const channel = await this.baseClient.post<Channel>("/channels", data);
    this.channelData = channel;

    return channel;
  }

  /**
   * Obtém os detalhes do canal.
   */
  async getDetails(): Promise<Channel> {
    if (this.channelData) {
      return this.channelData;
    }

    if (!this.id) {
      throw new Error("Nenhum ID de canal associado a esta instância.");
    }

    const details = await this.baseClient.get<Channel>(`/channels/${this.id}`);
    this.channelData = details; // Armazena os detalhes para evitar múltiplas chamadas
    return details;
  }

  async getVariable(variable: string): Promise<ChannelVar> {
    if (!variable) {
      throw new Error("The 'variable' parameter is required.");
    }
    return this.baseClient.get<ChannelVar>(
      `/channels/${this.id}/variable?variable=${encodeURIComponent(variable)}`,
    );
  }

  /**
   * Encerra o canal, se ele já foi criado.
   */
  async hangup(): Promise<void> {
    if (!this.channelData) {
      console.log("Canal não inicializado, buscando detalhes...");
      this.channelData = await this.getDetails();
    }

    if (!this.channelData?.id) {
      throw new Error("Não foi possível inicializar o canal. ID inválido.");
    }

    await this.baseClient.delete(`/channels/${this.channelData.id}`);
  }

  /**
   * Reproduz mídia no canal.
   */
  async play(
    options: { media: string; lang?: string },
    playbackId?: string,
  ): Promise<PlaybackInstance> {
    if (!this.channelData) {
      console.log("Canal não inicializado, buscando detalhes...");
      this.channelData = await this.getDetails();
    }

    const playback = this.client.Playback(playbackId || uuidv4());

    if (!this.channelData?.id) {
      throw new Error("Não foi possível inicializar o canal. ID inválido.");
    }

    await this.baseClient.post<void>(
      `/channels/${this.channelData.id}/play/${playback.id}`,
      options,
    );

    return playback;
  }

  /**
   * Reproduz mídia em um canal.
   */
  async playMedia(
    media: string,
    options?: PlaybackOptions,
  ): Promise<ChannelPlayback> {
    if (!this.channelData) {
      throw new Error("O canal ainda não foi criado.");
    }

    const queryParams = options
      ? `?${new URLSearchParams(options as Record<string, string>).toString()}`
      : "";

    return this.baseClient.post<ChannelPlayback>(
      `/channels/${this.channelData.id}/play${queryParams}`,
      { media },
    );
  }

  /**
   * Para a reprodução de mídia.
   */
  async stopPlayback(playbackId: string): Promise<void> {
    if (!this.channelData?.id) {
      throw new Error("Canal não associado a esta instância.");
    }

    await this.baseClient.delete<void>(
      `/channels/${this.channelData.id}/play/${playbackId}`,
    );
  }

  /**
   * Pausa a reprodução de mídia.
   */
  async pausePlayback(playbackId: string): Promise<void> {
    if (!this.channelData?.id) {
      throw new Error("Canal não associado a esta instância.");
    }

    await this.baseClient.post<void>(
      `/channels/${this.channelData.id}/play/${playbackId}/pause`,
    );
  }

  /**
   * Retoma a reprodução de mídia.
   */
  async resumePlayback(playbackId: string): Promise<void> {
    if (!this.channelData?.id) {
      throw new Error("Canal não associado a esta instância.");
    }

    await this.baseClient.delete<void>(
      `/channels/${this.channelData.id}/play/${playbackId}/pause`,
    );
  }

  /**
   * Retrocede a reprodução de mídia.
   */
  async rewindPlayback(playbackId: string, skipMs: number): Promise<void> {
    if (!this.channelData?.id) {
      throw new Error("Canal não associado a esta instância.");
    }

    await this.baseClient.post<void>(
      `/channels/${this.channelData.id}/play/${playbackId}/rewind`,
      { skipMs },
    );
  }

  /**
   * Avança a reprodução de mídia.
   */
  async fastForwardPlayback(playbackId: string, skipMs: number): Promise<void> {
    if (!this.channelData?.id) {
      throw new Error("Canal não associado a esta instância.");
    }

    await this.baseClient.post<void>(
      `/channels/${this.channelData.id}/play/${playbackId}/forward`,
      { skipMs },
    );
  }

  /**
   * Muta o canal.
   */
  async muteChannel(direction: "both" | "in" | "out" = "both"): Promise<void> {
    if (!this.channelData?.id) {
      throw new Error("Canal não associado a esta instância.");
    }

    await this.baseClient.post<void>(
      `/channels/${this.channelData.id}/mute?direction=${direction}`,
    );
  }

  /**
   * Desmuta o canal.
   */
  async unmuteChannel(
    direction: "both" | "in" | "out" = "both",
  ): Promise<void> {
    if (!this.channelData?.id) {
      throw new Error("Canal não associado a esta instância.");
    }

    await this.baseClient.delete<void>(
      `/channels/${this.channelData.id}/mute?direction=${direction}`,
    );
  }

  /**
   * Coloca o canal em espera.
   */
  async holdChannel(): Promise<void> {
    if (!this.channelData?.id) {
      throw new Error("Canal não associado a esta instância.");
    }

    await this.baseClient.post<void>(`/channels/${this.channelData.id}/hold`);
  }

  /**
   * Remove o canal da espera.
   */
  async unholdChannel(): Promise<void> {
    if (!this.channelData?.id) {
      throw new Error("Canal não associado a esta instância.");
    }

    await this.baseClient.delete<void>(`/channels/${this.channelData.id}/hold`);
  }
}

export class Channels {
  private channelInstances = new Map<string, ChannelInstance>();
  constructor(
    private baseClient: BaseClient,
    private client: AriClient,
  ) {}

  Channel({ id }: { id?: string }): ChannelInstance {
    if (!id) {
      const instance = new ChannelInstance(this.client, this.baseClient);
      this.channelInstances.set(instance.id, instance);
      return instance;
    }

    if (!this.channelInstances.has(id)) {
      const instance = new ChannelInstance(this.client, this.baseClient, id);
      this.channelInstances.set(id, instance);
      return instance;
    }

    return this.channelInstances.get(id)!;
  }

  /**
   * Remove uma instância de canal.
   */
  removeChannelInstance(channelId: string): void {
    if (this.channelInstances.has(channelId)) {
      const instance = this.channelInstances.get(channelId);
      instance?.removeAllListeners();
      this.channelInstances.delete(channelId);
      console.log(`Instância do canal ${channelId} removida.`);
    } else {
      console.warn(
        `Tentativa de remover uma instância inexistente: ${channelId}`,
      );
    }
  }

  /**
   * Propaga eventos do WebSocket para o canal correspondente.
   */
  propagateEventToChannel(event: WebSocketEvent): void {
    if ("channel" in event && event.channel?.id) {
      const instance = this.channelInstances.get(event.channel.id);
      if (instance) {
        instance.emitEvent(event);
      } else {
        console.warn(
          `Nenhuma instância encontrada para o canal ${event.channel.id}`,
        );
      }
    }
  }

  /**
   * Origina um canal físico diretamente, sem uma instância de `ChannelInstance`.
   */
  async originate(data: OriginateRequest): Promise<Channel> {
    return this.baseClient.post<Channel>("/channels", data);
  }

  /**
   * Obtém detalhes de um canal específico.
   */
  async getDetails(channelId: string): Promise<Channel> {
    return this.baseClient.get<Channel>(`/channels/${channelId}`);
  }

  /**
   * Lista todos os canais ativos.
   */
  async list(): Promise<Channel[]> {
    const channels = await this.baseClient.get<unknown>("/channels");
    if (!Array.isArray(channels)) {
      throw new Error("Resposta da API /channels não é um array.");
    }
    return channels as Channel[];
  }

  /**
   * Encerra um canal específico.
   */
  async hangup(
    channelId: string,
    options?: { reason_code?: string; reason?: string },
  ): Promise<void> {
    const queryParams = new URLSearchParams({
      ...(options?.reason_code && { reason_code: options.reason_code }),
      ...(options?.reason && { reason: options.reason }),
    });

    return this.baseClient.delete<void>(
      `/channels/${channelId}?${queryParams.toString()}`,
    );
  }

  /**
   * Inicia a escuta em um canal.
   */
  async snoopChannel(
    channelId: string,
    options: SnoopOptions,
  ): Promise<Channel> {
    const queryParams = toQueryParams(options);
    return this.baseClient.post<Channel>(
      `/channels/${channelId}/snoop?${queryParams}`,
    );
  }

  async startSilence(channelId: string): Promise<void> {
    return this.baseClient.post<void>(`/channels/${channelId}/silence`);
  }

  async stopSilence(channelId: string): Promise<void> {
    return this.baseClient.delete<void>(`/channels/${channelId}/silence`);
  }

  async getRTPStatistics(channelId: string): Promise<RTPStats> {
    return this.baseClient.get<RTPStats>(
      `/channels/${channelId}/rtp_statistics`,
    );
  }

  async createExternalMedia(options: ExternalMediaOptions): Promise<Channel> {
    const queryParams = toQueryParams(options);
    return this.baseClient.post<Channel>(
      `/channels/externalMedia?${queryParams}`,
    );
  }

  async playWithId(
    channelId: string,
    playbackId: string,
    media: string,
    options?: PlaybackOptions,
  ): Promise<ChannelPlayback> {
    const queryParams = options ? `?${toQueryParams(options)}` : "";
    return this.baseClient.post<ChannelPlayback>(
      `/channels/${channelId}/play/${playbackId}${queryParams}`,
      { media },
    );
  }

  async snoopChannelWithId(
    channelId: string,
    snoopId: string,
    options: SnoopOptions,
  ): Promise<Channel> {
    const queryParams = toQueryParams(options);
    return this.baseClient.post<Channel>(
      `/channels/${channelId}/snoop/${snoopId}?${queryParams}`,
    );
  }

  async startMohWithClass(channelId: string, mohClass: string): Promise<void> {
    const queryParams = `mohClass=${encodeURIComponent(mohClass)}`;
    await this.baseClient.post<void>(
      `/channels/${channelId}/moh?${queryParams}`,
    );
  }

  async getChannelVariable(
    channelId: string,
    variable: string,
  ): Promise<ChannelVar> {
    if (!variable) {
      throw new Error("The 'variable' parameter is required.");
    }
    return this.baseClient.get<ChannelVar>(
      `/channels/${channelId}/variable?variable=${encodeURIComponent(variable)}`,
    );
  }

  async setChannelVariable(
    channelId: string,
    variable: string,
    value?: string,
  ): Promise<void> {
    if (!variable) {
      throw new Error("The 'variable' parameter is required.");
    }
    const queryParams = new URLSearchParams({
      variable,
      ...(value && { value }),
    });
    await this.baseClient.post<void>(
      `/channels/${channelId}/variable?${queryParams}`,
    );
  }

  async moveToApplication(
    channelId: string,
    app: string,
    appArgs?: string,
  ): Promise<void> {
    await this.baseClient.post<void>(`/channels/${channelId}/move`, {
      app,
      appArgs,
    });
  }

  async continueDialplan(
    channelId: string,
    context?: string,
    extension?: string,
    priority?: number,
    label?: string,
  ): Promise<void> {
    await this.baseClient.post<void>(`/channels/${channelId}/continue`, {
      context,
      extension,
      priority,
      label,
    });
  }

  async stopMusicOnHold(channelId: string): Promise<void> {
    await this.baseClient.delete<void>(`/channels/${channelId}/moh`);
  }

  async startMusicOnHold(channelId: string): Promise<void> {
    await this.baseClient.post<void>(`/channels/${channelId}/moh`);
  }

  async record(channelId: string, options: RecordingOptions): Promise<Channel> {
    const queryParams = toQueryParams(options);
    return this.baseClient.post<Channel>(
      `/channels/${channelId}/record?${queryParams}`,
    );
  }

  async dial(
    channelId: string,
    caller?: string,
    timeout?: number,
  ): Promise<void> {
    const queryParams = new URLSearchParams({
      ...(caller && { caller }),
      ...(timeout && { timeout: timeout.toString() }),
    });
    await this.baseClient.post<void>(
      `/channels/${channelId}/dial?${queryParams}`,
    );
  }

  async redirectChannel(channelId: string, endpoint: string): Promise<void> {
    await this.baseClient.post<void>(
      `/channels/${channelId}/redirect?endpoint=${encodeURIComponent(endpoint)}`,
    );
  }

  async answerChannel(channelId: string): Promise<void> {
    await this.baseClient.post<void>(`/channels/${channelId}/answer`);
  }

  async ringChannel(channelId: string): Promise<void> {
    await this.baseClient.post<void>(`/channels/${channelId}/ring`);
  }

  async stopRingChannel(channelId: string): Promise<void> {
    await this.baseClient.delete<void>(`/channels/${channelId}/ring`);
  }

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
    const queryParams = toQueryParams({ dtmf, ...options });
    await this.baseClient.post<void>(
      `/channels/${channelId}/dtmf?${queryParams}`,
    );
  }

  async muteChannel(
    channelId: string,
    direction: "both" | "in" | "out" = "both",
  ): Promise<void> {
    await this.baseClient.post<void>(
      `/channels/${channelId}/mute?direction=${direction}`,
    );
  }

  async unmuteChannel(
    channelId: string,
    direction: "both" | "in" | "out" = "both",
  ): Promise<void> {
    await this.baseClient.delete<void>(
      `/channels/${channelId}/mute?direction=${direction}`,
    );
  }

  async holdChannel(channelId: string): Promise<void> {
    await this.baseClient.post<void>(`/channels/${channelId}/hold`);
  }

  async unholdChannel(channelId: string): Promise<void> {
    await this.baseClient.delete<void>(`/channels/${channelId}/hold`);
  }

  async createChannel(data: OriginateRequest): Promise<Channel> {
    return this.baseClient.post<Channel>("/channels/create", data);
  }

  async originateWithId(
    channelId: string,
    data: OriginateRequest,
  ): Promise<Channel> {
    return this.baseClient.post<Channel>(`/channels/${channelId}`, data);
  }
}

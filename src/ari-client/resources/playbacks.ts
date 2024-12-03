import { EventEmitter } from "events";
import type { AriClient } from "../ariClient";
import type { BaseClient } from "../baseClient.js";
import type { Playback, WebSocketEvent } from "../interfaces";

export class PlaybackInstance {
  private eventEmitter = new EventEmitter();
  private playbackData: Playback | null = null;
  public id: string;

  constructor(
    private client: AriClient,
    private baseClient: BaseClient,
    private playbackId: string = `playback-${Date.now()}`,
  ) {
    this.id = playbackId;
  }

  /**
   * Registra um listener para eventos específicos deste playback.
   */
  on<T extends WebSocketEvent["type"]>(
    event: T,
    listener: (data: Extract<WebSocketEvent, { type: T }>) => void,
  ): void {
    const wrappedListener = (data: WebSocketEvent) => {
      if ("playback" in data && data.playback?.id === this.id) {
        listener(data as Extract<WebSocketEvent, { type: T }>);
      }
    };
    this.eventEmitter.on(event, wrappedListener);
  }

  /**
   * Registra um listener único para eventos específicos deste playback.
   */
  once<T extends WebSocketEvent["type"]>(
    event: T,
    listener: (data: Extract<WebSocketEvent, { type: T }>) => void,
  ): void {
    const wrappedListener = (data: WebSocketEvent) => {
      if ("playback" in data && data.playback?.id === this.id) {
        listener(data as Extract<WebSocketEvent, { type: T }>);
      }
    };
    this.eventEmitter.once(event, wrappedListener);
  }

  /**
   * Remove um listener para eventos específicos deste playback.
   */
  off<T extends WebSocketEvent["type"]>(
    event: T,
    listener?: (data: Extract<WebSocketEvent, { type: T }>) => void,
  ): void {
    if (listener) {
      this.eventEmitter.off(event, listener);
    } else {
      this.eventEmitter.removeAllListeners(event);
    }
  }

  /**
   * Emite eventos internamente para o playback.
   */
  emitEvent(event: WebSocketEvent): void {
    if ("playback" in event && event.playback?.id === this.id) {
      this.eventEmitter.emit(event.type, event);
    }
  }

  /**
   * Obtém os detalhes do playback.
   */
  async get(): Promise<Playback> {
    if (!this.id) {
      throw new Error("Nenhum playback associado a esta instância.");
    }

    this.playbackData = await this.baseClient.get<Playback>(
      `/playbacks/${this.id}`,
    );
    return this.playbackData;
  }

  /**
   * Controla o playback.
   */
  async control(
    operation: "pause" | "unpause" | "reverse" | "forward",
  ): Promise<void> {
    if (!this.id) {
      throw new Error("Nenhum playback associado para controlar.");
    }

    await this.baseClient.post<void>(
      `/playbacks/${this.id}/control?operation=${operation}`,
    );
  }

  /**
   * Encerra o playback.
   */
  async stop(): Promise<void> {
    if (!this.id) {
      throw new Error("Nenhum playback associado para encerrar.");
    }

    await this.baseClient.delete<void>(`/playbacks/${this.id}`);
  }

  /**
   * Remove todos os listeners para este playback.
   */
  removeAllListeners(): void {
    this.eventEmitter.removeAllListeners();
  }
}

export class Playbacks {
  private playbackInstances = new Map<string, PlaybackInstance>();

  constructor(
    private baseClient: BaseClient,
    private client: AriClient,
  ) {}

  /**
   * Gerencia instâncias de playback.
   */
  Playback({ id }: { id?: string }): PlaybackInstance {
    if (!id) {
      const instance = new PlaybackInstance(this.client, this.baseClient);
      this.playbackInstances.set(instance.id, instance);
      return instance;
    }

    if (!this.playbackInstances.has(id)) {
      const instance = new PlaybackInstance(this.client, this.baseClient, id);
      this.playbackInstances.set(id, instance);
      return instance;
    }

    return this.playbackInstances.get(id)!;
  }

  /**
   * Remove uma instância de playback.
   */
  removePlaybackInstance(playbackId: string): void {
    if (this.playbackInstances.has(playbackId)) {
      const instance = this.playbackInstances.get(playbackId);
      instance?.removeAllListeners();
      this.playbackInstances.delete(playbackId);
    }
  }

  /**
   * Propaga eventos do WebSocket para o playback correspondente.
   */
  propagateEventToPlayback(event: WebSocketEvent): void {
    if ("playback" in event && event.playback?.id) {
      const instance = this.playbackInstances.get(event.playback.id);
      if (instance) {
        instance.emitEvent(event);
      }
    }
  }

  /**
   * Obtém detalhes de um playback específico.
   */
  async getDetails(playbackId: string): Promise<Playback> {
    return this.baseClient.get<Playback>(`/playbacks/${playbackId}`);
  }

  /**
   * Controla um playback específico.
   */
  async control(
    playbackId: string,
    operation: "pause" | "unpause" | "reverse" | "forward",
  ): Promise<void> {
    const playback = this.Playback({ id: playbackId });
    await playback.control(operation);
  }

  /**
   * Encerra um playback específico.
   */
  async stop(playbackId: string): Promise<void> {
    const playback = this.Playback({ id: playbackId });
    await playback.stop();
  }
}

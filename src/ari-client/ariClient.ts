import { BaseClient } from "./baseClient.js";
import type {
  AriClientConfig,
  WebSocketEvent,
  WebSocketEventType,
} from "./interfaces";
import { Applications } from "./resources/applications.js";
import { Asterisk } from "./resources/asterisk";
import { Bridges } from "./resources/bridges";
import { type ChannelInstance, Channels } from "./resources/channels.js";
import { Endpoints } from "./resources/endpoints";
import { type PlaybackInstance, Playbacks } from "./resources/playbacks";
import { Sounds } from "./resources/sounds";
import { WebSocketClient } from "./websocketClient.js";

export class AriClient {
  private readonly baseClient: BaseClient;
  private webSocketClient?: WebSocketClient;

  public channels: Channels;
  public endpoints: Endpoints;
  public applications: Applications;
  public playbacks: Playbacks;
  public sounds: Sounds;
  public asterisk: Asterisk;
  public bridges: Bridges;

  constructor(private config: AriClientConfig) {
    const httpProtocol = config.secure ? "https" : "http";
    const normalizedHost = config.host.replace(/^https?:\/\//, "");
    const baseUrl = `${httpProtocol}://${normalizedHost}:${config.port}/ari`;

    this.baseClient = new BaseClient(baseUrl, config.username, config.password);
    this.channels = new Channels(this.baseClient, this);
    this.playbacks = new Playbacks(this.baseClient, this);
    this.endpoints = new Endpoints(this.baseClient);
    this.applications = new Applications(this.baseClient);
    this.sounds = new Sounds(this.baseClient);
    this.asterisk = new Asterisk(this.baseClient);
    this.bridges = new Bridges(this.baseClient);
  }

  /**
   * Inicializa uma conexão WebSocket.
   */
  public async connectWebSocket(
    apps: string[],
    subscribedEvents?: WebSocketEventType[],
  ): Promise<void> {
    if (this.webSocketClient) {
      console.warn("WebSocket já está conectado.");
      return;
    }
    this.webSocketClient = new WebSocketClient(
      this.baseClient,
      apps,
      subscribedEvents,
      this,
    );
    await this.webSocketClient.connect();
  }

  /**
   * Adiciona um listener para eventos do WebSocket.
   */
  public on<T extends WebSocketEvent["type"]>(
    event: T,
    listener: (data: Extract<WebSocketEvent, { type: T }>) => void,
  ): void {
    this.webSocketClient?.on(event, listener);
  }

  /**
   * Adiciona um listener único para eventos do WebSocket.
   */
  public once<T extends WebSocketEvent["type"]>(
    event: T,
    listener: (data: Extract<WebSocketEvent, { type: T }>) => void,
  ): void {
    this.webSocketClient?.once(event, listener);
  }

  /**
   * Remove um listener para eventos do WebSocket.
   */
  public off<T extends WebSocketEvent["type"]>(
    event: T,
    listener: (data: Extract<WebSocketEvent, { type: T }>) => void,
  ): void {
    this.webSocketClient?.off(event, listener);
  }

  /**
   * Fecha a conexão WebSocket.
   */
  public closeWebSocket(): void {
    this.webSocketClient?.close();
    this.webSocketClient = undefined;
  }

  /**
   * Inicializa uma nova instância de `ChannelInstance` para manipular canais localmente.
   */

  Channel(channelId?: string): ChannelInstance {
    return this.channels.Channel({ id: channelId });
  }

  /**
   * Inicializa uma nova instância de `PlaybackInstance` para manipular playbacks.
   */
  public Playback(playbackId?: string, _app?: string): PlaybackInstance {
    return this.playbacks.Playback({ id: playbackId });
  }
}

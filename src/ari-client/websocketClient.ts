import { EventEmitter } from "events";
import { type IBackOffOptions, backOff } from "exponential-backoff";
import WebSocket from "ws";
import type { AriClient } from "./ariClient";
import type { BaseClient } from "./baseClient.js";
import type { WebSocketEvent, WebSocketEventType } from "./interfaces";

export class WebSocketClient extends EventEmitter {
  private ws?: WebSocket;
  private isReconnecting = false;
  private readonly maxReconnectAttempts = 10;

  private readonly backOffOptions: IBackOffOptions = {
    numOfAttempts: 10, // Máximo de tentativas de reconexão
    startingDelay: 500, // Início com 500ms de atraso
    maxDelay: 10000, // Limite máximo de atraso de 10s
    timeMultiple: 2, // Atraso aumenta exponencialmente
    jitter: "full", // Randomização para evitar colisões
    delayFirstAttempt: false, // Não atrase a primeira tentativa
    retry: (error, attemptNumber) => {
      console.warn(
        `Tentativa #${attemptNumber} falhou:`,
        error.message || error,
      );
      // Continue tentando reconectar, a menos que seja um erro crítico
      return true;
    },
  };

  constructor(
    private baseClient: BaseClient, // BaseClient contém baseUrl, username, e password
    private apps: string[], // Lista de aplicativos a serem conectados
    private subscribedEvents?: WebSocketEventType[], // Lista de eventos a serem assinados
    private ariClient?: AriClient, // Para acessar recursos como ChannelInstance
  ) {
    super();
  }

  /**
   * Conecta ao WebSocket.
   */
  public async connect(): Promise<void> {
    const { baseUrl, username, password } = this.baseClient.getCredentials();

    // Determina o protocolo correto
    const protocol = baseUrl.startsWith("https") ? "wss" : "ws";

    // Remove o prefixo redundante "/ari" do baseUrl, se existir
    const normalizedHost = baseUrl
      .replace(/^https?:\/\//, "")
      .replace(/\/ari$/, "");

    // Prepara os parâmetros da query
    const queryParams = new URLSearchParams();
    queryParams.append("app", this.apps.join(",")); // Adiciona os aplicativos como uma lista separada por vírgulas
    if (this.subscribedEvents && this.subscribedEvents.length > 0) {
      this.subscribedEvents.forEach((event) =>
        queryParams.append("event", event),
      );
    } else {
      queryParams.append("subscribeAll", "true");
    }

    // Constrói a URL final corrigida
    const wsUrl = `${protocol}://${encodeURIComponent(username)}:${encodeURIComponent(password)}@${normalizedHost}/ari/events?${queryParams.toString()}`;

    console.log("Conectando ao WebSocket em:", wsUrl);

    // Inicializa o WebSocket
    return this.initializeWebSocket(wsUrl);
  }

  /**
   * Inicializa a conexão WebSocket com lógica de reconexão.
   */
  private async initializeWebSocket(wsUrl: string): Promise<void> {
    return backOff(async () => {
      return new Promise<void>((resolve, reject) => {
        this.ws = new WebSocket(wsUrl);

        this.ws.on("open", () => {
          console.log("WebSocket conectado com sucesso.");
          this.isReconnecting = false;
          this.emit("connected");
          resolve();
        });

        this.ws.on("message", (data) => this.handleMessage(data.toString()));

        this.ws.on("close", (code) => {
          console.warn(
            `WebSocket desconectado com código ${code}. Tentando reconectar...`,
          );
          if (!this.isReconnecting) {
            this.reconnect(wsUrl);
          }
        });

        this.ws.on("error", (err) => {
          console.error("Erro no WebSocket:", err.message);
          if (!this.isReconnecting) {
            this.reconnect(wsUrl);
          }
          reject(err);
        });
      });
    }, this.backOffOptions);
  }

  /**
   * Processa as mensagens recebidas do WebSocket.
   */
  private handleMessage(rawMessage: string): void {
    try {
      const event: WebSocketEvent = JSON.parse(rawMessage);

      // Filtrar eventos não assinados
      if (
        this.subscribedEvents &&
        !this.subscribedEvents.includes(event.type as WebSocketEventType)
      ) {
        return;
      }

      // Processa eventos associados a canais
      if ("channel" in event && event.channel?.id && this.ariClient) {
        const instanceChannel = this.ariClient.Channel(event.channel.id);

        // Encaminha o evento para o ChannelInstance
        instanceChannel.emitEvent(event);

        // Também adiciona `instanceChannel` ao evento
        event.instanceChannel = instanceChannel;
      }

      if ("playback" in event && event.playback?.id && this.ariClient) {
        const instancePlayback = this.ariClient.Playback(event.playback.id);

        // Encaminha o evento para o ChannelInstance
        instancePlayback.emitEvent(event);

        // Também adiciona `instanceChannel` ao evento
        event.instancePlayback = instancePlayback;
      }

      this.emit(event.type, event); // Evento genérico para o WebSocket
    } catch (err) {
      console.error("Erro ao processar mensagem WebSocket:", err);
      this.emit("error", new Error("Falha ao decodificar mensagem WebSocket."));
    }
  }

  /**
   * Tenta reconectar ao WebSocket.
   */
  private reconnect(wsUrl: string): void {
    this.isReconnecting = true;
    console.log("Iniciando tentativa de reconexão...");
    this.removeAllListeners(); // Limpa todos os listeners associados
    backOff(() => this.initializeWebSocket(wsUrl), this.backOffOptions).catch(
      (err) => {
        console.error(
          "Falha ao reconectar após várias tentativas:",
          err.message || err,
        );
      },
    );
  }

  /**
   * Fecha o WebSocket manualmente.
   */
  public close(): void {
    this.ws?.close();
    this.ws = undefined;
  }
}

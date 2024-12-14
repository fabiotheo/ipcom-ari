import { EventEmitter } from "events";
import { type IBackOffOptions, backOff } from "exponential-backoff";
import WebSocket from "ws";
import type { AriClient } from "./ariClient";
import type { BaseClient } from "./baseClient.js";
import type { WebSocketEvent, WebSocketEventType } from "./interfaces";

const DEFAULT_MAX_RECONNECT_ATTEMPTS = 10;
const DEFAULT_STARTING_DELAY = 500;
const DEFAULT_MAX_DELAY = 10000;

/**
 * WebSocketClient handles real-time communication with the Asterisk server.
 * Extends EventEmitter to provide event-based communication patterns.
 */
export class WebSocketClient extends EventEmitter {
  private ws?: WebSocket;
  private isReconnecting = false;
  private readonly maxReconnectAttempts = DEFAULT_MAX_RECONNECT_ATTEMPTS;

  private readonly backOffOptions: IBackOffOptions = {
    numOfAttempts: DEFAULT_MAX_RECONNECT_ATTEMPTS,
    startingDelay: DEFAULT_STARTING_DELAY,
    maxDelay: DEFAULT_MAX_DELAY,
    timeMultiple: 2,
    jitter: "full",
    delayFirstAttempt: false,
    retry: (error: Error, attemptNumber: number) => {
      console.warn(
          `Connection attempt #${attemptNumber} failed:`,
          error.message || 'Unknown error'
      );
      return attemptNumber < this.maxReconnectAttempts;
    },
  };

  /**
   * Creates a new WebSocket client instance.
   *
   * @param {BaseClient} baseClient - The base client containing connection details
   * @param {string[]} apps - List of applications to connect to
   * @param {WebSocketEventType[]} [subscribedEvents] - Optional list of events to subscribe to
   * @param {AriClient} [ariClient] - Optional ARI client for handling channel and playback events
   */
  constructor(
      private readonly baseClient: BaseClient,
      private readonly apps: string[],
      private readonly subscribedEvents?: WebSocketEventType[],
      private readonly ariClient?: AriClient,
  ) {
    super();

    if (!apps.length) {
      throw new Error("At least one application name is required");
    }
  }

  /**
   * Establishes a WebSocket connection.
   *
   * @returns {Promise<void>} Resolves when connection is established
   * @throws {Error} If connection fails
   */
  public async connect(): Promise<void> {
    const { baseUrl, username, password } = this.baseClient.getCredentials();

    // Determine correct protocol
    const protocol = baseUrl.startsWith("https") ? "wss" : "ws";

    // Normalize host
    const normalizedHost = baseUrl
        .replace(/^https?:\/\//, "")
        .replace(/\/ari$/, "");

    // Prepare query parameters
    const queryParams = new URLSearchParams();
    queryParams.append("app", this.apps.join(","));

    if (this.subscribedEvents?.length) {
      this.subscribedEvents.forEach(event =>
          queryParams.append("event", event)
      );
    } else {
      queryParams.append("subscribeAll", "true");
    }

    // Build final WebSocket URL
    const wsUrl = `${protocol}://${encodeURIComponent(username)}:${encodeURIComponent(password)}@${normalizedHost}/ari/events?${queryParams.toString()}`;

    console.log("Connecting to WebSocket...");
    return this.initializeWebSocket(wsUrl);
  }

  /**
   * Initializes WebSocket connection with reconnection logic.
   *
   * @param {string} wsUrl - The WebSocket URL to connect to
   * @returns {Promise<void>} Resolves when connection is established
   */
  private async initializeWebSocket(wsUrl: string): Promise<void> {
    return backOff(async () => {
      return new Promise<void>((resolve, reject) => {
        try {
          this.ws = new WebSocket(wsUrl);

          this.ws.on("open", () => {
            console.log("WebSocket connection established successfully");
            this.isReconnecting = false;
            this.emit("connected");
            resolve();
          });

          this.ws.on("message", (data) => this.handleMessage(data.toString()));

          this.ws.on("close", (code) => {
            console.warn(
                `WebSocket disconnected with code ${code}. Attempting to reconnect...`
            );
            if (!this.isReconnecting) {
              this.reconnect(wsUrl);
            }
          });

          this.ws.on("error", (err: Error) => {
            console.error("WebSocket error:", err.message);
            if (!this.isReconnecting) {
              this.reconnect(wsUrl);
            }
            reject(err);
          });
        } catch (error) {
          reject(error);
        }
      });
    }, this.backOffOptions);
  }

  /**
   * Processes incoming WebSocket messages.
   *
   * @param {string} rawMessage - The raw message received from WebSocket
   */
  private handleMessage(rawMessage: string): void {
    try {
      const event: WebSocketEvent = JSON.parse(rawMessage);

      // Filter unsubscribed events
      if (
          this.subscribedEvents?.length &&
          !this.subscribedEvents.includes(event.type as WebSocketEventType)
      ) {
        return;
      }

      // Process channel-related events
      if ("channel" in event && event.channel?.id && this.ariClient) {
        const instanceChannel = this.ariClient.Channel(event.channel.id);
        instanceChannel.emitEvent(event);
        event.instanceChannel = instanceChannel;
      }

      // Process playback-related events
      if ("playback" in event && event.playback?.id && this.ariClient) {
        const instancePlayback = this.ariClient.Playback(event.playback.id);
        instancePlayback.emitEvent(event);
        event.instancePlayback = instancePlayback;
      }

      this.emit(event.type, event);
      console.log(`Event processed: ${event.type}`);
    } catch (error) {
      console.error("Error processing WebSocket message:", error instanceof Error ? error.message : 'Unknown error');
      this.emit("error", new Error("Failed to decode WebSocket message"));
    }
  }

  /**
   * Attempts to reconnect to the WebSocket.
   *
   * @param {string} wsUrl - The WebSocket URL to reconnect to
   */
  private reconnect(wsUrl: string): void {
    this.isReconnecting = true;
    console.log("Initiating reconnection attempt...");
    this.removeAllListeners();

    backOff(() => this.initializeWebSocket(wsUrl), this.backOffOptions)
        .catch((error) => {
          console.error(
              "Failed to reconnect after multiple attempts:",
              error instanceof Error ? error.message : 'Unknown error'
          );
          this.emit("reconnectFailed", error);
        });
  }

  /**
   * Manually closes the WebSocket connection.
   */
  public close(): void {
    try {
      if (this.ws) {
        this.ws.close();
        this.ws = undefined;
        console.log("WebSocket connection closed");
      }
    } catch (error) {
      console.error("Error closing WebSocket:",
          error instanceof Error ? error.message : 'Unknown error'
      );
    }
  }

  /**
   * Checks if the WebSocket is currently connected.
   *
   * @returns {boolean} True if connected, false otherwise
   */
  public isConnected(): boolean {
    return this.ws?.readyState === WebSocket.OPEN;
  }

  /**
   * Gets the current connection state.
   *
   * @returns {number} The WebSocket ready state
   */
  public getState(): number {
    return this.ws?.readyState ?? WebSocket.CLOSED;
  }
}

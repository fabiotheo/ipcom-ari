import { EventEmitter } from "events";
import { type IBackOffOptions, backOff } from "exponential-backoff";
import WebSocket from "ws";
import type { AriClient } from "./ariClient";
import type { BaseClient } from "./baseClient.js";
import type { WebSocketEvent, WebSocketEventType } from "./interfaces";

const DEFAULT_MAX_RECONNECT_ATTEMPTS = 30;
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
  private reconnectionAttempts = 0;
  private lastWsUrl: string = "";

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
        error.message || "Unknown error",
      );
      return attemptNumber < this.maxReconnectAttempts;
    },
  };

  /**
   * Creates a new WebSocketClient instance.
   *
   * This constructor initializes a WebSocketClient with the necessary dependencies and configuration.
   * It ensures that at least one application name is provided.
   *
   * @param baseClient - The BaseClient instance used for basic ARI operations and authentication.
   * @param apps - An array of application names to connect to via the WebSocket.
   * @param subscribedEvents - Optional. An array of WebSocketEventTypes to subscribe to. If not provided, all events will be subscribed.
   * @param ariClient - Optional. The AriClient instance, used for creating Channel and Playback instances when processing events.
   *
   * @throws {Error} Throws an error if the apps array is empty.
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
   * Establishes a WebSocket connection to the Asterisk server.
   *
   * This method constructs the WebSocket URL using the base URL, credentials,
   * application names, and subscribed events. It then initiates the connection
   * using the constructed URL.
   *
   * @returns A Promise that resolves when the WebSocket connection is successfully established.
   * @throws Will throw an error if the connection cannot be established.
   */
  public async connect(): Promise<void> {
    const { baseUrl, username, password } = this.baseClient.getCredentials();

    const protocol = baseUrl.startsWith("https") ? "wss" : "ws";
    const normalizedHost = baseUrl
      .replace(/^https?:\/\//, "")
      .replace(/\/ari$/, "");

    const queryParams = new URLSearchParams();
    queryParams.append("app", this.apps.join(","));

    if (this.subscribedEvents?.length) {
      this.subscribedEvents.forEach((event) =>
        queryParams.append("event", event),
      );
    } else {
      queryParams.append("subscribeAll", "true");
    }

    this.lastWsUrl = `${protocol}://${encodeURIComponent(username)}:${encodeURIComponent(password)}@${normalizedHost}/ari/events?${queryParams.toString()}`;

    console.log("Connecting to WebSocket...");
    return this.initializeWebSocket(this.lastWsUrl);
  }

  /**
   * Initializes a WebSocket connection with exponential backoff retry mechanism.
   *
   * This method attempts to establish a WebSocket connection to the specified URL.
   * It sets up event listeners for the WebSocket's 'open', 'message', 'close', and 'error' events.
   * If the connection is successful, it emits a 'connected' event. If it's a reconnection,
   * it also emits a 'reconnected' event with the current apps and subscribed events.
   * In case of connection failure, it uses an exponential backoff strategy to retry.
   *
   * @param wsUrl - The WebSocket URL to connect to.
   * @returns A Promise that resolves when the connection is successfully established,
   *          or rejects if an error occurs during the connection process.
   * @throws Will throw an error if the WebSocket connection cannot be established
   *         after the maximum number of retry attempts.
   */
  private async initializeWebSocket(wsUrl: string): Promise<void> {
    return backOff(async () => {
      return new Promise<void>((resolve, reject) => {
        try {
          this.ws = new WebSocket(wsUrl);

          this.ws.on("open", () => {
            console.log("WebSocket connection established successfully");
            if (this.isReconnecting) {
              this.emit("reconnected", {
                apps: this.apps,
                subscribedEvents: this.subscribedEvents,
              });
            }
            this.isReconnecting = false;
            this.reconnectionAttempts = 0;
            this.emit("connected");
            resolve();
          });

          this.ws.on("message", (data) => this.handleMessage(data.toString()));

          this.ws.on("close", (code) => {
            console.warn(
              `WebSocket disconnected with code ${code}. Attempting to reconnect...`,
            );
            if (!this.isReconnecting) {
              this.reconnect(this.lastWsUrl);
            }
          });

          this.ws.on("error", (err: Error) => {
            console.error("WebSocket error:", err.message);
            if (!this.isReconnecting) {
              this.reconnect(this.lastWsUrl);
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
   * Handles incoming WebSocket messages by parsing and processing events.
   *
   * This method parses the raw message into a WebSocketEvent, filters it based on
   * subscribed events (if any), processes channel and playback events, and emits
   * the event to listeners. It also handles any errors that occur during processing.
   *
   * @param rawMessage - The raw message string received from the WebSocket connection.
   * @returns void This method doesn't return a value but emits events.
   *
   * @throws Will emit an 'error' event if the message cannot be parsed or processed.
   */
  private handleMessage(rawMessage: string): void {
    try {
      const event: WebSocketEvent = JSON.parse(rawMessage);

      if (
        this.subscribedEvents?.length &&
        !this.subscribedEvents.includes(event.type as WebSocketEventType)
      ) {
        return;
      }

      if ("channel" in event && event.channel?.id && this.ariClient) {
        const instanceChannel = this.ariClient.Channel(event.channel.id);
        instanceChannel.emitEvent(event);
        event.instanceChannel = instanceChannel;
      }

      if ("playback" in event && event.playback?.id && this.ariClient) {
        const instancePlayback = this.ariClient.Playback(event.playback.id);
        instancePlayback.emitEvent(event);
        event.instancePlayback = instancePlayback;
      }

      // Process bridges-related events
      if ("bridge" in event && event.bridge?.id && this.ariClient) {
        const instanceBridge = this.ariClient.Bridge(event.bridge.id);
        instanceBridge.emitEvent(event);
        event.instanceBridge = instanceBridge;
      }

      this.emit(event.type, event);
    } catch (error) {
      console.error(
        "Error processing WebSocket message:",
        error instanceof Error ? error.message : "Unknown error",
      );
      this.emit("error", new Error("Failed to decode WebSocket message"));
    }
  }

  /**
   * Attempts to reconnect to the WebSocket server using an exponential backoff strategy.
   *
   * This method is called when the WebSocket connection is closed unexpectedly.
   * It increments the reconnection attempt counter, logs the attempt, and uses
   * the backOff utility to retry the connection with exponential delays between attempts.
   *
   * @param wsUrl - The WebSocket URL to reconnect to.
   * @returns void - This method doesn't return a value.
   *
   * @emits reconnectFailed - Emitted if all reconnection attempts fail.
   */
  private reconnect(wsUrl: string): void {
    this.isReconnecting = true;
    this.reconnectionAttempts++;
    console.log(
      `Initiating reconnection attempt #${this.reconnectionAttempts}...`,
    );

    backOff(() => this.initializeWebSocket(wsUrl), this.backOffOptions).catch(
      (error) => {
        console.error(
          `Failed to reconnect after ${this.reconnectionAttempts} attempts:`,
          error instanceof Error ? error.message : "Unknown error",
        );
        this.emit("reconnectFailed", error);
      },
    );
  }

  /**
   * Closes the WebSocket connection if it exists.
   *
   * This method attempts to gracefully close the WebSocket connection
   * and sets the WebSocket instance to undefined. If an error occurs
   * during the closing process, it will be caught and logged.
   *
   * @throws {Error} Logs an error message if closing the WebSocket fails.
   */
  public close(): void {
    try {
      if (this.ws) {
        this.ws.close();
        this.ws = undefined;
        console.log("WebSocket connection closed");
      }
    } catch (error) {
      console.error(
        "Error closing WebSocket:",
        error instanceof Error ? error.message : "Unknown error",
      );
    }
  }

  /**
   * Checks if the WebSocket connection is currently open and active.
   *
   * This method provides a way to determine the current state of the WebSocket connection.
   * It checks if the WebSocket's readyState property is equal to WebSocket.OPEN,
   * which indicates an active connection.
   *
   * @returns {boolean} True if the WebSocket connection is open and active, false otherwise.
   */
  public isConnected(): boolean {
    return this.ws?.readyState === WebSocket.OPEN;
  }

  /**
   * Retrieves the current state of the WebSocket connection.
   *
   * This method provides a way to check the current state of the WebSocket connection.
   * It returns a number corresponding to one of the WebSocket readyState values:
   * - 0 (CONNECTING): The connection is not yet open.
   * - 1 (OPEN): The connection is open and ready to communicate.
   * - 2 (CLOSING): The connection is in the process of closing.
   * - 3 (CLOSED): The connection is closed or couldn't be opened.
   *
   * If the WebSocket instance doesn't exist, it returns WebSocket.CLOSED (3).
   *
   * @returns {number} A number representing the current state of the WebSocket connection.
   */
  public getState(): number {
    return this.ws?.readyState ?? WebSocket.CLOSED;
  }
}

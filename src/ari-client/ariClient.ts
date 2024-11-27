import { type IBackOffOptions, backOff } from "exponential-backoff";
import { BaseClient } from "./baseClient.js";
import type {
  Application,
  ApplicationDetails,
} from "./interfaces/applications.types";
import type {
  AsteriskInfo,
  Logging,
  Module,
  Variable,
} from "./interfaces/asterisk.types";
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
} from "./interfaces/channels.types";
import type {
  Endpoint,
  EndpointDetails,
} from "./interfaces/endpoints.types.js";
import type {
  Playback as APIPlayback,
  PlaybackControlRequest,
} from "./interfaces/playbacks.types";
import type { AriApplication, AriClientConfig } from "./interfaces/requests.js";
import type { Sound, SoundListRequest } from "./interfaces/sounds.types";
import { Applications } from "./resources/applications.js";
import { Asterisk } from "./resources/asterisk";
import { Channels } from "./resources/channels.js";
import { Endpoints } from "./resources/endpoints";
import { Playbacks } from "./resources/playbacks";
import { Sounds } from "./resources/sounds";
import { WebSocketClient } from "./websocketClient.js";

export class AriClient {
  private wsClient: WebSocketClient | null = null;
  private readonly baseClient: BaseClient;
  private isReconnecting = false;

  public channels: Channels;
  public endpoints: Endpoints;
  public applications: Applications;
  public playbacks: Playbacks;
  public sounds: Sounds;
  public asterisk: Asterisk;

  constructor(private config: AriClientConfig) {
    const httpProtocol = config.secure ? "https" : "http";
    const normalizedHost = config.host.replace(/^https?:\/\//, "");
    const baseUrl = `${httpProtocol}://${normalizedHost}:${config.port}/ari`;

    this.baseClient = new BaseClient(baseUrl, config.username, config.password);
    this.channels = new Channels(this.baseClient);
    this.endpoints = new Endpoints(this.baseClient);
    this.applications = new Applications(this.baseClient);
    this.playbacks = new Playbacks(this.baseClient);
    this.sounds = new Sounds(this.baseClient);
    this.asterisk = new Asterisk(this.baseClient);
  }

  /**
   * Connects to the ARI WebSocket for a specific application.
   *
   * @param app - The application name to connect to.
   * @returns {Promise<void>} Resolves when the WebSocket connects successfully.
   */
  async connectWebSocket(app: string): Promise<void> {
    if (!app) {
      throw new Error(
        "The 'app' parameter is required to connect to the WebSocket.",
      );
    }

    if (this.isReconnecting) {
      console.warn("Already attempting to reconnect. Skipping this attempt.");
      return;
    }

    this.isReconnecting = true;

    const protocol = this.config.secure ? "wss" : "ws";
    const wsUrl = `${protocol}://${encodeURIComponent(this.config.username)}:${encodeURIComponent(this.config.password)}@${
      this.config.host
    }:${this.config.port}/ari/events?app=${app}`;

    const backoffOptions: IBackOffOptions = {
      delayFirstAttempt: false,
      startingDelay: 1000,
      timeMultiple: 2,
      maxDelay: 30000,
      numOfAttempts: 10,
      jitter: "full",
      retry: (error: any, attemptNumber: number) => {
        console.warn(`Tentativa ${attemptNumber} falhou: ${error.message}`);
        return !this.wsClient?.isConnected();
      },
    };

    this.wsClient = new WebSocketClient(wsUrl);

    try {
      await backOff(async () => {
        if (!this.wsClient) {
          throw new Error("WebSocketClient instance is null.");
        }
        await this.wsClient.connect();
        console.log(`WebSocket conectado para o app: ${app}`);
        await this.ensureAppRegistered(app); // Verifica e registra o aplicativo
      }, backoffOptions);
    } catch (err) {
      console.error(
        "Não foi possível conectar ao WebSocket após múltiplas tentativas:",
        err,
      );
      throw err;
    } finally {
      this.isReconnecting = false;
    }
  }

  /**
   * Ensures the ARI application is registered.
   *
   * @param app - The application name to ensure is registered.
   * @returns {Promise<void>}
   */
  async ensureAppRegistered(app: string): Promise<void> {
    try {
      const apps = await this.baseClient.get<AriApplication[]>("/applications");
      const appExists = apps.some((a: { name: string }) => a.name === app);

      if (!appExists) {
        console.log(`Registrando o aplicativo ARI: ${app}`);
        await this.baseClient.post("/applications", { app });
        console.log(`Aplicativo ${app} registrado com sucesso.`);
      } else {
        console.log(`Aplicativo ${app} já está registrado.`);
      }
    } catch (error) {
      console.error(`Erro ao garantir o registro do aplicativo ${app}:`, error);
      throw error;
    }
  }

  /**
   * Checks if the WebSocket connection is active.
   *
   * @returns {boolean} True if connected, false otherwise.
   */
  isWebSocketConnected(): boolean {
    return this.wsClient ? this.wsClient.isConnected() : false;
  }

  /**
   * Registers a callback for a specific WebSocket event.
   *
   * @param event - The WebSocket event to listen for.
   * @param callback - The callback function to execute when the event occurs.
   */
  onWebSocketEvent(event: string, callback: (data: any) => void): void {
    if (!this.wsClient) {
      throw new Error("WebSocket is not connected.");
    }
    this.wsClient.on(event, callback);
  }

  /**
   * Closes the WebSocket connection.
   */
  closeWebSocket(): void {
    if (this.wsClient) {
      this.wsClient.close();
      this.wsClient = null;
    }
  }
  /**
   * Retrieves a list of active channels from the Asterisk ARI.
   *
   * @returns {Promise<Channel[]>} A promise resolving to the list of active channels.
   */
  /**
   * Lists all active channels.
   */
  async listChannels(): Promise<Channel[]> {
    return this.channels.list();
  }

  /**
   * Creates a new channel.
   */
  async originateChannel(data: OriginateRequest): Promise<Channel> {
    return this.channels.originate(data);
  }

  /**
   * Retrieves details of a specific channel.
   */
  async getChannelDetails(channelId: string): Promise<Channel> {
    return this.channels.getDetails(channelId);
  }

  /**
   * Hangs up a specific channel.
   */
  async hangupChannel(channelId: string): Promise<void> {
    return this.channels.hangup(channelId);
  }

  /**
   * Continues the dialplan for a specific channel.
   */
  async continueChannelDialplan(
    channelId: string,
    context?: string,
    extension?: string,
    priority?: number,
    label?: string,
  ): Promise<void> {
    return this.channels.continueDialplan(
      channelId,
      context,
      extension,
      priority,
      label,
    );
  }

  /**
   * Moves a channel to another Stasis application.
   */
  async moveChannelToApplication(
    channelId: string,
    app: string,
    appArgs?: string,
  ): Promise<void> {
    return this.channels.moveToApplication(channelId, app, appArgs);
  }

  /**
   * Sets a channel variable.
   */
  async setChannelVariable(
    channelId: string,
    variable: string,
    value: string,
  ): Promise<void> {
    return this.channels.setVariable(channelId, variable, value);
  }

  /**
   * Gets a channel variable.
   */
  async getChannelVariable(
    channelId: string,
    variable: string,
  ): Promise<ChannelVar> {
    return this.channels.getVariable(channelId, variable);
  }

  /**
   * Plays a media file to a channel.
   */
  async playMediaToChannel(
    channelId: string,
    media: string,
    options?: PlaybackOptions,
  ): Promise<ChannelPlayback> {
    return this.channels.playMedia(channelId, media, options);
  }

  /**
   * Starts music on hold for a channel.
   */
  async startChannelMusicOnHold(channelId: string): Promise<void> {
    return this.channels.startMusicOnHold(channelId);
  }

  /**
   * Stops music on hold for a channel.
   */
  async stopChannelMusicOnHold(channelId: string): Promise<void> {
    return this.channels.stopMusicOnHold(channelId);
  }

  /**
   * Starts playback of a media file on a channel.
   */
  async startChannelPlayback(
    channelId: string,
    media: string,
    options?: PlaybackOptions,
  ): Promise<ChannelPlayback> {
    return this.channels.startPlayback(channelId, media, options);
  }

  /**
   * Stops playback of a media file on a channel.
   */
  async stopChannelPlayback(
    channelId: string,
    playbackId: string,
  ): Promise<void> {
    return this.channels.stopPlayback(channelId, playbackId);
  }

  /**
   * Pauses playback of a media file on a channel.
   */
  async pauseChannelPlayback(
    channelId: string,
    playbackId: string,
  ): Promise<void> {
    return this.channels.pausePlayback(channelId, playbackId);
  }

  /**
   * Resumes playback of a media file on a channel.
   */
  async resumeChannelPlayback(
    channelId: string,
    playbackId: string,
  ): Promise<void> {
    return this.channels.resumePlayback(channelId, playbackId);
  }

  /**
   * Rewinds playback of a media file on a channel.
   */
  async rewindChannelPlayback(
    channelId: string,
    playbackId: string,
    skipMs: number,
  ): Promise<void> {
    return this.channels.rewindPlayback(channelId, playbackId, skipMs);
  }

  /**
   * Fast-forwards playback of a media file on a channel.
   */
  async fastForwardChannelPlayback(
    channelId: string,
    playbackId: string,
    skipMs: number,
  ): Promise<void> {
    return this.channels.fastForwardPlayback(channelId, playbackId, skipMs);
  }

  /**
   * Records audio from a channel.
   */
  async recordAudio(
    channelId: string,
    options: RecordingOptions,
  ): Promise<Channel> {
    return this.channels.record(channelId, options);
  }

  /**
   * Starts snooping on a channel.
   */
  async snoopChannel(
    channelId: string,
    options: SnoopOptions,
  ): Promise<Channel> {
    return this.channels.snoopChannel(channelId, options);
  }

  /**
   * Starts snooping on a channel with a specific snoop ID.
   */
  async snoopChannelWithId(
    channelId: string,
    snoopId: string,
    options: SnoopOptions,
  ): Promise<Channel> {
    return this.channels.snoopChannelWithId(channelId, snoopId, options);
  }

  /**
   * Dials a created channel.
   */
  async dialChannel(
    channelId: string,
    caller?: string,
    timeout?: number,
  ): Promise<void> {
    return this.channels.dial(channelId, caller, timeout);
  }

  /**
   * Retrieves RTP statistics for a channel.
   */
  async getRTPStatistics(channelId: string): Promise<RTPStats> {
    return this.channels.getRTPStatistics(channelId);
  }

  /**
   * Creates a channel to an external media source/sink.
   */
  async createExternalMedia(options: ExternalMediaOptions): Promise<Channel> {
    return this.channels.createExternalMedia(options);
  }

  /**
   * Redirects a channel to a different location.
   */
  async redirectChannel(channelId: string, endpoint: string): Promise<void> {
    return this.channels.redirectChannel(channelId, endpoint);
  }

  /**
   * Answers a channel.
   */
  async answerChannel(channelId: string): Promise<void> {
    return this.channels.answerChannel(channelId);
  }

  /**
   * Sends a ringing indication to a channel.
   */
  async ringChannel(channelId: string): Promise<void> {
    return this.channels.ringChannel(channelId);
  }

  /**
   * Stops ringing indication on a channel.
   */
  async stopRingChannel(channelId: string): Promise<void> {
    return this.channels.stopRingChannel(channelId);
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
    return this.channels.sendDTMF(channelId, dtmf, options);
  }

  /**
   * Mutes a channel.
   */
  async muteChannel(
    channelId: string,
    direction: "both" | "in" | "out" = "both",
  ): Promise<void> {
    return this.channels.muteChannel(channelId, direction);
  }

  /**
   * Unmutes a channel.
   */
  async unmuteChannel(
    channelId: string,
    direction: "both" | "in" | "out" = "both",
  ): Promise<void> {
    return this.channels.unmuteChannel(channelId, direction);
  }

  /**
   * Puts a channel on hold.
   */
  async holdChannel(channelId: string): Promise<void> {
    return this.channels.holdChannel(channelId);
  }

  /**
   * Removes a channel from hold.
   */
  async unholdChannel(channelId: string): Promise<void> {
    return this.channels.unholdChannel(channelId);
  }

  /**
   * Creates a new channel using the provided originate request data.
   *
   * @param data - The originate request data containing channel creation parameters.
   * @returns A promise that resolves to the created Channel object.
   */
  async createChannel(data: OriginateRequest): Promise<Channel> {
    return this.channels.createChannel(data);
  }

  /**
   * Hangs up a specific channel.
   *
   * @param channelId - The unique identifier of the channel to hang up.
   * @param options - Optional parameters for the hangup operation.
   * @param options.reason_code - An optional reason code for the hangup.
   * @param options.reason - An optional textual reason for the hangup.
   * @returns A promise that resolves when the hangup operation is complete.
   */
  async hangup(
    channelId: string,
    options?: { reason_code?: string; reason?: string },
  ): Promise<void> {
    return this.channels.hangup(channelId, options);
  }

  /**
   * Originates a new channel with a specified ID using the provided originate request data.
   *
   * @param channelId - The desired unique identifier for the new channel.
   * @param data - The originate request data containing channel creation parameters.
   * @returns A promise that resolves to the created Channel object.
   */
  async originateWithId(
    channelId: string,
    data: OriginateRequest,
  ): Promise<Channel> {
    return this.channels.originateWithId(channelId, data);
  }

  // Métodos relacionados a endpoints:

  /**
   * Lists all endpoints.
   *
   * @returns {Promise<Endpoint[]>} A promise resolving to the list of endpoints.
   */
  async listEndpoints(): Promise<Endpoint[]> {
    return this.endpoints.list();
  }

  /**
   * Retrieves details of a specific endpoint.
   *
   * @param technology - The technology of the endpoint.
   * @param resource - The resource name of the endpoint.
   * @returns {Promise<EndpointDetails>} A promise resolving to the details of the endpoint.
   */
  async getEndpointDetails(
    technology: string,
    resource: string,
  ): Promise<EndpointDetails> {
    return this.endpoints.getDetails(technology, resource);
  }

  /**
   * Sends a message to an endpoint.
   *
   * @param technology - The technology of the endpoint.
   * @param resource - The resource name of the endpoint.
   * @param body - The message body to send.
   * @returns {Promise<void>} A promise resolving when the message is sent.
   */
  async sendMessageToEndpoint(
    technology: string,
    resource: string,
    body: any,
  ): Promise<void> {
    return this.endpoints.sendMessage(technology, resource, body);
  }

  // Métodos relacionados a applications
  /**
   * Lists all applications.
   *
   * @returns {Promise<Application[]>} A promise resolving to the list of applications.
   */
  async listApplications(): Promise<Application[]> {
    return this.applications.list();
  }

  /**
   * Retrieves details of a specific application.
   *
   * @param appName - The name of the application.
   * @returns {Promise<ApplicationDetails>} A promise resolving to the application details.
   */
  async getApplicationDetails(appName: string): Promise<ApplicationDetails> {
    return this.applications.getDetails(appName);
  }

  /**
   * Sends a message to a specific application.
   *
   * @param appName - The name of the application.
   * @param body - The message body to send.
   * @returns {Promise<void>} A promise resolving when the message is sent successfully.
   */
  async sendMessageToApplication(appName: string, body: any): Promise<void> {
    return this.applications.sendMessage(appName, body);
  }

  // Métodos relacionados a playbacks
  /**
   * Retrieves details of a specific playback.
   *
   * @param playbackId - The unique identifier of the playback.
   * @returns {Promise<Playback>} A promise resolving to the playback details.
   */
  async getPlaybackDetails(playbackId: string): Promise<APIPlayback> {
    return this.playbacks.getDetails(playbackId);
  }

  /**
   * Controls a specific playback.
   *
   * @param playbackId - The unique identifier of the playback.
   * @param controlRequest - The PlaybackControlRequest containing the control operation.
   * @returns {Promise<void>} A promise resolving when the control operation is successfully executed.
   */
  async controlPlayback(
    playbackId: string,
    controlRequest: PlaybackControlRequest,
  ): Promise<void> {
    return this.playbacks.control(playbackId, controlRequest);
  }

  /**
   * Stops a specific playback.
   *
   * @param playbackId - The unique identifier of the playback.
   * @returns {Promise<void>} A promise resolving when the playback is successfully stopped.
   */
  async stopPlayback(playbackId: string): Promise<void> {
    return this.playbacks.stop(playbackId);
  }

  /**
   * Lists all available sounds.
   *
   * @param params - Optional parameters to filter the list of sounds.
   * @returns {Promise<Sound[]>} A promise resolving to the list of sounds.
   */
  async listSounds(params?: SoundListRequest): Promise<Sound[]> {
    return this.sounds.list(params);
  }

  /**
   * Retrieves details of a specific sound.
   *
   * @param soundId - The unique identifier of the sound.
   * @returns {Promise<Sound>} A promise resolving to the sound details.
   */
  async getSoundDetails(soundId: string): Promise<Sound> {
    return this.sounds.getDetails(soundId);
  }

  /**
   * Retrieves information about the Asterisk server.
   */
  async getAsteriskInfo(): Promise<AsteriskInfo> {
    return this.asterisk.getInfo();
  }

  /**
   * Lists all loaded modules in the Asterisk server.
   */
  async listModules(): Promise<Module[]> {
    return this.asterisk.listModules();
  }

  /**
   * Manages a specific module in the Asterisk server.
   */
  async manageModule(
    moduleName: string,
    action: "load" | "unload" | "reload",
  ): Promise<void> {
    return this.asterisk.manageModule(moduleName, action);
  }

  /**
   * Retrieves all configured logging channels.
   */
  async listLoggingChannels(): Promise<Logging[]> {
    return this.asterisk.listLoggingChannels();
  }

  /**
   * Adds or removes a log channel in the Asterisk server.
   */
  async manageLogChannel(
    logChannelName: string,
    action: "add" | "remove",
    configuration?: { type?: string; configuration?: string },
  ): Promise<void> {
    return this.asterisk.manageLogChannel(
      logChannelName,
      action,
      configuration,
    );
  }

  /**
   * Retrieves the value of a global variable.
   */
  async getGlobalVariable(variableName: string): Promise<Variable> {
    return this.asterisk.getGlobalVariable(variableName);
  }

  /**
   * Sets a global variable.
   */
  async setGlobalVariable(variableName: string, value: string): Promise<void> {
    return this.asterisk.setGlobalVariable(variableName, value);
  }
}

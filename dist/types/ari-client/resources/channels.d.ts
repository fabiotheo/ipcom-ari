import type { AriClient } from "../ariClient";
import type { BaseClient } from "../baseClient.js";
import type { Channel, ChannelPlayback, ChannelVar, ExternalMediaOptions, OriginateRequest, PlaybackOptions, RTPStats, RecordingOptions, SnoopOptions, WebSocketEvent } from "../interfaces";
import type { PlaybackInstance } from "./playbacks";
export declare class ChannelInstance {
    private client;
    private baseClient;
    private channelId;
    private eventEmitter;
    private channelData;
    id: string;
    constructor(client: AriClient, baseClient: BaseClient, channelId?: string);
    /**
     * Registra um listener para eventos específicos deste canal.
     */
    on<T extends WebSocketEvent["type"]>(event: T, listener: (data: Extract<WebSocketEvent, {
        type: T;
    }>) => void): void;
    /**
     * Registra um listener único para eventos específicos deste canal.
     */
    once<T extends WebSocketEvent["type"]>(event: T, listener: (data: Extract<WebSocketEvent, {
        type: T;
    }>) => void): void;
    /**
     * Remove um listener para eventos específicos deste canal.
     */
    off<T extends WebSocketEvent["type"]>(event: T, listener?: (data: Extract<WebSocketEvent, {
        type: T;
    }>) => void): void;
    /**
     * Obtém a quantidade de listeners registrados para o evento especificado.
     */
    getListenerCount(event: string): number;
    /**
     * Emite eventos internamente para o canal.
     * Verifica o ID do canal antes de emitir.
     */
    emitEvent(event: WebSocketEvent): void;
    /**
     * Remove todos os listeners para este canal.
     */
    removeAllListeners(): void;
    answer(): Promise<void>;
    /**
     * Origina um canal físico no Asterisk.
     */
    originate(data: OriginateRequest): Promise<Channel>;
    /**
     * Obtém os detalhes do canal.
     */
    getDetails(): Promise<Channel>;
    getVariable(variable: string): Promise<ChannelVar>;
    /**
     * Encerra o canal, se ele já foi criado.
     */
    hangup(): Promise<void>;
    /**
     * Reproduz mídia no canal.
     */
    play(options: {
        media: string;
        lang?: string;
    }, playbackId?: string): Promise<PlaybackInstance>;
    /**
     * Reproduz mídia em um canal.
     */
    playMedia(media: string, options?: PlaybackOptions): Promise<ChannelPlayback>;
    /**
     * Para a reprodução de mídia.
     */
    stopPlayback(playbackId: string): Promise<void>;
    /**
     * Pausa a reprodução de mídia.
     */
    pausePlayback(playbackId: string): Promise<void>;
    /**
     * Retoma a reprodução de mídia.
     */
    resumePlayback(playbackId: string): Promise<void>;
    /**
     * Retrocede a reprodução de mídia.
     */
    rewindPlayback(playbackId: string, skipMs: number): Promise<void>;
    /**
     * Avança a reprodução de mídia.
     */
    fastForwardPlayback(playbackId: string, skipMs: number): Promise<void>;
    /**
     * Muta o canal.
     */
    muteChannel(direction?: "both" | "in" | "out"): Promise<void>;
    /**
     * Desmuta o canal.
     */
    unmuteChannel(direction?: "both" | "in" | "out"): Promise<void>;
    /**
     * Coloca o canal em espera.
     */
    holdChannel(): Promise<void>;
    /**
     * Remove o canal da espera.
     */
    unholdChannel(): Promise<void>;
}
export declare class Channels {
    private baseClient;
    private client;
    private channelInstances;
    constructor(baseClient: BaseClient, client: AriClient);
    Channel({ id }: {
        id?: string;
    }): ChannelInstance;
    /**
     * Remove uma instância de canal.
     */
    removeChannelInstance(channelId: string): void;
    /**
     * Propaga eventos do WebSocket para o canal correspondente.
     */
    propagateEventToChannel(event: WebSocketEvent): void;
    /**
     * Origina um canal físico diretamente, sem uma instância de `ChannelInstance`.
     */
    originate(data: OriginateRequest): Promise<Channel>;
    /**
     * Obtém detalhes de um canal específico.
     */
    getDetails(channelId: string): Promise<Channel>;
    /**
     * Lista todos os canais ativos.
     */
    list(): Promise<Channel[]>;
    /**
     * Encerra um canal específico.
     */
    hangup(channelId: string, options?: {
        reason_code?: string;
        reason?: string;
    }): Promise<void>;
    /**
     * Inicia a escuta em um canal.
     */
    snoopChannel(channelId: string, options: SnoopOptions): Promise<Channel>;
    startSilence(channelId: string): Promise<void>;
    stopSilence(channelId: string): Promise<void>;
    getRTPStatistics(channelId: string): Promise<RTPStats>;
    createExternalMedia(options: ExternalMediaOptions): Promise<Channel>;
    playWithId(channelId: string, playbackId: string, media: string, options?: PlaybackOptions): Promise<ChannelPlayback>;
    snoopChannelWithId(channelId: string, snoopId: string, options: SnoopOptions): Promise<Channel>;
    startMohWithClass(channelId: string, mohClass: string): Promise<void>;
    getChannelVariable(channelId: string, variable: string): Promise<ChannelVar>;
    setChannelVariable(channelId: string, variable: string, value?: string): Promise<void>;
    moveToApplication(channelId: string, app: string, appArgs?: string): Promise<void>;
    continueDialplan(channelId: string, context?: string, extension?: string, priority?: number, label?: string): Promise<void>;
    stopMusicOnHold(channelId: string): Promise<void>;
    startMusicOnHold(channelId: string): Promise<void>;
    record(channelId: string, options: RecordingOptions): Promise<Channel>;
    dial(channelId: string, caller?: string, timeout?: number): Promise<void>;
    redirectChannel(channelId: string, endpoint: string): Promise<void>;
    answerChannel(channelId: string): Promise<void>;
    ringChannel(channelId: string): Promise<void>;
    stopRingChannel(channelId: string): Promise<void>;
    sendDTMF(channelId: string, dtmf: string, options?: {
        before?: number;
        between?: number;
        duration?: number;
        after?: number;
    }): Promise<void>;
    muteChannel(channelId: string, direction?: "both" | "in" | "out"): Promise<void>;
    unmuteChannel(channelId: string, direction?: "both" | "in" | "out"): Promise<void>;
    holdChannel(channelId: string): Promise<void>;
    unholdChannel(channelId: string): Promise<void>;
    createChannel(data: OriginateRequest): Promise<Channel>;
    originateWithId(channelId: string, data: OriginateRequest): Promise<Channel>;
}
//# sourceMappingURL=channels.d.ts.map
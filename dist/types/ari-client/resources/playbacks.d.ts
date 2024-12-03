import type { AriClient } from "../ariClient";
import type { BaseClient } from "../baseClient.js";
import type { Playback, WebSocketEvent } from "../interfaces";
export declare class PlaybackInstance {
    private client;
    private baseClient;
    private playbackId;
    private eventEmitter;
    private playbackData;
    id: string;
    constructor(client: AriClient, baseClient: BaseClient, playbackId?: string);
    /**
     * Registra um listener para eventos específicos deste playback.
     */
    on<T extends WebSocketEvent["type"]>(event: T, listener: (data: Extract<WebSocketEvent, {
        type: T;
    }>) => void): void;
    /**
     * Registra um listener único para eventos específicos deste playback.
     */
    once<T extends WebSocketEvent["type"]>(event: T, listener: (data: Extract<WebSocketEvent, {
        type: T;
    }>) => void): void;
    /**
     * Remove um listener para eventos específicos deste playback.
     */
    off<T extends WebSocketEvent["type"]>(event: T, listener?: (data: Extract<WebSocketEvent, {
        type: T;
    }>) => void): void;
    /**
     * Emite eventos internamente para o playback.
     */
    emitEvent(event: WebSocketEvent): void;
    /**
     * Obtém os detalhes do playback.
     */
    get(): Promise<Playback>;
    /**
     * Controla o playback.
     */
    control(operation: "pause" | "unpause" | "reverse" | "forward"): Promise<void>;
    /**
     * Encerra o playback.
     */
    stop(): Promise<void>;
    /**
     * Remove todos os listeners para este playback.
     */
    removeAllListeners(): void;
}
export declare class Playbacks {
    private baseClient;
    private client;
    private playbackInstances;
    constructor(baseClient: BaseClient, client: AriClient);
    /**
     * Gerencia instâncias de playback.
     */
    Playback({ id }: {
        id?: string;
    }): PlaybackInstance;
    /**
     * Remove uma instância de playback.
     */
    removePlaybackInstance(playbackId: string): void;
    /**
     * Propaga eventos do WebSocket para o playback correspondente.
     */
    propagateEventToPlayback(event: WebSocketEvent): void;
    /**
     * Obtém detalhes de um playback específico.
     */
    getDetails(playbackId: string): Promise<Playback>;
    /**
     * Controla um playback específico.
     */
    control(playbackId: string, operation: "pause" | "unpause" | "reverse" | "forward"): Promise<void>;
    /**
     * Encerra um playback específico.
     */
    stop(playbackId: string): Promise<void>;
}
//# sourceMappingURL=playbacks.d.ts.map
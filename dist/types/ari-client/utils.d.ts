import type { Channel, WebSocketEvent } from './interfaces';
export declare function toQueryParams<T>(options: T): string;
export declare function isPlaybackEvent(event: WebSocketEvent, playbackId?: string): event is Extract<WebSocketEvent, {
    playbackId: string;
}>;
/**
 * Verifica se um evento pertence a um canal e opcionalmente valida o ID do canal.
 * @param event O evento WebSocket a ser validado.
 * @param channelId Opcional. O ID do canal a ser validado.
 * @returns Verdadeiro se o evento é relacionado a um canal (e ao ID, se fornecido).
 */
export declare function isChannelEvent(event: WebSocketEvent, channelId?: string): event is Extract<WebSocketEvent, {
    channel: Channel;
}>;
export declare const channelEvents: string[];
//# sourceMappingURL=utils.d.ts.map
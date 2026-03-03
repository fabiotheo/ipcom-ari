import type { AriEventMap, WebSocketEvent } from './events.types';

export type WebSocketEventListener = (data: WebSocketEvent) => void;

/**
 * Tipo específico para um listener de um tipo de evento específico
 */
export type TypedWebSocketEventListener<K extends keyof AriEventMap> = (
  data: AriEventMap[K]
) => void;

import type { WebSocketEvent } from './events.types';

export type WebSocketEventListener = (data: WebSocketEvent) => void;

/**
 * Tipo específico para um listener de um tipo de evento específico
 */
export type TypedWebSocketEventListener<T extends WebSocketEvent['type']> = (
  data: Extract<WebSocketEvent, { type: T }>
) => void;

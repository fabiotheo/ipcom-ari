import type { Channel, Playback, WebSocketEvent } from "./interfaces";

export function toQueryParams<T>(options: T): string {
  return new URLSearchParams(
    Object.entries(options as Record<string, string>)
      .filter(([, value]) => value !== undefined)
      .map(([key, value]) => [key, value as string]),
  ).toString();
}

export function isPlaybackEvent(
  event: WebSocketEvent,
  playbackId?: string,
): event is Extract<WebSocketEvent, { playbackId: string }> {
  const hasPlayback = "playback" in event && event.playback?.id !== undefined;
  return hasPlayback && (!playbackId || event.playback?.id === playbackId);
}

/**
 * Verifica se um evento pertence a um canal e opcionalmente valida o ID do canal.
 * @param event O evento WebSocket a ser validado.
 * @param channelId Opcional. O ID do canal a ser validado.
 * @returns Verdadeiro se o evento é relacionado a um canal (e ao ID, se fornecido).
 */
export function isChannelEvent(
  event: WebSocketEvent,
  channelId?: string,
): event is Extract<WebSocketEvent, { channel: Channel }> {
  // Verifica se o evento tem a propriedade `channel`
  const hasChannel = "channel" in event && event.channel?.id !== undefined;

  return hasChannel && (!channelId || event.channel?.id === channelId);
}

export const channelEvents = [
  "ChannelCreated",
  "ChannelDestroyed",
  "ChannelEnteredBridge",
  "ChannelLeftBridge",
  "ChannelStateChange",
  "ChannelDtmfReceived",
  "ChannelDialplan",
  "ChannelCallerId",
  "ChannelUserevent",
  "ChannelHangupRequest",
  "ChannelVarset",
  "ChannelTalkingStarted",
  "ChannelTalkingFinished",
  "ChannelHold",
  "ChannelUnhold",
];

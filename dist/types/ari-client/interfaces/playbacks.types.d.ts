/**
 * Representa os detalhes de um Playback no Asterisk.
 */
export interface Playback {
    id: string;
    media_uri: string;
    next_media_uri?: string;
    target_uri: string;
    language?: string;
    state: 'queued' | 'playing' | 'paused' | 'stopped' | 'done' | 'failed';
}
/**
 * Define as operações disponíveis para controlar um Playback.
 */
export interface PlaybackControlRequest {
    operation: 'pause' | 'unpause' | 'reverse' | 'forward';
}
//# sourceMappingURL=playbacks.types.d.ts.map
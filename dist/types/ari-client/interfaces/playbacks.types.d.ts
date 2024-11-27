export interface Playback {
    id: string;
    media_uri: string;
    state: "playing" | "paused" | "stopped" | "failed";
    target_uri: string;
    language: string;
}
export interface PlaybackControlRequest {
    operation: "pause" | "unpause" | "rewind" | "fastforward" | "stop";
}
//# sourceMappingURL=playbacks.types.d.ts.map
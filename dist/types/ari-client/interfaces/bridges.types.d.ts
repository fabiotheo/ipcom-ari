export interface Bridge {
    id: string;
    technology: string;
    bridge_type: "mixing" | "holding" | "dtmf_events" | "proxy_media";
    bridge_class?: string;
    creator?: string;
    name?: string;
    channels?: string[];
    creationtime?: string;
    video_mode?: "none" | "talker" | "single";
    video_source_id?: string;
}
export interface CreateBridgeRequest {
    type: "mixing" | "holding" | "dtmf_events" | "proxy_media";
    name?: string;
    bridgeId?: string;
}
export interface AddChannelRequest {
    channel: string | string[];
    role?: "participant" | "announcer";
}
export interface RemoveChannelRequest {
    channel: string | string[];
}
export interface PlayMediaRequest {
    media: string;
    lang?: string;
    offsetms?: number;
    skipms?: number;
    playbackId?: string;
}
export interface BridgePlayback {
    id: string;
    media_uri: string;
    state: "queued" | "playing" | "done" | "failed";
    bridge: Bridge;
}
//# sourceMappingURL=bridges.types.d.ts.map
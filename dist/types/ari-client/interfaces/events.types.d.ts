import type { ChannelInstance } from '../resources/channels';
import type { PlaybackInstance, Playbacks } from '../resources/playbacks';
import type { Bridge } from './bridges.types';
import type { Channel } from './channels.types';
import type { Playback } from './playbacks.types';
export type ChannelEvent = Extract<WebSocketEvent, {
    channel: Channel;
}>;
export type PlaybackEvent = Extract<WebSocketEvent, {
    playback: Playback;
}>;
export type BridgeEvent = Extract<WebSocketEvent, {
    bridge: Bridge;
}>;
export type WebSocketEventType = 'DeviceStateChanged' | 'PlaybackStarted' | 'PlaybackContinuing' | 'PlaybackFinished' | 'RecordingStarted' | 'RecordingFinished' | 'RecordingFailed' | 'ApplicationMoveFailed' | 'ApplicationReplaced' | 'BridgeCreated' | 'BridgeDestroyed' | 'BridgeMerged' | 'BridgeBlindTransfer' | 'BridgeAttendedTransfer' | 'BridgeVideoSourceChanged' | 'ChannelCreated' | 'ChannelDestroyed' | 'ChannelEnteredBridge' | 'ChannelLeftBridge' | 'ChannelStateChange' | 'ChannelDtmfReceived' | 'ChannelDialplan' | 'ChannelCallerId' | 'ChannelUserevent' | 'ChannelHangupRequest' | 'ChannelVarset' | 'ChannelTalkingStarted' | 'ChannelTalkingFinished' | 'ChannelHold' | 'ChannelUnhold' | 'ContactStatusChange' | 'EndpointStateChange' | 'Dial' | 'StasisEnd' | 'StasisStart' | 'TextMessageReceived' | 'ChannelConnectedLine' | 'PeerStatusChange';
export declare const bridgeEvents: string[];
export type ChannelDtmfReceived = Extract<WebSocketEvent, {
    type: 'ChannelDtmfReceived';
}>;
export type ChannelDialplanEvent = Extract<WebSocketEvent, {
    type: 'ChannelDialplan';
}>;
export type ChannelVarset = Extract<WebSocketEvent, {
    type: 'ChannelVarset';
}>;
export type StasisStart = Extract<WebSocketEvent, {
    type: 'StasisStart';
}>;
export type PlaybackStarted = Extract<WebSocketEvent, {
    type: 'PlaybackStarted';
}>;
export type PlaybackContinuing = Extract<WebSocketEvent, {
    type: 'PlaybackContinuing';
}>;
export type PlaybackFinished = Extract<WebSocketEvent, {
    type: 'PlaybackFinished';
}>;
export type BridgeCreated = Extract<WebSocketEvent, {
    type: 'BridgeCreated';
}>;
export type BridgeDestroyed = Extract<WebSocketEvent, {
    type: 'BridgeDestroyed';
}>;
export type ChannelCreated = Extract<WebSocketEvent, {
    type: 'ChannelCreated';
}>;
export type ChannelDestroyed = Extract<WebSocketEvent, {
    type: 'ChannelDestroyed';
}>;
export type ApplicationMoveFailed = Extract<WebSocketEvent, {
    type: 'ApplicationMoveFailed';
}>;
export type RecordingStarted = Extract<WebSocketEvent, {
    type: 'RecordingStarted';
}>;
export type RecordingFinished = Extract<WebSocketEvent, {
    type: 'RecordingFinished';
}>;
export type RecordingFailed = Extract<WebSocketEvent, {
    type: 'RecordingFailed';
}>;
export type DeviceStateChanged = Extract<WebSocketEvent, {
    type: 'DeviceStateChanged';
}>;
export type BridgeMerged = Extract<WebSocketEvent, {
    type: 'BridgeMerged';
}>;
export type BridgeBlindTransfer = Extract<WebSocketEvent, {
    type: 'BridgeBlindTransfer';
}>;
export type BridgeAttendedTransfer = Extract<WebSocketEvent, {
    type: 'BridgeAttendedTransfer';
}>;
export type BridgeVideoSourceChanged = Extract<WebSocketEvent, {
    type: 'BridgeVideoSourceChanged';
}>;
export type ChannelEnteredBridge = Extract<WebSocketEvent, {
    type: 'ChannelEnteredBridge';
}>;
export type ChannelLeftBridge = Extract<WebSocketEvent, {
    type: 'ChannelLeftBridge';
}>;
export type ChannelStateChange = Extract<WebSocketEvent, {
    type: 'ChannelStateChange';
}>;
export type ChannelTalkingStarted = Extract<WebSocketEvent, {
    type: 'ChannelTalkingStarted';
}>;
export type ChannelTalkingFinished = Extract<WebSocketEvent, {
    type: 'ChannelTalkingFinished';
}>;
export type ChannelUnhold = Extract<WebSocketEvent, {
    type: 'ChannelUnhold';
}>;
export type ChannelHold = Extract<WebSocketEvent, {
    type: 'ChannelHold';
}>;
export type ContactStatusChange = Extract<WebSocketEvent, {
    type: 'ContactStatusChange';
}>;
export type EndpointStateChange = Extract<WebSocketEvent, {
    type: 'EndpointStateChange';
}>;
export type Dial = Extract<WebSocketEvent, {
    type: 'Dial';
}>;
export type StasisEnd = Extract<WebSocketEvent, {
    type: 'StasisEnd';
}>;
export type TextMessageReceived = Extract<WebSocketEvent, {
    type: 'TextMessageReceived';
}>;
export type ChannelConnectedLine = Extract<WebSocketEvent, {
    type: 'ChannelConnectedLine';
}>;
export type ChannelHangupRequest = Extract<WebSocketEvent, {
    type: 'ChannelHangupRequest';
}>;
export type PeerStatusChange = Extract<WebSocketEvent, {
    type: 'PeerStatusChange';
}>;
export type WebSocketEvent = {
    type: 'ChannelDtmfReceived';
    digit: string;
    duration_ms: number;
    channel: Channel;
    instanceChannel?: ChannelInstance;
    application: string;
} | {
    type: 'ChannelDialplan';
    channel: Channel;
    instanceChannel?: ChannelInstance;
    dialplan_app: string;
    dialplan_app_data: string;
    application: string;
} | {
    type: 'ChannelVarset';
    variable: string;
    value: string;
    channel?: Channel;
    application: string;
    instanceChannel?: ChannelInstance;
} | {
    type: 'StasisStart';
    args: string[];
    channel: Channel;
    instanceChannel?: ChannelInstance;
    replace_channel?: Channel;
    application: string;
} | {
    type: 'PlaybackStarted';
    playback: Playbacks;
    asterisk_id: string;
    application: string;
    instancePlayback?: PlaybackInstance;
} | {
    type: 'PlaybackContinuing';
    playback: Playbacks;
    playbackId: string;
    asterisk_id: string;
    application: string;
    instancePlayback?: PlaybackInstance;
} | {
    type: 'PlaybackFinished';
    playback: Playbacks;
    playbackId: string;
    asterisk_id: string;
    application: string;
    instancePlayback?: PlaybackInstance;
} | {
    type: 'BridgeCreated';
    bridgeId: string;
    bridgeType: string;
    channels: Channel[];
    application: string;
} | {
    type: 'BridgeDestroyed';
    bridgeId: string;
    application: string;
} | {
    type: 'ChannelCreated';
    channel: Channel;
    instanceChannel?: ChannelInstance;
    application: string;
} | {
    type: 'ChannelDestroyed';
    channel: Channel;
    instanceChannel?: ChannelInstance;
    application: string;
} | {
    type: 'ApplicationMoveFailed';
    application: string;
    channel: Channel;
    instanceChannel?: ChannelInstance;
} | {
    type: 'RecordingStarted';
    recordingId: string;
    name: string;
    application: string;
} | {
    type: 'RecordingFinished';
    recordingId: string;
    name: string;
    application: string;
    recording: {
        name: string;
        format: string;
        state: string;
        target_uri: string;
        duration: number;
        talking_duration: number;
        silence_duration: number;
    };
} | {
    type: 'RecordingFailed';
    recordingId: string;
    name: string;
    reason: string;
    application: string;
} | {
    type: 'DeviceStateChanged';
    device: string;
    state: string;
    application: string;
} | {
    type: 'BridgeMerged';
    bridgeId: string;
    bridges: string[];
    application: string;
} | {
    type: 'BridgeBlindTransfer';
    bridgeId: string;
    channel: Channel;
    instanceChannel?: ChannelInstance;
    transferee: Channel;
    application: string;
} | {
    type: 'BridgeAttendedTransfer';
    bridgeId: string;
    transferer: Channel;
    transferee: Channel;
    destination: Channel;
    application: string;
} | {
    type: 'BridgeVideoSourceChanged';
    bridgeId: string;
    old_video_source_id?: string;
    new_video_source_id: string;
    application: string;
} | {
    type: 'ChannelEnteredBridge';
    bridgeId: string;
    channel: Channel;
    instanceChannel?: ChannelInstance;
    application: string;
} | {
    type: 'ChannelLeftBridge';
    bridgeId: string;
    channel: Channel;
    instanceChannel?: ChannelInstance;
    application: string;
} | {
    type: 'ChannelStateChange';
    channel: Channel;
    instanceChannel?: ChannelInstance;
    application: string;
} | {
    type: 'ChannelTalkingStarted';
    channel: Channel;
    instanceChannel?: ChannelInstance;
    application: string;
} | {
    type: 'ChannelTalkingFinished';
    channel: Channel;
    instanceChannel?: ChannelInstance;
    application: string;
} | {
    type: 'ChannelUnhold';
    channel: Channel;
    instanceChannel?: ChannelInstance;
    application: string;
} | {
    type: 'ChannelHold';
    channel: Channel;
    instanceChannel?: ChannelInstance;
    application: string;
} | {
    type: 'ContactStatusChange';
    contact_info: Record<string, any>;
    status: string;
    aor?: string;
    application: string;
} | {
    type: 'EndpointStateChange';
    endpoint: Record<string, any>;
    state: string;
    application: string;
} | {
    type: 'Dial';
    caller: Channel;
    peer: Channel;
    dialstring?: string;
    application: string;
} | {
    type: 'StasisEnd';
    channel: Channel;
    instanceChannel?: ChannelInstance;
    application: string;
} | {
    type: 'TextMessageReceived';
    to: string;
    from: string;
    body: string;
    variables?: Record<string, any>;
    application: string;
} | {
    type: 'ChannelConnectedLine';
    channel: Channel;
    instanceChannel?: ChannelInstance;
    application: string;
} | {
    type: 'ChannelHangupRequest';
    cause: number;
    soft: boolean;
    channel: Channel;
    instanceChannel?: ChannelInstance;
    application: string;
} | {
    type: 'PeerStatusChange';
    peer: string;
    peer_status: string;
    application: string;
} | {
    type: string;
    [key: string]: any;
};
//# sourceMappingURL=events.types.d.ts.map
/* eslint-disable @typescript-eslint/no-explicit-any */
import type { BridgeInstance } from '../resources/bridges';
import type { ChannelInstance } from '../resources/channels';
import type { PlaybackInstance } from '../resources/playbacks';
import type { Bridge } from './bridges.types';
import type { Channel } from './channels.types';
import type { Playback } from './playbacks.types';

/**
 * Event Map interface that maps each ARI event name to its payload.
 * Extensible via declaration merging for custom events.
 */
export interface AriEventMap {
  ChannelDtmfReceived: {
    type: 'ChannelDtmfReceived';
    digit: string;
    duration_ms: number;
    channel: Channel;
    instanceChannel?: ChannelInstance;
    application: string;
  };
  ChannelDialplan: {
    type: 'ChannelDialplan';
    channel: Channel;
    instanceChannel?: ChannelInstance;
    dialplan_app: string;
    dialplan_app_data: string;
    application: string;
  };
  ChannelVarset: {
    type: 'ChannelVarset';
    variable: string;
    value: string;
    channel?: Channel;
    application: string;
    instanceChannel?: ChannelInstance;
  };
  StasisStart: {
    type: 'StasisStart';
    args: string[];
    channel: Channel;
    instanceChannel?: ChannelInstance;
    replace_channel?: Channel;
    application: string;
  };
  PlaybackStarted: {
    type: 'PlaybackStarted';
    playback: Playback;
    asterisk_id: string;
    application: string;
    instancePlayback?: PlaybackInstance;
  };
  PlaybackContinuing: {
    type: 'PlaybackContinuing';
    playback: Playback;
    playbackId: string;
    asterisk_id: string;
    application: string;
    instancePlayback?: PlaybackInstance;
  };
  PlaybackFinished: {
    type: 'PlaybackFinished';
    playback: Playback;
    playbackId: string;
    asterisk_id: string;
    application: string;
    instancePlayback?: PlaybackInstance;
  };
  BridgeCreated: {
    type: 'BridgeCreated';
    bridge?: Bridge;
    instanceBridge?: BridgeInstance;
    bridgeId: string;
    bridgeType: string;
    channels: Channel[];
    application: string;
  };
  BridgeDestroyed: {
    type: 'BridgeDestroyed';
    bridge?: Bridge;
    instanceBridge?: BridgeInstance;
    bridgeId: string;
    application: string;
  };
  ChannelCreated: {
    type: 'ChannelCreated';
    channel: Channel;
    instanceChannel?: ChannelInstance;
    application: string;
  };
  ChannelDestroyed: {
    type: 'ChannelDestroyed';
    channel: Channel;
    instanceChannel?: ChannelInstance;
    application: string;
  };
  ApplicationMoveFailed: {
    type: 'ApplicationMoveFailed';
    application: string;
    channel: Channel;
    instanceChannel?: ChannelInstance;
  };
  ApplicationReplaced: {
    type: 'ApplicationReplaced';
    application: string;
  };
  RecordingStarted: {
    type: 'RecordingStarted';
    recordingId: string;
    name: string;
    application: string;
  };
  RecordingFinished: {
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
  };
  RecordingFailed: {
    type: 'RecordingFailed';
    recordingId: string;
    name: string;
    reason: string;
    application: string;
  };
  DeviceStateChanged: {
    type: 'DeviceStateChanged';
    device: string;
    state: string;
    application: string;
  };
  BridgeMerged: {
    type: 'BridgeMerged';
    bridge?: Bridge;
    instanceBridge?: BridgeInstance;
    bridgeId: string;
    bridges: string[];
    application: string;
  };
  BridgeBlindTransfer: {
    type: 'BridgeBlindTransfer';
    bridge?: Bridge;
    instanceBridge?: BridgeInstance;
    bridgeId: string;
    channel: Channel;
    instanceChannel?: ChannelInstance;
    transferee: Channel;
    application: string;
  };
  BridgeAttendedTransfer: {
    type: 'BridgeAttendedTransfer';
    bridge?: Bridge;
    instanceBridge?: BridgeInstance;
    bridgeId: string;
    transferer: Channel;
    transferee: Channel;
    destination: Channel;
    application: string;
  };
  BridgeVideoSourceChanged: {
    type: 'BridgeVideoSourceChanged';
    bridge?: Bridge;
    instanceBridge?: BridgeInstance;
    bridgeId: string;
    old_video_source_id?: string;
    new_video_source_id: string;
    application: string;
  };
  ChannelEnteredBridge: {
    type: 'ChannelEnteredBridge';
    bridge?: Bridge;
    instanceBridge?: BridgeInstance;
    bridgeId: string;
    channel: Channel;
    instanceChannel?: ChannelInstance;
    application: string;
  };
  ChannelLeftBridge: {
    type: 'ChannelLeftBridge';
    bridge?: Bridge;
    instanceBridge?: BridgeInstance;
    bridgeId: string;
    channel: Channel;
    instanceChannel?: ChannelInstance;
    application: string;
  };
  ChannelStateChange: {
    type: 'ChannelStateChange';
    channel: Channel;
    instanceChannel?: ChannelInstance;
    application: string;
  };
  ChannelTalkingStarted: {
    type: 'ChannelTalkingStarted';
    channel: Channel;
    instanceChannel?: ChannelInstance;
    application: string;
  };
  ChannelTalkingFinished: {
    type: 'ChannelTalkingFinished';
    channel: Channel;
    instanceChannel?: ChannelInstance;
    application: string;
  };
  ChannelUnhold: {
    type: 'ChannelUnhold';
    channel: Channel;
    instanceChannel?: ChannelInstance;
    application: string;
  };
  ChannelHold: {
    type: 'ChannelHold';
    channel: Channel;
    instanceChannel?: ChannelInstance;
    application: string;
  };
  ContactStatusChange: {
    type: 'ContactStatusChange';
    contact_info: Record<string, any>;
    status: string;
    aor?: string;
    application: string;
  };
  EndpointStateChange: {
    type: 'EndpointStateChange';
    endpoint: Record<string, any>;
    state: string;
    application: string;
  };
  Dial: {
    type: 'Dial';
    caller: Channel;
    peer: Channel;
    dialstring?: string;
    application: string;
  };
  StasisEnd: {
    type: 'StasisEnd';
    channel: Channel;
    instanceChannel?: ChannelInstance;
    application: string;
  };
  TextMessageReceived: {
    type: 'TextMessageReceived';
    to: string;
    from: string;
    body: string;
    variables?: Record<string, any>;
    application: string;
  };
  ChannelConnectedLine: {
    type: 'ChannelConnectedLine';
    channel: Channel;
    instanceChannel?: ChannelInstance;
    application: string;
  };
  ChannelHangupRequest: {
    type: 'ChannelHangupRequest';
    cause: number;
    soft: boolean;
    channel: Channel;
    instanceChannel?: ChannelInstance;
    application: string;
  };
  PeerStatusChange: {
    type: 'PeerStatusChange';
    peer: string;
    peer_status: string;
    application: string;
  };
  ChannelCallerId: {
    type: 'ChannelCallerId';
    caller_presentation: number;
    caller_presentation_txt: string;
    channel: Channel;
    instanceChannel?: ChannelInstance;
    application: string;
  };
  ChannelUserevent: {
    type: 'ChannelUserevent';
    eventname: string;
    channel?: Channel;
    instanceChannel?: ChannelInstance;
    userevent: Record<string, any>;
    application: string;
  };
}

// Union de todos os nomes de eventos
export type WebSocketEventType = keyof AriEventMap;

// Union discriminada derivada do map
export type WebSocketEvent = AriEventMap[keyof AriEventMap];

export type ChannelEvent = Extract<WebSocketEvent, { channel: Channel }>;
export type PlaybackEvent = Extract<WebSocketEvent, { playback: Playback }>;
export type BridgeEvent = Extract<WebSocketEvent, { bridgeId: string }>;

export const bridgeEvents = [
  'BridgeCreated',
  'BridgeDestroyed',
  'BridgeMerged',
  'BridgeBlindTransfer',
  'BridgeAttendedTransfer',
  'BridgeVideoSourceChanged',
] as const satisfies readonly WebSocketEventType[];

// Tipos individuais para cada evento (lookups do AriEventMap)
export type ChannelDtmfReceived = AriEventMap['ChannelDtmfReceived'];
export type ChannelDialplanEvent = AriEventMap['ChannelDialplan'];
export type ChannelVarset = AriEventMap['ChannelVarset'];
export type StasisStart = AriEventMap['StasisStart'];
export type PlaybackStarted = AriEventMap['PlaybackStarted'];
export type PlaybackContinuing = AriEventMap['PlaybackContinuing'];
export type PlaybackFinished = AriEventMap['PlaybackFinished'];
export type BridgeCreated = AriEventMap['BridgeCreated'];
export type BridgeDestroyed = AriEventMap['BridgeDestroyed'];
export type ChannelCreated = AriEventMap['ChannelCreated'];
export type ChannelDestroyed = AriEventMap['ChannelDestroyed'];
export type ApplicationMoveFailed = AriEventMap['ApplicationMoveFailed'];
export type RecordingStarted = AriEventMap['RecordingStarted'];
export type RecordingFinished = AriEventMap['RecordingFinished'];
export type RecordingFailed = AriEventMap['RecordingFailed'];
export type DeviceStateChanged = AriEventMap['DeviceStateChanged'];
export type BridgeMerged = AriEventMap['BridgeMerged'];
export type BridgeBlindTransfer = AriEventMap['BridgeBlindTransfer'];
export type BridgeAttendedTransfer = AriEventMap['BridgeAttendedTransfer'];
export type BridgeVideoSourceChanged = AriEventMap['BridgeVideoSourceChanged'];
export type ChannelEnteredBridge = AriEventMap['ChannelEnteredBridge'];
export type ChannelLeftBridge = AriEventMap['ChannelLeftBridge'];
export type ChannelStateChange = AriEventMap['ChannelStateChange'];
export type ChannelTalkingStarted = AriEventMap['ChannelTalkingStarted'];
export type ChannelTalkingFinished = AriEventMap['ChannelTalkingFinished'];
export type ChannelUnhold = AriEventMap['ChannelUnhold'];
export type ChannelHold = AriEventMap['ChannelHold'];
export type ContactStatusChange = AriEventMap['ContactStatusChange'];
export type EndpointStateChange = AriEventMap['EndpointStateChange'];
export type Dial = AriEventMap['Dial'];
export type StasisEnd = AriEventMap['StasisEnd'];
export type TextMessageReceived = AriEventMap['TextMessageReceived'];
export type ChannelConnectedLine = AriEventMap['ChannelConnectedLine'];
export type ChannelHangupRequest = AriEventMap['ChannelHangupRequest'];
export type PeerStatusChange = AriEventMap['PeerStatusChange'];

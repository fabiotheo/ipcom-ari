/**
 * @file Main entry point for the Asterisk REST Interface (ARI) client package
 * @description This file exports all the necessary classes, types and interfaces for interacting with the ARI
 */
/**
 * Main client class for interacting with Asterisk REST Interface
 * @packageDocumentation
 */
export { AriClient } from './ari-client/ariClient.js';
/**
 * Resource Classes
 * These classes provide direct access to ARI resources
 */
export { Channels, ChannelInstance } from './ari-client/resources/channels.js';
export { Endpoints } from './ari-client/resources/endpoints.js';
export { Applications } from './ari-client/resources/applications.js';
export { Sounds } from './ari-client/resources/sounds.js';
export { Playbacks, PlaybackInstance, } from './ari-client/resources/playbacks.js';
export { Asterisk } from './ari-client/resources/asterisk.js';
export { Bridges, BridgeInstance } from './ari-client/resources/bridges.js';
/**
 * Type Definitions
 * These types and interfaces define the shape of data structures used throughout the API
 */
export type { AriClientConfig, AriApplication, } from './ari-client/interfaces/index.js';
export type { Channel, ChannelEvent, ChannelPlayback, ChannelVar, ChannelDialplan, OriginateRequest, RecordingOptions, SnoopOptions, ExternalMediaOptions, RTPStats, } from './ari-client/interfaces/index.js';
export type { Playback, PlaybackEvent, PlaybackOptions, PlaybackControlRequest, PlayMediaRequest, } from './ari-client/interfaces/index.js';
export type { Bridge, BridgePlayback, CreateBridgeRequest, RemoveChannelRequest, AddChannelRequest, } from './ari-client/interfaces/index.js';
export type { Endpoint, EndpointDetails, } from './ari-client/interfaces/index.js';
export type { Application, ApplicationDetails, } from './ari-client/interfaces/index.js';
export type { Sound, SoundListRequest } from './ari-client/interfaces/index.js';
export type { AsteriskInfo, Module, Logging, Variable, AsteriskPing, } from './ari-client/interfaces/index.js';
export type { WebSocketEvent, WebSocketEventType, ChannelDtmfReceived, ChannelDialplanEvent, ChannelVarset, StasisStart, PlaybackStarted, PlaybackContinuing, PlaybackFinished, BridgeCreated, BridgeDestroyed, ChannelCreated, ChannelDestroyed, ApplicationMoveFailed, RecordingStarted, RecordingFinished, RecordingFailed, DeviceStateChanged, BridgeMerged, BridgeBlindTransfer, BridgeAttendedTransfer, BridgeVideoSourceChanged, ChannelEnteredBridge, ChannelLeftBridge, ChannelStateChange, ChannelTalkingStarted, ChannelTalkingFinished, ChannelUnhold, ChannelHold, ContactStatusChange, EndpointStateChange, Dial, StasisEnd, TextMessageReceived, ChannelConnectedLine, ChannelHangupRequest, PeerStatusChange, } from './ari-client/interfaces/index.js';
//# sourceMappingURL=index.d.ts.map
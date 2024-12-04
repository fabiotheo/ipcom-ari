// Exporta a classe principal AriClient
export { AriClient } from "./ari-client/ariClient.js";

// Exporta as classes dos recursos, caso o usuário precise usá-las diretamente
export { Channels, ChannelInstance } from "./ari-client/resources/channels.js";
export { Endpoints } from "./ari-client/resources/endpoints.js";
export { Applications } from "./ari-client/resources/applications.js";
export { Sounds } from "./ari-client/resources/sounds.js";
export {
  Playbacks,
  PlaybackInstance,
} from "./ari-client/resources/playbacks.js";
export { Asterisk } from "./ari-client/resources/asterisk.js";
export { Bridges } from "./ari-client/resources/bridges.js";

// Exporta interfaces importantes para tipagem
export type {
  AriClientConfig,
  Channel,
  Endpoint,
  Playback,
  Application,
  Sound,
  AsteriskInfo,
  Module,
  Logging,
  Variable,
  WebSocketEvent,
  WebSocketEventType,
  OriginateRequest,
  PlaybackOptions,
  RTPStats,
  RecordingOptions,
  SnoopOptions,
  ExternalMediaOptions,
  ChannelPlayback,
  ChannelVar,
  ChannelDialplan,
  AriApplication,
  EndpointDetails,
  PlaybackControlRequest,
  ApplicationDetails,
  SoundListRequest,
  PlayMediaRequest,
  Bridge,
  BridgePlayback,
  CreateBridgeRequest,
  RemoveChannelRequest,
  AddChannelRequest,
  ChannelEvent,
  PlaybackEvent,
  AsteriskPing,
} from "./ari-client/interfaces/index.js";

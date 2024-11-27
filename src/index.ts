// Exporta a classe principal AriClient
export { AriClient } from "./ari-client/ariClient.js";

// Exporta as classes dos recursos, caso o usuário precise usá-las diretamente
export { Channels } from "./ari-client/resources/channels.js";
export { Endpoints } from "./ari-client/resources/endpoints.js";
export { Applications } from "./ari-client/resources/applications.js";
export { Sounds } from "./ari-client/resources/sounds.js";
export { Playbacks } from "./ari-client/resources/playbacks.js";

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
} from "./ari-client/interfaces/index.js";

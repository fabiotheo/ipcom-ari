// Exporta a classe principal AriClient
export { AriClient } from "./ari-client/ariClient.js";

// Exporta as classes dos recursos, caso o usuário precise usá-las diretamente
export { Channels } from "./ari-client/resources/channels.js";

// Exporta interfaces importantes para tipagem
export type { AriClientConfig } from "./ari-client/interfaces/requests.js";
export type { Channel } from "./ari-client/interfaces/channels.types.js";

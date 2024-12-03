/**
 * Representa os detalhes de um Playback no Asterisk.
 */
export interface Playback {
  id: string; // ID único para esta operação de playback
  media_uri: string; // URI da mídia que está sendo reproduzida
  next_media_uri?: string; // URI da próxima mídia a ser reproduzida, caso exista uma fila
  target_uri: string; // URI do canal ou bridge onde a mídia está sendo reproduzida
  language?: string; // Idioma solicitado para a reprodução, se suportado
  state:
    | "queued" // Playback enfileirado e aguardando para iniciar
    | "playing" // Playback atualmente em execução
    | "paused" // Playback pausado
    | "stopped" // Playback interrompido
    | "done" // Playback finalizado com sucesso
    | "failed"; // Playback falhou durante a execução
}

/**
 * Define as operações disponíveis para controlar um Playback.
 */
export interface PlaybackControlRequest {
  operation: "pause" | "unpause" | "reverse" | "forward";
}

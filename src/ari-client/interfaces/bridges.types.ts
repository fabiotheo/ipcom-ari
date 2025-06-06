export interface Bridge {
  id: string;
  technology: string;
  bridge_type: 'mixing' | 'holding' | 'dtmf_events' | 'proxy_media';
  bridge_class?: string;
  creator?: string;
  name?: string;
  channels?: string[]; // Array de IDs de canais associados à bridge
  creationtime?: string; // Timestamp da criação da bridge
  video_mode?: 'none' | 'talker' | 'single'; // Modos de vídeo suportados pela bridge
  video_source_id?: string; // ID do canal que é a fonte do vídeo (se aplicável)
}

export interface CreateBridgeRequest {
  type: 'mixing' | 'holding' | 'dtmf_events' | 'proxy_media';
  name?: string; // Nome opcional para a bridge
  bridgeId?: string; // ID opcional da bridge
}

export interface AddChannelRequest {
  channel: string | string[]; // Um ou mais canais para adicionar à bridge
  role?: 'participant' | 'announcer'; // Função do canal na bridge
}

export interface RemoveChannelRequest {
  channel: string | string[]; // Um ou mais canais para remover da bridge
}

export interface PlayMediaRequest {
  media: string; // URI do arquivo de mídia a ser reproduzido
  lang?: string; // Idioma da mídia (opcional)
  offsetms?: number; // Offset inicial em milissegundos
  skipms?: number; // Tempo de pular entre controles
  playbackId?: string; // ID opcional do playback
}

export interface BridgePlayback {
  id: string;
  media_uri: string;
  state: 'queued' | 'playing' | 'done' | 'failed';
  bridge: Bridge;
}

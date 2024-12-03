import type { ChannelInstance } from "../resources/channels";
import type { PlaybackInstance, Playbacks } from "../resources/playbacks";
import type { Channel } from "./channels.types";
import type { Playback } from "./playbacks.types";

export type ChannelEvent = Extract<WebSocketEvent, { channel: Channel }>;
export type PlaybackEvent = Extract<WebSocketEvent, { playback: Playback }>;

export type WebSocketEventType =
  | "DeviceStateChanged"
  | "PlaybackStarted"
  | "PlaybackContinuing"
  | "PlaybackFinished"
  | "RecordingStarted"
  | "RecordingFinished"
  | "RecordingFailed"
  | "ApplicationMoveFailed"
  | "ApplicationReplaced"
  | "BridgeCreated"
  | "BridgeDestroyed"
  | "BridgeMerged"
  | "BridgeBlindTransfer"
  | "BridgeAttendedTransfer"
  | "BridgeVideoSourceChanged"
  | "ChannelCreated"
  | "ChannelDestroyed"
  | "ChannelEnteredBridge"
  | "ChannelLeftBridge"
  | "ChannelStateChange"
  | "ChannelDtmfReceived"
  | "ChannelDialplan"
  | "ChannelCallerId"
  | "ChannelUserevent"
  | "ChannelHangupRequest"
  | "ChannelVarset"
  | "ChannelTalkingStarted"
  | "ChannelTalkingFinished"
  | "ChannelHold"
  | "ChannelUnhold"
  | "ContactStatusChange"
  | "EndpointStateChange"
  | "Dial"
  | "StasisEnd"
  | "StasisStart"
  | "TextMessageReceived"
  | "ChannelConnectedLine"
  | "PeerStatusChange";

export type WebSocketEvent =
  | {
      type: "ChannelDtmfReceived";
      digit: string; // O dígito DTMF recebido
      duration_ms: number; // Duração do DTMF em milissegundos
      channel: Channel; // O canal em que o DTMF foi recebido
      instanceChannel?: ChannelInstance;
      application: string;
    }
  | {
      type: "ChannelDialplan";
      channel: Channel; // O canal em que o DTMF foi recebido
      instanceChannel?: ChannelInstance;
      dialplan_app: string;
      dialplan_app_data: string;
      application: string;
    }
  | {
      type: "ChannelVarset";
      variable: string;
      value: string;
      channel?: Channel; // Opcional, conforme especificado no JSON
      application: string;
      instanceChannel?: ChannelInstance;
    }
  | {
      type: "StasisStart";
      args: string[]; // Lista de argumentos fornecidos
      channel: Channel; // Obrigatório
      instanceChannel?: ChannelInstance;
      replace_channel?: Channel; // Opcional
      application: string;
    }
  | {
      type: "PlaybackStarted";
      playback: Playbacks;
      asterisk_id: string;
      application: string;
      instancePlayback?: PlaybackInstance;
    }
  | {
      type: "PlaybackContinuing";
      playback: Playbacks;
      playbackId: string;
      asterisk_id: string;
      application: string;
      instancePlayback?: PlaybackInstance;
    }
  | {
      type: "PlaybackFinished";
      playback: Playbacks;
      playbackId: string;
      asterisk_id: string;
      application: string;
      instancePlayback?: PlaybackInstance;
    }
  | {
      type: "BridgeCreated";
      bridgeId: string;
      bridgeType: string;
      channels: Channel[]; // Array de Channels associados à Bridge
      application: string;
    }
  | {
      type: "BridgeDestroyed";
      bridgeId: string;
      application: string;
    }
  | {
      type: "ChannelCreated";
      channel: Channel; // Evento possui detalhes do canal criado
      instanceChannel?: ChannelInstance;
      application: string;
    }
  | {
      type: "ChannelDestroyed";
      channel: Channel; // Evento possui detalhes do canal destruído
      instanceChannel?: ChannelInstance;
      application: string;
    }
  | {
      type: "ApplicationMoveFailed";
      application: string;
      channel: Channel;
      instanceChannel?: ChannelInstance;
    }
  | {
      type: "RecordingStarted";
      recordingId: string;
      name: string;
      application: string;
    }
  | {
      type: "RecordingFinished";
      recordingId: string;
      name: string;
      application: string;
    }
  | {
      type: "RecordingFailed";
      recordingId: string;
      name: string;
      reason: string;
      application: string;
    }
  | {
      type: "DeviceStateChanged";
      device: string;
      state: string; // Pode ser "ONLINE", "OFFLINE", etc.
      application: string;
    }
  | {
      type: "BridgeMerged";
      bridgeId: string; // ID da bridge resultante
      bridges: string[]; // IDs das bridges originais
      application: string;
    }
  | {
      type: "BridgeBlindTransfer";
      bridgeId: string; // ID da bridge onde ocorreu a transferência
      channel: Channel; // Canal que iniciou a transferência
      instanceChannel?: ChannelInstance;
      transferee: Channel; // Canal transferido
      application: string;
    }
  | {
      type: "BridgeAttendedTransfer";
      bridgeId: string; // ID da bridge onde ocorreu a transferência
      transferer: Channel; // Canal que iniciou a transferência
      transferee: Channel; // Canal sendo transferido
      destination: Channel; // Canal de destino da transferência
      application: string;
    }
  | {
      type: "BridgeVideoSourceChanged";
      bridgeId: string; // ID da bridge onde a fonte de vídeo mudou
      old_video_source_id?: string; // ID da antiga fonte de vídeo (opcional)
      new_video_source_id: string; // ID da nova fonte de vídeo
      application: string;
    }
  | {
      type: "ChannelEnteredBridge";
      bridgeId: string; // ID da bridge que o canal entrou
      channel: Channel; // Detalhes do canal que entrou na bridge
      instanceChannel?: ChannelInstance;
      application: string;
    }
  | {
      type: "ChannelLeftBridge";
      bridgeId: string; // ID da bridge que o canal deixou
      channel: Channel; // Detalhes do canal que deixou a bridge
      instanceChannel?: ChannelInstance;
      application: string;
    }
  | {
      type: "ChannelStateChange";
      channel: Channel; // Detalhes do canal cuja mudança de estado ocorreu
      instanceChannel?: ChannelInstance;
      application: string;
    }
  | {
      type: "ChannelTalkingStarted";
      channel: Channel; // Canal onde começou a detecção de fala
      instanceChannel?: ChannelInstance;
      application: string;
    }
  | {
      type: "ChannelTalkingFinished";
      channel: Channel; // Canal onde terminou a detecção de fala
      instanceChannel?: ChannelInstance;
      application: string;
    }
  | {
      type: "ChannelUnhold";
      channel: Channel; // Canal que foi retirado de espera
      instanceChannel?: ChannelInstance;
      application: string;
    }
  | {
      type: "ChannelHold";
      channel: Channel; // Canal que foi colocado em espera
      instanceChannel?: ChannelInstance;
      application: string;
    }
  | {
      type: "ContactStatusChange";
      contact_info: Record<string, any>; // Informações sobre o contato
      status: string; // Novo status do contato
      aor?: string; // Opcional, AOR associado
      application: string;
    }
  | {
      type: "EndpointStateChange";
      endpoint: Record<string, any>; // Informações do endpoint
      state: string; // Novo estado do endpoint
      application: string;
    }
  | {
      type: "Dial";
      caller: Channel; // Canal que iniciou a operação de discagem
      peer: Channel; // Canal alvo da operação de discagem
      dialstring?: string; // Opcional, string de discagem usada
      application: string;
    }
  | {
      type: "StasisEnd";
      channel: Channel; // Canal que deixou a aplicação Stasis
      instanceChannel?: ChannelInstance;
      application: string;
    }
  | {
      type: "TextMessageReceived";
      to: string; // Destinatário da mensagem
      from: string; // Remetente da mensagem
      body: string; // Conteúdo da mensagem
      variables?: Record<string, any>; // Variáveis associadas (opcional)
      application: string;
    }
  | {
      type: "ChannelConnectedLine";
      channel: Channel; // Canal cuja linha conectada foi alterada
      instanceChannel?: ChannelInstance;
      application: string;
    }
  | {
      type: "ChannelHangupRequest"; // Tipo do evento
      cause: number; // Representação inteira da causa do hangup
      soft: boolean; // Indica se o hangup foi solicitado de forma "soft"
      channel: Channel; // Informações do canal onde o hangup foi solicitado
      instanceChannel?: ChannelInstance;
      application: string;
    }
  | {
      type: "PeerStatusChange";
      peer: string; // Nome do peer
      peer_status: string; // Novo status do peer
      application: string;
    }
  | { type: string; [key: string]: any }; // Caso genérico para eventos desconhecidos
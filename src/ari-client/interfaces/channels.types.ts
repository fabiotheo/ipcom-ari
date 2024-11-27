export interface Channel {
  id: string;
  name: string;
  state: string;
  caller: {
    number: string;
    name: string;
  };
  connected: {
    number: string;
    name: string;
  };
  accountcode: string;
  dialplan: ChannelDialplan;
  creationtime: string;
  language: string;
}

export interface OriginateRequest {
  endpoint: string;
  extension?: string;
  context?: string;
  priority?: number;
  label?: string;
  app?: string;
  appArgs?: string;
  callerId?: string;
  timeout?: number;
  variables?: Record<string, string>;
  channelId?: string;
  otherChannelId?: string;
  originator?: string;
  formats?: string;
}

export interface ChannelDialplan {
  context: string;
  exten: string;
  priority: number;
}

export interface ChannelVar {
  variable: string;
  value: string;
}

export interface Playback {
  id: string;
  media_uri: string;
  target_uri: string;
  state: "queued" | "playing" | "paused" | "done";
}

export interface PlaybackOptions {
  lang?: string;
  offsetms?: number;
  skipms?: number;
}

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
    dialplan: {
        context: string;
        exten: string;
        priority: number;
    };
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
//# sourceMappingURL=channels.types.d.ts.map
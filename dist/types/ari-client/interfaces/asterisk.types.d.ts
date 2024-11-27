export interface AsteriskInfo {
    build: {
        os: string;
        kernel: string;
        machine: string;
        options: string[];
        modules: string[];
    };
    system: {
        entity_id: string;
        version: string;
        uptime: {
            startup_time: string;
            last_reload_time: string;
        };
    };
    config: {
        name: string;
        default_language: string;
    };
}
export interface Module {
    name: string;
    description: string;
    support_level: string;
    use_count: number;
    status: string;
}
export interface Logging {
    channel: string;
    type: string;
    configuration: string;
    status: string;
}
export interface Variable {
    name: string;
    value: string;
}
//# sourceMappingURL=asterisk.types.d.ts.map
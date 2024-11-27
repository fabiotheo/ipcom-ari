import type { BaseClient } from "../baseClient.js";
import type { AsteriskInfo, Logging, Module, Variable } from "../interfaces/asterisk.types.js";
export declare class Asterisk {
    private client;
    constructor(client: BaseClient);
    /**
     * Retrieves information about the Asterisk server.
     */
    getInfo(): Promise<AsteriskInfo>;
    /**
     * Lists all loaded modules in the Asterisk server.
     */
    listModules(): Promise<Module[]>;
    /**
     * Manages a specific module in the Asterisk server.
     */
    manageModule(moduleName: string, action: "load" | "unload" | "reload"): Promise<void>;
    /**
     * Retrieves all configured logging channels.
     */
    listLoggingChannels(): Promise<Logging[]>;
    /**
     * Adds or removes a log channel in the Asterisk server.
     */
    manageLogChannel(logChannelName: string, action: "add" | "remove", configuration?: {
        type?: string;
        configuration?: string;
    }): Promise<void>;
    /**
     * Retrieves the value of a global variable.
     */
    getGlobalVariable(variableName: string): Promise<Variable>;
    /**
     * Sets a global variable.
     */
    setGlobalVariable(variableName: string, value: string): Promise<void>;
}
//# sourceMappingURL=asterisk.d.ts.map
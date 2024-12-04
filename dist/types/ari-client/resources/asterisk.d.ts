import type { BaseClient } from "../baseClient.js";
import type { AsteriskInfo, AsteriskPing, Logging, Module, Variable } from "../interfaces";
export declare class Asterisk {
    private client;
    constructor(client: BaseClient);
    ping(): Promise<AsteriskPing>;
    /**
     * Retrieves information about the Asterisk server.
     */
    get(): Promise<AsteriskInfo>;
    /**
     * Lists all loaded modules in the Asterisk server.
     */
    list(): Promise<Module[]>;
    /**
     * Manages a specific module in the Asterisk server.
     *
     * @param moduleName - The name of the module to manage.
     * @param action - The action to perform on the module: "load", "unload", or "reload".
     * @returns A promise that resolves when the action is completed successfully.
     * @throws {Error} Throws an error if the HTTP method or action is invalid.
     */
    manage(moduleName: string, action: "load" | "unload" | "reload"): Promise<void>;
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
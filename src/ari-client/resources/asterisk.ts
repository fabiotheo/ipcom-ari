import type { BaseClient } from "../baseClient.js";
import type {
  AsteriskInfo,
  Logging,
  Module,
  Variable,
} from "../interfaces/asterisk.types.js";

function toQueryParams<T>(options: T): string {
  return new URLSearchParams(
    Object.entries(options as Record<string, string>)
      .filter(([, value]) => value !== undefined)
      .map(([key, value]) => [key, String(value)]),
  ).toString();
}

export class Asterisk {
  constructor(private client: BaseClient) {}

  /**
   * Retrieves information about the Asterisk server.
   */
  async getInfo(): Promise<AsteriskInfo> {
    return this.client.get<AsteriskInfo>("/asterisk/info");
  }

  /**
   * Lists all loaded modules in the Asterisk server.
   */
  async listModules(): Promise<Module[]> {
    return this.client.get<Module[]>("/asterisk/modules");
  }

  /**
   * Manages a specific module in the Asterisk server.
   */
  async manageModule(
    moduleName: string,
    action: "load" | "unload" | "reload",
  ): Promise<void> {
    return this.client.post<void>(
      `/asterisk/modules/${moduleName}?action=${encodeURIComponent(action)}`,
    );
  }

  /**
   * Retrieves all configured logging channels.
   */
  async listLoggingChannels(): Promise<Logging[]> {
    return this.client.get<Logging[]>("/asterisk/logging");
  }

  /**
   * Adds or removes a log channel in the Asterisk server.
   */
  async manageLogChannel(
    logChannelName: string,
    action: "add" | "remove",
    configuration?: { type?: string; configuration?: string },
  ): Promise<void> {
    const queryParams = toQueryParams(configuration || {});
    return this.client.post<void>(
      `/asterisk/logging/${logChannelName}?action=${encodeURIComponent(action)}&${queryParams}`,
    );
  }

  /**
   * Retrieves the value of a global variable.
   */
  async getGlobalVariable(variableName: string): Promise<Variable> {
    return this.client.get<Variable>(
      `/asterisk/variables?variable=${encodeURIComponent(variableName)}`,
    );
  }

  /**
   * Sets a global variable.
   */
  async setGlobalVariable(variableName: string, value: string): Promise<void> {
    return this.client.post<void>(
      `/asterisk/variables?variable=${encodeURIComponent(variableName)}&value=${encodeURIComponent(value)}`,
    );
  }
}

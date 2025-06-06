import type { BaseClient } from '../baseClient.js';
import type {
  AsteriskInfo,
  AsteriskPing,
  Logging,
  Module,
  Variable,
} from '../interfaces';

function toQueryParams<T>(options: T): string {
  return new URLSearchParams(
    Object.entries(options as Record<string, string>)
      .filter(([, value]) => value !== undefined)
      .map(([key, value]) => [key, String(value)])
  ).toString();
}

export class Asterisk {
  constructor(private client: BaseClient) {}

  async ping(): Promise<AsteriskPing> {
    return this.client.get<AsteriskPing>('/asterisk/ping');
  }

  /**
   * Retrieves information about the Asterisk server.
   */
  async get(): Promise<AsteriskInfo> {
    return this.client.get<AsteriskInfo>('/asterisk/info');
  }

  /**
   * Lists all loaded modules in the Asterisk server.
   */
  async list(): Promise<Module[]> {
    return this.client.get<Module[]>('/asterisk/modules');
  }

  /**
   * Manages a specific module in the Asterisk server.
   *
   * @param moduleName - The name of the module to manage.
   * @param action - The action to perform on the module: "load", "unload", or "reload".
   * @returns A promise that resolves when the action is completed successfully.
   * @throws {Error} Throws an error if the HTTP method or action is invalid.
   */
  async manage(
    moduleName: string,
    action: 'load' | 'unload' | 'reload'
  ): Promise<void> {
    const url = `/asterisk/modules/${moduleName}`;
    switch (action) {
      case 'load':
        await this.client.post<void>(`${url}?action=load`);
        break;
      case 'unload':
        await this.client.delete<void>(url);
        break;
      case 'reload':
        await this.client.put<void>(url, {});
        break;
      default:
        throw new Error(`Ação inválida: ${action}`);
    }
  }

  /**
   * Retrieves all configured logging channels.
   */
  async listLoggingChannels(): Promise<Logging[]> {
    return this.client.get<Logging[]>('/asterisk/logging');
  }

  /**
   * Adds or removes a log channel in the Asterisk server.
   */
  async manageLogChannel(
    logChannelName: string,
    action: 'add' | 'remove',
    configuration?: { type?: string; configuration?: string }
  ): Promise<void> {
    const queryParams = toQueryParams(configuration || {});
    return this.client.post<void>(
      `/asterisk/logging/${logChannelName}?action=${encodeURIComponent(action)}&${queryParams}`
    );
  }

  /**
   * Retrieves the value of a global variable.
   */
  async getGlobalVariable(variableName: string): Promise<Variable> {
    return this.client.get<Variable>(
      `/asterisk/variables?variable=${encodeURIComponent(variableName)}`
    );
  }

  /**
   * Sets a global variable.
   */
  async setGlobalVariable(variableName: string, value: string): Promise<void> {
    return this.client.post<void>(
      `/asterisk/variables?variable=${encodeURIComponent(variableName)}&value=${encodeURIComponent(value)}`
    );
  }
}

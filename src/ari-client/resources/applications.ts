import type { BaseClient } from '../baseClient.js';
import type {
  Application,
  ApplicationDetails,
} from '../interfaces/applications.types.js';

export interface ApplicationMessage {
  event: string;
  data?: Record<string, any>;
}

export class Applications {
  constructor(private client: BaseClient) {}

  /**
   * Lists all applications.
   *
   * @returns A promise that resolves to an array of Application objects.
   * @throws {Error} If the API response is not an array.
   */
  async list(): Promise<Application[]> {
    const applications = await this.client.get<unknown>('/applications');

    if (!Array.isArray(applications)) {
      throw new Error('Resposta da API /applications não é um array.');
    }

    return applications as Application[];
  }

  /**
   * Retrieves details of a specific application.
   *
   * @param appName - The name of the application to retrieve details for.
   * @returns A promise that resolves to an ApplicationDetails object.
   * @throws {Error} If there's an error fetching the application details.
   */
  async getDetails(appName: string): Promise<ApplicationDetails> {
    try {
      return await this.client.get<ApplicationDetails>(
        `/applications/${appName}`
      );
    } catch (error) {
      console.error(`Erro ao obter detalhes do aplicativo ${appName}:`, error);
      throw error;
    }
  }

  /**
   * Sends a message to a specific application.
   *
   * @param appName - The name of the application to send the message to.
   * @param body - The message to be sent, containing an event and optional data.
   * @returns A promise that resolves when the message is successfully sent.
   */
  async sendMessage(appName: string, body: ApplicationMessage): Promise<void> {
    await this.client.post<void>(`/applications/${appName}/messages`, body);
  }
}

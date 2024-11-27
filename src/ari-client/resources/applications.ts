import type { BaseClient } from "../baseClient.js";
import type {
  Application,
  ApplicationDetails,
} from "../interfaces/applications.types.js";

export class Applications {
  constructor(private client: BaseClient) {}

  /**
   * Lists all applications.
   *
   * @returns A promise that resolves to an array of Application objects representing all registered applications.
   * @throws {Error} If the API response is not an array.
   */
  async list(): Promise<Application[]> {
    const applications = await this.client.get<unknown>("/applications");

    if (!Array.isArray(applications)) {
      throw new Error("Resposta da API /applications não é um array.");
    }

    return applications as Application[];
  }

  /**
   * Retrieves details of a specific application.
   *
   * @param appName - The unique name of the application.
   * @returns A promise that resolves to an ApplicationDetails object containing the details of the specified application.
   */
  async getDetails(appName: string): Promise<ApplicationDetails> {
    return this.client.get<ApplicationDetails>(`/applications/${appName}`);
  }

  /**
   * Sends a message to a specific application.
   *
   * @param appName - The unique name of the application.
   * @param body - The message body to send.
   * @returns A promise that resolves when the message is sent successfully.
   */
  async sendMessage(appName: string, body: any): Promise<void> {
    await this.client.post<void>(`/applications/${appName}/messages`, body);
  }
}

import type { BaseClient } from "../baseClient.js";
import type { Endpoint, EndpointDetails } from "../interfaces/endpoints.types";

export class Endpoints {
  constructor(private client: BaseClient) {}

  /**
   * Lists all available endpoints.
   *
   * @returns A promise that resolves to an array of Endpoint objects representing all available endpoints.
   * @throws {Error} If the API response is not an array.
   */
  async list(): Promise<Endpoint[]> {
    const endpoints = await this.client.get<unknown>("/endpoints");

    if (!Array.isArray(endpoints)) {
      throw new Error("Resposta da API /endpoints não é um array.");
    }

    return endpoints as Endpoint[];
  }

  /**
   * Retrieves details of a specific endpoint.
   *
   * @param technology - The technology of the endpoint (e.g., "PJSIP").
   * @param resource - The specific resource name of the endpoint (e.g., "9001").
   * @returns A promise that resolves to an EndpointDetails object containing the details of the specified endpoint.
   */
  async getDetails(
    technology: string,
    resource: string,
  ): Promise<EndpointDetails> {
    return this.client.get<EndpointDetails>(
      `/endpoints/${technology}/${resource}`,
    );
  }

  /**
   * Sends a message to a specific endpoint.
   *
   * @param technology - The technology of the endpoint (e.g., "PJSIP").
   * @param resource - The specific resource name of the endpoint (e.g., "9001").
   * @param message - The message payload to send to the endpoint.
   * @returns A promise that resolves when the message has been successfully sent.
   */
  async sendMessage(
    technology: string,
    resource: string,
    message: Record<string, unknown>,
  ): Promise<void> {
    await this.client.post<void>(
      `/endpoints/${technology}/${resource}/sendMessage`,
      message,
    );
  }
}

import type { BaseClient } from "../baseClient.js";
import type { Sound, SoundListRequest } from "../interfaces/sounds.types.js";

export class Sounds {
  constructor(private client: BaseClient) {}

  /**
   * Lists all available sounds.
   *
   * @param params - Optional parameters to filter the list of sounds.
   * @returns A promise that resolves to an array of Sound objects.
   * @throws {Error} If the API response is not an array.
   */
  async list(params?: SoundListRequest): Promise<Sound[]> {
    const query = params
      ? `?${new URLSearchParams(params as Record<string, string>).toString()}`
      : "";

    const sounds = await this.client.get<unknown>(`/sounds${query}`);

    if (!Array.isArray(sounds)) {
      throw new Error("Resposta da API /sounds não é um array.");
    }

    return sounds as Sound[];
  }

  /**
   * Retrieves details of a specific sound.
   *
   * @param soundId - The unique identifier of the sound.
   * @returns A promise that resolves to a Sound object containing the details of the specified sound.
   */
  async getDetails(soundId: string): Promise<Sound> {
    return this.client.get<Sound>(`/sounds/${soundId}`);
  }
}

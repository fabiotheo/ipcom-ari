import axios, { type AxiosInstance } from "axios";

export class BaseClient {
  private client: AxiosInstance;

  constructor(baseUrl: string, username: string, password: string) {
    this.client = axios.create({
      baseURL: baseUrl,
      auth: { username, password },
    });
  }

  /**
   * Executes a GET request.
   * @param path - The API endpoint path.
   */
  async get<T>(path: string): Promise<T> {
    const response = await this.client.get<T>(path);
    return response.data;
  }

  /**
   * Executes a POST request.
   * @param path - The API endpoint path.
   * @param data - Optional payload to send with the request.
   */
  async post<T>(path: string, data?: unknown): Promise<T> {
    const response = await this.client.post<T>(path, data);
    return response.data;
  }

  /**
   * Executes a PUT request.
   * @param path - The API endpoint path.
   * @param data - Payload to send with the request.
   */
  async put<T>(path: string, data: unknown): Promise<T> {
    const response = await this.client.put<T>(path, data);
    return response.data;
  }

  /**
   * Executes a DELETE request.
   * @param path - The API endpoint path.
   */
  async delete<T>(path: string): Promise<T> {
    const response = await this.client.delete<T>(path);
    return response.data;
  }
}

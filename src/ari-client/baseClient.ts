import axios, { type AxiosInstance, type AxiosRequestConfig } from "axios";

export class BaseClient {
  private client: AxiosInstance;

  constructor(
    private baseUrl: string,
    private username: string,
    private password: string,
    timeout = 5000, // Timeout configurável
  ) {
    if (!/^https?:\/\/.+/.test(baseUrl)) {
      throw new Error(
        "Invalid base URL. It must start with http:// or https://",
      );
    }

    this.client = axios.create({
      baseURL: baseUrl,
      auth: { username, password },
      timeout,
    });

    // Interceptores
    this.addInterceptors();
  }

  public getBaseUrl(): string {
    return this.baseUrl;
  }

  /**
   * Retorna as credenciais configuradas.
   */
  public getCredentials(): {
    baseUrl: string;
    username: string;
    password: string;
  } {
    return {
      baseUrl: this.baseUrl,
      username: this.username,
      password: this.password,
    };
  }

  /**
   * Adds interceptors to the Axios instance.
   */
  private addInterceptors(): void {
    // Interceptor para registrar requisições
    this.client.interceptors.request.use(
      (config) => {
        // Pode adicionar logs ou metadados aqui, se necessário
        return config;
      },
      (error) => {
        console.error("[Request Error]", error.message); // Log opcional
        return Promise.reject(error);
      },
    );

    // Interceptor para tratar respostas e erros
    this.client.interceptors.response.use(
      (response) => response,
      (error) => {
        const status = error.response?.status;
        const message =
          error.response?.data?.message || error.message || "Unknown error";

        const errorDetails = {
          status,
          message,
          url: error.config?.url || "Unknown URL",
          method: error.config?.method?.toUpperCase() || "Unknown Method",
        };

        if (status === 404) {
          console.warn(`[404] Not Found: ${errorDetails.url}`);
        } else if (status >= 500) {
          console.error(`[500] Server Error: ${errorDetails.url}`);
        } else {
          console.warn(
            `[Response Error] ${errorDetails.method} ${errorDetails.url}: ${message}`,
          );
        }

        // Cria um erro controlado com os detalhes
        return Promise.reject(
          new Error(
            `[Error] ${errorDetails.method} ${errorDetails.url} - ${message} (Status: ${status})`,
          ),
        );
      },
    );
  }

  /**
   * Executes a GET request.
   * @param path - The API endpoint path.
   * @param config - Optional Axios request configuration.
   */
  async get<T>(path: string, config?: AxiosRequestConfig): Promise<T> {
    try {
      const response = await this.client.get<T>(path, config);
      return response.data;
    } catch (error) {
      this.handleRequestError(error);
    }
  }

  /**
   * Executes a POST request.
   * @param path - The API endpoint path.
   * @param data - Optional payload to send with the request.
   * @param config - Optional Axios request configuration.
   */
  async post<T>(
    path: string,
    data?: Record<string, any>,
    config?: AxiosRequestConfig,
  ): Promise<T> {
    try {
      const response = await this.client.post<T>(path, data, config);
      return response.data;
    } catch (error) {
      this.handleRequestError(error);
    }
  }

  /**
   * Executes a PUT request.
   * @param path - The API endpoint path.
   * @param data - Payload to send with the request.
   * @param config - Optional Axios request configuration.
   */
  async put<T>(
    path: string,
    data: Record<string, any>,
    config?: AxiosRequestConfig,
  ): Promise<T> {
    try {
      const response = await this.client.put<T>(path, data, config);
      return response.data;
    } catch (error) {
      this.handleRequestError(error);
    }
  }

  /**
   * Executes a DELETE request.
   * @param path - The API endpoint path.
   * @param config - Optional Axios request configuration.
   */
  async delete<T>(path: string, config?: AxiosRequestConfig): Promise<T> {
    try {
      const response = await this.client.delete<T>(path, config);
      return response.data;
    } catch (error) {
      this.handleRequestError(error);
    }
  }

  /**
   * Handles errors for HTTP requests.
   * @param error - The error to handle.
   */
  private handleRequestError(error: any): never {
    if (axios.isAxiosError(error)) {
      // Erros provenientes do Axios
      console.error(`[HTTP Error] ${error.message}`);
      throw new Error(error.message || "HTTP Error");
    } else {
      // Outros erros não relacionados ao Axios
      console.error(`[Unexpected Error] ${error}`);
      throw error;
    }
  }

  /**
   * Sets custom headers for the client instance.
   * Useful for adding dynamic tokens or specific API headers.
   * @param headers - Headers to merge with existing configuration.
   */
  setHeaders(headers: Record<string, string>): void {
    this.client.defaults.headers.common = {
      ...this.client.defaults.headers.common,
      ...headers,
    };
  }
}

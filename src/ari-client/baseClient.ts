import axios, {
  type AxiosInstance,
  type AxiosRequestConfig,
  isAxiosError
} from "axios";

/**
 * Custom error class for HTTP-related errors
 */
class HTTPError extends Error {
  constructor(
      message: string,
      public readonly status?: number,
      public readonly method?: string,
      public readonly url?: string,
  ) {
    super(message);
    this.name = 'HTTPError';
  }
}

/**
 * BaseClient handles HTTP communications with the ARI server.
 * Provides methods for making HTTP requests and manages authentication and error handling.
 */
export class BaseClient {
  private readonly client: AxiosInstance;

  /**
   * Creates a new BaseClient instance.
   *
   * @param {string} baseUrl - The base URL for the API
   * @param {string} username - Username for authentication
   * @param {string} password - Password for authentication
   * @param {number} [timeout=5000] - Request timeout in milliseconds
   * @throws {Error} If the base URL format is invalid
   */
  constructor(
      private readonly baseUrl: string,
      private readonly username: string,
      private readonly password: string,
      timeout = 5000,
  ) {
    if (!/^https?:\/\/.+/.test(baseUrl)) {
      throw new Error("Invalid base URL. It must start with http:// or https://");
    }

    this.client = axios.create({
      baseURL: baseUrl,
      auth: { username, password },
      timeout,
      headers: {
        'Content-Type': 'application/json',
      },
    });

    this.addInterceptors();
    console.log(`BaseClient initialized for ${baseUrl}`);
  }

  /**
   * Gets the base URL of the client.
   */
  public getBaseUrl(): string {
    return this.baseUrl;
  }

  /**
   * Gets the configured credentials.
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
   * Adds request and response interceptors to the Axios instance.
   */
  private addInterceptors(): void {
    this.client.interceptors.request.use(
        (config) => {
          console.log(`[Request] ${config.method?.toUpperCase()} ${config.url}`);
          return config;
        },
        (error: unknown) => {
          const message = this.getErrorMessage(error);
          console.error("[Request Error]", message);
          return Promise.reject(new HTTPError(message));
        },
    );

    this.client.interceptors.response.use(
        (response) => {
          console.log(`[Response] ${response.status} ${response.config.url}`);
          return response;
        },
        (error: unknown) => {
          if (isAxiosError(error)) {
            const status = error.response?.status ?? 0;
            const method = error.config?.method?.toUpperCase() ?? 'UNKNOWN';
            const url = error.config?.url ?? 'unknown-url';
            const message = error.response?.data?.message || error.message || 'Unknown error';

            if (status === 404) {
              console.warn(`[404] Not Found: ${url}`);
            } else if (status >= 500) {
              console.error(`[${status}] Server Error: ${url}`);
            } else if (status > 0) {
              console.warn(`[${status}] ${method} ${url}: ${message}`);
            } else {
              console.error(`[Network] Request failed: ${message}`);
            }

            throw new HTTPError(message, status || undefined, method, url);
          }

          const message = this.getErrorMessage(error);
          console.error("[Unexpected Error]", message);
          throw new Error(message);
        },
    );
  }

  /**
   * Executes a GET request.
   *
   * @param path - API endpoint path
   * @param config - Optional Axios request configuration
   * @returns Promise with the response data
   */
  async get<T>(path: string, config?: AxiosRequestConfig): Promise<T> {
    try {
      const response = await this.client.get<T>(path, config);
      return response.data;
    } catch (error: unknown) {
      throw this.handleRequestError(error);
    }
  }

  /**
   * Executes a POST request.
   *
   * @param path - API endpoint path
   * @param data - Request payload
   * @param config - Optional Axios request configuration
   * @returns Promise with the response data
   */
  async post<T, D = unknown>(
      path: string,
      data?: D,
      config?: AxiosRequestConfig,
  ): Promise<T> {
    try {
      const response = await this.client.post<T>(path, data, config);
      return response.data;
    } catch (error: unknown) {
      throw this.handleRequestError(error);
    }
  }

  /**
   * Executes a PUT request.
   *
   * @param path - API endpoint path
   * @param data - Request payload
   * @param config - Optional Axios request configuration
   * @returns Promise with the response data
   */
  async put<T, D = unknown>(
      path: string,
      data: D,
      config?: AxiosRequestConfig,
  ): Promise<T> {
    try {
      const response = await this.client.put<T>(path, data, config);
      return response.data;
    } catch (error: unknown) {
      throw this.handleRequestError(error);
    }
  }

  /**
   * Executes a DELETE request.
   *
   * @param path - API endpoint path
   * @param config - Optional Axios request configuration
   * @returns Promise with the response data
   */
  async delete<T>(path: string, config?: AxiosRequestConfig): Promise<T> {
    try {
      const response = await this.client.delete<T>(path, config);
      return response.data;
    } catch (error: unknown) {
      throw this.handleRequestError(error);
    }
  }

  /**
   * Handles and formats error messages from various error types.
   */
  private getErrorMessage(error: unknown): string {
    if (isAxiosError(error)) {
      return error.response?.data?.message || error.message || "HTTP Error";
    }
    if (error instanceof Error) {
      return error.message;
    }
    return "An unknown error occurred";
  }

  /**
   * Handles errors from HTTP requests.
   */
  private handleRequestError(error: unknown): never {
    const message = this.getErrorMessage(error);
    if (isAxiosError(error)) {
      throw new HTTPError(
          message,
          error.response?.status,
          error.config?.method?.toUpperCase(),
          error.config?.url
      );
    }
    throw new Error(message);
  }

  /**
   * Sets custom headers for the client instance.
   */
  setHeaders(headers: Record<string, string>): void {
    this.client.defaults.headers.common = {
      ...this.client.defaults.headers.common,
      ...headers,
    };
    console.log("Updated client headers");
  }

  /**
   * Gets the current request timeout setting.
   */
  getTimeout(): number {
    return this.client.defaults.timeout || 5000;
  }

  /**
   * Updates the request timeout setting.
   */
  setTimeout(timeout: number): void {
    this.client.defaults.timeout = timeout;
    console.log(`Updated timeout to ${timeout}ms`);
  }
}

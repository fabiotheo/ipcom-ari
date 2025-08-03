import { type AxiosRequestConfig } from 'axios';
/**
 * BaseClient handles HTTP communications with the ARI server.
 * Provides methods for making HTTP requests and manages authentication and error handling.
 */
export declare class BaseClient {
    private readonly baseUrl;
    private readonly username;
    private readonly password;
    private readonly secure;
    private readonly client;
    /**
     * Creates a new BaseClient instance.
     *
     * @param {string} baseUrl - The base URL for the API
     * @param {string} username - Username for authentication
     * @param {string} password - Password for authentication
     * @param {boolean} [secure=false] - Whether to use secure connections (HTTPS/WSS)
     * @param {number} [timeout=5000] - Request timeout in milliseconds
     * @throws {Error} If the base URL format is invalid
     */
    constructor(baseUrl: string, username: string, password: string, secure?: boolean, timeout?: number);
    /**
     * Gets the base URL of the client.
     */
    getBaseUrl(): string;
    /**
     * Gets the configured credentials including security settings.
     * Used by WebSocketClient to determine authentication method.
     */
    getCredentials(): {
        baseUrl: string;
        username: string;
        password: string;
        secure: boolean;
    };
    /**
     * Adds request and response interceptors to the Axios instance.
     */
    private addInterceptors;
    /**
     * Executes a GET request.
     *
     * @param path - API endpoint path
     * @param config - Optional Axios request configuration
     * @returns Promise with the response data
     */
    get<T>(path: string, config?: AxiosRequestConfig): Promise<T>;
    /**
     * Executes a POST request.
     *
     * @param path - API endpoint path
     * @param data - Request payload
     * @param config - Optional Axios request configuration
     * @returns Promise with the response data
     */
    post<T, D = unknown>(path: string, data?: D, config?: AxiosRequestConfig): Promise<T>;
    /**
     * Executes a PUT request.
     *
     * @param path - API endpoint path
     * @param data - Request payload
     * @param config - Optional Axios request configuration
     * @returns Promise with the response data
     */
    put<T, D = unknown>(path: string, data: D, config?: AxiosRequestConfig): Promise<T>;
    /**
     * Executes a DELETE request.
     *
     * @param path - API endpoint path
     * @param config - Optional Axios request configuration
     * @returns Promise with the response data
     */
    delete<T>(path: string, config?: AxiosRequestConfig): Promise<T>;
    /**
     * Handles and formats error messages from various error types.
     */
    private getErrorMessage;
    /**
     * Handles errors from HTTP requests.
     */
    private handleRequestError;
    /**
     * Sets custom headers for the client instance.
     */
    setHeaders(headers: Record<string, string>): void;
    /**
     * Gets the current request timeout setting.
     */
    getTimeout(): number;
    /**
     * Updates the request timeout setting.
     */
    setTimeout(timeout: number): void;
}
//# sourceMappingURL=baseClient.d.ts.map
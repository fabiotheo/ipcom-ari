import { type AxiosRequestConfig } from "axios";
export declare class BaseClient {
    private baseUrl;
    private username;
    private password;
    private client;
    constructor(baseUrl: string, username: string, password: string, timeout?: number);
    getBaseUrl(): string;
    /**
     * Retorna as credenciais configuradas.
     */
    getCredentials(): {
        baseUrl: string;
        username: string;
        password: string;
    };
    /**
     * Adds interceptors to the Axios instance.
     */
    private addInterceptors;
    /**
     * Executes a GET request.
     * @param path - The API endpoint path.
     * @param config - Optional Axios request configuration.
     */
    get<T>(path: string, config?: AxiosRequestConfig): Promise<T>;
    /**
     * Executes a POST request.
     * @param path - The API endpoint path.
     * @param data - Optional payload to send with the request.
     * @param config - Optional Axios request configuration.
     */
    post<T>(path: string, data?: Record<string, any>, config?: AxiosRequestConfig): Promise<T>;
    /**
     * Executes a PUT request.
     * @param path - The API endpoint path.
     * @param data - Payload to send with the request.
     * @param config - Optional Axios request configuration.
     */
    put<T>(path: string, data: Record<string, any>, config?: AxiosRequestConfig): Promise<T>;
    /**
     * Executes a DELETE request.
     * @param path - The API endpoint path.
     * @param config - Optional Axios request configuration.
     */
    delete<T>(path: string, config?: AxiosRequestConfig): Promise<T>;
    /**
     * Handles errors for HTTP requests.
     * @param error - The error to handle.
     */
    private handleRequestError;
    /**
     * Sets custom headers for the client instance.
     * Useful for adding dynamic tokens or specific API headers.
     * @param headers - Headers to merge with existing configuration.
     */
    setHeaders(headers: Record<string, string>): void;
}
//# sourceMappingURL=baseClient.d.ts.map
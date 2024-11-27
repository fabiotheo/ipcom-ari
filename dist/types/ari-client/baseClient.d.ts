export declare class BaseClient {
    private client;
    constructor(baseUrl: string, username: string, password: string);
    /**
     * Executes a GET request.
     * @param path - The API endpoint path.
     */
    get<T>(path: string): Promise<T>;
    /**
     * Executes a POST request.
     * @param path - The API endpoint path.
     * @param data - Optional payload to send with the request.
     */
    post<T>(path: string, data?: unknown): Promise<T>;
    /**
     * Executes a PUT request.
     * @param path - The API endpoint path.
     * @param data - Payload to send with the request.
     */
    put<T>(path: string, data: unknown): Promise<T>;
    /**
     * Executes a DELETE request.
     * @param path - The API endpoint path.
     */
    delete<T>(path: string): Promise<T>;
}
//# sourceMappingURL=baseClient.d.ts.map
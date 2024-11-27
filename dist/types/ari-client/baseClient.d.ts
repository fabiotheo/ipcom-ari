export declare class BaseClient {
    private client;
    constructor(baseUrl: string, username: string, password: string);
    get<T>(path: string): Promise<T>;
    post<T>(path: string, data?: unknown): Promise<T>;
}
//# sourceMappingURL=baseClient.d.ts.map
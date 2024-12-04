import type { AriClient } from "../ariClient";
export declare abstract class BaseResource {
    protected readonly client: AriClient;
    private readonly emitter;
    private readonly resourceId;
    protected constructor(client: AriClient, resourceId: string);
    /**
     * Registra um listener para eventos do recurso.
     * @param event O tipo de evento a escutar.
     * @param callback Função callback a ser chamada quando o evento ocorre.
     */
    on<T extends string>(event: T, callback: (data: any) => void): void;
    /**
     * Remove um listener para eventos do recurso.
     * @param event O tipo de evento.
     * @param callback Função callback a ser removida.
     */
    removeListener<T extends string>(event: T, callback: (data: any) => void): void;
    /**
     * Remove todos os listeners de um tipo de evento.
     * @param event O tipo de evento.
     */
    removeAllListeners<T extends string>(event: T): void;
    /**
     * Emite um evento específico para este recurso.
     * @param event O tipo de evento.
     * @param data Os dados associados ao evento.
     */
    emit<T extends string>(event: T, data: any): void;
}
//# sourceMappingURL=baseResource.d.ts.map
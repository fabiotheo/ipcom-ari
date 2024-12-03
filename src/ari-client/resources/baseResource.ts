import { EventEmitter } from "events";
import type { AriClient } from "../ariClient"; // Referência ao seu AriClient

export abstract class BaseResource {
  protected readonly client: AriClient;
  private readonly emitter: EventEmitter;
  private readonly resourceId: string;

  protected constructor(client: AriClient, resourceId: string) {
    this.client = client;
    this.resourceId = resourceId;
    this.emitter = new EventEmitter();
  }

  /**
   * Registra um listener para eventos do recurso.
   * @param event O tipo de evento a escutar.
   * @param callback Função callback a ser chamada quando o evento ocorre.
   */
  public on<T extends string>(event: T, callback: (data: any) => void): void {
    console.log({
      baseEvent: "on",
      event,
      name: `${event}-${this.resourceId}`,
    });
    this.emitter.on(`${event}-${this.resourceId}`, callback);
  }

  /**
   * Remove um listener para eventos do recurso.
   * @param event O tipo de evento.
   * @param callback Função callback a ser removida.
   */
  public removeListener<T extends string>(
    event: T,
    callback: (data: any) => void,
  ): void {
    console.log({
      baseEvent: "removeListener - baseResources",
      event,
      name: `${event}-${this.resourceId}`,
    });
    this.emitter.removeListener(`${event}-${this.resourceId}`, callback);
  }

  /**
   * Remove todos os listeners de um tipo de evento.
   * @param event O tipo de evento.
   */
  public removeAllListeners<T extends string>(event: T): void {
    this.emitter.removeAllListeners(`${event}-${this.resourceId}`);
  }

  /**
   * Emite um evento específico para este recurso.
   * @param event O tipo de evento.
   * @param data Os dados associados ao evento.
   */
  public emit<T extends string>(event: T, data: any): void {
    console.log({
      baseEvent: "emit - baseResources",
      event,
      name: `${event}-${this.resourceId}`,
    });
    this.emitter.emit(`${event}-${this.resourceId}`, data);
  }
}

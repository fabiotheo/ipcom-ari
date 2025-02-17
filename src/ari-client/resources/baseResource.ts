import { EventEmitter } from "events";
import type { AriClient } from "../ariClient"; // Referência ao seu AriClient

export abstract class BaseResource {
  protected readonly client: AriClient;
  private readonly emitter: EventEmitter;
  private readonly resourceId: string;
  private readonly listenersMap = new Map<string, Function[]>(); // 🔹 Armazena listeners para remoção futura

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
    const eventKey = `${event}-${this.resourceId}`;

    // 🔹 Verifica se o listener já foi adicionado
    const existingListeners = this.listenersMap.get(eventKey) || [];
    if (existingListeners.includes(callback)) {
      console.warn(`Listener já registrado para ${eventKey}, reutilizando.`);
      return;
    }

    console.log({
      baseEvent: "on",
      event,
      name: eventKey,
    });

    this.emitter.on(eventKey, callback);

    // 🔹 Armazena o listener para remoção futura
    if (!this.listenersMap.has(eventKey)) {
      this.listenersMap.set(eventKey, []);
    }
    this.listenersMap.get(eventKey)!.push(callback);
  }

  /**
   * Remove um listener específico do evento.
   * @param event O tipo de evento.
   * @param callback Função callback a ser removida.
   */
  public removeListener<T extends string>(
    event: T,
    callback: (data: any) => void,
  ): void {
    const eventKey = `${event}-${this.resourceId}`;

    console.log({
      baseEvent: "removeListener - baseResources",
      event,
      name: eventKey,
    });

    this.emitter.off(eventKey, callback);

    // 🔹 Remove do mapa de listeners
    const storedListeners = this.listenersMap.get(eventKey) || [];
    this.listenersMap.set(
      eventKey,
      storedListeners.filter((l) => l !== callback),
    );
  }

  /**
   * Remove todos os listeners de um tipo de evento.
   * @param event O tipo de evento.
   */
  public removeAllListeners<T extends string>(event: T): void {
    const eventKey = `${event}-${this.resourceId}`;

    console.log({
      baseEvent: "removeAllListeners",
      event,
      name: eventKey,
    });

    this.emitter.removeAllListeners(eventKey);
    this.listenersMap.delete(eventKey);
  }

  /**
   * Remove todos os listeners de todos os eventos associados a este recurso.
   */
  public clearAllListeners(): void {
    console.log(`Removing all event listeners for resource ${this.resourceId}`);

    this.listenersMap.forEach((listeners, eventKey) => {
      listeners.forEach((listener) => {
        this.emitter.off(eventKey, listener as (...args: any[]) => void);
      });
    });

    this.listenersMap.clear();
    this.emitter.removeAllListeners();
  }

  /**
   * Emite um evento específico para este recurso.
   * @param event O tipo de evento.
   * @param data Os dados associados ao evento.
   */
  public emit<T extends string>(event: T, data: any): void {
    const eventKey = `${event}-${this.resourceId}`;

    if (!this.emitter.listenerCount(eventKey)) {
      console.warn(
        `No listeners registered for event ${eventKey}, skipping emit.`,
      );
      return;
    }

    console.log({
      baseEvent: "emit - baseResources",
      event,
      name: eventKey,
    });

    this.emitter.emit(eventKey, data);
  }
}

import type { WebSocketEvent } from "./events.types";

export interface Application {
  name: string;
  description?: string; // Descrição opcional do aplicativo
}

export interface ApplicationDetails extends Application {
  subscribedEvents?: WebSocketEvent["type"][]; // Lista de eventos específicos
}

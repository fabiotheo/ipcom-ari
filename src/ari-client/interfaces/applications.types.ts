import type { AriEventMap } from './events.types';

export interface Application {
  name: string;
  description?: string; // Descrição opcional do aplicativo
}

export interface ApplicationDetails extends Application {
  subscribedEvents?: (keyof AriEventMap)[]; // Lista de eventos específicos
}

export interface Application {
  name: string;
  description?: string; // Opcional, dependendo da resposta do ARI
}

export interface ApplicationDetails {
  name: string;
  description?: string;
  subscribedEvents?: string[]; // Lista de eventos aos quais o aplicativo está inscrito
}

import WebSocket from "ws";

export class WebSocketClient {
  private ws: WebSocket | null = null;
  private isClosedManually = false; // Para evitar reconexões automáticas quando fechado manualmente
  private isReconnecting = false; // Para evitar reconexões paralelas

  constructor(private url: string) {}

  async connect(): Promise<void> {
    if (this.isReconnecting) return; // Evita múltiplas reconexões simultâneas

    return new Promise((resolve, reject) => {
      this.ws = new WebSocket(this.url);

      this.ws.on("open", () => {
        console.log("WebSocket conectado.");
        this.isClosedManually = false;
        this.isReconnecting = false;
        resolve();
      });

      this.ws.on("error", (err) => {
        console.error("Erro na conexão WebSocket:", err);
        reject(err);
      });

      this.ws.on("close", (code, reason) => {
        console.warn(`WebSocket desconectado: ${code} - ${reason}`);
        this.isReconnecting = false; // Libera novas reconexões
      });
    });
  }

  async reconnect(): Promise<void> {
    if (this.isClosedManually || this.isReconnecting) return;

    console.log("Tentando reconectar ao WebSocket...");
    this.isReconnecting = true;
    try {
      await this.connect();
      console.log("Reconexão bem-sucedida.");
    } catch (err) {
      console.error("Erro ao tentar reconectar:", err);
    } finally {
      this.isReconnecting = false;
    }
  }

  isConnected(): boolean {
    return this.ws?.readyState === WebSocket.OPEN;
  }

  on(event: string, callback: (data: any) => void): void {
    if (!this.ws || this.ws.readyState !== WebSocket.OPEN) {
      throw new Error("WebSocket não está conectado.");
    }

    if (event === "message") {
      this.ws.on(event, (data) => {
        try {
          const decodedData = JSON.parse(data.toString());
          callback(decodedData); // Retorna o JSON já decodificado
        } catch (err) {
          console.error("Erro ao decodificar mensagem do WebSocket:", err);
          callback(data); // Retorna o buffer original em caso de erro
        }
      });
    } else {
      this.ws.on(event, callback);
    }
  }

  send(data: any): void {
    if (!this.ws || this.ws.readyState !== WebSocket.OPEN) {
      throw new Error("WebSocket não está conectado.");
    }

    this.ws.send(data, (err) => {
      if (err) {
        console.error("Erro ao enviar dados pelo WebSocket:", err);
      }
    });
  }

  close(): void {
    if (this.ws) {
      this.isClosedManually = true;
      this.ws.close();
      console.log("WebSocket fechado manualmente.");
    }
  }
}

export interface AriClientConfig {
  host: string; // Ex.: "localhost"
  port: number; // Ex.: 8088
  username: string; // Ex.: "ipcomari"
  password: string; // Ex.: "password123"
  secure?: boolean; // Indica se é uma conexão segura (default: true)
}

export interface AriApplication {
  name: string;
  // [key: string]: any; // Caso existam outros campos desconhecidos, remova isso se os campos forem conhecidos.
}

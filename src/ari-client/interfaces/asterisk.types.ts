// Representa informações gerais sobre o servidor Asterisk
export interface AsteriskInfo {
  build: {
    os: string;
    kernel: string;
    machine: string;
    options: string[];
    modules: string[];
  };
  system: {
    entity_id: string;
    version: string;
    uptime: {
      startup_time: string;
      last_reload_time: string;
    };
  };
  config: {
    name: string;
    default_language: string;
  };
}

// Representa um módulo carregado no Asterisk
export interface Module {
  name: string;
  description: string;
  support_level: string;
  use_count: number;
  status: string; // Ex: "running" ou "not_running"
}

// Representa um canal de log configurado
export interface Logging {
  channel: string; // Nome do canal de log
  type: string; // Ex: "console", "file", etc.
  configuration: string; // Detalhes da configuração
  status: string; // Ex: "enabled", "disabled"
}

// Representa uma variável global do Asterisk
export interface Variable {
  name: string; // Nome da variável
  value: string; // Valor associado à variável
}

export interface AsteriskPing {
  asterisk_id: string; // Asterisk id info
  ping: string; // Always string value is pong
  timestamp: string; // The timestamp string of request received time
}

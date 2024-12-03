import type { WebSocketEvent } from "./events.types";
export interface Application {
    name: string;
    description?: string;
}
export interface ApplicationDetails extends Application {
    subscribedEvents?: WebSocketEvent["type"][];
}
//# sourceMappingURL=applications.types.d.ts.map
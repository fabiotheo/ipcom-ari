import type { AriEventMap } from './events.types';
export interface Application {
    name: string;
    description?: string;
}
export interface ApplicationDetails extends Application {
    subscribedEvents?: (keyof AriEventMap)[];
}
//# sourceMappingURL=applications.types.d.ts.map
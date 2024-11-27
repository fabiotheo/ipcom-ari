import type { BaseClient } from "../baseClient.js";
import type { Sound, SoundListRequest } from "../interfaces/sounds.types.js";
export declare class Sounds {
    private client;
    constructor(client: BaseClient);
    /**
     * Lists all available sounds.
     *
     * @param params - Optional parameters to filter the list of sounds.
     * @returns A promise that resolves to an array of Sound objects.
     * @throws {Error} If the API response is not an array.
     */
    list(params?: SoundListRequest): Promise<Sound[]>;
    /**
     * Retrieves details of a specific sound.
     *
     * @param soundId - The unique identifier of the sound.
     * @returns A promise that resolves to a Sound object containing the details of the specified sound.
     */
    getDetails(soundId: string): Promise<Sound>;
}
//# sourceMappingURL=sounds.d.ts.map
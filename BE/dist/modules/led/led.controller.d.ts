import { Response } from 'express';
import { LedService } from './led.service';
export declare class LedController {
    private readonly ledService;
    constructor(ledService: LedService);
    getPaginated(page: number, limit: number, sortBy: string, order: string, res: Response): Promise<void>;
    listStatus(): Promise<string>;
    turnOn(id: number): Promise<string>;
    turnOff(id: number): Promise<string>;
}

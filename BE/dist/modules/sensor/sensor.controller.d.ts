import { SensorService } from './sensor.service';
import { Response } from 'express';
export declare class SensorController {
    private readonly sensorService;
    constructor(sensorService: SensorService);
    getPaginated(page: number, limit: number, sortBy: string, order: string, searchField: string, searchValue: string, globalSearchValue: string, res: Response): Promise<void>;
    getLatestRecord(res: Response): Promise<void>;
}

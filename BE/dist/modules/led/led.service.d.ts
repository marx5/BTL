import { MqttService } from 'src/base/mqtt/mqtt.service';
import { DataSource } from 'typeorm';
export declare class LedService {
    private readonly dataSource;
    private readonly mqttService;
    private localStorage;
    constructor(dataSource: DataSource, mqttService: MqttService);
    getAllLed(): Promise<any>;
    getPaginatedSensors(page: number, limit: number, sortBy: string, order: string): Promise<any>;
    listStatus(): Promise<string>;
    turnOn(id: number): Promise<string>;
    turnOff(id: number): Promise<string>;
}

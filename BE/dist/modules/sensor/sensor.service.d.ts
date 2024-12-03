import { DataSource } from 'typeorm';
import { MqttService } from 'src/base/mqtt/mqtt.service';
import { SensorGateway } from './sensor.gateway';
export declare class SensorService {
    private readonly dataSource;
    private readonly mqttService;
    private sensorGateway;
    constructor(dataSource: DataSource, mqttService: MqttService, sensorGateway: SensorGateway);
    getAllSensors(): Promise<any>;
    getPaginatedSensors(page: number, limit: number, sortBy?: string, order?: string, searchField?: string, searchValue?: string, globalSearchValue?: string): Promise<{
        page: number;
        limit: number;
        total: any;
        data: any;
    }>;
    private subscribeToEsp8266Data;
    private processReceivedData;
    getLatestRecord(): Promise<any>;
}

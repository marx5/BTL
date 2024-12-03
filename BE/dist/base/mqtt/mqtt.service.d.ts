export declare class MqttService {
    private readonly client;
    constructor();
    publish(topic: string, message: string): void;
    subscribe(topic: string, callback: (topic: string, payload: Buffer) => void): void;
}

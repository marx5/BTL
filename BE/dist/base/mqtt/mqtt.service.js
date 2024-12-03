"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.MqttService = void 0;
const common_1 = require("@nestjs/common");
const mqtt = require("mqtt");
let MqttService = class MqttService {
    constructor() {
        const protocol = 'wss';
        const host = '1c0787fe98d845fea408181bfc94d923.s1.eu.hivemq.cloud';
        const port = '8884';
        const clientId = `mqtt_${Math.random().toString(16).slice(3)}`;
        const connectUrl = `${protocol}://${host}:${port}/mqtt`;
        console.log('Connecting to', connectUrl);
        this.client = mqtt.connect(connectUrl, {
            clientId,
            clean: true,
            connectTimeout: 4000,
            username: 'vanvu',
            password: 'E!hU2TJUGSSJjqb',
            reconnectPeriod: 1000,
            rejectUnauthorized: true,
        });
        this.client.on('connect', () => {
            console.log('Connected to mqttbroker');
        });
        this.client.on('error', (error) => {
            console.error('MQTT connection failed', error);
        });
    }
    publish(topic, message) {
        this.client.publish(topic, message, {}, (error) => {
            if (error) {
                console.error('Publish failed', error);
            }
        });
    }
    subscribe(topic, callback) {
        this.client.subscribe(topic, (error) => {
            if (error) {
                console.error('Subscription failed', error);
            }
        });
        this.client.on('message', callback);
    }
};
exports.MqttService = MqttService;
exports.MqttService = MqttService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [])
], MqttService);
//# sourceMappingURL=mqtt.service.js.map
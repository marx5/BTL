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
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.LedService = void 0;
const common_1 = require("@nestjs/common");
const mqtt_service_1 = require("../../base/mqtt/mqtt.service");
const typeorm_1 = require("@nestjs/typeorm");
const typeorm_2 = require("typeorm");
const node_localstorage_1 = require("node-localstorage");
const luxon_1 = require("luxon");
let LedService = class LedService {
    constructor(dataSource, mqttService) {
        this.dataSource = dataSource;
        this.mqttService = mqttService;
        this.localStorage = new node_localstorage_1.LocalStorage('./scractch');
    }
    async getAllLed() {
        const sql = 'SELECT * FROM data_led;';
        try {
            const rows = await this.dataSource.query(sql);
            console.log(rows);
            return rows;
        }
        catch (err) {
            throw new Error('Not found');
        }
    }
    async getPaginatedSensors(page, limit, sortBy, order) {
        let sensors = await this.getAllLed();
        const startIndex = (page - 1) * limit;
        const endIndex = page * limit;
        const paginatedSensors = sensors.slice(startIndex, endIndex);
        return {
            page,
            limit,
            total: sensors.length,
            data: paginatedSensors,
        };
    }
    async listStatus() {
        const sql = 'SELECT * FROM status_led;';
        try {
            const rows = await this.dataSource.query(sql);
            if (rows.length === 0) {
                throw new Error('No data found');
            }
            const status = {
                led1: rows[0].status,
                led2: rows[1].status,
                led3: rows[2].status,
            };
            return JSON.stringify(status);
        }
        catch (err) {
            console.error('Error fetching status from database:', err);
            throw new Error('Error fetching status');
        }
    }
    async turnOn(id) {
        const now = luxon_1.DateTime.now().setZone('Asia/Ho_Chi_Minh');
        const temp = now.toFormat('yyyy-MM-dd HH:mm:ss');
        const mqttPromise = new Promise((resolve, reject) => {
            this.mqttService.subscribe('led_data', (topic, payload) => {
                const message = payload.toString();
                const data = JSON.parse(message);
                if (data.led_id === id && data.status === 'ON') {
                    resolve();
                }
                else {
                    reject(new Error('Invalid message received'));
                }
            });
        });
        this.mqttService.publish('led_status', `{led_id: ${id}, status: "ON"}`);
        console.log('Subscribed to led_data');
        try {
            await mqttPromise;
            let name;
            if (id == 1) {
                name = 'Đèn';
            }
            else if (id == 2) {
                name = 'Quạt';
            }
            else if (id == 3) {
                name = 'Điều hòa';
            }
            const sql1 = `INSERT INTO data_led (name, time_updated, status) VALUES ('${name}', '${temp}', 'ON');`;
            const sql2 = `UPDATE status_led SET status = 'ON' WHERE id = ${id};`;
            await this.dataSource.query(sql1);
            await this.dataSource.query(sql2);
            console.log('turn on led');
            return 'turn on led';
        }
        catch (err) {
            console.error('Error executing SQL query:', err);
            throw new Error('Error turning on LED');
        }
    }
    async turnOff(id) {
        const now = luxon_1.DateTime.now().setZone('Asia/Ho_Chi_Minh');
        const temp = now.toFormat('yyyy-MM-dd HH:mm:ss');
        const mqttPromise = new Promise((resolve, reject) => {
            this.mqttService.subscribe('led_data', (topic, payload) => {
                const message = payload.toString();
                const data = JSON.parse(message);
                if (data.led_id === id && data.status === 'OFF') {
                    resolve();
                }
                else {
                    reject(new Error('Invalid message received'));
                }
            });
        });
        this.mqttService.publish('led_status', `{led_id: ${id}, status: "OFF"}`);
        try {
            await mqttPromise;
            let name;
            if (id == 1) {
                name = 'Đèn';
            }
            else if (id == 2) {
                name = 'Quạt';
            }
            else if (id == 3) {
                name = 'Điều hòa';
            }
            const sql1 = `INSERT INTO data_led (name, time_updated, status) VALUES ('${name}', '${temp}', 'OFF');`;
            const sql2 = `UPDATE status_led SET status = 'OFF' WHERE id = ${id};`;
            await this.dataSource.query(sql2);
            await this.dataSource.query(sql1);
            console.log('turn off led');
            return 'turn off led';
        }
        catch (err) {
            console.error('Error executing SQL query:', err);
            throw new Error('Error turning on LED');
        }
    }
};
exports.LedService = LedService;
exports.LedService = LedService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, typeorm_1.InjectDataSource)()),
    __metadata("design:paramtypes", [typeorm_2.DataSource,
        mqtt_service_1.MqttService])
], LedService);
//# sourceMappingURL=led.service.js.map
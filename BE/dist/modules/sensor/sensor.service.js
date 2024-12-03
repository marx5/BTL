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
exports.SensorService = void 0;
const common_1 = require("@nestjs/common");
const typeorm_1 = require("@nestjs/typeorm");
const typeorm_2 = require("typeorm");
const mqtt_service_1 = require("../../base/mqtt/mqtt.service");
const sensor_gateway_1 = require("./sensor.gateway");
const luxon_1 = require("luxon");
let SensorService = class SensorService {
    constructor(dataSource, mqttService, sensorGateway) {
        this.dataSource = dataSource;
        this.mqttService = mqttService;
        this.sensorGateway = sensorGateway;
        this.subscribeToEsp8266Data();
    }
    async getAllSensors() {
        const sql = 'SELECT * FROM data_sensor';
        try {
            const rows = await this.dataSource.query(sql);
            return rows;
        }
        catch (err) {
            throw new Error('Not found');
        }
    }
    async getPaginatedSensors(page, limit, sortBy, order, searchField, searchValue, globalSearchValue) {
        let sensors = await this.getAllSensors();
        if (globalSearchValue) {
            const searchValueLower = String(globalSearchValue).toLowerCase();
            console.log(searchValueLower);
            sensors = sensors.filter((sensor) => {
                const humidity = String(sensor['humidity']).toLowerCase();
                const temperature = String(sensor['temperature']).toLowerCase();
                const light = String(sensor['light']).toLowerCase();
                const timeUpdated = String(sensor['time_updated']).toLowerCase();
                console.log(timeUpdated);
                const date = new Date(timeUpdated);
                const padZero = (num) => num.toString().padStart(2, '0');
                const formattedDate = `${date.getFullYear()}-${padZero(date.getMonth() + 1)}-${padZero(date.getDate())} ${padZero(date.getHours())}:${padZero(date.getMinutes())}:${padZero(date.getSeconds())}`;
                console.log(formattedDate);
                const sensorDate = new Date(timeUpdated);
                const sensorDateStr = sensorDate.toISOString().split('T')[0];
                const sensorDateTimeStr = sensorDate
                    .toISOString()
                    .replace('T', ' ')
                    .substring(0, 19);
                return (humidity.includes(searchValueLower) ||
                    temperature.includes(searchValueLower) ||
                    light.includes(searchValueLower) ||
                    sensorDateStr.includes(searchValueLower) ||
                    sensorDateTimeStr.includes(searchValueLower) ||
                    formattedDate.includes(searchValueLower));
            });
        }
        else if (searchField && searchValue) {
            sensors = sensors.filter((sensor) => {
                const sensorValue = String(sensor[searchField]).toLowerCase();
                const searchValueLower = String(searchValue).toLowerCase();
                if (searchField === 'time_updated') {
                    const date = new Date(sensorValue);
                    const padZero = (num) => num.toString().padStart(2, '0');
                    const formattedDate = `${date.getFullYear()}-${padZero(date.getMonth() + 1)}-${padZero(date.getDate())} ${padZero(date.getHours())}:${padZero(date.getMinutes())}:${padZero(date.getSeconds())}`;
                    console.log(formattedDate);
                    if (formattedDate.includes(searchValueLower)) {
                        return true;
                    }
                    return sensorValue.includes(searchValueLower);
                }
                return sensorValue.includes(searchValueLower);
            });
        }
        if (sortBy && order) {
            sensors.sort((a, b) => {
                if (order === 'asc') {
                    return a[sortBy] > b[sortBy] ? 1 : -1;
                }
                else {
                    return a[sortBy] < b[sortBy] ? 1 : -1;
                }
            });
        }
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
    subscribeToEsp8266Data() {
        this.mqttService.subscribe('esp_data', async (topic, payload) => {
            const data = JSON.parse(payload.toString());
            console.log(`Received data from topic ${topic}:`, data);
            await this.processReceivedData(data);
            this.sensorGateway.sendSensorData(data);
        });
    }
    async processReceivedData(data) {
        try {
            const now = luxon_1.DateTime.now().setZone('Asia/Ho_Chi_Minh');
            const temp = now.toFormat('yyyy-MM-dd HH:mm:ss');
            console.log(temp);
            const sql = `
        INSERT INTO data_sensor (temperature, humidity, light, time_updated)
        VALUES (?, ?, ?, ?)
      `;
            await this.dataSource.query(sql, [
                Number(data.temperature),
                Number(data.humidity),
                Number(data.light),
                temp,
            ]);
            console.log('Data from ESP inserted into database');
        }
        catch (err) {
            console.error('Failed to insert data into database', err);
        }
    }
    async getLatestRecord() {
        const sql = `
      SELECT * FROM data_sensor
      ORDER BY time_updated DESC
      LIMIT 1
    `;
        try {
            const rows = await this.dataSource.query(sql);
            return rows[0];
        }
        catch (err) {
            console.error('Failed to fetch latest sensor data', err);
            throw new Error('Failed to fetch latest sensor data');
        }
    }
};
exports.SensorService = SensorService;
exports.SensorService = SensorService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, typeorm_1.InjectDataSource)()),
    __metadata("design:paramtypes", [typeorm_2.DataSource,
        mqtt_service_1.MqttService,
        sensor_gateway_1.SensorGateway])
], SensorService);
//# sourceMappingURL=sensor.service.js.map
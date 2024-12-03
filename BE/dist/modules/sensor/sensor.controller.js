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
exports.SensorController = void 0;
const common_1 = require("@nestjs/common");
const sensor_service_1 = require("./sensor.service");
const swagger_1 = require("@nestjs/swagger");
let SensorController = class SensorController {
    constructor(sensorService) {
        this.sensorService = sensorService;
    }
    async getPaginated(page, limit, sortBy, order, searchField, searchValue, globalSearchValue, res) {
        try {
            console.log(page, limit, sortBy, order, searchField, searchValue, globalSearchValue);
            const result = await this.sensorService.getPaginatedSensors(page, limit, sortBy, order, searchField, searchValue, globalSearchValue);
            res.send(result);
        }
        catch (err) {
            res.status(400).send('Bad Request');
        }
    }
    async getLatestRecord(res) {
        try {
            const latestRecord = await this.sensorService.getLatestRecord();
            res.send(latestRecord);
        }
        catch (err) {
            res.status(400).send('Failed to fetch latest sensor data');
        }
    }
};
exports.SensorController = SensorController;
__decorate([
    (0, common_1.Get)('paginated'),
    (0, swagger_1.ApiOperation)({ summary: 'Phân trang bao gồm tìm kiếm và sắp xếp' }),
    (0, swagger_1.ApiQuery)({ name: 'page', required: true, description: 'Trang' }),
    (0, swagger_1.ApiQuery)({ name: 'limit', required: true, description: 'Số bản ghi trên một trang' }),
    (0, swagger_1.ApiQuery)({ name: 'sortBy', required: false, description: 'Sắp xếp' }),
    (0, swagger_1.ApiQuery)({ name: 'order', required: false, description: 'Tăng hoặc giảm (asc/desc)' }),
    (0, swagger_1.ApiQuery)({ name: 'searchField', required: false, description: 'Tìm kiếm' }),
    (0, swagger_1.ApiQuery)({ name: 'searchValue', required: false, description: 'Giá trị tìm kiếm' }),
    (0, swagger_1.ApiQuery)({ name: 'globalSearchValue', required: false, description: 'Tìm kiếm tổng' }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'Successful response' }),
    (0, swagger_1.ApiResponse)({ status: 400, description: 'Bad Request' }),
    __param(0, (0, common_1.Query)('page')),
    __param(1, (0, common_1.Query)('limit')),
    __param(2, (0, common_1.Query)('sortBy')),
    __param(3, (0, common_1.Query)('order')),
    __param(4, (0, common_1.Query)('searchField')),
    __param(5, (0, common_1.Query)('searchValue')),
    __param(6, (0, common_1.Query)('globalSearchValue')),
    __param(7, (0, common_1.Res)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number, Number, String, String, String, String, String, Object]),
    __metadata("design:returntype", Promise)
], SensorController.prototype, "getPaginated", null);
__decorate([
    (0, common_1.Get)('latest'),
    (0, swagger_1.ApiOperation)({ summary: 'Lấy thông tin mới nhất của sensor' }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'Successful response' }),
    (0, swagger_1.ApiResponse)({ status: 400, description: 'Failed to fetch latest sensor data' }),
    __param(0, (0, common_1.Res)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], SensorController.prototype, "getLatestRecord", null);
exports.SensorController = SensorController = __decorate([
    (0, swagger_1.ApiTags)('sensor'),
    (0, common_1.Controller)('sensor'),
    __metadata("design:paramtypes", [sensor_service_1.SensorService])
], SensorController);
//# sourceMappingURL=sensor.controller.js.map
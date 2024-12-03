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
exports.LedController = void 0;
const common_1 = require("@nestjs/common");
const led_service_1 = require("./led.service");
const swagger_1 = require("@nestjs/swagger");
let LedController = class LedController {
    constructor(ledService) {
        this.ledService = ledService;
    }
    async getPaginated(page, limit, sortBy = 'id', order = 'desc', res) {
        try {
            const result = await this.ledService.getPaginatedSensors(page, limit, sortBy, order);
            res.send(result);
        }
        catch (err) {
            res.status(400).send('Bad Request');
        }
    }
    listStatus() {
        return this.ledService.listStatus();
    }
    async turnOn(id) {
        return await this.ledService.turnOn(id);
    }
    async turnOff(id) {
        return await this.ledService.turnOff(id);
    }
};
exports.LedController = LedController;
__decorate([
    (0, common_1.Get)('paginated'),
    (0, swagger_1.ApiOperation)({ summary: 'Phân trang' }),
    (0, swagger_1.ApiQuery)({ name: 'page', required: true, description: 'Trang' }),
    (0, swagger_1.ApiQuery)({ name: 'limit', required: true, description: 'Số bản ghi trên một trang' }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'Successful response' }),
    (0, swagger_1.ApiResponse)({ status: 400, description: 'Bad Request' }),
    __param(0, (0, common_1.Query)('page')),
    __param(1, (0, common_1.Query)('limit')),
    __param(2, (0, common_1.Query)('sortBy')),
    __param(3, (0, common_1.Query)('order')),
    __param(4, (0, common_1.Res)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number, Number, String, String, Object]),
    __metadata("design:returntype", Promise)
], LedController.prototype, "getPaginated", null);
__decorate([
    (0, common_1.Get)('status'),
    (0, swagger_1.ApiOperation)({ summary: 'Lấy status của thiết bị' }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'Successful response' }),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", void 0)
], LedController.prototype, "listStatus", null);
__decorate([
    (0, common_1.Post)('turn-on/:id'),
    (0, swagger_1.ApiOperation)({ summary: 'Bật thiết bị' }),
    (0, swagger_1.ApiParam)({ name: 'id', required: true, description: 'ID của thiết bị muốn bật' }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'Successful response' }),
    (0, swagger_1.ApiResponse)({ status: 400, description: 'Bad Request' }),
    __param(0, (0, common_1.Param)('id', common_1.ParseIntPipe)),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number]),
    __metadata("design:returntype", Promise)
], LedController.prototype, "turnOn", null);
__decorate([
    (0, common_1.Post)('turn-off/:id'),
    (0, swagger_1.ApiOperation)({ summary: 'Tắt thiết bị' }),
    (0, swagger_1.ApiParam)({ name: 'id', required: true, description: 'ID của thiết bị muốn tắt' }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'Successful response' }),
    (0, swagger_1.ApiResponse)({ status: 400, description: 'Bad Request' }),
    __param(0, (0, common_1.Param)('id', common_1.ParseIntPipe)),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number]),
    __metadata("design:returntype", Promise)
], LedController.prototype, "turnOff", null);
exports.LedController = LedController = __decorate([
    (0, swagger_1.ApiTags)('led'),
    (0, common_1.Controller)('led'),
    __metadata("design:paramtypes", [led_service_1.LedService])
], LedController);
//# sourceMappingURL=led.controller.js.map
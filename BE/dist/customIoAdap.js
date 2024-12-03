"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.CustomIoAdapter = void 0;
const platform_socket_io_1 = require("@nestjs/platform-socket.io");
class CustomIoAdapter extends platform_socket_io_1.IoAdapter {
    createIOServer(port, options) {
        options = {
            ...options,
            cors: {
                origin: 'http://localhost:3000',
                methods: ['GET', 'POST'],
            },
        };
        return super.createIOServer(port, options);
    }
}
exports.CustomIoAdapter = CustomIoAdapter;
//# sourceMappingURL=customIoAdap.js.map
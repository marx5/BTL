import { IoAdapter } from '@nestjs/platform-socket.io';
export declare class CustomIoAdapter extends IoAdapter {
    createIOServer(port: number, options?: any): any;
}

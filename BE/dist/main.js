"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const core_1 = require("@nestjs/core");
const app_module_1 = require("./app.module");
const swagger_1 = require("@nestjs/swagger");
const bodyParser = require("body-parser");
const customIoAdap_1 = require("./customIoAdap");
async function bootstrap() {
    const app = await core_1.NestFactory.create(app_module_1.AppModule);
    const config = new swagger_1.DocumentBuilder()
        .setTitle('IoT API')
        .setDescription('The IoT API description')
        .setVersion('1.0')
        .addTag('led')
        .addTag('sensor')
        .build();
    const document = swagger_1.SwaggerModule.createDocument(app, config);
    swagger_1.SwaggerModule.setup('api', app, document);
    app.use(bodyParser.json());
    app.enableCors({
        origin: 'http://localhost:3000',
    });
    app.useWebSocketAdapter(new customIoAdap_1.CustomIoAdapter(app));
    await app.listen(3001);
}
bootstrap();
//# sourceMappingURL=main.js.map
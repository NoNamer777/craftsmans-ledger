import 'reflect-metadata/Reflect.js';

import { classTransformOptions, tryCatch } from '@craftsmans-ledger/shared';
import { Logger, ValidationPipe } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { NestFactory } from '@nestjs/core';
import { FastifyAdapter } from '@nestjs/platform-fastify';
import { AppModule, validationOptions } from './app';

async function bootstrap() {
    const app = await NestFactory.create(AppModule, new FastifyAdapter());

    app.useGlobalPipes(new ValidationPipe({
        transform: true,
        exceptionFactory: (errors) => errors[0],
        transformOptions: classTransformOptions,
        ...validationOptions
    }));

    const configService = app.get(ConfigService);

    const host = configService.get<string>('host');
    const port = configService.get<number>('port');

    await app.listen(port, host);

    Logger.log(`API is running on: http://${host}:${port}`);
}

(async () => {
    const { error } = await tryCatch(bootstrap());

    if (error) console.error(error);
})();

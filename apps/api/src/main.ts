import 'reflect-metadata';

import { classTransformOptions, tryCatch } from '@craftsmans-ledger/shared';
import { Logger, ValidationPipe } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { NestFactory } from '@nestjs/core';
import { FastifyAdapter } from '@nestjs/platform-fastify';
import { readFile } from 'fs/promises';
import { AppModule, ErrorFilter, SslConfig, validationOptions } from './app';

async function bootstrap() {
    const applicationContext = await NestFactory.createApplicationContext(AppModule, {
        logger: ['error', 'warn'],
    });
    const configService = applicationContext.get(ConfigService);

    const host = configService.get<string>('host');
    const port = configService.get<number>('port');
    const sslConfig = configService.get<SslConfig>('ssl');
    const corsOrigins = configService.get<string[]>('corsOrigins');

    const app = await NestFactory.create(
        AppModule,
        new FastifyAdapter({
            http2: true,
            ...(sslConfig
                ? {
                      https: {
                          allowHTTP1: false,
                          cert: await readFile(sslConfig.cert, { encoding: 'utf8' }),
                          key: await readFile(sslConfig.key, { encoding: 'utf8' }),
                      },
                  }
                : {}),
        }),
        {
            logger: ['log', 'error', 'warn'],
            cors: {
                origin: corsOrigins,
                methods: ['OPTIONS', 'GET', 'POST', 'PUT', 'DELETE'],
            },
        }
    );

    app.useGlobalPipes(
        new ValidationPipe({
            transform: true,
            exceptionFactory: (errors) => errors[0],
            transformOptions: classTransformOptions,
            ...validationOptions,
        })
    );
    app.useGlobalFilters(new ErrorFilter());

    app.enableShutdownHooks();

    await app.listen(port, host);

    Logger.log(`API is running on: ${sslConfig ? 'https' : 'http'}://${host}:${port}`);
}

(async () => {
    const { error } = await tryCatch(bootstrap());

    if (error) console.error(error);
})();

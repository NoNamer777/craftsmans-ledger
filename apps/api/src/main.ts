import { Logger } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import { FastifyAdapter } from '@nestjs/platform-fastify';
import { AppModule } from './app';

async function bootstrap() {
    const app = await NestFactory.create(AppModule, new FastifyAdapter());

    const port = process.env['PORT'] || 3000;
    await app.listen(port);

    Logger.log(`API is running on: http://localhost:${port}`);
}

(async () => await bootstrap())();

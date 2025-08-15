import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { AppController } from './app.controller';
import { configModuleOptions } from './core';

@Module({
    imports: [ConfigModule.forRoot(configModuleOptions)],
    controllers: [AppController],
})
export class AppModule {}

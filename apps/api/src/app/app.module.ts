import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { AppController } from './app.controller';
import { configModuleOptions, DatabaseModule } from './core';

@Module({
    imports: [ConfigModule.forRoot(configModuleOptions), DatabaseModule],
    controllers: [AppController],
})
export class AppModule {}

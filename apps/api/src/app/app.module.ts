import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { AppController } from './app.controller';
import { configModuleOptions, DatabaseModule } from './core';
import { ItemsModule } from './items';

@Module({
    imports: [ConfigModule.forRoot(configModuleOptions), DatabaseModule, ItemsModule],
    controllers: [AppController],
})
export class AppModule {}

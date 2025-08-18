import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { AppController } from './app.controller';
import { CacheModule, configModuleOptions } from './core';
import { ItemsModule } from './items';
import { RecipesModule } from './recipes';
import { TechnologyTreesModule } from './technology-trees';

@Module({
    imports: [
        ConfigModule.forRoot(configModuleOptions),
        ItemsModule,
        TechnologyTreesModule,
        RecipesModule,
        CacheModule,
    ],
    controllers: [AppController],
})
export class AppModule {}

import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { AppController } from './app.controller';
import { configModuleOptions, DatabaseModule } from './core';
import { ItemsModule } from './items';
import { RecipesModule } from './recipes';
import { TechnologyTreesModule } from './technology-trees';

@Module({
    imports: [
        ConfigModule.forRoot(configModuleOptions),
        DatabaseModule,
        ItemsModule,
        TechnologyTreesModule,
        RecipesModule,
    ],
    controllers: [AppController],
})
export class AppModule {}

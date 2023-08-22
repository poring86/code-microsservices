import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { CategoriesModule } from './categories/categories.module';
import { ConfigModule } from './config/config.module';
import { DatabaseModule } from './database/database.module';
import { ShareModule } from './@share/@share.module';


@Module({
  imports: [ConfigModule.forRoot(), CategoriesModule, DatabaseModule, ShareModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule { }

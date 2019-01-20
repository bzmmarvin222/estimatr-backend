import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { SyncableModule } from './syncable/syncable.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import {Connection} from 'typeorm';

@Module({
  imports: [
      SyncableModule,
      TypeOrmModule.forRoot({
        type: 'mongodb',
        host: process.env.ESTIMATR_DB_HOST || 'localhost',
        port: +process.env.ESTIMATR_DB_PORT || 27017,
        username: process.env.ESTIMATR_DB_USERNAME || '',
        password: process.env.ESTIMATR_DB_PASSWORD || '',
        database: 'estimatr',
        entities: [__dirname + '/**/*.entity{.ts,.js}'],
        synchronize: true,
      }),
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {
    constructor(private readonly connection: Connection) {}
}

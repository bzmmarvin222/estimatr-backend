import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { SyncableModule } from './syncable/syncable.module';

@Module({
  imports: [SyncableModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}

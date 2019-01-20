import {Module} from '@nestjs/common';
import {SyncEstimationGateway} from './sync-gateway/sync-estimation.gateway';
import {EstimationController} from './estimation/estimation.controller';
import {SessionProviderService} from './services/session-provider/session-provider.service';
import {EstimationService} from './services/estimation/estimation.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import {EstimationEntity} from './shared/entities/estimation.entity';

@Module({
    imports: [
      TypeOrmModule.forFeature([EstimationEntity]),
    ],
    providers: [
        SyncEstimationGateway,
        SessionProviderService,
        EstimationService,
    ],
    controllers: [EstimationController],
})
export class SyncableModule {
}

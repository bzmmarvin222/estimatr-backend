import {Module} from '@nestjs/common';
import {SyncEstimationGateway} from './sync-gateway/sync-estimation.gateway';
import {EstimationController} from './estimation/estimation.controller';
import {SessionProviderService} from './services/session-provider/session-provider.service';

@Module({
    providers: [
        SyncEstimationGateway,
        SessionProviderService,
    ],
    controllers: [EstimationController],
})
export class SyncableModule {
}

import {Body, Controller, Put} from '@nestjs/common';
import {SessionProviderService} from '../services/session-provider/session-provider.service';
import {EstimationRoot} from '../shared/estimation';
import {SessionCreatedDto} from '../shared/dtos/session-created-dto';
import {SyncedSessionId} from '../shared/synced-session';

@Controller('api/estimation')
export class EstimationController {

    constructor(private readonly sessionProvider: SessionProviderService) {

    }

    @Put()
    newProject(@Body() projectRoot: EstimationRoot): SessionCreatedDto {
        const sessionId: SyncedSessionId = this.sessionProvider.createSession(projectRoot);
        return {sessionId};
    }
}

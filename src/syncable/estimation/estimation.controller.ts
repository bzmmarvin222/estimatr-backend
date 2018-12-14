import {Body, Controller, Post} from '@nestjs/common';
import {SessionProviderService} from '../services/session-provider/session-provider.service';
import {EstimationRoot} from '../shared/estimation';

@Controller('api/estimation')
export class EstimationController {

    constructor(private readonly sessionProvider: SessionProviderService) {

    }

    @Post()
    newProject(@Body() projectRoot: EstimationRoot): string {
        return this.sessionProvider.createSession(projectRoot);
    }
}

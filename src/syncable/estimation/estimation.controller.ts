import {Body, Controller, Put} from '@nestjs/common';
import {EstimationRoot} from '../shared/estimation';
import {SessionCreatedDto} from '../shared/dtos/session-created-dto';
import {EstimationId} from '../shared/synced-session';
import {EstimationService} from '../services/estimation/estimation.service';

@Controller('api/estimation')
export class EstimationController {

    constructor(private readonly estimation: EstimationService) {

    }

    @Put()
    async newProject(@Body() projectRoot: EstimationRoot): Promise<SessionCreatedDto> {
        const estimationId: EstimationId = await this.estimation.create(projectRoot);
        return {estimationId};
    }
}

import {Injectable, Logger} from '@nestjs/common';
import {Repository} from 'typeorm';
import {EstimationEntity} from '../../shared/entities/estimation.entity';
import {InjectRepository} from '@nestjs/typeorm';
import {EstimationNode, EstimationRoot} from '../../shared/estimation';
import {EstimationId} from '../../shared/synced-session';
import {OperationType, ServerHandler, SyncableResource, SyncableTree} from 'sync_ot';

@Injectable()
export class EstimationService {

    private readonly logger: Logger = new Logger(EstimationService.name);

    constructor(
        @InjectRepository(EstimationEntity)
        private readonly syncedSessionRepo: Repository<EstimationEntity>,
    ) {}

    public async create(projectRoot: EstimationRoot): Promise<EstimationId> {
        const tree = SyncableTree.root(projectRoot).toNonRecursive();
        const syncedSessionEntity: EstimationEntity = new EstimationEntity(tree);
        await this.syncedSessionRepo.save(syncedSessionEntity);
        this.logger.log(`Created new project with id ${syncedSessionEntity.id}`);
        return syncedSessionEntity.id.toString();
    }

    public async getEstimation(estimationId: EstimationId): Promise<SyncableResource<EstimationNode>> {
        const estimation = await this.syncedSessionRepo.findOne(estimationId);
        const syncHandler = new ServerHandler();
        const res: SyncableResource<EstimationNode> = new SyncableResource(syncHandler);
        res.queueOperation({type: OperationType.INIT, data: estimation.tree, objectPath: [], nodeId: estimation.tree.nodeId});
        return res;
    }

    public async updateEstimation(estimationId: EstimationId, estimation: SyncableTree<EstimationNode>): Promise<void> {
        const entity = await this.syncedSessionRepo.findOne(estimationId);
        entity.tree = estimation.toNonRecursive();
        this.syncedSessionRepo.save(entity).then(() => {
            this.logger.log(`Saved estimation ${estimationId} to the database.`);
        });
    }
}

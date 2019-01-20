import {Injectable, Logger} from '@nestjs/common';
import {ClientId, ClientSessions, ConnectedClients, SyncedSession, EstimationId} from '../../shared/synced-session';
import {ServerHandler, SyncableResource} from 'sync_ot';
import {EstimationNode, EstimationRoot} from '../../shared/estimation';
import {removeItem} from '../../../shared/util';
import {EstimationService} from '../estimation/estimation.service';

@Injectable()
export class SessionProviderService {
    private readonly logger: Logger = new Logger(SessionProviderService.name);

    private syncedSessions: SyncedSession = new Map<EstimationId, SyncableResource<EstimationNode>>();
    private connectedClients: ConnectedClients = new Map<EstimationId, ClientId[]>();
    private clientSessions: ClientSessions = new Map<ClientId, EstimationId>();

    constructor(
        private readonly estimation: EstimationService,
    ) { }

    public removeClient(clientId: ClientId): void {
        const estimationId = this.clientSessions.get(clientId);
        this.clientSessions.delete(clientId);

        const clients: ClientId[] = this.connectedClients.get(estimationId) || [];
        removeItem(clients, clientId);

        if (clients.length < 1) {
            this.logger.log(`All clients in session ${estimationId} left.`);
            const session: SyncableResource<EstimationNode> = this.syncedSessions.get(estimationId);
            this.syncedSessions.delete(estimationId);
            this.estimation.updateEstimation(estimationId, session.getCurrentTree()).then(() => {
                this.logger.log(`Session ${estimationId} successfully closed.`);
            });
        }
    }

    public addClient(estimationId: EstimationId, clientId: ClientId): void {
        if (!this.connectedClients.has(estimationId)) {
            this.connectedClients.set(estimationId, []);
        }
        this.connectedClients.get(estimationId).push(clientId);
        this.clientSessions.set(clientId, estimationId);
    }

    public getClients(estimationId: EstimationId): ClientId[] {
        return this.connectedClients.get(estimationId);
    }

    public async getSession(estimationId: EstimationId): Promise<SyncableResource<EstimationNode>> {
        let session: SyncableResource<EstimationNode> = this.syncedSessions.get(estimationId);
        if (!session) {
            session = await this.estimation.getEstimation(estimationId);
            this.syncedSessions.set(estimationId, session);
            this.logger.log(`Loaded project with id ${estimationId} from database`);
        }
        return session;
    }
}

import {OnGatewayConnection, OnGatewayDisconnect, SubscribeMessage, WebSocketGateway, WebSocketServer} from '@nestjs/websockets';
import {SessionProviderService} from '../services/session-provider/session-provider.service';
import {take} from 'rxjs/operators';
import {Operation, OperationType, SyncableTree} from 'sync_ot';
import {ClientId, EstimationId} from '../shared/synced-session';
import {Logger} from '@nestjs/common';
import {EstimationNode} from '../shared/estimation';

@WebSocketGateway()
export class SyncEstimationGateway implements OnGatewayConnection, OnGatewayDisconnect {
    private readonly logger: Logger = new Logger(SyncEstimationGateway.name);
    @WebSocketServer() server;

    constructor(private readonly sessionProvider: SessionProviderService) {
    }

    async handleConnection(client, ...args: any[]): Promise<void> {
        const estimationId: EstimationId = client.handshake.query.sessionId;
        const session = await this.sessionProvider.getSession(estimationId);
        // For later use
        const authToken: string = client.handshake.headers.authorization;

        if (!session) {
            this.logger.warn(`Session ${estimationId} does not exist. Client: ${client.id}`);
            return;
        }

        this.logger.log(`New connection for session ${estimationId} from client ${client.id}`);
        session.getTree$().pipe(take(1)).subscribe((v: SyncableTree<EstimationNode>) => {
            const init = {
                type: OperationType.INIT,
                data: v.toNonRecursive(),
                objectPath: [],
            };
            this.sessionProvider.addClient(estimationId, client.id);
            client.emit('init', init);
        });
    }

    @SubscribeMessage('message')
    async onEvent(client, data: string): Promise<void> {
        const estimationId: EstimationId = client.handshake.query.estimationId;
        const operation: Operation = JSON.parse(data);
        const session = await this.sessionProvider.getSession(estimationId);
        session.queueOperation(operation);
        const sessionClientIds: ClientId[] = this.sessionProvider.getClients(estimationId);
        this.broadCast(sessionClientIds, data);
    }

    handleDisconnect(client): any {
        this.logger.log(`Client ${client.id} disconnected.`);
        this.sessionProvider.removeClient(client.id);
    }

    private broadCast(clientIds: ClientId[], toBroadcast: string): void {
        clientIds.forEach(id => this.server.to(id).emit('message', toBroadcast));
    }
}

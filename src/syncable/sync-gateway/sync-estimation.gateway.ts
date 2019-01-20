import {OnGatewayConnection, OnGatewayDisconnect, SubscribeMessage, WebSocketGateway, WebSocketServer} from '@nestjs/websockets';
import {SessionProviderService} from '../services/session-provider/session-provider.service';
import {take} from 'rxjs/operators';
import {Operation, OperationType} from 'sync_ot';
import {ClientId, SyncedSessionId} from '../shared/synced-session';
import {Logger} from '@nestjs/common';

@WebSocketGateway()
export class SyncEstimationGateway implements OnGatewayConnection, OnGatewayDisconnect {
    private readonly logger: Logger = new Logger(SyncEstimationGateway.name);
    @WebSocketServer() server;

    constructor(private readonly sessionProvider: SessionProviderService) {
    }

    handleConnection(client, ...args: any[]): void {
        const sessionId: SyncedSessionId = client.handshake.query.sessionId;
        const session = this.sessionProvider.getSession(sessionId);
        // For later use
        const authToken: string = client.handshake.headers.authorization;

        if (!session) {
            this.logger.warn(`Session ${sessionId} does not exist. Client: ${client.id}`);
            return;
        }

        this.logger.log(`New connection for session ${sessionId} from client ${client.id}`);
        session.getTree$().pipe(take(1)).subscribe(v => {
            const init = {
                type: OperationType.INIT,
                data: v.toNonRecursive(),
                objectPath: [],
            };
            this.sessionProvider.addClient(sessionId, client.id);
            client.emit('init', init);
        });
    }

    @SubscribeMessage('message')
    onEvent(client, data: string): void {
        const sessionId: SyncedSessionId = client.handshake.query.sessionId;
        const operation: Operation = JSON.parse(data);
        this.sessionProvider.getSession(sessionId).queueOperation(operation);
        const sessionClientIds: ClientId[] = this.sessionProvider.getClients(sessionId);
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

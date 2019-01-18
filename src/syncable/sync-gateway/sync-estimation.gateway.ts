import {OnGatewayConnection, OnGatewayDisconnect, SubscribeMessage, WebSocketGateway, WebSocketServer} from '@nestjs/websockets';
import {SessionProviderService} from '../services/session-provider/session-provider.service';
import {take} from 'rxjs/operators';
import {Operation} from 'sync_ot';
import {ClientId, SyncedSessionId} from '../shared/synced-session';

@WebSocketGateway()
export class SyncEstimationGateway implements OnGatewayConnection, OnGatewayDisconnect {
    @WebSocketServer() server;

    constructor(private readonly sessionProvider: SessionProviderService) {
    }

    handleConnection(client, ...args: any[]): void {
        const sessionId: SyncedSessionId = client.handshake.query.sessionId;
        const session = this.sessionProvider.getSession(sessionId);
        const authToken: string = client.handshake.headers.authorization;
        console.log('AuthToken: ' + authToken);
        if (!session) {
            return;
        }
        session.getTree$().pipe(take(1)).subscribe(v => {
            const init = {
                range: {
                    start: -1,
                    end: -1,
                },
                type: 'INIT',
                data: v.toNonRecursive(),
                objectPath: [],
            };
            this.sessionProvider.getClients(sessionId).push(client.id);
            client.emit('init', init);
        });
    }

    @SubscribeMessage('message')
    onEvent(client, data: string): void {
        // console.log(client.id);
        // console.log(client.handshake.headers);
        // console.log(data);

        const sessionId: SyncedSessionId = client.handshake.query.sessionId;
        const operation: Operation = JSON.parse(data);
        this.sessionProvider.getSession(sessionId).queueOperation(operation);
        const sessionClientIds = this.sessionProvider.getClients(sessionId);
        this.broadCast(sessionClientIds, data);
    }

    handleDisconnect(client): any {
        console.log('client disconnected');
        console.log(client.id);
    }

    private broadCast(clientIds: ClientId[], toBroadcast: any): void {
        clientIds.forEach(id => this.server.to(id).emit('message', toBroadcast));
    }
}

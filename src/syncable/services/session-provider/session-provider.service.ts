import {Injectable, Logger} from '@nestjs/common';
import {ClientId, ClientSessions, ConnectedClients, SyncedSession, SyncedSessionId} from '../../shared/synced-session';
import {ServerHandler, SyncableResource} from 'sync_ot';
import {EstimationNode, EstimationRoot} from '../../shared/estimation';
import {Guid} from 'guid-typescript';
import {removeItem} from '../../../shared/util';

@Injectable()
export class SessionProviderService {
    private readonly logger: Logger = new Logger(SessionProviderService.name);

    private syncedSessions: SyncedSession = new Map<SyncedSessionId, SyncableResource<EstimationNode>>();
    private connectedClients: ConnectedClients = new Map<SyncedSessionId, ClientId[]>();
    private clientSessions: ClientSessions = new Map<ClientId, SyncedSessionId>();

    public removeClient(clientId: ClientId): void {
        const sessionId = this.clientSessions.get(clientId);
        this.clientSessions.delete(clientId);

        const clients: ClientId[] = this.connectedClients.get(sessionId) || [];
        removeItem(clients, clientId);

        if (clients.length < 1) {
            this.logger.log(`All clients in session ${sessionId} left.`);
            this.syncedSessions.delete(sessionId);
        //    TODO: persist the session (db)
        }
    }

    public addClient(sessionId: SyncedSessionId, clientId: ClientId): void {
        if (!this.connectedClients.has(sessionId)) {
            this.connectedClients.set(sessionId, []);
        }
        this.connectedClients.get(sessionId).push(clientId);
        this.clientSessions.set(clientId, sessionId);
    }

    public getClients(sessionId: SyncedSessionId): ClientId[] {
        return this.connectedClients.get(sessionId);
    }

    public getSession(sessionId: SyncedSessionId): SyncableResource<EstimationNode> {
        // if (!session) {
        //    // TODO: this should query an old session from storage or something
        //     this.createSession({projectTitle: 'Test', riskFactors: {low: 1, moderate: 1.5, high: 2, showstopper: 99}});
        //     session = this.syncedSessions.get(sessionId);
        //     this.connectedClients.set(sessionId, []);
        // }
        return this.syncedSessions.get(sessionId);
    }

    public createSession(projectRoot: EstimationRoot): SyncedSessionId {
        const handler = new ServerHandler();
        const resource = new SyncableResource(handler, projectRoot);
        const sessionId: SyncedSessionId = Guid.create().toString();
        // TODO: this should store to the db as the clients might not connect immediately
        this.syncedSessions.set(sessionId, resource);
        this.logger.log(`Created new project with id ${sessionId}`);
        return sessionId;
    }
}

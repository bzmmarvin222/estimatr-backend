import { Injectable } from '@nestjs/common';
import {ClientId, ConnectedClients, SyncedSession, SyncedSessionId} from '../../shared/synced-session';
import {ServerHandler, SyncableResource} from 'sync_ot';
import {EstimationNode, EstimationRoot} from '../../shared/estimation';

@Injectable()
export class SessionProviderService {
    private syncedSessions: SyncedSession = new Map<SyncedSessionId, SyncableResource<EstimationNode>>();
    private connectedClients: ConnectedClients = new Map<SyncedSessionId, ClientId[]>();

    public getClients(sessionId: SyncedSessionId): ClientId[] {
        return this.connectedClients.get(sessionId);
    }

    public getSession(sessionId: SyncedSessionId): SyncableResource<EstimationNode> {
        let session: SyncableResource<EstimationNode> = this.syncedSessions.get(sessionId);
        if (!session) {
           // TODO: this should query an old session from storage or something
            this.createSession({projectTitle: 'Test', riskFactors: {low: 1, moderate: 1.5, high: 2, showstopper: 99}});
            session = this.syncedSessions.get(sessionId);
            this.connectedClients.set(sessionId, []);
        }
        return session;
    }

    public createSession(projectRoot: EstimationRoot): string {
        const handler = new ServerHandler();
        const resource = new SyncableResource(handler, projectRoot);
        // TODO: return the generated session id
        this.syncedSessions.set('x', resource);
        this.connectedClients.set('x', []);
        return 'x';
    }
}

import {SyncableResource} from 'sync_ot';
import {EstimationNode} from './estimation';

export type SyncedSessionId = string;
export type ClientId = string;
export type SyncedSession = Map<SyncedSessionId, SyncableResource<EstimationNode>>;
export type ConnectedClients = Map<SyncedSessionId, ClientId[]>;

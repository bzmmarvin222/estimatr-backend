import {SyncableResource} from 'sync_ot';
import {EstimationNode} from './estimation';

export type EstimationId = string;
export type ClientId = string;
export type SyncedSession = Map<EstimationId, SyncableResource<EstimationNode>>;
export type ConnectedClients = Map<EstimationId, ClientId[]>;
export type ClientSessions = Map<ClientId, EstimationId>;

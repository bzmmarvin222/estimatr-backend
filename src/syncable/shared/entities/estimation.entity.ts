import {Column, Entity, ObjectID, ObjectIdColumn} from 'typeorm';
import {SyncableTreeJson} from 'sync_ot';
import {EstimationNode} from '../estimation';

@Entity()
export class EstimationEntity {
    @ObjectIdColumn()
    id: ObjectID;
    @Column()
    tree: SyncableTreeJson<EstimationNode>;

    constructor(tree: SyncableTreeJson<EstimationNode>) {
        this.tree = tree;
    }
}

import { ConfigurationSnapshotData, WorkStepPricesValuesByWorkStepSet } from '@igus/icalc-domain';
import { Column, Entity, Index, JoinColumn, ManyToOne, OneToOne, PrimaryGeneratedColumn } from 'typeorm';
import { SingleCableCalculationEntity } from './singleCableCalculation.entity';
import { ConfigurationEntity } from './configuration.entity';
import { UserEntity } from './user.entity';

@Entity('configuration_snapshot')
export class ConfigurationSnapshotEntity {
  @PrimaryGeneratedColumn('uuid')
  public id: string;

  @OneToOne(() => SingleCableCalculationEntity, (scc) => scc.snapshot)
  public singleCableCalculation: SingleCableCalculationEntity | null;

  @ManyToOne(() => ConfigurationEntity, (configuration) => configuration.snapshots)
  @JoinColumn({ name: 'is_snapshot_of', referencedColumnName: 'id' })
  public configurations: ConfigurationEntity | null;

  @Column({ name: 'is_snapshot_of', type: 'uuid' })
  public isSnapshotOf: string;

  @Column({ name: 'work_step_prices', type: 'json' })
  public workStepPrices: WorkStepPricesValuesByWorkStepSet;

  @Index('index_configuration_mat_number')
  @Column({ name: 'configuration_mat_number' })
  public configurationMatNumber: string;

  @Column({ name: 'configuration_data', type: 'jsonb' })
  public configurationData: ConfigurationSnapshotData;

  @Column({ name: 'creation_date', type: 'timestamptz', default: () => 'CURRENT_TIMESTAMP(6)' })
  public creationDate: Date;

  @Column({ name: 'modification_date', type: 'timestamptz', default: () => 'CURRENT_TIMESTAMP(6)' })
  public modificationDate: Date;

  @ManyToOne(() => UserEntity, (user) => user.createdConfigurationSnapshots)
  @JoinColumn({ name: 'created_by ', referencedColumnName: 'id' })
  public createdBy: UserEntity;

  @ManyToOne(() => UserEntity, (user) => user.modifiedConfigurationSnapshots)
  @JoinColumn({ name: 'modified_by ', referencedColumnName: 'id' })
  public modifiedBy: UserEntity;
}

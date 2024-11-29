import { CommercialWorkStepOverrides } from '@igus/icalc-domain';
import { CalculationEntity } from './calculation.entity';
import { ConfigurationSnapshotEntity } from './configurationSnapshot.entity';
import { ConfigurationEntity } from './configuration.entity';
import { UserEntity } from './user.entity';

import { Column, CreateDateColumn, Entity, JoinColumn, ManyToOne, PrimaryGeneratedColumn } from 'typeorm';

@Entity('single_cable_calculation')
export class SingleCableCalculationEntity {
  @PrimaryGeneratedColumn('uuid')
  public id: string;

  @Column({ name: 'calculation_id' })
  public calculationId: string;

  // will be null for a locked calculation
  @Column({ name: 'configuration_id', nullable: true })
  public configurationId: string;

  // will be set only for a locked calculation
  @Column({ name: 'snapshot_id', nullable: true })
  public snapshotId: string;

  @Column({ name: 'commercial_work_step_overrides', type: 'jsonb', default: {} })
  public commercialWorkStepOverrides: CommercialWorkStepOverrides;

  @ManyToOne(() => ConfigurationEntity, (configuration) => configuration.singleCableCalculations, {
    onDelete: 'CASCADE',
    onUpdate: 'CASCADE',
  })
  @JoinColumn({ name: 'configuration_id' })
  public configuration: ConfigurationEntity | null;

  @ManyToOne(() => CalculationEntity, (calculation) => calculation.singleCableCalculations, {
    onDelete: 'CASCADE',
    onUpdate: 'CASCADE',
  })
  @JoinColumn({ name: 'calculation_id' })
  public calculation!: CalculationEntity;

  @ManyToOne(() => ConfigurationSnapshotEntity, (configurationSnapshot) => configurationSnapshot.singleCableCalculation)
  @JoinColumn({ name: 'snapshot_id' })
  public snapshot: ConfigurationSnapshotEntity | null;

  @Column({ name: 'calculation_factor', type: 'decimal', nullable: true, precision: 10, scale: 2 })
  public calculationFactor: number;

  @Column({ name: 'batch_size', type: 'decimal', precision: 10, scale: 2 })
  public batchSize: number;

  // is not provided yet when configuration is created
  @Column({ name: 'chain_flex_length', type: 'decimal', nullable: true, precision: 10, scale: 2 })
  public chainflexLength: number | null;

  @ManyToOne(() => UserEntity, (user) => user.singleCableCalculations)
  @JoinColumn({ name: 'assigned_by_id ', referencedColumnName: 'id' })
  public assignedBy: UserEntity;

  @CreateDateColumn({ name: 'assignment_date', type: 'timestamptz', default: () => 'CURRENT_TIMESTAMP(6)' })
  public assignmentDate: Date;
}

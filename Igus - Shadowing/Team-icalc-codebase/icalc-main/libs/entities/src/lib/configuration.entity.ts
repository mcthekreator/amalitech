import { ConfigurationState } from '@igus/icalc-domain';
import { CalculationConfigurationStatusEntity } from './calculationConfigurationStatus.entity';
import { Column, Entity, JoinColumn, ManyToOne, OneToMany, PrimaryGeneratedColumn, Unique } from 'typeorm';

import { SingleCableCalculationEntity } from './singleCableCalculation.entity';
import { ConfigurationSnapshotEntity } from './configurationSnapshot.entity';

@Entity('configuration')
@Unique('MatNumberUniqueConstraint', ['matNumber'])
export class ConfigurationEntity {
  @OneToMany(() => ConfigurationEntity, (configuration) => configuration.parent)
  @JoinColumn({ name: 'is_copy_of_configuration' })
  public children: ConfigurationEntity[];

  @ManyToOne(() => ConfigurationEntity, (configuration) => configuration.children, { onDelete: 'SET NULL' })
  @JoinColumn({ name: 'is_copy_of_configuration' })
  public parent: ConfigurationEntity;

  @Column({ name: 'is_copy_of_configuration', nullable: true })
  public isCopyOfConfigurationId: string;

  @PrimaryGeneratedColumn('uuid')
  public id: string;

  @Column({ name: 'mat_number', unique: true })
  public matNumber: string;

  @Column({ name: 'labeling_left', nullable: true })
  public labelingLeft: string;

  @Column({ name: 'labeling_right', nullable: true })
  public labelingRight: string;

  @Column({ name: 'description', nullable: true })
  public description: string;

  @Column({ name: 'creation_date', type: 'timestamptz' })
  public creationDate: Date;

  @Column({ name: 'modification_date', type: 'timestamptz' })
  public modificationDate: Date;

  @Column({ name: 'created_by' })
  public createdBy: string;

  @Column({ name: 'modified_by' })
  public modifiedBy: string;

  @Column({ name: 'state', type: 'jsonb' })
  public state: ConfigurationState;

  @Column({ name: 'part_number', nullable: true })
  public partNumber: string;

  @OneToMany(() => ConfigurationSnapshotEntity, (configurationSnapshot) => configurationSnapshot.configurations)
  public snapshots: ConfigurationSnapshotEntity[];

  @OneToMany(
    () => CalculationConfigurationStatusEntity,
    (calculationConfigurationStatus) => calculationConfigurationStatus.status
  )
  public calculationConfigurationStatus: CalculationConfigurationStatusEntity[];

  @OneToMany(
    () => SingleCableCalculationEntity,
    (singleCableCalculationEntity) => singleCableCalculationEntity.configuration
  )
  public singleCableCalculations: SingleCableCalculationEntity[];
}

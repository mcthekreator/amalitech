import { Column, Entity, JoinColumn, ManyToOne, Unique } from 'typeorm';
import { CalculationEntity } from './calculation.entity';
import { ConfigurationEntity } from './configuration.entity';

@Entity('calculation_configuration_status')
@Unique(['calculationId', 'configurationId'])
export class CalculationConfigurationStatusEntity {
  @Column({ primary: true })
  public calculationId: string;

  @ManyToOne(() => CalculationEntity, (calculation) => calculation.calculationConfigurationStatus, { eager: false })
  @JoinColumn({ name: 'calculationId', referencedColumnName: 'id' }) // name: column name in this entity, referencedColumnName: column name in the referenced entity
  public calculation: CalculationEntity;

  @Column({ primary: true })
  public configurationId: string;

  @ManyToOne(() => ConfigurationEntity, (configuration) => configuration.calculationConfigurationStatus, {
    eager: false,
  })
  @JoinColumn({ name: 'configurationId', referencedColumnName: 'id' }) // name: column name in this entity, referencedColumnName: column name in the referenced entity
  public configuration: ConfigurationEntity;

  @Column()
  public status: string;

  @Column({ name: 'modification_date', type: 'timestamptz' })
  public modificationDate: Date;

  @Column({ name: 'modified_by' })
  public modifiedBy: string;
}

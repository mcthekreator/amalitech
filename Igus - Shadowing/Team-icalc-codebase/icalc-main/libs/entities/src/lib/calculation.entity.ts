import { Column, Entity, JoinColumn, ManyToOne, OneToMany, PrimaryGeneratedColumn, Unique } from 'typeorm';
import { CalculationConfigurationStatusEntity } from './calculationConfigurationStatus.entity';
import { SingleCableCalculationEntity } from './singleCableCalculation.entity';
import { CustomerTypeEnum, CalculationStatus } from '@igus/icalc-domain';

@Entity('calculation')
@Unique('calculationNumberUniqueConstraint', ['calculationNumber'])
export class CalculationEntity {
  @OneToMany(() => CalculationEntity, (configuration) => configuration.parent)
  @JoinColumn({ name: 'is_copy_of_calculation' })
  public children: CalculationEntity[];

  @ManyToOne(() => CalculationEntity, (configuration) => configuration.children, { onDelete: 'SET NULL' })
  @JoinColumn({ name: 'is_copy_of_calculation' })
  public parent: CalculationEntity;

  @PrimaryGeneratedColumn('uuid')
  public id: string;

  @Column({ name: 'calculation_number', unique: true })
  public calculationNumber: string;

  @Column({ name: 'calculation_factor', type: 'decimal', precision: 10, scale: 2 })
  public calculationFactor: number;

  @Column({ type: 'text', name: 'customer_type' })
  public customerType: CustomerTypeEnum;

  @Column({ name: 'customer', nullable: true })
  public customer: string;

  @Column({ name: 'quote_number', nullable: true })
  public quoteNumber: string;

  @Column({ name: 'production_plan_excel_downloaded', type: 'boolean', default: false })
  public productionPlanExcelDownloaded: boolean;

  @Column({ name: 'calculation_excel_downloaded', type: 'boolean', default: false })
  public calculationExcelDownloaded: boolean;

  @Column({ name: 'creation_date', type: 'timestamptz' })
  public creationDate: Date;

  @Column({ name: 'created_by' })
  public createdBy: string;

  @Column({ name: 'modification_date', type: 'timestamptz' })
  public modificationDate: Date;

  @Column({ name: 'modified_by' })
  public modifiedBy: string;

  @OneToMany(
    () => CalculationConfigurationStatusEntity,
    (calculationConfigurationStatus) => calculationConfigurationStatus.status
  )
  public calculationConfigurationStatus: CalculationConfigurationStatusEntity[];

  @OneToMany(
    () => SingleCableCalculationEntity,
    (singleCableCalculationEntity) => singleCableCalculationEntity.calculation,
    { cascade: true }
  )
  public singleCableCalculations: SingleCableCalculationEntity[];

  @Column({
    name: 'status',
    type: 'text',
    default: CalculationStatus.inProgress,
  })
  public status: CalculationStatus;

  @Column({ name: 'locking_date', type: 'timestamptz', nullable: true })
  public lockingDate: Date;

  @Column({ name: 'locked_by', nullable: true })
  public lockedBy: string;

  @Column({ name: 'mat017_item_risk_factor', type: 'decimal', precision: 10, scale: 3 })
  public mat017ItemRiskFactor: number;

  @Column({ name: 'mat017_item_and_work_step_risk_factor', type: 'decimal', precision: 10, scale: 3 })
  public mat017ItemAndWorkStepRiskFactor: number;
}

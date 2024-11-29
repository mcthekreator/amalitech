import { CableStructureInformation, OuterDiameter } from '@igus/icalc-domain';
import type { LocalizedStrings } from '@igus/icalc-domain';
import { ChainflexPriceEntity } from './chainflexPrice.entity';
import { Column, Entity, OneToOne, PrimaryGeneratedColumn, Unique } from 'typeorm';

@Entity('chainflex')
@Unique('partNumberUniqueConstraint', ['partNumber'])
export class ChainflexEntity {
  @PrimaryGeneratedColumn('uuid')
  public id: string;

  @Column({ name: 'part_number', unique: true, primary: true })
  public partNumber: string; // Artikelnummer

  @Column('jsonb')
  public description: LocalizedStrings; // Artikelname

  @Column({ name: 'overall_shield', type: 'boolean' })
  public overallShield: boolean;

  @Column({ name: 'outer_jacket', type: 'jsonb' })
  public outerJacket: LocalizedStrings; // Außenmantel

  @Column({ name: 'inner_jacket', type: 'jsonb' })
  public innerJacket: LocalizedStrings; // Innenmantel

  @Column({ name: 'number_of_cores' })
  public numberOfCores: string; // Aderzahl

  @Column({ name: 'nominal_cross_section', type: 'jsonb' })
  public nominalCrossSection: LocalizedStrings; // Aderquerschnitt

  @Column({ name: 'outer_diameter', type: 'jsonb' })
  public outerDiameter: OuterDiameter;

  @Column({ name: 'cable_structure', type: 'jsonb' })
  public cableStructure: LocalizedStrings; // Leitungsaufbau

  @Column({ name: 'shop_image_url' })
  public shopImageUrl: string;

  @Column({ type: 'boolean', nullable: true })
  public ul: boolean;

  @OneToOne(() => ChainflexPriceEntity, (chainflexPrice) => chainflexPrice.chainflex, {
    eager: true,
    createForeignKeyConstraints: false,
  })
  public price: ChainflexPriceEntity;

  @Column({ name: 'cable_structure_information', type: 'jsonb' })
  public cableStructureInformation: CableStructureInformation;
}

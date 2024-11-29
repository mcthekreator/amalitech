import { Column, Entity, JoinColumn, OneToOne, PrimaryGeneratedColumn } from 'typeorm';
import { ChainflexEntity } from './chainflex.entity';

@Entity('chainflex_prices')
export class ChainflexPriceEntity {
  @PrimaryGeneratedColumn('uuid')
  public id: string;

  @Column({ name: 'part_number', unique: true })
  public partNumber: string;

  @Column({ name: 'german_list_price', nullable: true, type: 'numeric' })
  public germanListPrice: number;

  @OneToOne(() => ChainflexEntity, (chainflex) => chainflex.price, { createForeignKeyConstraints: false })
  @JoinColumn({ name: 'part_number', referencedColumnName: 'partNumber' })
  public chainflex: ChainflexEntity;
}

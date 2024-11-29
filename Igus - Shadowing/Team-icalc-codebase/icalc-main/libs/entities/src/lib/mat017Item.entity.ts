import { Column, Entity, OneToMany, PrimaryGeneratedColumn, Unique, UpdateDateColumn } from 'typeorm';
import { FavoritesToMat017ItemEntity } from './favoritesToMat017Item.entity';
import { Mat017ItemStatus } from '@igus/icalc-domain';

@Entity('mat017_item')
@Unique('matNumberUniqueConstraint', ['matNumber'])
export class Mat017ItemEntity {
  @PrimaryGeneratedColumn('uuid')
  public id: string;

  @Column({ name: 'mat_number', unique: true, primary: true })
  public matNumber: string;

  @Column({ name: 'item_description_1', nullable: true })
  public itemDescription1: string;

  @Column({ name: 'item_description_2', nullable: true })
  public itemDescription2: string;

  @Column({ name: 'mat017_item_group', nullable: true })
  public mat017ItemGroup: string;

  @Column({ name: 'supplier_item_number', nullable: true })
  public supplierItemNumber: string;

  @Column({ name: 'price_unit', nullable: true, type: 'numeric' })
  public priceUnit: number;

  @Column({ nullable: true, type: 'numeric' })
  public amount: number;

  @Column({ name: 'amount_divided_by_price_unit', nullable: true, type: 'numeric' })
  public amountDividedByPriceUnit: number;

  @Column({ nullable: true, name: 'supplier_id' })
  public supplierId: string;

  @Column({ type: 'text', name: 'item_status', default: Mat017ItemStatus.active })
  public itemStatus: Mat017ItemStatus;

  @Column({ type: Boolean, name: 'manually_created', default: false })
  public manuallyCreated: boolean;

  @UpdateDateColumn({ name: 'modification_date', type: 'timestamptz', default: () => 'CURRENT_TIMESTAMP(6)' })
  public modificationDate: Date;

  @OneToMany(() => FavoritesToMat017ItemEntity, (favoritesToMat017Item) => favoritesToMat017Item.favorites, {
    eager: false,
  })
  public favoritesToMat017Items: FavoritesToMat017ItemEntity[];
}

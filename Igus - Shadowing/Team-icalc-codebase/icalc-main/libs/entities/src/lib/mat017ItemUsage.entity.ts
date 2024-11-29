import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';

@Entity('mat017_item_usages')
export class Mat017ItemUsageEntity {
  @PrimaryGeneratedColumn('uuid')
  public id: string;

  @Column({ name: 'part_number' })
  public chainFlexPartNumber: string;

  @Column({ name: 'mat_number' })
  public matNumber: string;

  @Column({ name: 'bom_id' })
  public bomId: string;
}

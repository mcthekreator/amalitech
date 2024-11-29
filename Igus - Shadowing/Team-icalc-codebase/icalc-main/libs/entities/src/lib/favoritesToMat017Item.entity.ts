import { Column, Entity, JoinColumn, ManyToOne, PrimaryGeneratedColumn, Unique } from 'typeorm';
import { Mat017ItemEntity } from './mat017Item.entity';
import { FavoritesEntity } from './favorites.entity';

@Entity('favorites_to_mat017_item')
@Unique(['favoritesId', 'matNumber'])
export class FavoritesToMat017ItemEntity {
  @PrimaryGeneratedColumn('uuid')
  public id: string;

  @Column({ name: 'favorites_id' })
  public favoritesId: string;

  @ManyToOne(() => FavoritesEntity, (favorites) => favorites.favoritesToMat017Items)
  @JoinColumn({ name: 'favorites_id', referencedColumnName: 'id' }) // name: column name  in this entity, referencedColumnName: column name in the referneced entity
  public favorites: FavoritesEntity;

  @Column({ name: 'mat_number' })
  public matNumber: string;

  @ManyToOne(() => Mat017ItemEntity, (mat017Item) => mat017Item.favoritesToMat017Items, { eager: true })
  @JoinColumn({ name: 'mat_number', referencedColumnName: 'matNumber' }) // name: column name  in this entity, referencedColumnName: column name in the referneced entity
  public mat017Item: Mat017ItemEntity;

  @Column()
  public amount: number;
}

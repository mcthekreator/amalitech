import { Column, Entity, OneToMany, PrimaryGeneratedColumn, Unique } from 'typeorm';
import { FavoritesToMat017ItemEntity } from './favoritesToMat017Item.entity';

@Entity('favorites')
@Unique('nameUniqueConstraint', ['name'])
export class FavoritesEntity {
  @PrimaryGeneratedColumn('uuid')
  public id: string;

  @Column({ name: 'name', unique: true })
  public name: string;

  @OneToMany(() => FavoritesToMat017ItemEntity, (favoritesToMat017Item) => favoritesToMat017Item.favorites, {
    eager: true,
  })
  public favoritesToMat017Items: FavoritesToMat017ItemEntity[];
}

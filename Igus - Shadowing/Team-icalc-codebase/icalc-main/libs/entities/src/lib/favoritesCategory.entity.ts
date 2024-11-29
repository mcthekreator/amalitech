import { Column, Entity, OneToMany, PrimaryGeneratedColumn, Unique } from 'typeorm';
import { FavoritesEntity } from './favorites.entity';
import { LocalizedStrings } from '@igus/icalc-domain';

@Entity('favorites_category')
@Unique('nameUniqueConstraint', ['name'])
export class FavoritesCategoryEntity {
  @PrimaryGeneratedColumn('uuid')
  public id: string;

  @Column({ name: 'name', type: 'jsonb' })
  public name: LocalizedStrings;

  @OneToMany(() => FavoritesEntity, (favorites) => favorites.favoritesCategory, {
    eager: true,
  })
  public favorites: FavoritesEntity[];
}

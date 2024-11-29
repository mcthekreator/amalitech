import type { Favorites, FavoritesToMat017Item } from '@igus/icalc-domain';
import { FavoritesEntity, FavoritesToMat017ItemEntity } from '@igus/icalc-entities';
import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { ICALC_CONNECTION } from '@igus/icalc-common';
import { Repository } from 'typeorm';
import type { FavoritesDto } from '../dtos/favorites.dto';
// import { initialFavorites } from '../favorites-data/initial-favorites';

@Injectable()
export class FavoritesService {
  constructor(
    @InjectRepository(FavoritesEntity, ICALC_CONNECTION)
    private readonly favoritesRepository: Repository<Favorites>,
    @InjectRepository(FavoritesToMat017ItemEntity, ICALC_CONNECTION)
    private readonly favoritesToMat017ItemRepository: Repository<FavoritesToMat017Item>
  ) {}

  public async getAllFavorites(): Promise<Favorites[]> {
    return this.favoritesRepository.find();
  }

  public async getFavoritesToMat017ItemsByFavoritesId(favoritesId: string): Promise<FavoritesToMat017Item[]> {
    return this.favoritesToMat017ItemRepository.find({
      where: {
        favoritesId,
      },
    });
  }

  public async createFavorites(favoritesDto: FavoritesDto): Promise<Favorites> {
    const newFavoriteEntry = await this.favoritesRepository.save({
      name: favoritesDto.name,
    });

    favoritesDto.favoritesToMat017ItemsDto.forEach((favoritesToMat017Item) => {
      this.favoritesToMat017ItemRepository.save({
        favoritesId: newFavoriteEntry.id,
        matNumber: favoritesToMat017Item.matNumber,
        amount: favoritesToMat017Item.amount,
      });
    });

    return newFavoriteEntry;
  }
}

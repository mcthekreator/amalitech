import { InjectRepository } from '@nestjs/typeorm';
import { ICALC_CONNECTION } from '@igus/icalc-common';
import { Injectable } from '@nestjs/common';
import { Favorites, FavoritesToMat017Item } from '@igus/icalc-domain';
import { FavoritesEntity, FavoritesToMat017ItemEntity } from '@igus/icalc-entities';
import { Repository } from 'typeorm';

@Injectable()
export class FavoriteDataAccessService {
  constructor(
    @InjectRepository(FavoritesEntity, ICALC_CONNECTION)
    private readonly favoritesRepository: Repository<Favorites>,
    @InjectRepository(FavoritesToMat017ItemEntity, ICALC_CONNECTION)
    private readonly favoritesToMat017ItemRepository: Repository<FavoritesToMat017Item>
  ) {}
}

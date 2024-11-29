import type { Favorites, FavoritesToMat017Item } from '@igus/icalc-domain';
import { Body, Controller, Get, Param, Post } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { FavoritesDto } from '../dtos/favorites.dto';
import { FavoritesService } from '../services/favorites.service';

@ApiTags('favorites')
@Controller('favorites')
export class FavoritesController {
  constructor(private readonly favoritesService: FavoritesService) {}

  @Get('')
  public getAllFavorites(): Promise<Favorites[]> {
    return this.favoritesService.getAllFavorites();
  }

  @Get(':favoritesId/favoritesToMat017Items')
  public getFavoritesToMat017ItemsByFavoritesId(
    @Param('favoritesId') favoritesId: string
  ): Promise<FavoritesToMat017Item[]> {
    return this.favoritesService.getFavoritesToMat017ItemsByFavoritesId(favoritesId);
  }

  @Post()
  public create(@Body() favoritesDto: FavoritesDto): Promise<Favorites> {
    return this.favoritesService.createFavorites(favoritesDto);
  }
}

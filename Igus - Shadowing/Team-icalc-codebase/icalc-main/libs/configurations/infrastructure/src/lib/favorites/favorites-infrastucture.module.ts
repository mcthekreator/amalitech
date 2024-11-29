import { ICALC_CONNECTION } from '@igus/icalc-common';
import { FavoritesEntity, FavoritesToMat017ItemEntity } from '@igus/icalc-entities';
import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { FavoriteDataAccessService } from './favorites-data-access.service';
import { FavoriteFileParsingService } from './favorites-file-parsing.service';
import { FavoritesInfrastructureModuleLogger } from './logger.service';

@Module({
  imports: [TypeOrmModule.forFeature([FavoritesEntity, FavoritesToMat017ItemEntity], ICALC_CONNECTION)],
  providers: [FavoriteDataAccessService, FavoriteFileParsingService, FavoritesInfrastructureModuleLogger],
  exports: [FavoriteDataAccessService, TypeOrmModule, FavoriteFileParsingService],
})
export class FavoriteInfrastructureModule {}

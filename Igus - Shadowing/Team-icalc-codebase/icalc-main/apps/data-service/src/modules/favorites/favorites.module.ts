import { FavoritesEntity, FavoritesToMat017ItemEntity } from '@igus/icalc-entities';
import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ICALC_CONNECTION } from '@igus/icalc-common';
import { FavoritesController } from './controllers/favorites.controller';
import { FavoritesService } from './services/favorites.service';

@Module({
  imports: [TypeOrmModule.forFeature([FavoritesEntity, FavoritesToMat017ItemEntity], ICALC_CONNECTION)],
  controllers: [FavoritesController],
  providers: [FavoritesService],
})
export class FavoritesModule {}

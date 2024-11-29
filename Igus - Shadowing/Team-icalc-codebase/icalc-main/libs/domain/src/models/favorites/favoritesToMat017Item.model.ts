import type { Favorites, Mat017Item } from '../../models';

// model for FavoritesToMat017ItemEntity
export interface FavoritesToMat017Item {
  id: string;
  favoritesId: string;
  favorites?: Favorites;
  matNumber: string;
  mat017Item?: Mat017Item;
  amount: number;
  checked?: boolean;
}

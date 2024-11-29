import {
  Component,
  ChangeDetectionStrategy,
  ViewEncapsulation,
  EventEmitter,
  Output,
  Inject,
  OnInit,
  ChangeDetectorRef,
  OnDestroy,
} from '@angular/core';
import { FormArray, FormBuilder, FormControl, FormGroup } from '@angular/forms';
import { MatCheckboxChange } from '@angular/material/checkbox';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { ProcessStateFacadeService } from '@icalc/frontend/app/modules/core/state/process-state/process-state-facade.service';
import { Mat017ItemStatus } from '@igus/icalc-domain';
import type { FavoritesToMat017Item, Favorites, ChainflexCable, LocalizedStrings } from '@igus/icalc-domain';
import { combineLatest, debounceTime, filter, Observable, Subscription, take } from 'rxjs';

export enum FavoriteItemTemplatesEnum {
  generalTemplates = 'GENERAL_TEMPLATES',
}

interface FavoritesPresentation extends Favorites {
  checked: boolean;
  isPartiallySelected: boolean;
}
@Component({
  changeDetection: ChangeDetectionStrategy.OnPush,
  selector: 'icalc-connector-mat017-item-favorites',
  templateUrl: './mat017-item-favorites.component.html',
  styleUrls: ['./mat017-item-favorites.component.scss'],
  encapsulation: ViewEncapsulation.Emulated,
})
export class Mat017ItemFavoritesComponent implements OnInit, OnDestroy {
  @Output() public readonly selectFavorites = new EventEmitter<Favorites>();

  public favorites: Favorites[];
  public favoritesById = new Map<string, FavoritesPresentation>();
  public validMat017ItemStatus: string = Mat017ItemStatus.active;
  public itemHasBeenRemoved: string = Mat017ItemStatus.removed;
  public favoritesIsLoading$: Observable<boolean>;
  public form: FormGroup;
  public isFormReady: boolean;
  public chainflexCable$: Observable<ChainflexCable>;
  public chainflexCableStructure$: Observable<LocalizedStrings>;
  public currentCategory: FavoriteItemTemplatesEnum = FavoriteItemTemplatesEnum.generalTemplates;
  public selectedFavorites = new Map<string, FavoritesPresentation>();
  public favoriteItemTemplates = [
    {
      name: FavoriteItemTemplatesEnum.generalTemplates,
      icon: 'star',
    },
  ];

  public displayedColumns: string[] = [
    'select',
    'matNumber',
    'itemDescription1',
    'itemDescription2',
    'mat017ItemGroup',
    'amount',
  ];

  private subscriptions = new Subscription();

  constructor(
    @Inject(MAT_DIALOG_DATA)
    public dialogData: { favorites$: Observable<Favorites[]>; favoritesIsLoading$: Observable<boolean> },
    private dialogRef: MatDialogRef<Mat017ItemFavoritesComponent>,
    private processStateFacadeService: ProcessStateFacadeService,
    private fb: FormBuilder,
    private cdr: ChangeDetectorRef
  ) {}

  public get favoriteGroupsArray(): FormArray {
    return this.form.get('favoriteGroups') as FormArray;
  }

  public getFavoriteGroupsArray(groupIndex: number): FormArray {
    return this.form.get(['favoriteGroups', groupIndex, 'favoritesToMat017Items']) as FormArray;
  }

  public ngOnInit(): void {
    this.favoritesIsLoading$ = this.dialogData.favoritesIsLoading$;
    this.chainflexCable$ = this.processStateFacadeService.chainflexCable$;
    this.chainflexCableStructure$ = this.processStateFacadeService.chainflexCableStructure$;
    this.subscriptions.add(
      combineLatest([this.dialogData.favoritesIsLoading$, this.dialogData.favorites$])
        .pipe(
          filter(([isLoading, favorites]) => !isLoading && !!favorites.length),
          take(1)
        )
        .subscribe(([_, favorites]) => {
          this.favorites = favorites;
          this.favoritesById = this.transformFavoritesToPresentation(favorites);
          this.createForm();
          this.isFormReady = true;
        })
    );
  }

  public onAddItems(): void {
    const data = this.getSelectedFavorites();

    this.dialogRef.close(data);
  }

  public favoriteGroupIsPartiallySelected(groupIndex: number): boolean {
    const group = (this.form.get('favoriteGroups') as FormArray).at(groupIndex) as FormGroup;
    const partiallySelectedControl = group.get('isPartiallySelected');

    if (partiallySelectedControl) {
      return partiallySelectedControl.value;
    }

    return false;
  }

  public onFavoriteItemCheckboxChange(event: MatCheckboxChange, favoriteGroupIndex: number, itemIndex: number): void {
    const control = this.getFavoriteItemControl(favoriteGroupIndex, itemIndex);

    control.setValue(event.checked);
  }

  public onFavoriteGroupCheckboxChange(event: MatCheckboxChange, groupIndex: number): void {
    const subItemsArray = this.getFavoriteGroupsArray(groupIndex);
    const group = (this.form.get('favoriteGroups') as FormArray).at(groupIndex) as FormGroup;

    const accordionExpansionStatus = group.get('isExpanded') as FormControl;

    subItemsArray.controls.forEach((control) => control.setValue(event.checked));
    if (event.checked) {
      accordionExpansionStatus.setValue(false, { emitEvent: false });
    }
  }

  public getIsExpanded(groupIndex?: number): boolean {
    const group = (this.form.get('favoriteGroups') as FormArray).at(groupIndex) as FormGroup;

    const accordionExpansionStatus = group.get('isExpanded') as FormControl;

    return accordionExpansionStatus.value;
  }

  public getFavoriteItemControl(itemIndex: number, subItemIndex: number): FormControl {
    return this.getFavoriteGroupsArray(itemIndex).at(subItemIndex) as FormControl;
  }

  public getFavoriteGroupControl(itemIndex: number): FormControl {
    return this.favoriteGroupsArray.at(itemIndex).get('checked') as FormControl;
  }

  public ngOnDestroy(): void {
    this.subscriptions.unsubscribe();
  }

  public onCategoryListItemClicked(newCategory: FavoriteItemTemplatesEnum): void {
    if (newCategory === this.currentCategory) return;

    //TODO in ICALC-702: cache selections this.cacheCategorySelectedFavorites and fetch new Category
  }

  private getPreviousFavoriteGroupState(favorite: Favorites): FavoritesPresentation {
    return this.selectedFavorites.get(favorite.id);
  }

  private createForm(): void {
    const controls: FormGroup[] = [];

    this.favoritesById.forEach((itemList) => {
      const itemInPreviousSelection = this.getPreviousFavoriteGroupState(itemList);

      const item = itemInPreviousSelection ? itemInPreviousSelection : itemList;

      const form = this.fb.group({
        id: item.id,
        name: item.name,
        checked: this.fb.control(item.checked),
        isPartiallySelected: item.isPartiallySelected,
        isExpanded: false,
        favoritesToMat017Items: this.fb.array(
          item.favoritesToMat017Items.map((favoriteItem) =>
            this.fb.control({
              value: favoriteItem.checked,
              disabled: favoriteItem.mat017Item.itemStatus !== Mat017ItemStatus.active,
            })
          )
        ),
      });

      controls.push(form);
    });

    this.form = this.fb.group({
      favoriteGroups: this.fb.array(controls),
    });
    const matItemsArray = this.form.get('favoriteGroups') as FormArray;

    matItemsArray.controls.forEach((group: FormGroup) => {
      const favoritesToMat017Items = group.get('favoritesToMat017Items') as FormArray;

      this.subscriptions.add(
        favoritesToMat017Items.valueChanges.pipe(debounceTime(100)).subscribe(() => {
          this.updateGroupCheckboxState(group);
        })
      );
    });
  }

  private filterInvalidFavorites(favorites: Favorites): Favorites {
    const favoritesToMat017Items = favorites.favoritesToMat017Items;
    const filteredFavoritesToMat017Items = favoritesToMat017Items.filter(
      (favoriteItem) => !!this.isFavoriteValid(favoriteItem)
    );

    return { ...favorites, favoritesToMat017Items: filteredFavoritesToMat017Items };
  }

  private isFavoriteValid(favoriteItem: FavoritesToMat017Item): boolean {
    return favoriteItem?.mat017Item?.itemStatus === Mat017ItemStatus.active;
  }

  private transformFavoritesToPresentation(favorites: Favorites[]): Map<string, FavoritesPresentation> {
    return favorites.reduce((acc, current) => {
      acc.set(current.id, {
        ...current,
        isPartiallySelected: false,
        checked: false,
        favoritesToMat017Items: current.favoritesToMat017Items.map((favoriteItem) => ({
          ...favoriteItem,
          checked: false,
        })),
      });
      return acc;
    }, new Map<string, FavoritesPresentation>());
  }

  private updateGroupCheckboxState(group: FormGroup): void {
    const favoriteGroupArray = group.get('favoritesToMat017Items') as FormArray;
    const partiallySelectedControl = group.get('isPartiallySelected') as FormControl;
    const isExpanded = group.get('isExpanded') as FormControl;
    const allChecked = favoriteGroupArray.controls.every((control) => control.value === true);

    if (!allChecked) {
      const nonChecked = !favoriteGroupArray.controls.some((control) => control.value === true);

      if (nonChecked) {
        isExpanded.setValue(false, { emitEvent: false });
      }
      partiallySelectedControl.setValue(!nonChecked, { emitEvent: false });
    } else {
      partiallySelectedControl.setValue(false, { emitEvent: false });
      isExpanded.setValue(true, { emitEvent: false });
    }

    group.get('checked').setValue(allChecked, { emitEvent: false });
    this.cdr.detectChanges();
  }

  private getSelectedFavorites(): FavoritesToMat017Item[] {
    return this.favoriteGroupsArray.controls.reduce((acc: FavoritesToMat017Item[], group: FormGroup) => {
      const isChecked = group.get('checked')?.value;
      const id = group.get('id')?.value;
      const isPartiallySelected = group.get('isPartiallySelected')?.value;

      if (isChecked || isPartiallySelected) {
        const selectedItems = (group.get('favoritesToMat017Items') as FormArray).controls.reduce(
          (itemsAcc: FavoritesToMat017Item[], control, itemIndex) => {
            if (control.value === true) {
              const currentFavoriteItem = this.favoritesById.get(id).favoritesToMat017Items[itemIndex];
              const isCurrentFavoriteItemValid = this.isFavoriteValid(currentFavoriteItem);

              if (isCurrentFavoriteItemValid) itemsAcc.push(currentFavoriteItem);
            }
            return itemsAcc;
          },
          []
        );

        acc.push(...selectedItems);
      }

      return acc;
    }, []);
  }

  private cacheCategorySelectedFavorites(): void {
    this.selectedFavorites = this.favoriteGroupsArray.controls.reduce(
      (acc: Map<string, FavoritesPresentation>, group: FormGroup) => {
        const isChecked = group.get('checked')?.value;
        const id = group.get('id')?.value;
        const isPartiallySelected = group.get('isPartiallySelected')?.value;

        if (isChecked || isPartiallySelected) {
          const favoritesToMat017Items = (group.get('favoritesToMat017Items') as FormArray).controls.map(
            (control, controlIndex) => ({
              ...this.favoritesById.get(id).favoritesToMat017Items[controlIndex],
              checked: control?.value,
            })
          );

          acc.set(id, { ...this.favoritesById.get(id), favoritesToMat017Items });
        }

        return acc;
      },
      new Map<string, FavoritesPresentation>()
    );
  }
}

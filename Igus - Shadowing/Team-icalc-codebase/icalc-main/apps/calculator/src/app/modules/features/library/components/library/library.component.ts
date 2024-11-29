import { formatDate } from '@angular/common';
import type { OnDestroy, OnInit } from '@angular/core';
import { ChangeDetectorRef, Component, Inject, LOCALE_ID, ChangeDetectionStrategy } from '@angular/core';
import { Router } from '@angular/router';
import { AppStateFacadeService } from '@icalc/frontend/app/modules/core/state/app-state/app-state-facade.service';
import type { IcalcStep } from '@icalc/frontend/app/modules/core/state/app-state/app-state.model';
import { LibraryStateFacadeService } from '@icalc/frontend/app/modules/core/state/library-state/library-state-facade.service';
import { ProcessStateFacadeService } from '@icalc/frontend/app/modules/core/state/process-state/process-state-facade.service';
import { HtmlToImageService } from '@icalc/frontend/app/modules/shared/services/html-to-image.service';
import type {
  ConfigurationPresentation,
  IcalcArrow,
  IcalcBox,
  IcalcCircle,
  IcalcComment,
  IcalcImage,
  IcalcLibrary,
  IcalcLine,
  Mat017ItemWithWidenData,
  WidenTitleTag,
} from '@igus/icalc-domain';
import { ArrayUtils, ObjectUtils, StringUtils } from '@igus/icalc-utils';
import type { Observable } from 'rxjs';
import { take, BehaviorSubject, filter, map, of, Subject, Subscription, tap, combineLatestWith } from 'rxjs';
import {
  getMatNumbersOfMat017ItemsFromConnectorStateOnSide,
  areMatNumbersOfMat017ItemsPresentInConnectorStateOnSide,
} from '@igus/icalc-domain';
import { IcalcLibraryMat017ItemLoadingStatus } from '@icalc/frontend/app/modules/core/state/library-state/library-state.model';

@Component({
  changeDetection: ChangeDetectionStrategy.OnPush,
  selector: 'icalc-library',
  templateUrl: './library.component.html',
  styleUrls: ['./library.component.scss'],
})
export class LibraryComponent implements OnInit, OnDestroy {
  public selectedId$: Observable<string> = of(null);

  public nextStep$: Observable<IcalcStep>;
  public previousStep$: Observable<IcalcStep>;
  public imageList$: Observable<IcalcImage[]>;
  public leftChainFlex$: Observable<{ fontSize: number; text: string }>;
  public rightChainFlex$: Observable<{ fontSize: number; text: string }>;
  public commentList$: Observable<IcalcComment[]>;
  public isLibraryValid$: Observable<boolean>;

  public isLocked: boolean;
  public isLocked$: Observable<boolean>;

  public boxList$: Observable<IcalcBox[]>;
  public circleList$: Observable<IcalcCircle[]>;
  public lineList$: Observable<IcalcLine[]>;
  public arrowList$: Observable<IcalcArrow[]>;
  public configurationMatNumber: string;
  public selectedFiles?: FileList;
  public maxSize = 21;
  public minSize = 7;
  public chainFlexLabelLeft$: Observable<string>;
  public chainFlexLabelRight$: Observable<string>;
  public date$: Observable<string>;
  public allItemList: Mat017ItemWithWidenData[];
  public mat017ItemLoadingStatus: Record<string, IcalcLibraryMat017ItemLoadingStatus>;

  public leftMarkerDistance$: Observable<number>;
  public leftMarkerDistanceSubject$: Subject<number> = new Subject();
  public rightMarkerDistance$: Observable<number>;
  public rightMarkerDistanceSubject$: Subject<number> = new Subject();
  public subscription = new Subscription();
  public isNavigating = false;

  private selectedIdSub: BehaviorSubject<string> = new BehaviorSubject<string>(null);
  private configuration: ConfigurationPresentation;
  private alreadyCalledLeavingLibraryPageStarted = false;

  constructor(
    private appStateFacadeService: AppStateFacadeService,
    private libraryStateFacadeService: LibraryStateFacadeService,
    private processStateFacadeService: ProcessStateFacadeService,
    private htmlToImageService: HtmlToImageService,
    private router: Router,
    private changeDetection: ChangeDetectorRef,
    @Inject(LOCALE_ID) public locale: string
  ) {
    this.libraryStateFacadeService.enteringLibraryPageStarted();
    this.selectedId$ = this.selectedIdSub.asObservable();
  }

  public ngOnInit(): void {
    this.nextStep$ = this.appStateFacadeService.nextStep$;
    this.previousStep$ = this.appStateFacadeService.previousStep$;
    this.leftChainFlex$ = this.libraryStateFacadeService.leftChainFlex$;
    this.rightChainFlex$ = this.libraryStateFacadeService.rightChainFlex$;
    this.imageList$ = this.libraryStateFacadeService.imageList$;
    this.commentList$ = this.libraryStateFacadeService.commentList$;

    this.boxList$ = this.libraryStateFacadeService.boxList$;
    this.circleList$ = this.libraryStateFacadeService.circleList$;
    this.lineList$ = this.libraryStateFacadeService.lineList$;
    this.arrowList$ = this.libraryStateFacadeService.arrowList$;
    this.chainFlexLabelLeft$ = this.processStateFacadeService.selectedConfigurationData$.pipe(
      map((configuration) => configuration?.labelingLeft)
    );
    this.chainFlexLabelRight$ = this.processStateFacadeService.selectedConfigurationData$.pipe(
      map((configuraiton) => configuraiton?.labelingRight)
    );

    this.date$ = this.libraryStateFacadeService.sketchDate$;

    this.leftMarkerDistance$ = this.libraryStateFacadeService.leftMarkerDistance$;
    this.rightMarkerDistance$ = this.libraryStateFacadeService.rightMarkerDistance$;

    this.subscription.add(
      this.leftMarkerDistanceSubject$.subscribe((value) =>
        this.libraryStateFacadeService.changeMarkerDistance({ which: 'left', value })
      )
    );
    this.subscription.add(
      this.rightMarkerDistanceSubject$.subscribe((value) =>
        this.libraryStateFacadeService.changeMarkerDistance({ which: 'right', value })
      )
    );

    this.subscription.add(
      this.processStateFacadeService.selectedConfigurationData$
        .pipe(
          filter((value) => !!value),
          tap((value) => (this.configuration = value)),
          map((value) => ({
            labelingLeft: value.labelingLeft,
            labelingRight: value.labelingRight,
            matNumber: value.matNumber,
            libraryState: value.state.libraryState || null,
            connectorState: value.state.connectorState,
          })),
          filter(({ connectorState }) => this.bothConnectorsHaveMat017ItemList(connectorState))
        )
        .subscribe(({ labelingLeft, labelingRight, matNumber, libraryState, connectorState }) => {
          const { leftConnector, rightConnector } = connectorState;

          this.allItemList = [
            ...ArrayUtils.fallBackToEmptyArray(leftConnector.mat017ItemListWithWidenData),
            ...ArrayUtils.fallBackToEmptyArray(rightConnector.mat017ItemListWithWidenData),
          ];

          if (!this.configurationMatNumber) {
            this.setupInitialLibrary(libraryState, labelingLeft, labelingRight);
          }

          this.configurationMatNumber = matNumber;
        })
    );

    this.subscription.add(
      this.libraryStateFacadeService.mat017ItemLoadingStatus$.subscribe((value) => {
        this.mat017ItemLoadingStatus = value;
        this.changeDetection.detectChanges();
      })
    );

    this.subscription.add(this.processStateFacadeService.isLocked$.subscribe((value) => (this.isLocked = value)));
    this.isLibraryValid$ = this.isLibraryValid();
  }

  public ngOnDestroy(): void {
    this.startLeavingLibrary();
  }

  public resetActions(event: MouseEvent): void {
    const voidClickIds: string[] = ['chainflex-wrapper', 'drop-area'];

    if (voidClickIds.some((id) => id === (event.target as HTMLElement).id)) this.selectedIdSub.next(null);
  }

  public onAddImage(id: string, src: string, group: string): void {
    this.libraryStateFacadeService.addToImageList({ id, src, group });
  }

  public onAddComment(): void {
    this.libraryStateFacadeService.addToCommentList({ text: 'Kommentar' });
  }

  public onAddBox(): void {
    this.libraryStateFacadeService.addToBoxList();
  }

  public onAddCircle(): void {
    this.libraryStateFacadeService.addToCircleList();
  }

  public onAddLine(): void {
    this.libraryStateFacadeService.addToLineList();
  }

  public onAddArrow(): void {
    this.libraryStateFacadeService.addToArrowList();
  }

  public selectImageFiles(event): void {
    this.selectedFiles = event.target.files;

    if (this.selectedFiles && this.selectedFiles[0]) {
      const id = StringUtils.generateGuid();
      const reader = new FileReader();

      reader.onload = (e: ProgressEvent<FileReader>): void => {
        try {
          let width: number;
          let height: number;

          const img = document.createElement('img');

          img.onload = (): void => {
            try {
              width = +(img.naturalWidth || img.width);
              height = +(img.naturalHeight || img.height);

              this.libraryStateFacadeService.addToImageList({
                id,
                src: e.target.result as string,
                aspectRatio: isNaN(height) || isNaN(width) ? null : height / width,
              });
              this.changeDetection.detectChanges();
            } catch (error) {
              console.log('can not add file to the library');
            }
          };
          img.src = e.target.result as string;
        } catch (error) {
          console.log('can not read image files');
        }
      };

      reader.readAsDataURL(this.selectedFiles[0]);
    }
  }

  public selectFiles(
    event,
    matNumber: string,
    itemDescription1: string,
    itemDescription2: string,
    picType: WidenTitleTag
  ): void {
    const file: File = event.target?.files?.[0];

    const typeMap = {
      pinAss: ['TD', '_pin_'],
      techDraw: ['TD', '_'],
      photo: ['PROD', '_'],
    };

    const picTag = typeMap[picType]?.[0] ?? '';
    const pin = typeMap[picType]?.[1] ?? '';

    if (file) {
      const fileName = `${file.name}`;

      this.libraryStateFacadeService.addingWidenImageStarted({
        filename: `RCA_${picTag}${pin}${matNumber}_low_quality${fileName.substring?.(file.name.lastIndexOf('.'))}`,
        file,
        matNumber,
        description: `picture type:${picType}, ${itemDescription1}, ${itemDescription2}`,
        titleTag: picType,
      });
    }
  }

  public changeCommentText(id, text, rotationDegree: number): void {
    this.libraryStateFacadeService.updateSketchItemInfo({
      id,
      type: 'comment',
      sketchItemChange: { text, rotationDegree },
    });
  }

  public addItemPosition(event, id, type: 'image' | 'comment' | 'box' | 'circle' | 'line' | 'arrow'): void {
    this.libraryStateFacadeService.updateSketchItemInfo({
      id,
      type,
      sketchItemChange: { ...event.distance },
    });
  }

  public onItemResize(
    $event: { width: number; height: number },
    id,
    type: 'image' | 'comment' | 'box' | 'circle' | 'line' | 'arrow',
    rotationDegree: number
  ): void {
    this.libraryStateFacadeService.updateSketchItemInfo({
      id,
      type,
      sketchItemChange: { ...$event, rotationDegree },
    });
  }

  public onItemFlip(
    $event: { isFlipped: boolean },
    id,
    type: 'image' | 'comment' | 'box' | 'circle' | 'line' | 'arrow',
    rotationDegree: number
  ): void {
    this.libraryStateFacadeService.updateSketchItemInfo({
      id,
      type,
      sketchItemChange: { isFlipped: !$event.isFlipped, rotationDegree },
    });
  }

  public onItemRotate(
    $event: { rotationDegree: number },
    id,
    type: 'image' | 'comment' | 'box' | 'circle' | 'line' | 'arrow'
  ): void {
    this.libraryStateFacadeService.updateSketchItemInfo({
      id,
      type,
      sketchItemChange: { rotationDegree: $event.rotationDegree + 15 },
    });
  }

  public changeCommentFontSize(
    commentId: string,
    fontSize: number,
    type: 'decrease' | 'increase',
    rotationDegree: number
  ): void {
    const newFontSize = type === 'decrease' ? fontSize - 1 : fontSize + 1;

    this.libraryStateFacadeService.updateSketchItemInfo({
      id: commentId,
      type: 'comment',
      sketchItemChange: { fontSize: newFontSize, rotationDegree },
    });
  }

  public changeChainflexFont(type: 'decrease' | 'increase', side: 'left' | 'right', currentFontSize: number): void {
    const fontSize = type === 'decrease' ? currentFontSize - 1 : currentFontSize + 1;

    this.libraryStateFacadeService.updateChainFlexInfo({ side, chainFlexInfo: { fontSize } });
  }

  public changeChainflexText(side: 'left' | 'right', text: string, matNumber: string): void {
    this.libraryStateFacadeService.updateChainFlexInfo({ side, chainFlexInfo: { text, matNumber } });
  }

  public getDateString(): string {
    const currentDate = new Date();

    const dd = String(currentDate.getDate()).padStart(2, '0');
    const mm = String(currentDate.getMonth() + 1).padStart(2, '0'); //January is 0!
    const yyyy = currentDate.getFullYear();

    return mm + '/' + dd + '/' + yyyy;
  }

  public addImageToSketch(
    side: 'left' | 'right',
    src: string,
    matNumber?: string,
    group?: string,
    picType?: 'photo' | 'techDraw' | 'pinAss'
  ): void {
    this.libraryStateFacadeService.addToImageList({
      id: StringUtils.generateGuid(),
      src,
      matNumber,
      group,
      side,
      picType,
    });
  }

  public resetSketch(): void {
    this.libraryStateFacadeService.resetSketch();
  }

  // Input Validation
  public checkValue(event): void {
    event.target.value = event.target.value.replace(/[^0-9+]/g, '');
  }

  public onRemoveFromImageList(
    item: IcalcImage | IcalcComment | IcalcBox | IcalcCircle | IcalcLine | IcalcArrow
  ): void {
    this.libraryStateFacadeService.removeFromImageOrCommentList({ id: item?.id });
  }

  public isMat017ItemRemovedFromConfiguration(matNumber: string, side: 'left' | 'right'): boolean {
    return (
      !getMatNumbersOfMat017ItemsFromConnectorStateOnSide(this.configuration, side).includes(matNumber) &&
      !this.isLocked
    );
  }

  public onNext(nextStep: IcalcStep): void {
    this.htmlToImageService.getImageFromId('drop-area')?.then?.((value) => {
      this.subscription.add(
        this.libraryStateFacadeService
          .hasSavedBase64ImageInState$()
          .pipe(take(1))
          .subscribe(() => {
            this.router.navigate([nextStep?.route]);
            this.isNavigating = false;
          })
      );

      if (value) {
        this.libraryStateFacadeService.setBase64Image(value);
      }

      this.startLeavingLibrary();
    });
  }

  public onSelect(id: string | undefined): void {
    const selectedId = this.selectedIdSub.getValue() === id ? null : id;

    this.selectedIdSub.next(selectedId);
  }

  private isLibraryValid(): Observable<boolean> {
    if (this.isLocked) {
      return of(true);
    }
    const imageList$ = this.libraryStateFacadeService.imageList$;

    const leftConnectorItemsValid$ = imageList$.pipe(
      map((imageList) =>
        imageList.filter((image) => image.side === 'left').map((mat017ItemInImage) => mat017ItemInImage.matNumber)
      ),
      map((mat017ItemNumber) =>
        areMatNumbersOfMat017ItemsPresentInConnectorStateOnSide(mat017ItemNumber, this.configuration, 'left')
      )
    );

    return imageList$.pipe(
      map((imageList) =>
        imageList.filter((image) => image.side === 'right').map((mat017ItemInImage) => mat017ItemInImage.matNumber)
      ),
      map((mat017ItemNumber) =>
        areMatNumbersOfMat017ItemsPresentInConnectorStateOnSide(mat017ItemNumber, this.configuration, 'right')
      ),
      combineLatestWith(leftConnectorItemsValid$),
      map(
        ([leftConnectorItemsValid, rightConnectorsItemsValid]) => leftConnectorItemsValid && rightConnectorsItemsValid
      )
    );
  }

  private startLeavingLibrary(): void {
    if (this.alreadyCalledLeavingLibraryPageStarted) return;
    this.libraryStateFacadeService.leavingLibraryPageStarted(this.libraryStateFacadeService.getLibraryStateSnapshot());
    this.alreadyCalledLeavingLibraryPageStarted = true;
  }

  private bothConnectorsHaveMat017ItemList({ leftConnector, rightConnector }): boolean {
    return !!leftConnector?.mat017ItemListWithWidenData && !!rightConnector?.mat017ItemListWithWidenData;
  }

  private setupInitialLibrary(libraryState: IcalcLibrary, labelingLeft: string, labelingRight: string): void {
    const mat017ItemLoadingStatus = ObjectUtils.cloneDeep<Mat017ItemWithWidenData[]>(this.allItemList).reduce<
      Record<string, IcalcLibraryMat017ItemLoadingStatus>
    >((acc, currentItem) => {
      acc[currentItem.matNumber] = {
        photoIsLoading: true,
        techDrawIsLoading: true,
        pinAssIsLoading: true,
      };

      return acc;
    }, {});

    this.libraryStateFacadeService.enteringLibraryPageEntered({
      ...libraryState,
      leftChainFlex: {
        ...libraryState?.leftChainFlex,
        text: labelingLeft,
      },
      rightChainFlex: {
        ...libraryState?.rightChainFlex,
        text: labelingRight,
      },
      sketchDate: formatDate(new Date(), 'MM/dd/yyyy', this.locale),
      mat017ItemLoadingStatus,
    });
  }
}

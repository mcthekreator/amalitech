import { Injectable } from '@angular/core';
import type {
  IcalcArrow,
  IcalcBox,
  IcalcCircle,
  IcalcComment,
  IcalcImage,
  IcalcLine,
  SketchItemChange,
  WidenTitleTag,
  WidenUploadImage,
} from '@igus/icalc-domain';
import { Dispatch } from '@ngxs-labs/dispatch-decorator';
import { Actions, Select, Store, ofActionSuccessful } from '@ngxs/store';
import { Observable } from 'rxjs';

import { LibraryState } from './library-state';
import {
  AddFontSize,
  AddToArrowList,
  AddToBoxList,
  AddToCircleList,
  AddToCommentList,
  AddToImageList,
  AddToLineList,
  ChangeMarkerDistance,
  RemoveFromImageOrCommentList,
  ResetSketch,
  SetBase64Image,
  SetSketchDate,
  UpdateChainFlexInfo,
  UpdateSketchItemInfo,
} from './library-state.actions';
import type { IcalcLibraryMat017ItemLoadingStatus, LibraryStateModel } from './library-state.model';
import { Library } from '../actions/library';
import { Api } from '../actions/api';

@Injectable({
  providedIn: 'root',
})
export class LibraryStateFacadeService {
  @Select(LibraryState.isValid)
  public isValid$: Observable<boolean>;

  @Select(LibraryState.leftChainFlex)
  public leftChainFlex$: Observable<{
    fontSize: number;
    text: string;
  }>;

  @Select(LibraryState.rightChainFlex)
  public rightChainFlex$: Observable<{
    fontSize: number;
    text: string;
  }>;

  @Select(LibraryState.imageList)
  public imageList$: Observable<IcalcImage[]>;

  @Select(LibraryState.commentList)
  public commentList$: Observable<IcalcComment[]>;

  @Select(LibraryState.boxList)
  public boxList$: Observable<IcalcBox[]>;

  @Select(LibraryState.circleList)
  public circleList$: Observable<IcalcCircle[]>;

  @Select(LibraryState.lineList)
  public lineList$: Observable<IcalcLine[]>;

  @Select(LibraryState.arrowList)
  public arrowList$: Observable<IcalcArrow[]>;

  @Select(LibraryState.fontSizeLeft)
  public fontSizeLeft$: Observable<number>;

  @Select(LibraryState.fontSizeRight)
  public fontSizeRight$: Observable<number>;

  @Select(LibraryState.sketchDate)
  public sketchDate$: Observable<string>;

  @Select(LibraryState.leftMarkerDistance)
  public leftMarkerDistance$: Observable<number>;

  @Select(LibraryState.rightMarkerDistance)
  public rightMarkerDistance$: Observable<number>;

  @Select(LibraryState.mat017ItemLoadingStatus)
  public mat017ItemLoadingStatus$: Observable<Record<string, IcalcLibraryMat017ItemLoadingStatus>>;

  constructor(
    private store: Store,
    private actions$: Actions
  ) {}

  @Dispatch()
  public addToImageList = (payload: {
    id: string;
    src: string;
    matNumber?: string;
    group?: string;
    side?: 'left' | 'right';
    aspectRatio?: number;
    picType?: 'photo' | 'techDraw' | 'pinAss';
  }): AddToImageList => new AddToImageList(payload);

  @Dispatch()
  public addToCommentList = (payload: { text: string }) => new AddToCommentList(payload);

  @Dispatch()
  public addToBoxList = () => new AddToBoxList();

  @Dispatch()
  public addToCircleList = () => new AddToCircleList();

  @Dispatch()
  public addToLineList = () => new AddToLineList();

  @Dispatch()
  public addToArrowList = () => new AddToArrowList();

  @Dispatch()
  public removeFromImageOrCommentList = (payload: { id: string }) => new RemoveFromImageOrCommentList(payload);

  @Dispatch()
  public addFontSize = (payload: { left: number; right: number }) => new AddFontSize(payload);

  @Dispatch()
  public updateSketchItemInfo = (payload: {
    id: string;
    type: 'image' | 'comment' | 'box' | 'circle' | 'line' | 'arrow';
    sketchItemChange: SketchItemChange;
  }): UpdateSketchItemInfo => new UpdateSketchItemInfo(payload);

  @Dispatch()
  public updateChainFlexInfo = (payload: {
    side: 'left' | 'right';
    chainFlexInfo: {
      fontSize?: number;
      text?: string;
      matNumber?: string;
    };
  }): UpdateChainFlexInfo => new UpdateChainFlexInfo(payload);

  @Dispatch()
  public setSketchDate = (date: string) => new SetSketchDate(date);

  @Dispatch()
  public setBase64Image = (payload: string) => new SetBase64Image(payload);

  @Dispatch()
  public resetSketch = () => new ResetSketch();

  @Dispatch()
  public changeMarkerDistance = (payload: { which: 'left' | 'right'; value: number }) =>
    new ChangeMarkerDistance(payload);

  @Dispatch()
  public enteringLibraryPageStarted = () => new Library.EnteringLibraryPage.Started();

  @Dispatch()
  public enteringLibraryPageEntered = (payload: Partial<LibraryStateModel>) =>
    new Library.EnteringLibraryPage.Entered(payload);

  @Dispatch()
  public leavingLibraryPageStarted = (payload: Partial<LibraryStateModel>) =>
    new Library.LeavingLibraryPage.Started(payload);

  @Dispatch()
  public addingWidenImageStarted = (payload: WidenUploadImage) => new Library.AddingWidenImage.Started(payload);

  @Dispatch()
  public addingWidenImageSucceeded = (payload: { matNumber: string; titleTag: WidenTitleTag }) =>
    new Library.AddingWidenImage.Succeeded(payload);

  public getSketchSnapshot(): string {
    return this.store.selectSnapshot(LibraryState.base64Image);
  }

  public hasSavedBase64ImageInState$(): Observable<SetBase64Image> {
    return this.actions$.pipe(ofActionSuccessful(SetBase64Image));
  }

  public hasFetchedWidenImageSuccessfully$(): Observable<Api.FetchingImageFromWiden.Succeeded> {
    return this.actions$.pipe(ofActionSuccessful(Api.FetchingImageFromWiden.Succeeded));
  }

  public getLibraryStateSnapshot(): LibraryStateModel {
    return this.store.selectSnapshot(LibraryState);
  }
}

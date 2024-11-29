import { Injectable } from '@angular/core';
import { ObjectUtils, StringUtils } from '@igus/icalc-utils';
import { Action, Selector, State, StateContext } from '@ngxs/store';
import { createGetDefaultStateItemValue } from '../../utils';

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
import { IcalcLibraryMat017ItemLoadingStatus, LibraryStateModel } from './library-state.model';
import { Library } from '../actions/library';

import type {
  IcalcImage as IcalcDomainImage,
  IcalcComment,
  IcalcLibraryShape as IcalcDomainLibraryShape,
  WidenUploadImage,
  WidenTitleTag,
} from '@igus/icalc-domain';
import { patch } from '@ngxs/store/operators';
import { Api } from '../actions/api';

const stateDefault: LibraryStateModel = {
  imageList: [],
  commentList: [],
  boxList: [],
  circleList: [],
  lineList: [],
  arrowList: [],
  leftChainFlex: { fontSize: 14, text: '' },
  rightChainFlex: { fontSize: 14, text: '' },
  fontSizeLeft: 14,
  fontSizeRight: 14,
  labelTextLeft: '',
  labelTextRight: '',
  leftMarkerDistance: 100,
  rightMarkerDistance: 100,
  sketchDate: '',
  base64Image: '',
  mat017ItemLoadingStatus: {},
};

export const getDefaultFromLibraryState = createGetDefaultStateItemValue(stateDefault);

@State<LibraryStateModel>({
  name: 'LibraryState',
  defaults: { ...stateDefault },
})
@Injectable()
export class LibraryState {
  @Selector()
  public static isValid(state: LibraryStateModel): boolean {
    return !!state;
  }

  @Selector()
  public static imageList(state: LibraryStateModel): IcalcDomainImage[] {
    return state.imageList;
  }

  @Selector()
  public static leftChainFlex(state: LibraryStateModel): { fontSize: number; text: string } {
    return state.leftChainFlex;
  }

  @Selector()
  public static rightChainFlex(state: LibraryStateModel): { fontSize: number; text: string } {
    return state.rightChainFlex;
  }

  @Selector()
  public static commentList(state: LibraryStateModel): IcalcComment[] {
    return state.commentList;
  }

  @Selector()
  public static boxList(state: LibraryStateModel): IcalcDomainLibraryShape[] {
    return state.boxList;
  }

  @Selector()
  public static circleList(state: LibraryStateModel): IcalcDomainLibraryShape[] {
    return state.circleList;
  }

  @Selector()
  public static lineList(state: LibraryStateModel): IcalcDomainLibraryShape[] {
    return state.lineList;
  }

  @Selector()
  public static arrowList(state: LibraryStateModel): IcalcDomainLibraryShape[] {
    return state.arrowList;
  }

  @Selector()
  public static fontSizeLeft(state: LibraryStateModel): number {
    return state.fontSizeLeft;
  }

  @Selector()
  public static fontSizeRight(state: LibraryStateModel): number {
    return state.fontSizeRight;
  }

  @Selector()
  public static sketchDate(state: LibraryStateModel): string {
    return state.sketchDate;
  }

  @Selector()
  public static base64Image(state: LibraryStateModel): string {
    return state.base64Image;
  }

  @Selector()
  public static leftMarkerDistance(state: LibraryStateModel): number {
    return state.leftMarkerDistance;
  }

  @Selector()
  public static rightMarkerDistance(state: LibraryStateModel): number {
    return state.rightMarkerDistance;
  }

  @Selector()
  public static mat017ItemLoadingStatus(state: LibraryStateModel): Record<string, IcalcLibraryMat017ItemLoadingStatus> {
    return state.mat017ItemLoadingStatus;
  }

  @Action(AddFontSize)
  public addFontSize(context: StateContext<LibraryStateModel>, action: AddFontSize): void {
    if (action.payload.left && action.payload.right) {
      context.patchState({
        fontSizeLeft: action.payload.left,
        fontSizeRight: action.payload.right,
      });
    }
  }

  @Action(UpdateChainFlexInfo)
  public updateChainFlexInfo(context: StateContext<LibraryStateModel>, action: UpdateChainFlexInfo): void {
    if (action.payload.side && action.payload.chainFlexInfo) {
      const state = context.getState();
      const chainFlexPropertyName = `${action.payload.side}ChainFlex`;

      context.patchState({
        [chainFlexPropertyName]: { ...state[chainFlexPropertyName], ...action.payload.chainFlexInfo },
      });
    }
  }

  @Action(AddToImageList)
  public addToImageList(context: StateContext<LibraryStateModel>, action: AddToImageList): void {
    if (action.payload.id && action.payload.src) {
      const state = context.getState();

      let height = 137;
      const aspectRatio = +action.payload.aspectRatio;

      if (!isNaN(aspectRatio)) {
        height = 250 * aspectRatio;
      }

      context.patchState({
        imageList: [
          ...state.imageList,
          {
            id: action.payload.id,
            src: action.payload.src,
            matNumber: action.payload.matNumber,
            group: action.payload.group,
            side: action.payload.side,
            width: 250,
            height,
            isFlipped: false,
            picType: action.payload.picType,
            ...this.startOffset(state, action.payload.side),
            rotationDegree: 0,
          },
        ],
      });
    }
  }

  @Action(RemoveFromImageOrCommentList)
  public removeFromImageOrCommentList(
    context: StateContext<LibraryStateModel>,
    action: RemoveFromImageOrCommentList
  ): void {
    if (action.payload.id) {
      const state = context.getState();

      context.patchState({
        imageList: [...state.imageList.filter((image) => image.id !== action.payload.id)],
        commentList: [...state.commentList.filter((comment) => comment.id !== action.payload.id)],
        boxList: [...state.boxList.filter((box) => box.id !== action.payload.id)],
        circleList: [...state.circleList.filter((circle) => circle.id !== action.payload.id)],
        lineList: [...state.lineList.filter((line) => line.id !== action.payload.id)],
        arrowList: [...state.arrowList.filter((arrow) => arrow.id !== action.payload.id)],
      });
    }
  }

  @Action(AddToCommentList)
  public addToCommentList(context: StateContext<LibraryStateModel>, action: AddToCommentList): void {
    const state = context.getState();

    if (action.payload.text) {
      context.patchState({
        commentList: [
          ...state.commentList,
          {
            id: StringUtils.generateGuid(),
            fontSize: 14,
            text: action.payload.text,
            ...this.startOffset(state),
            width: 250,
            height: 165,
            rotationDegree: 0,
          },
        ],
      });
    }
  }

  @Action(AddToBoxList)
  public addToBoxList(context: StateContext<LibraryStateModel>): void {
    const state = context.getState();

    context.patchState({
      boxList: [
        ...state.boxList,
        {
          id: StringUtils.generateGuid(),
          ...this.startOffset(state),
          width: 150,
          height: 150,
          rotationDegree: 0,
        },
      ],
    });
  }

  @Action(AddToCircleList)
  public addToCircleList(context: StateContext<LibraryStateModel>): void {
    const state = context.getState();

    context.patchState({
      circleList: [
        ...state.circleList,
        {
          id: StringUtils.generateGuid(),
          ...this.startOffset(state),
          width: 150,
          height: 150,
          rotationDegree: 0,
        },
      ],
    });
  }

  @Action(AddToLineList)
  public addToLineList(context: StateContext<LibraryStateModel>): void {
    const state = context.getState();

    context.patchState({
      lineList: [
        ...state.lineList,
        {
          id: StringUtils.generateGuid(),
          ...this.startOffset(state),
          width: 150,
          rotationDegree: 0,
        },
      ],
    });
  }

  @Action(AddToArrowList)
  public addToArrowList(context: StateContext<LibraryStateModel>): void {
    const state = context.getState();

    context.patchState({
      arrowList: [
        ...state.arrowList,
        {
          id: StringUtils.generateGuid(),
          ...this.startOffset(state),
          width: 150,
          rotationDegree: 0,
        },
      ],
    });
  }

  @Action(UpdateSketchItemInfo)
  public updateImagePosition(context: StateContext<LibraryStateModel>, action: UpdateSketchItemInfo): void {
    if (action.payload.id && action.payload.sketchItemChange) {
      const state = context.getState();

      const sketchItemChange = action.payload.sketchItemChange;
      let xValue = null;
      let yValue = null;

      if (typeof sketchItemChange.x === 'number') {
        xValue = sketchItemChange.x;
      }

      if (typeof sketchItemChange.y === 'number') {
        yValue = sketchItemChange.y;
      }

      const itemListPropertyName = `${action.payload.type}List`;

      context.patchState({
        [itemListPropertyName]: [
          ...state[itemListPropertyName].map((item) => {
            if (item.id === action.payload.id) {
              return {
                ...item,
                ...sketchItemChange,
                x: this.normalizeCoordinateValue(xValue === null ? item.x : item.x + xValue),
                y: this.normalizeCoordinateValue(yValue === null ? item.y : item.y + yValue),
              };
            }
            return item;
          }),
        ],
      });
    }
  }

  @Action(SetSketchDate)
  public setSketchDate(context: StateContext<LibraryStateModel>, action: SetSketchDate): void {
    if (!action?.sketchDate) {
      return;
    }
    context.patchState({
      sketchDate: action.sketchDate,
    });
  }

  @Action(SetBase64Image)
  public setBase64Image(context: StateContext<LibraryStateModel>, action: SetBase64Image): LibraryStateModel {
    if (!action.payload) {
      return;
    }
    return context.patchState({
      base64Image: `${action.payload}`,
    });
  }

  @Action(ResetSketch)
  public resetSketch(context: StateContext<LibraryStateModel>): void {
    context.patchState({
      imageList: getDefaultFromLibraryState('imageList'),
      commentList: getDefaultFromLibraryState('commentList'),
      boxList: getDefaultFromLibraryState('boxList'),
      circleList: getDefaultFromLibraryState('circleList'),
      lineList: getDefaultFromLibraryState('lineList'),
      arrowList: getDefaultFromLibraryState('arrowList'),
      leftChainFlex: getDefaultFromLibraryState('leftChainFlex'),
      rightChainFlex: getDefaultFromLibraryState('rightChainFlex'),
      fontSizeLeft: getDefaultFromLibraryState('fontSizeLeft'),
      fontSizeRight: getDefaultFromLibraryState('fontSizeRight'),
      labelTextLeft: getDefaultFromLibraryState('labelTextLeft'),
      labelTextRight: getDefaultFromLibraryState('labelTextRight'),
      leftMarkerDistance: getDefaultFromLibraryState('leftMarkerDistance'),
      rightMarkerDistance: getDefaultFromLibraryState('rightMarkerDistance'),
      base64Image: getDefaultFromLibraryState('base64Image'),
    });
  }

  @Action(ChangeMarkerDistance)
  public changeMarkerDistance(context: StateContext<LibraryStateModel>, action: ChangeMarkerDistance): void {
    const state = context.getState();

    if (action.payload.which === 'left') {
      context.patchState({
        ...state,
        leftMarkerDistance: Number(action.payload.value),
      });
    } else if (action.payload.which === 'right') {
      context.patchState({
        ...state,
        rightMarkerDistance: Number(action.payload.value),
      });
    }
  }

  @Action(Library.EnteringLibraryPage.Entered)
  public updateLibraryState(context: StateContext<LibraryStateModel>, action: Library.EnteringLibraryPage.Entered) {
    if (!action.payload) {
      return;
    }

    if (!action.payload.base64Image) {
      context.setState(
        patch({
          ...stateDefault,
          ...action.payload,
        })
      );

      return;
    }

    context.patchState({ ...action.payload });
  }

  @Action(Api.FetchingImagesFromWiden.Succeeded)
  public setMat017ItemLoadingStatusToFalseForAllItems(context: StateContext<LibraryStateModel>) {
    const { getState, patchState } = context;

    const state = getState();

    const mat017ItemLoadingStatus = ObjectUtils.cloneDeep<Record<string, IcalcLibraryMat017ItemLoadingStatus>>(
      state.mat017ItemLoadingStatus
    );

    for (const key in mat017ItemLoadingStatus) {
      if ({}.hasOwnProperty.call(mat017ItemLoadingStatus, key)) {
        mat017ItemLoadingStatus[key] = {
          photoIsLoading: false,
          techDrawIsLoading: false,
          pinAssIsLoading: false,
        };
      }
    }

    patchState({
      mat017ItemLoadingStatus,
    });
  }

  @Action(Library.AddingWidenImage.Started)
  public setMat017ItemLoadingStatusOnAddingImageStarted(
    context: StateContext<LibraryStateModel>,
    action: Library.AddingWidenImage.Started
  ) {
    this.updateMat017ItemLoadingStatus(context, action.payload, true);
  }

  @Action(Library.AddingWidenImage.Succeeded)
  public setMat017ItemLoadingStatusOnAddingImageSucceeded(
    context: StateContext<LibraryStateModel>,
    action: Library.AddingWidenImage.Succeeded
  ) {
    this.updateMat017ItemLoadingStatus(context, action.payload, false);
  }

  private updateMat017ItemLoadingStatus(
    context: StateContext<LibraryStateModel>,
    itemData: WidenUploadImage | { matNumber: string; titleTag: WidenTitleTag },
    status: boolean
  ) {
    const { getState, patchState } = context;

    const state = getState();

    const mat017ItemLoadingStatus = ObjectUtils.cloneDeep<Record<string, IcalcLibraryMat017ItemLoadingStatus>>(
      state.mat017ItemLoadingStatus
    );

    for (const key in mat017ItemLoadingStatus) {
      if (ObjectUtils.hasKey(mat017ItemLoadingStatus, key) && key === itemData.matNumber) {
        mat017ItemLoadingStatus[key] = {
          ...mat017ItemLoadingStatus[key],
          [`${itemData.titleTag}IsLoading`]: status,
        };
      }
    }

    patchState({
      mat017ItemLoadingStatus,
    });
  }

  private normalizeCoordinateValue(value) {
    return value < 0 ? 0 : value;
  }

  private startOffset(state: LibraryStateModel, side?: 'left' | 'right') {
    let x = 10;

    if (side === 'right') {
      try {
        const containerWidth = document.getElementById('drop-area').offsetWidth;

        x = containerWidth - 250 - 150;
      } catch (_) {}
    }
    let position = { x, y: 10 };

    while (
      !!state.imageList.find((image) => image.y === position.y && image.x === position.x) ||
      !!state.commentList.find((comment) => comment.y === position.y && comment.x === position.x) ||
      !!state.boxList.find((box) => box.y === position.y && box.x === position.x) ||
      !!state.circleList.find((circle) => circle.y === position.y && circle.x === position.x) ||
      !!state.lineList.find((line) => line.y === position.y && line.x === position.x) ||
      !!state.arrowList.find((arrow) => arrow.y === position.y && arrow.x === position.x)
    ) {
      if (side === 'right') {
        position = { x: position.x - 50, y: position.y + 50 };
      } else {
        position = { x: position.x + 50, y: position.y + 50 };
      }
    }
    return position;
  }
}

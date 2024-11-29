import type { SketchItemChange } from '@igus/icalc-domain';

export class AddFontSize {
  public static readonly type = '[AddFontSize] Adds the selected fontsize for each chainflex label';
  constructor(public payload: { left: number; right: number }) {}
}

export class AddToImageList {
  public static readonly type =
    '[AddToImageList] Adds Id of selected Mat017ItemWithWidenData and image src to the imageList';

  constructor(
    public payload: {
      id: string;
      src: string;
      matNumber?: string;
      group?: string;
      side?: 'left' | 'right';
      aspectRatio?: number;
      picType?: 'photo' | 'techDraw' | 'pinAss';
    }
  ) {}
}

export class RemoveFromImageOrCommentList {
  public static readonly type = '[RemoveFromImageList] removes an image or comment from the sketch by the id';
  constructor(public payload: { id: string }) {}
}

export class AddToCommentList {
  public static readonly type = '[AddToCommentList] Adds new comment to the commentList';
  constructor(public payload: { text: string }) {}
}

export class AddToBoxList {
  public static readonly type = '[AddToBoxList] Adds new box to the boxList';
}

export class AddToCircleList {
  public static readonly type = '[AddToCircleList] Adds new circle to the circleList';
}

export class AddToLineList {
  public static readonly type = '[AddToLineList] Adds new line to the lineList';
}

export class AddToArrowList {
  public static readonly type = '[AddToArrowList] Adds new arrow to the arrowList';
}

export class UpdateSketchItemInfo {
  public static readonly type = '[UpdateSketchItemInfo] Updates item position by id';
  constructor(
    public payload: {
      id: string;
      type: 'image' | 'comment' | 'box' | 'circle' | 'line' | 'arrow';
      sketchItemChange: SketchItemChange;
    }
  ) {}
}

export class UpdateChainFlexInfo {
  public static readonly type = '[UpdateChainFlexInfo] Updates the properties of a chainflex cable';
  constructor(
    public payload: {
      side: 'left' | 'right';
      chainFlexInfo: {
        fontSize?: number;
        text?: string;
      };
    }
  ) {}
}

export class SetSketchDate {
  public static readonly type = '[SetSketchDate] sets the date for this sketch';
  constructor(public sketchDate: string) {}
}

export class SetBase64Image {
  public static readonly type = '[SetBase64Image] sets the the base64-encoded screenshot of the sketch';
  constructor(public payload: string) {}
}

export class ResetSketch {
  public static readonly type = '[ResetSketch] resets library state to default';
}

export class ChangeMarkerDistance {
  public static readonly type = '[ChangeMarkerDistance] changes marker distance of a given side';
  constructor(public payload: { which: 'left' | 'right'; value: number }) {}
}

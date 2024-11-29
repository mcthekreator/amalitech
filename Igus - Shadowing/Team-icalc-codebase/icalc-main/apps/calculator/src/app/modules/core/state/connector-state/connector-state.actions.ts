import type {
  IcalcListInformation,
  Mat017ItemListFilter,
  Mat017ItemWithWidenData,
  ConnectorSide,
} from '@igus/icalc-domain';
import type { IcalcConnector } from './connector-state.model';

export class SetConnector {
  public static readonly type = '[SetConnector] sets the state for a connector';

  constructor(public payload: { which: ConnectorSide; connector: Partial<IcalcConnector> }) {}
}

export class GetMat017ItemsOfConnectorWithWidenData {
  public static readonly type = '[GetConnectorItem] requests the connector items from server';

  constructor(
    public payload: {
      listInformation: Partial<IcalcListInformation>;
      filterInformation?: Mat017ItemListFilter;
      which: ConnectorSide;
    }
  ) {}
}

export class RemoveManuallyCreatedMat017Item {
  public static readonly type =
    '[RemoveManuallyCreatedMat017Item] Remove selected Mat017ItemCreationData from the mat017-item table';

  constructor(public payload: { matNumber: string; which?: ConnectorSide }) {}
}

export class AddToMat017ItemListWithWidenData {
  public static readonly type =
    '[AddToMat017ItemListWithWidenData] Adds selected Mat017ItemWithWidenData[] to the mat017ItemListWithWidenData';

  constructor(public payload: { which: ConnectorSide; mat017ItemsWithWidenData: Mat017ItemWithWidenData[] }) {}
}

export class RemoveFromMat017ItemListWithWidenData {
  public static readonly type =
    '[RemoveFromMat017ItemListWithWidenData] Remove selected Mat017ItemWithWidenData[] from the mat017ItemListWithWidenData';

  constructor(public payload: { which: ConnectorSide; mat017ItemWithWidenData: Mat017ItemWithWidenData }) {}
}
export class CloneMat017ItemListWithWidenData {
  public static readonly type = '[CloneMat017ItemListWithWidenData] clone items from one connector to the other';
  constructor(public payload: { which: ConnectorSide }) {}
}

export class ChangeQuantityOfMat017ItemWithWidenData {
  public static readonly type =
    '[ChangeQuantityOfMat017ItemWithWidenData] Change the quantity of the Mat017ItemWithWidenData';

  constructor(public payload: { which: ConnectorSide; amount: number; matNumber: string }) {}
}
export class UpdateSort {
  public static readonly type = '[UpdateSort] updates the sort information for a given connector list';
  constructor(public payload: { which: ConnectorSide; listInformation: IcalcListInformation }) {}
}

export class GetFavorites {
  public static readonly type = '[GetFavorites] Gets the Favorites for this side';
  constructor(public payload: { which: ConnectorSide }) {}
}

export class SetBothConnectorStates {
  public static readonly type =
    '[SetBothConnectorStates] sets the connector items from action. Used for loading configuration.';

  constructor(
    public payload: {
      leftConnector: Partial<IcalcConnector>;
      rightConnector: Partial<IcalcConnector>;
    }
  ) {}
}

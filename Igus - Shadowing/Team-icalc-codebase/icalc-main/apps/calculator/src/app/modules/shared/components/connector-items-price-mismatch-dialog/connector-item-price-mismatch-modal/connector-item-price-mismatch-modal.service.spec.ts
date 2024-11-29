import { TestBed } from '@angular/core/testing';

import { ConnectorItemPriceMismatchModalService } from './connector-item-price-mismatch-modal.service';
import { ProcessStateFacadeService } from '@icalc/frontend/app/modules/core/state/process-state/process-state-facade.service';
import { MatDialog, MatDialogRef } from '@angular/material/dialog';
import type { ConfigurationPresentation, Mat017ItemWithWidenData } from '@igus/icalc-domain';
import {
  NumberUtils,
  createConfigurationPresentation,
  createConfigurationStatePresentation,
  createIcalcTestConnectorStatePresentation,
  createIcalcTestMat017ItemWithWidenData,
  icalcTestMat017ItemWithWidenData,
} from '@igus/icalc-domain';
import { of } from 'rxjs';

describe('ConnectorItemPriceMismatchModalService', () => {
  let service: ConnectorItemPriceMismatchModalService;
  let mockProcessStateFacadeService: jest.Mocked<ProcessStateFacadeService>;
  let mockMatDialog: jest.Mocked<MatDialog>;
  let mockMatDialogRef: jest.Mocked<MatDialogRef<any>>;

  const rightConnector = {
    mat017ItemListWithWidenData: [
      createIcalcTestMat017ItemWithWidenData({ id: undefined }),
      createIcalcTestMat017ItemWithWidenData({
        id: undefined,
        amountDividedByPriceUnit: 0.5,
        matNumber: `${icalcTestMat017ItemWithWidenData.matNumber}-2`,
      }),
    ],
    addedMat017Items: {
      [icalcTestMat017ItemWithWidenData.matNumber]: 1,
      [`${icalcTestMat017ItemWithWidenData.matNumber}-2`]: 1,
    },
  };
  const leftConnector = {
    mat017ItemListWithWidenData: [
      createIcalcTestMat017ItemWithWidenData({ id: undefined }),
      createIcalcTestMat017ItemWithWidenData({
        id: undefined,
        amountDividedByPriceUnit: 0.3,
        matNumber: `${icalcTestMat017ItemWithWidenData.matNumber}-2`,
      }),
    ],
    addedMat017Items: {
      [icalcTestMat017ItemWithWidenData.matNumber]: 1,
      [`${icalcTestMat017ItemWithWidenData.matNumber}-2`]: 1,
    },
  };
  const testConnectorStatePresentation = createIcalcTestConnectorStatePresentation({ rightConnector, leftConnector });

  const configurationState = createConfigurationStatePresentation({
    connectorState: testConnectorStatePresentation,
  });
  const testConfiguration = createConfigurationPresentation({ state: configurationState });

  beforeEach(async () => {
    mockProcessStateFacadeService = {
      selectedConfigurationData$: of(testConfiguration),
    } as any;

    mockMatDialog = {
      open: jest.fn(),
    } as any;
    mockMatDialogRef = {
      close: jest.fn(),
      afterClosed: jest.fn(() => of(null)),
    } as any;

    await TestBed.configureTestingModule({
      providers: [
        ConnectorItemPriceMismatchModalService,
        { provide: ProcessStateFacadeService, useValue: mockProcessStateFacadeService },
        { provide: MatDialog, useValue: mockMatDialog },
        { provide: MatDialogRef, useValue: mockMatDialogRef },
      ],
    }).compileComponents();
    service = TestBed.inject(ConnectorItemPriceMismatchModalService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  describe('checkMat017ItemPriceMismatchInOtherConnectorSide', () => {
    it('should return false if mat017Item exists in rightConnector, but there is no price mismatch', (done) => {
      let config: ConfigurationPresentation;

      service.processStateFacadeService.selectedConfigurationData$.subscribe((data) => {
        config = data;
        done();
      });
      const mat017ItemPriceMismatchCheck = service.checkMat017ItemPriceMismatchOnOtherConnectorSide(
        'leftConnector',
        icalcTestMat017ItemWithWidenData.matNumber
      );
      const rightConnectorItems = config.state.connectorState.rightConnector.mat017ItemListWithWidenData;

      const rightConnectorHasRequestedMat017Item = rightConnectorItems.some(
        (item: Mat017ItemWithWidenData) => item.matNumber === `${icalcTestMat017ItemWithWidenData.matNumber}-2`
      );

      expect(rightConnectorHasRequestedMat017Item).toBe(true);
      const itemPriceIsOutdatedInRight = rightConnectorItems.some(
        (item) =>
          item.matNumber === `${icalcTestMat017ItemWithWidenData.matNumber}` &&
          !NumberUtils.areFloatsEqual(item.amountDividedByPriceUnit, item.overrides.amountDividedByPriceUnit)
      );

      expect(itemPriceIsOutdatedInRight).toBe(false);
      expect(mat017ItemPriceMismatchCheck).toBe(false);
    });

    it('should return true if mat017Item exists in right connector, and there is a price mismatch ', (done) => {
      let config: ConfigurationPresentation;

      service.processStateFacadeService.selectedConfigurationData$.subscribe((data) => {
        config = data;
        done();
      });
      const rightConnectorItems = config.state.connectorState.rightConnector.mat017ItemListWithWidenData;
      const mat017ItemPriceMismatchCheck = service.checkMat017ItemPriceMismatchOnOtherConnectorSide(
        'leftConnector',
        `${icalcTestMat017ItemWithWidenData.matNumber}-2`
      );

      expect(service.currentConnectorSide).toEqual('leftConnector');
      expect(service.connectorState).toEqual(config.state.connectorState);
      const rightConnectorHasRequestedMat017Item = rightConnectorItems.some(
        (item: Mat017ItemWithWidenData) => item.matNumber === `${icalcTestMat017ItemWithWidenData.matNumber}-2`
      );

      expect(rightConnectorHasRequestedMat017Item).toBe(true);

      const itemPriceIsOutdatedInRight = rightConnectorItems.some(
        (item) =>
          item.matNumber === `${icalcTestMat017ItemWithWidenData.matNumber}-2` &&
          !NumberUtils.areFloatsEqual(item.amountDividedByPriceUnit, item.overrides.amountDividedByPriceUnit)
      );

      expect(itemPriceIsOutdatedInRight).toBe(true);
      expect(mat017ItemPriceMismatchCheck).toEqual(true);
    });
  });
});

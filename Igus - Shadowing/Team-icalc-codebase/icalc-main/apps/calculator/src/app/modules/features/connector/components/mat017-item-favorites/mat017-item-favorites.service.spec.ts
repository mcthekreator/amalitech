import { TestBed } from '@angular/core/testing';
import { MatDialog, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { of } from 'rxjs';
import { ConnectorSideEnum, Mat017ItemFavoritesService } from './mat017-item-favorites.service';
import { ConnectorStateFacadeService } from '@icalc/frontend/app/modules/core/state/connector-state/connector-state-facade.service';
import { Mat017ItemFavoritesComponent } from './mat017-item-favorites.component';
import { NO_ERRORS_SCHEMA } from '@angular/core';

describe('Mat017ItemFavoritesService', () => {
  let service: Mat017ItemFavoritesService;
  let connectorStateFacadeServiceMock: any;
  let matDialogMock: any;

  beforeEach(async () => {
    connectorStateFacadeServiceMock = {
      getFavorites: jest.fn(),
      leftFavorites$: of([]),
      leftFavoritesIsLoading$: of(false),
      rightFavorites$: of([]),
      rightFavoritesIsLoading$: of(false),
    };

    matDialogMock = {
      open: jest.fn().mockReturnValue({
        afterClosed: jest.fn().mockReturnValue(of([])),
      }),
    };

    TestBed.configureTestingModule({
      providers: [
        Mat017ItemFavoritesService,
        { provide: ConnectorStateFacadeService, useValue: connectorStateFacadeServiceMock },
        { provide: MatDialog, useValue: matDialogMock },
        { provide: MAT_DIALOG_DATA, useValue: {} },
      ],
      schemas: [NO_ERRORS_SCHEMA],
    });

    service = TestBed.inject(Mat017ItemFavoritesService);
  });

  it('should call getFavorites with the correct side when open is called', () => {
    service.open(ConnectorSideEnum.leftConnector).subscribe();

    expect(connectorStateFacadeServiceMock.getFavorites).toHaveBeenCalledWith({
      which: ConnectorSideEnum.leftConnector,
    });
  });

  it('should open the MatDialog with the correct component and data for leftConnector', () => {
    service.open(ConnectorSideEnum.leftConnector).subscribe();

    expect(matDialogMock.open).toHaveBeenCalledWith(Mat017ItemFavoritesComponent, {
      id: 'confirmFavoritesDialog',
      minWidth: 1400,
      minHeight: 400,
      data: {
        favorites$: connectorStateFacadeServiceMock.leftFavorites$,
        favoritesIsLoading$: connectorStateFacadeServiceMock.leftFavoritesIsLoading$,
      },
    });
  });

  it('should open the MatDialog with the correct component and data for rightConnector', () => {
    service.open(ConnectorSideEnum.rightConnector).subscribe();

    expect(matDialogMock.open).toHaveBeenCalledWith(Mat017ItemFavoritesComponent, {
      id: 'confirmFavoritesDialog',
      minWidth: 1400,
      minHeight: 400,
      data: {
        favorites$: connectorStateFacadeServiceMock.rightFavorites$,
        favoritesIsLoading$: connectorStateFacadeServiceMock.rightFavoritesIsLoading$,
      },
    });
  });

  it('should return the result from the dialog after it is closed', (done) => {
    const dialogResult = [{ id: 1, name: 'Favorite 1' }];

    matDialogMock.open.mockReturnValueOnce({
      afterClosed: jest.fn().mockReturnValue(of(dialogResult)),
    });

    service.open(ConnectorSideEnum.leftConnector).subscribe((result) => {
      expect(result).toEqual(dialogResult);
      done();
    });
  });
});
